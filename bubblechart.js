/*** Bubblechart API -
	myChart = new BubbleChart('#chart');	// creates the bubble chart inside the HTML
	
	bubble1 = myChart.addBubble(x,y,r,
		{color: '#ff7f7f'}
	);	// adds a bubble
	bubble2 = myChart.addBubble(x2,y2,r2);			// adds another bubble with default color
	
	bubble1.moveTo(x3,y3,r);	// moves to a new location with animation
	myChart.remove(bubble2);	// removes a bubble

	myChart.empty();		// clears everything
	
	myChart.updateHooks.push(function(ctx) {...});	// called ondraw
	
	myChart.titleX = "Variable on X-Axis";	// sets X-Axis title, same exists for Y axis
 ***/


function BubbleChart(container) {
	this.TransitionMillis = 1000;

	var canv=$('<canvas/>');
	$(container).append(canv);
	$(container).resizable();
	this.ctx = $(canv)[0].getContext('2d');

	function ObjectPosition(obj) {
		var curleft = 0;
		var curtop = 0;
		if (obj.offsetParent) {
			do {
				  curleft += obj.offsetLeft;
				  curtop += obj.offsetTop;
			} while (obj = obj.offsetParent);
		}
		return [curleft,curtop];
	}
	
	this.mouseX=null; this.mouseY=null;
	this.mouseClicked=false;	// to be processed by update2();
	this.mouseMultiple=false;	// ctrl pressed for multiselect?
	
	this.selectedBubbles={};
	this.nSelected=0;
	// deselect null means select, true means deselect
	this.selectionChangeHooks=[];
	this.selectBubble = function(bub,deselect) {
		if (bub==null) return;
		if (deselect==null) deselect=false;
		var exists=(this.selectedBubbles[ArnUtils.ObjectId(bub)]==true);
		if (deselect) delete this.selectedBubbles[ArnUtils.ObjectId(bub)];
		else this.selectedBubbles[ArnUtils.ObjectId(bub)]=true;
		var change=false;
		if (exists && deselect) {this.nSelected--; change=true;}
		else if (!exists && !deselect) {this.nSelected++; change=true;}
		if (change)
			for (var k in this.selectionChangeHooks)
				this.selectionChangeHooks[k](bub,deselect);
	}
	this.isSelected=function(bub) {
		//console.log(bub,ArnUtils.ObjectId(bub),this.selectedBubbles[ArnUtils.ObjectId(bub)]==true);
		if (this.selectedBubbles[ArnUtils.ObjectId(bub)]==true) return true;
		else return false;
	}
	this.selectOneBubble=function(bub,deselect) {
		if (this.nSelected>0)
			for (var k in this.selectionChangeHooks)
				this.selectionChangeHooks[k](null,true);
		this.selectedBubbles={};
		this.nSelected=0;
		this.selectBubble(bub,deselect);
	}

	var _this = this;
	/*
    $(canv)[0].addEventListener('mousemove', function(evt){
		var left,top;
		[left,top]=ObjectPosition(evt.target);
        _this.mouseX=evt.clientX-left;
		_this.mouseY=evt.clientY-top;
		//_this.update();
    }, false);
	*/
	$(canv)
	.mousemove(function(evt) {
		var left,top,_ref;
		_ref=ObjectPosition(evt.target),left=_ref[0],top=_ref[1];
        _this.mouseX=evt.pageX-left;
		_this.mouseY=evt.pageY-top;
		_this.update();
	})
	.mouseleave(function(evt) {
		_this.mouseX=null; _this.mouseY=null;
		_this.update();
	})
	.mousedown(function(evt) {
		_this.mouseClicked=true;
		_this.mouseMultiple=evt.ctrlKey;
		_this.update();
	});
	
	var doResize=function() {
		var w=$(container).width();
		var h=$(container).height();
		$(canv)[0].width=w;
		$(canv)[0].height=h;
		_this.width=w; _this.height=h;
		if (_this.update) _this.update();
	};
	$(container).resize(doResize);
	doResize();
	
	this.showAsPercents=false;
	var bubbleCount = 0;	// for random colors
	function Bubble(chart) {
		this.x=20; this.y=30; this.r=10;

		// recalculated on drawing
		this.pixelX=null; this.pixelY=null; this.pixelR=null;
		
		//this.color='#e07f7f';
		this.color=ColorUtils.RandomColor(353292+bubbleCount++);
		this.draw = function (ctx) {
			var x,y,r,_ref,_ref1;
			//[x,y,r]=[this.pixelX,this.pixelY,this.pixelR]=chart.dataToPixel(this.x,this.y,this.r);
			_ref1 = (_ref = chart.dataToPixel(this.x, this.y, this.r), this.pixelX = _ref[0], this.pixelY = _ref[1], this.pixelR = _ref[2], _ref), x = _ref1[0], y = _ref1[1], r = _ref1[2];
			var negative=false;
			if (r<0) {negative=true; r=-r;}
			if (r>chart.biggestR) r=chart.biggestR+2;
			var opa=(chart.nSelected==0 || chart.isSelected(this) ? 1 : 0.2);
			if (chart.showAsPercents) opa/=2;
			ctx.globalAlpha=0.5*opa;
			ctx.fillStyle=this.color;
			ctx.beginPath();
			ctx.arc(x, y, r, 0, Math.PI*2, true); 
			ctx.closePath();
			ctx.fill();
			if (chart.showAsPercents) {
				ctx.beginPath();
				ctx.arc(x, y, chart.biggestR, 0, Math.PI*2, true); 
				ctx.closePath();
				ctx.fill();
			}
			ctx.strokeStyle=ColorUtils.Darken(this.color,.2);
			ctx.stroke();
			ctx.globalAlpha=1*opa;
			if (negative) {
				var k=Math.sqrt(2)/2;
				ctx.beginPath(); ctx.moveTo(x-k*r,y-k*r); ctx.lineTo(x+k*r,y+k*r); ctx.stroke();
				ctx.beginPath(); ctx.moveTo(x-k*r,y+k*r); ctx.lineTo(x+k*r,y-k*r); ctx.stroke();
			}
			if (chart.nSelected>0 && chart.isSelected(this)) this.drawOutline(ctx);
		}
		this.drawOutline = function(ctx) {
			ctx.beginPath();
			ctx.arc(this.pixelX, this.pixelY, Math.abs(chart.showAsPercents?chart.biggestR:this.pixelR)+3, 0, Math.PI*2, true); 
			ctx.closePath();
			ctx.strokeStyle=ColorUtils.Darken(this.color,.2);
			ctx.stroke();
		}
		this.moveTo = function(nx,ny,nr) {
			if (nx!=null)
				Animations.animateValue(this,'x',nx,chart.TransitionMillis);
			if (ny!=null)
				Animations.animateValue(this,'y',ny,chart.TransitionMillis);
			if (nr!=null)
				Animations.animateValue(this,'r',nr,chart.TransitionMillis);
			chart.needsRecalc=true;
			chart.update();
		}
		this.set = function(x,y,r) {
			this.x=x; this.y=y; this.r=r;
		}
	}
	
	this.AllBubbles=[];

	// Whether to recalculate ranges and axes
	this.needsRecalc = false;
	
	this.addBubble=function(x,y,r,props) {
		var bub;
		bub=new Bubble(this);
		bub.set(x,y,r);
		if (props) {
			if(props.color!=null) bub.color=props.color;
			if(props.tooltip!=null) bub.tooltip=props.tooltip;
		}
		this.AllBubbles.push(bub);
		//this.AllBubbles[bub]=true;
		this.needsRecalc=true;
		//this.doRecalc(true);
		this.update();
		return bub;
	}
	
	this.remove=function(bub) {
		for (var i in this.AllBubbles) {
			if (this.AllBubbles[i]==bub) {
				this.AllBubbles.splice(i,1);
				delete bub;
				this.needsRecalc=true;
				return true;
			}
		}
		return false;
	}
	
	this.empty = function() {
		while(this.AllBubbles.length>0) {
			delete this.AllBubbles[0];
			this.AllBubbles.splice(0,1);
		}
		this.selectOneBubble(null);
		this.needsRecalc=true;
		this.update();
	}
	
	this.rangeX=[0,1000];
	this.rangeY=[0,400];
	this.biggestDataR=0.001;	// biggest r in data
	var margin=30;	// Margin of the chart in pixels
	this.biggestR=30;	// radius of the biggest bubble
	this.doRecalc=function(noAnim) {
		var biggestDataR=0.001;
		var rangeX=[0,0.0001];
		var rangeY=[0,0.0001];
		if (this.showAsPercents) biggestDataR=1;
		else
			for (var i in this.AllBubbles)
				biggestDataR=Math.max(biggestDataR,
					Math.abs(Animations.getFinalValue(this.AllBubbles[i],'r')));
		for (var i in this.AllBubbles) {
			var x = Animations.getFinalValue(this.AllBubbles[i],'x');
			var y = Animations.getFinalValue(this.AllBubbles[i],'y');
			var r = Animations.getFinalValue(this.AllBubbles[i],'r');
			r = Math.abs(r);
			var rPixels = r/biggestDataR*this.biggestR;
			var rx=x/(this.width-2*margin-rPixels)*rPixels;
			var ry=y/(this.height-2*margin-rPixels)*rPixels;
			rangeX[1]=Math.max(x+rx,rangeX[1]);
			rangeY[1]=Math.max(y+ry,rangeY[1]);
			rangeX[0]=Math.min(0,x,rangeX[0]);
			rangeY[0]=Math.min(0,y,rangeY[0]);
		}
		var transTime = (noAnim ? 0 : this.TransitionMillis);
		Animations.animateValue(this.rangeX,0,rangeX[0],transTime);
		Animations.animateValue(this.rangeY,0,rangeY[0],transTime);
		Animations.animateValue(this.rangeX,1,rangeX[1],transTime);
		Animations.animateValue(this.rangeY,1,rangeY[1],transTime);
		Animations.animateValue(this,'biggestDataR',biggestDataR,transTime);
		this.needsRecalc=false;
	}
	this.dataToPixel = function(x,y,r) {
		var x1 = (x-this.rangeX[0])/(this.rangeX[1]-this.rangeX[0])*(this.width-2*margin)+margin;
		var y1 = (y-this.rangeY[0])/(this.rangeY[1]-this.rangeY[0])*(this.height-2*margin)+margin;
		y1 = this.height - y1;
		return [x1,y1,(r<0?-1:1)*Math.sqrt(Math.abs(r)/this.biggestDataR)*this.biggestR];
	}
	
	this.pixelToData = function(x,y) {
		y1=this.height-y;
		var x1=(x-margin)/(this.width-2*margin)*(this.rangeX[1]-this.rangeX[0])+this.rangeX[0];
		var y1=(y1-margin)/(this.width-2*margin)*(this.rangeY[1]-this.rangeY[0])+this.rangeY[0];
		return [x1,y1];
	}

	this.drawAxes=function(ctx, drawLabels) {
		ctx.lineWidth=2;
		ctx.strokeStyle='#000000';
		var x0,y0,_ref;
		_ref=this.dataToPixel(0,0,0),x0=_ref[0],y0=_ref[1];
		ctx.beginPath(); ctx.moveTo(x0,0); ctx.lineTo(x0,this.height); ctx.stroke();
		ctx.beginPath(); ctx.moveTo(0,y0); ctx.lineTo(this.width,y0); ctx.stroke();
		ctx.lineWidth=1;
		
		if (drawLabels) {
			var minPPUTicks=50;	// minimum pixel per ticks
			function tickUnit(x) {
				var pow10=0;
				while (x>1) {x/=10; pow10++;}
				while (x<1) {x*=10; pow10--;}
				var value;
				if (x<2) value = 2;
				else if (x<5) value = 5;
				else {value = 1; pow10++;}
				return [value,pow10];
			}
			var unitsX=minPPUTicks*(this.rangeX[1]-this.rangeX[0])/this.width;
			unitsX=tickUnit(unitsX); var ticksX=unitsX[0]*Math.pow(10,unitsX[1]);
			var unitsY=minPPUTicks*(this.rangeY[1]-this.rangeY[0])/this.height;
			unitsY=tickUnit(unitsY); var ticksY=unitsY[0]*Math.pow(10,unitsY[1]);
			function tickLabel(i,tickUnits) {
				var pow=tickUnits[1];
				if (pow==0) return i;
				else if (pow>0) {
					var suff="";
					if (pow>=9) {pow-=9; suff=" B"+suff;}
					if (pow>=6) {pow-=6; suff=" MM"+suff;}
					if (pow>=3) {pow-=3; suff="k"+suff;}
					while (pow>0) {--pow; suff="0"+suff;}
					return i*tickUnits[0]+suff;
				}
				else {
					var res=""+Math.abs(i)*tickUnits[0];
					pow-=1;
					while (res.length<-pow) {res="0"+res;}
					var l=res.length;
					var msg = res.substr(0,l+pow+1)+"."+res.substr(l+pow+1);
					if (i<0) msg='-'+msg;
					return msg;
				}
			}
			//console.log(unitsY, ticksY);
			for (var i=1; i<1000; ++i) {
				var t,u,_ref;
				_ref = this.dataToPixel(ticksX * i, ticksY * i), t = _ref[0], u = _ref[1];
				var drawn=0;
				ctx.textAlign="center";
				if (t<this.width) {
					ctx.beginPath(); ctx.moveTo(t,y0+3); ctx.lineTo(t,y0); ctx.stroke();
					ctx.fillText(tickLabel(i,unitsX),t,y0+10);
					drawn=1;
				}
				if (2*x0-t>0) {
					ctx.beginPath(); ctx.moveTo(2*x0-t,y0+3); ctx.lineTo(2*x0-t,y0); ctx.stroke();
					ctx.fillText(tickLabel(-i,unitsX),2*x0-t,y0+10);
					drawn=2;
				}
				ctx.textAlign="left";
				if (u>0) {
					ctx.beginPath(); ctx.moveTo(x0-3,u); ctx.lineTo(x0,u); ctx.stroke();
					ctx.fillText(tickLabel(i,unitsY),x0+3,u);
					drawn=3;
				}
				if (2*y0-u<this.height) {
					ctx.beginPath(); ctx.moveTo(x0-3,2*y0-u); ctx.lineTo(x0,2*y0-u); ctx.stroke();
					ctx.fillText(-tickLabel(-i,unitsY),x0+3,2*y0-u);
					drawn=4;
				}
				if (!drawn) break;
			}
			if (i>100) console.log(this.height, u, "Warning: "+i+" iterations in drawing axes, last drawin index "+drawn);
		}
	}

	this.drawTooltip=function(ctx,text,x,y) {
		ctx.textAlign="left";
		var width=ctx.measureText(text).width;
		ctx.fillStyle="#fefee0";
		ctx.strokeStyle=ColorUtils.Darken("#fefee0",0.5);
		ctx.globalAlpha=0.7;
		var minx=this.width-width-20-3;
		x=Math.min(x,minx);
		ArnUtils.roundRect(ctx,x,y-17,width+20,19,3,true,true);
		//ctx.fillRect(x,y,width+20,-15);
		ctx.globalAlpha=1;
		ctx.fillStyle="black";
		ctx.fillText(text,x+10,y-5);
	}
	
	var lastFrameAt=0;
	var getFPS = function() {
		var milli = (new Date()).getTime();
		var diff = milli-lastFrameAt;
		lastFrameAt=milli;
		return 1000/diff;
	}
	
	this.titleX=null;
	this.titleY=null;
	this.drawChart=function(ctx) {
		ctx.save();
		//ctx.fillText("FPS: " + getFPS(), 300, 20);
		//this.drawAxes(ctx, !Animations.isAnimating());
		this.drawAxes(ctx, true);
		if (this.titleX || this.titleY) {
			ctx.save();
			ctx.textAlign="center";
			ctx.font="bold 10pt Arial";
			ctx.fillText(this.titleX,this.width/2,this.height-5);
			ctx.rotate(-Math.PI/2);
			ctx.fillText(this.titleY,(-this.height+margin)/2,15);
			ctx.restore();
		}
		var mouseBub=null, mouseIntensity=0;
		for (var i in this.AllBubbles) {
			this.AllBubbles[i].draw(ctx);
			if (this.mouseX!=null) {
				var dist = Math.sqrt(Math.pow(this.AllBubbles[i].pixelX-this.mouseX,2) + Math.pow(this.AllBubbles[i].pixelY-this.mouseY,2));
				if (dist<Math.abs(this.showAsPercents?this.biggestR:this.AllBubbles[i].pixelR)) {
					var intensity = 1/(1+Math.abs(this.AllBubbles[i].pixelR));
					if (intensity>mouseIntensity) {
						mouseBub=this.AllBubbles[i];
						mouseIntensity=intensity;
					}
				}
			}
		}
		if (mouseBub!=null) {
			// mouse is over a bubble
			ctx.globalAlpha=0.5;
			mouseBub.drawOutline(ctx);
			if (mouseBub.tooltip) {
				this.drawTooltip(ctx,mouseBub.tooltip, this.mouseX+5, this.mouseY-5);
			}
		}
		var motion=false;
		if (this.mouseClicked) {
			if (this.mouseMultiple)
				this.selectBubble(mouseBub,this.isSelected(mouseBub));
			else this.selectOneBubble(mouseBub,this.isSelected(mouseBub));
			this.mouseClicked=false;
			motion=true;
		}
		ctx.restore();
		return motion;
	}
	
	var willUpdate=false;
	this.update=function() {
		if (this.holdUpdates) return;
		if (!willUpdate) {
			willUpdate=true;
			setTimeout(function(thisObj) {thisObj.update2();},30,this);
		}
	}
	
	this.holdUpdates=false;
	this.updateHooks=[];
	this.update2=function() {
		if (this.holdUpdates) return;
		Animations.animate();
		var motion=Animations.isAnimating();
		this.ctx.clearRect(0,0,this.width,this.height);
		if (this.needsRecalc) this.doRecalc();
		for (var i in this.updateHooks) motion|=this.updateHooks[i](this.ctx);
		motion|=this.drawChart(this.ctx);
		//if (motion) requestAnimationFrame(_this.update2);
		//else willUpdate=false;
		if (motion) setTimeout(function(thisObj) {thisObj.update2();},0,this);
		else willUpdate=false;
	}
	
}
