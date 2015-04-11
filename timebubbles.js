/*** Timed Bubble Chart API
	
	goToTime(int,speed) - animates to a specified time
	setAxes(int index1, int index2, int indexRadius) - sets axes variables & animates
	
	// setData example
	setData({
		vars: ["Var 1", "Var 2", ..., "Var 6"],
		times: ["Year 1",..., "Year 10"],
		data: [
			["Cat 1",[data for time 1],...,[data for time 10]],
			["Cat 2",[data for time 1],...,[data for time 10]],
			...
			["Cat 23",[data for time 1],...,[data for time 10]]
		]
	});
	
	getData(int cat,int time) {
		return TimeData[cat][time+1];
	}
	

	var TimeData={
		vars: ["V1", "V2", "V3", "V4"],
		times: [1,2,3,4,5,6,7,8,9,10],
		data: [
['A1',	[0.263518103,0.944723165,0.604120634,0.659397469]					,
	[0.360281758,0.801827057,0.581054407,0.77922735]					,
	[0.3811654,0.81668331,0.598924355,0.782241045]					,
	[0.416443824,0.613123216,0.51478352,0.901660304]					,
	[0.468071639,0.614553653,0.541312646,0.926758993]					,
	[0.499095751,0.694410769,0.59675326,0.902342491]					,
	[0.551652295,0.478964831,0.515308563,1.036343732]					,
	[0.603384954,0.429697358,0.516541156,1.086843798]					,
	[0.651885831,0.596174687,0.624030259,1.027855572]					,
	[0.720735804,0.355359145,0.538047474,1.182688329]					],
['A2',	[0.121290146,0.893668988,0.507479567,0.613810579]					,
	[0.152233959,0.914561263,0.533397611,0.618836348]					,
	[0.170684931,0.98846342,0.579574176,0.591110755]					,
	[0.281252792,0.929932279,0.605592536,0.675660257]					,
	[0.375567509,0.71110314,0.543335324,0.832232185]					,
	[0.404124832,0.753073288,0.57859906,0.825525772]					,
	[0.409940481,0.664504938,0.53722271,0.872717771]					,
	[0.45558934,0.581791759,0.518690549,0.93689879]					,
	[0.463405959,0.68970058,0.576553269,0.886852689]					,
	[0.501764312,0.597820276,0.549792294,0.951972018]					],
['A3',	[0.02149104,1.125769182,0.573630111,0.447860929]					,
	[-0.042066863,1.226239417,0.592086277,0.36584686]					,
	[-0.10699788,1.212558073,0.552780096,0.340222024]					,
	[-0.156735562,1.293238367,0.568251402,0.275013036]					,
	[-0.253948236,1.258061362,0.502056563,0.243995201]					,
	[-0.309689061,1.3827675,0.53653922,0.153771719]					,
	[-0.346519358,1.374549597,0.51401512,0.139465522]					,
	[-0.40343937,1.565034715,0.580797672,0.015762957]					,
	[-0.469588511,1.607227563,0.568819526,-0.038408037]					,
	[-0.532846624,1.588335766,0.527744571,-0.060591195]					],
['A4',	[0.798865308,0.275348726,0.537107017,1.261758291]					,
	[0.714145736,0.430025728,0.572085732,1.142060004]					,
	[0.641857495,0.430752689,0.536305092,1.105552403]					,
	[0.51727205,0.667089702,0.592180876,0.925091174]					,
	[0.43392731,0.723606651,0.578766981,0.855160329]					,
	[0.356536486,0.867550711,0.612043598,0.744492888]					,
	[0.291306828,0.934466603,0.612886715,0.678420112]					,
	[0.285807729,0.761854994,0.523831361,0.761976367]					,
	[0.186053665,0.890862896,0.538458281,0.647595384]					,
	[0.084642411,1.046246506,0.565444459,0.519197953]					],
['B1',	[0.121176707,0.939649266,0.530412987,0.59076372]					,
	[0.122125827,1.086967206,0.604546517,0.51757931]					,
	[0.124145898,0.923167675,0.523656786,0.600489112]					,
	[0.132144955,0.986947319,0.559546137,0.572598818]					,
	[0.133259281,0.966863937,0.550061609,0.583197672]					,
	[0.142661862,0.959056073,0.550858967,0.591802894]					,
	[0.155509008,0.909946515,0.532727762,0.622781246]					,
	[0.156989037,1.031944865,0.594466951,0.562522086]					,
	[0.165698449,1.051746844,0.608722646,0.556975802]					,
	[0.171813925,0.909069777,0.540441851,0.631372074]					]
		]
	}
	***/

