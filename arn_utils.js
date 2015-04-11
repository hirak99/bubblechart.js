var ArnUtils = new function(){
	// This will parse a delimited string into an array of
	// arrays. The default delimiter is the comma, but this
	// can be overriden in the second argument.
	this.CSVToArray = function ( strData, strDelimiter ){
		// Check to see if the delimiter is defined. If not,
		// then default to comma.
		strDelimiter = (strDelimiter || ",");

		// Create a regular expression to parse the CSV values.
		var objPattern = new RegExp(
				(
						// Delimiters.
						"(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

						// Quoted fields.
						"(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

						// Standard fields.
						"([^\"\\" + strDelimiter + "\\r\\n]*))"
				),
				"gi"
				);


		// Create an array to hold our data. Give the array
		// a default empty first row.
		var arrData = [[]];

		// Create an array to hold our individual pattern
		// matching groups.
		var arrMatches = null;


		// Keep looping over the regular expression matches
		// until we can no longer find a match.
		while (arrMatches = objPattern.exec( strData )){

				// Get the delimiter that was found.
				var strMatchedDelimiter = arrMatches[ 1 ];

				// Check to see if the given delimiter has a length
				// (is not the start of string) and if it matches
				// field delimiter. If id does not, then we know
				// that this delimiter is a row delimiter.
				if (
						strMatchedDelimiter.length &&
						(strMatchedDelimiter != strDelimiter)
						){

						// Since we have reached a new row of data,
						// add an empty row to our data array.
						arrData.push( [] );

				}


				// Now that we have our delimiter out of the way,
				// let's check to see which kind of value we
				// captured (quoted or unquoted).
				if (arrMatches[ 2 ]){

						// We found a quoted value. When we capture
						// this value, unescape any double quotes.
						var strMatchedValue = arrMatches[ 2 ].replace(
								new RegExp( "\"\"", "g" ),
								"\""
								);

				} else {

						// We found a non-quoted value.
						var strMatchedValue = arrMatches[ 3 ];

				}


				// Now that we have our value string, let's add
				// it to the data array.
				arrData[ arrData.length - 1 ].push( strMatchedValue );
		}

		// Return the parsed data.
		return( arrData );
	}

	/**
	 * Draws a rounded rectangle using the current state of the canvas. 
	 * If you omit the last three params, it will draw a rectangle 
	 * outline with a 5 pixel border radius 
	 * @param {CanvasRenderingContext2D} ctx
	 * @param {Number} x The top left x coordinate
	 * @param {Number} y The top left y coordinate 
	 * @param {Number} width The width of the rectangle 
	 * @param {Number} height The height of the rectangle
	 * @param {Number} radius The corner radius. Defaults to 5;
	 * @param {Boolean} fill Whether to fill the rectangle. Defaults to false.
	 * @param {Boolean} stroke Whether to stroke the rectangle. Defaults to true.
	 */
	this.roundRect=function(ctx, x, y, width, height, radius, fill, stroke) {
	  if (typeof stroke == "undefined" ) {
		stroke = true;
	  }
	  if (typeof radius === "undefined") {
		radius = 5;
	  }
	  ctx.beginPath();
	  ctx.moveTo(x + radius, y);
	  ctx.lineTo(x + width - radius, y);
	  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
	  ctx.lineTo(x + width, y + height - radius);
	  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
	  ctx.lineTo(x + radius, y + height);
	  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
	  ctx.lineTo(x, y + radius);
	  ctx.quadraticCurveTo(x, y, x + radius, y);
	  ctx.closePath();
	  if (stroke) {
		ctx.stroke();
	  }
	  if (fill) {
		ctx.fill();
	  }        
	}
	
	this.nextId=1;
	this.ObjectId = function(obj) {
		if (obj==null) return null;
		if (obj.__arn_id==null) obj.__arn_id=this.nextId++;
		return obj.__arn_id;
	}
}



function RNG(seed) {
  // LCG using GCC's constants
  this.m = 0x100000000; // 2**32;
  this.a = 1103515245;
  this.c = 12345;

  this.state = seed ? seed : Math.floor(Math.random() * (this.m-1));
}
RNG.prototype.nextInt = function() {
  this.state = (this.a * this.state + this.c) % this.m;
  return this.state;
}
RNG.prototype.nextFloat = function() {
  // returns in range [0,1]
  return this.nextInt() / (this.m - 1);
}
RNG.prototype.nextRange = function(start, end) {
  // returns in range [start, end): including start, excluding end
  // can't modulu nextInt because of weak randomness in lower bits
  var rangeSize = end - start;
  var randomUnder1 = this.nextInt() / this.m;
  return start + Math.floor(randomUnder1 * rangeSize);
}
RNG.prototype.choice = function(array) {
  return array[this.nextRange(0, array.length)];
}