function TimeBubbles(container,TimeData) {
	var bubbleChart=new BubbleChart(container);
	//bubbleChart.holdUpdates=true;	// will always update through own routine
	bubbleChart.TransitionMillis=0;
	this.getChart=function() {return bubbleChart;}
	

	var varX, varY, varR;	// indices of the X, Y and R
	var bubbles=[];
	this.setData=function(data) {
		bubbleChart.empty();
		bubbles=[];
		for (var i in TimeData.data) {
			var bub = bubbleChart.addBubble(100,100,0,{tooltip:TimeData.data[i][0]});
			bub.category = i;	// category number
			bubbles.push(bub);
		}
		//varR=0; varX=1; varY=2;
	}
	this.setData(TimeData);

	// e.g. this.getData(cat,time,varR) will return the R
	this.getData = function(cat,time,variable) {
		if (time==0 || time==TimeData.times.length-1 || Math.floor(time)==time)
			return TimeData.data[cat][time+1][variable];
		var v1=TimeData.data[cat][Math.floor(time)+1][variable];
		var v2=TimeData.data[cat][Math.floor(time+1)+1][variable];
		var u=time-Math.floor(time);
		return v1*(1-u)+v2*u;
	}
	
	this.time=0;
	var prevTime=-1;
	this.recalc = function(force) {
		var time=this.time;
		if (!force && time==prevTime) return;
		for (var i in TimeData.data) {
			var x=this.getData(i,time,varX);
			var y=this.getData(i,time,varY);
			var r=this.getData(i,time,varR);
			bubbles[i].moveTo(x,y,r);
		}
		prevTime=time;
	}
	this.gotoTime = function(time,speed) {
		if (speed==null) speed=500;
		if (time>=TimeData.times.length) time=TimeData.times.length-1;
		else if (time<0) time=0;
		Animations.animateValue(this,'time',time,speed);
		bubbleChart.update();
	}
	
	var selections={};
	var _this=this;
	this.updateSelections = function(bub,deselected) {
		if (bub==null) selections={};
		else {
			var key=ArnUtils.ObjectId(bub);
			if (deselected) delete selections[key];
			else {
				obj={};
				obj.bubble=bub;
				obj.time=Math.floor(_this.time+0.5);
				selections[key]=obj;
			}
		}
	}
	bubbleChart.selectionChangeHooks.push(this.updateSelections);
	
	bubbleChart.updateHooks.push(function(ctx) {
		_this.recalc();
		ctx.save();
		var timeString = ""+TimeData.times[Math.floor(_this.time+.5)];
		var twidth = ctx.measureText(timeString).width;
		ctx.fillStyle="#000000";
		var textSize = 120*bubbleChart.width/800;
		ctx.font=textSize+"pt Arial";
		ctx.globalAlpha=0.05;
		ctx.textAlign="center";
		ctx.fillText(timeString,bubbleChart.width/2,bubbleChart.height/2+textSize/2);
		for (var key in selections) {
			var obj=selections[key];
			if (obj.time>_this.time) obj.time=_this.time;
			/*
			for (var t = obj.time; t<=_this.time; t+=0.25) {
				var time = t;
				var x=_this.getData(obj.bubble.category,time,varX);
				var y=_this.getData(obj.bubble.category,time,varY);
				var r=_this.getData(obj.bubble.category,time,varR);
				[x,y,r]=bubbleChart.dataToPixel(x,y,r);
				ctx.beginPath();
				ctx.arc(x, y, r, 0, Math.PI*2, true); 
				ctx.closePath();
				ctx.globalAlpha=0.3;
				ctx.fillStyle=obj.bubble.color;
				ctx.fill();
				ctx.globalAlpha=1;
				ctx.strokeStyle=ColorUtils.Darken(obj.bubble.color,.2);
				ctx.stroke();
			}
			*/
			ctx.beginPath();
			var first=true;
			for (var t = obj.time; t<=_this.time+1e-7+1; ++t) {
				if (t>_this.time) time=_this.time;
				else time=t;
				var x=_this.getData(obj.bubble.category,time,varX);
				var y=_this.getData(obj.bubble.category,time,varY);
				//[x,y]=bubbleChart.dataToPixel(x,y,0);
			// Doing it the old way, till destructuring assignment is supported in Chrome
			var _ref=bubbleChart.dataToPixel(x,y,0); x=_ref[0]; y=_ref[1];
				if (first) ctx.moveTo(x,y);
				else ctx.lineTo(x,y);
				first=false;
			}
			ctx.globalAlpha=0.5;
			ctx.strokeStyle=obj.bubble.color;
			ctx.stroke();
		}
		ctx.restore();
	});
	
	this.setAxes=function(nvx,nvy,nvr,quick) {
		if (nvx!=null) varX=nvx;
		if (nvy!=null) varY=nvy;
		if (nvr!=null) varR=nvr;
		bubbleChart.titleX=TimeData.vars[varX];
		bubbleChart.titleY=TimeData.vars[varY];
		if (!quick) bubbleChart.TransitionMillis=1000;
		this.recalc(true);
		bubbleChart.doRecalc();
		if (!quick) bubbleChart.TransitionMillis=0;
	}
	this.setAxes(1,2,0,true);
	
	var _this=this;
	this.createSlider=function(cont) {
		$(cont).width('800px');
		var $play=$('<button>Play</button>');
		var $slider=$('<div/>');
		var setValue=function(value) {
			//$label.html('Timepoint: '+TimeData.times[value]);
			_this.gotoTime(value);
		}
		$play.button().click(function() {
			var target=TimeData.times.length-1;
			var where=_this.time;
			if (target==where) return false;
			_this.gotoTime(target,6000*(target-where)/target);
			$slider.slider('value',target);
			return true;
		});
		$slider.slider({
			min: 0,
			max: TimeData.times.length-1,
			slide: function(evt, ui) {setValue(ui.value);}
		});

		var htmlVars = '<div>';
		for (var i in TimeData.vars)
			htmlVars+='<input type="radio" id="var'+i+'" name="radiovars"/><label for="var'+i+'">'+TimeData.vars[i]+'</label>';
		htmlVars+='</div>';
		var $vars = $(htmlVars);
		$vars.buttonset();

		var showVars = function(obj) {
			if ($vars.is(':visible')) {$vars.hide(); return;}
			$(obj).parent().append($vars);
			//$vars.insertAfter($(this));
			var left = $(obj).offset().left-$(obj).parent().offset().left;
			$vars.css('padding-left',left);
			$bXAxis.attr('checked','checked');
			$vars.show('fast');
		};

		var curAxis=0;
		$vars.children('input').click(function() {
			var varnum = parseInt($(this).attr('id').substr(3));
			if (curAxis==0) _this.setAxes(varnum);
			else if (curAxis==1) _this.setAxes(null,varnum);
			else if (curAxis==2) _this.setAxes(null,null,varnum);
			$vars.hide();
		});

		var $bXAxis=$('<button>X Axis</button>').button().click(function() {curAxis=0; showVars(this);});
		var $bYAxis=$('<button>Y Axis</button>').button().click(function() {curAxis=1; showVars(this);});
		var $bRadius=$('<button>Radius</button>').button().click(function() {curAxis=2; showVars(this);});

		$(cont).append($('<br/>'),/*$label,*/$slider,$play,$('<div style="display:inline;">&nbsp;&nbsp;&nbsp;</div>'),$bXAxis,$bYAxis,$bRadius);
		setValue(0);
	}
	
	//this.gotoTime(3);
}