var ColorUtils = new function() {
	/** Assumes all input colors of the format '#00a0b0', or named color like 'red' **/
		var colours = {"aliceblue":"#f0f8ff","antiquewhite":"#faebd7","aqua":"#00ffff","aquamarine":"#7fffd4","azure":"#f0ffff",
		"beige":"#f5f5dc","bisque":"#ffe4c4","black":"#000000","blanchedalmond":"#ffebcd","blue":"#0000ff","blueviolet":"#8a2be2","brown":"#a52a2a","burlywood":"#deb887",
		"cadetblue":"#5f9ea0","chartreuse":"#7fff00","chocolate":"#d2691e","coral":"#ff7f50","cornflowerblue":"#6495ed","cornsilk":"#fff8dc","crimson":"#dc143c","cyan":"#00ffff",
		"darkblue":"#00008b","darkcyan":"#008b8b","darkgoldenrod":"#b8860b","darkgray":"#a9a9a9","darkgreen":"#006400","darkkhaki":"#bdb76b","darkmagenta":"#8b008b","darkolivegreen":"#556b2f",
		"darkorange":"#ff8c00","darkorchid":"#9932cc","darkred":"#8b0000","darksalmon":"#e9967a","darkseagreen":"#8fbc8f","darkslateblue":"#483d8b","darkslategray":"#2f4f4f","darkturquoise":"#00ced1",
		"darkviolet":"#9400d3","deeppink":"#ff1493","deepskyblue":"#00bfff","dimgray":"#696969","dodgerblue":"#1e90ff",
		"firebrick":"#b22222","floralwhite":"#fffaf0","forestgreen":"#228b22","fuchsia":"#ff00ff",
		"gainsboro":"#dcdcdc","ghostwhite":"#f8f8ff","gold":"#ffd700","goldenrod":"#daa520","gray":"#808080","green":"#008000","greenyellow":"#adff2f",
		"honeydew":"#f0fff0","hotpink":"#ff69b4",
		"indianred ":"#cd5c5c","indigo ":"#4b0082","ivory":"#fffff0","khaki":"#f0e68c",
		"lavender":"#e6e6fa","lavenderblush":"#fff0f5","lawngreen":"#7cfc00","lemonchiffon":"#fffacd","lightblue":"#add8e6","lightcoral":"#f08080","lightcyan":"#e0ffff","lightgoldenrodyellow":"#fafad2",
		"lightgrey":"#d3d3d3","lightgreen":"#90ee90","lightpink":"#ffb6c1","lightsalmon":"#ffa07a","lightseagreen":"#20b2aa","lightskyblue":"#87cefa","lightslategray":"#778899","lightsteelblue":"#b0c4de",
		"lightyellow":"#ffffe0","lime":"#00ff00","limegreen":"#32cd32","linen":"#faf0e6",
		"magenta":"#ff00ff","maroon":"#800000","mediumaquamarine":"#66cdaa","mediumblue":"#0000cd","mediumorchid":"#ba55d3","mediumpurple":"#9370d8","mediumseagreen":"#3cb371","mediumslateblue":"#7b68ee",
		"mediumspringgreen":"#00fa9a","mediumturquoise":"#48d1cc","mediumvioletred":"#c71585","midnightblue":"#191970","mintcream":"#f5fffa","mistyrose":"#ffe4e1","moccasin":"#ffe4b5",
		"navajowhite":"#ffdead","navy":"#000080",
		"oldlace":"#fdf5e6","olive":"#808000","olivedrab":"#6b8e23","orange":"#ffa500","orangered":"#ff4500","orchid":"#da70d6",
		"palegoldenrod":"#eee8aa","palegreen":"#98fb98","paleturquoise":"#afeeee","palevioletred":"#d87093","papayawhip":"#ffefd5","peachpuff":"#ffdab9","peru":"#cd853f","pink":"#ffc0cb","plum":"#dda0dd","powderblue":"#b0e0e6","purple":"#800080",
		"red":"#ff0000","rosybrown":"#bc8f8f","royalblue":"#4169e1",
		"saddlebrown":"#8b4513","salmon":"#fa8072","sandybrown":"#f4a460","seagreen":"#2e8b57","seashell":"#fff5ee","sienna":"#a0522d","silver":"#c0c0c0","skyblue":"#87ceeb","slateblue":"#6a5acd","slategray":"#708090","snow":"#fffafa","springgreen":"#00ff7f","steelblue":"#4682b4",
		"tan":"#d2b48c","teal":"#008080","thistle":"#d8bfd8","tomato":"#ff6347","turquoise":"#40e0d0",
		"violet":"#ee82ee",
		"wheat":"#f5deb3","white":"#ffffff","whitesmoke":"#f5f5f5",
		"yellow":"#ffff00","yellowgreen":"#9acd32"};

	function colorNameLookup(colour)
	{
		if (colour[0]=='#') return colour;
		return colours[colour.toLowerCase()] || colour;
	}
	var ColorToInt = function (col) {
		col=colorNameLookup(col);
		return parseInt(col.slice(1),16);
	}
	this.RGB = function (r,g,b) {
		var value = b | (g << 8) | (r << 16);
		var newColor = value.toString(16);
		while (newColor.length<6) newColor='0'+newColor;
		return '#'+newColor;
	}
	this.ColorMix = function (col1,col2,u) {
		var num1 = ColorToInt(col1);
		var num2 = ColorToInt(col2);
		var r1 = (num1 >> 16);
		var g1 = ((num1 >> 8) & 0x00FF);
		var b1 = (num1 & 0x0000FF);
		var r2 = (num2 >> 16);
		var g2 = ((num2 >> 8) & 0x00FF);
		var b2 = (num2 & 0x0000FF);
		var r = Math.floor(r1*(1-u)+r2*u);
		var g = Math.floor(g1*(1-u)+g2*u);
		var b = Math.floor(b1*(1-u)+b2*u);
		return this.RGB(r,g,b);
	}
	this.RandomColor = function(index) {
		var rand = new RNG(index+23990414);
		var r = rand.nextRange(0,256);
		var g = rand.nextRange(0,256);
		var b = rand.nextRange(0,256);
		return this.RGB(r,g,b);
	}
	this.Brighten = function (col,u) {
		return this.ColorMix(col,'#ffffff',u);
	}
	this.Darken = function (col,u) {
		return this.ColorMix(col,'#000000',u);
	}
}();

/*** API
	a={b:2};
	Animations.animateValue(a,'b',3,10000);
	function draw() {
		Animation.animate();
		... drawing funcitons ...
		if (Animation.isAnimating()) setTimeOut(draw,100);
	}
	finalb=Animations.getFinalValue(a,'b');
 ***/

var Animations = new function() {
	var animQueue={};
	//this.AllAnims = function() {return animQueue;}	// for debugging
	var getIndex=function(parent,propName) {
		return ArnUtils.ObjectId(parent)+"|"+propName;
	}
	var findAnim=function(parent,propName) {
		return animQueue[getIndex(parent,propName)];
	}
	this.animateValue=function(parent,propName,dest,millis,tag) {
		delete animQueue[getIndex(parent,propName)];
		if (parent[propName]==dest)
			return;
		if (millis<10) {
			parent[propName]=dest;
			return;
		}
		var anim={
			parent: parent,
			propName: propName,
			startAt: (new Date()).getTime(),
			startVal: parent[propName],
			endVal: dest,
			duration: millis,
			lastVal: parent[propName],
			tag: tag
		};
		animQueue[getIndex(parent,propName)]=anim;
	}
	var animateAnim = function(anim) {
		if (anim.propName==null) {
			console.log('In animateAnim propName is null; should have been deleted.');
			return;
		}
		if (anim.parent[anim.propName]!=anim.lastVal) {
			anim.propName=null;
			return;
		}
		var diff = (new Date()).getTime() - anim.startAt;
		if (diff > anim.duration || anim.duration<1) {
			anim.parent[anim.propName]=anim.endVal;
			anim.propName=null;
			return;
		}
		var u = diff/anim.duration;
		anim.lastVal=anim.startVal*(1-u)+anim.endVal*u;
		anim.parent[anim.propName]=anim.lastVal;
	}
	this.animate=function() {
		var toRemove=[];
		for (var i in animQueue) {
			animateAnim(animQueue[i]);
			if (animQueue[i].propName==null) {
				toRemove.unshift(i);
			}
		}
		for (var k in toRemove) {
			delete animQueue[toRemove[k]];
		}
	}
	this.isAnimating = function() {
		for (var k in animQueue)
			return true;
		return false;
	}
	this.getFinalValue=function(parent,propName) {
		var anim = findAnim(parent,propName);
		if (anim!=null) return anim.endVal;
		return parent[propName];
	}
	this.endAll=function() {
		for (var k in animQueue) {
			var anim = animQueue[k];
			anim.parent[anim.propName]=anim.endVal;
			delete animQueue[k];
		}
	}
}
