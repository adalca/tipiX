/** Main working functions of the data viewer 
 * 
 * Warning: this is very rough code still.
 * 
 * TODO: getLoadBoxName() should exist to clean up above code,
 * TODO: define the pictureBox object cleanly along with all of its 
 * 	properties/functions - including onload, etc; and static getLoadBoxName.
 * 
 * Author: Adrian V. Dalca, http://www.mit.edu/~adalca/
 */


/**
 * Build the loading html matrix
 * 
 * @param loadObj - the main loading object for this set, see spec 
 * 	@ launchDisplay() 
 */
function buildLoadMatrix(loadObj) {

	// if one-dimension
	if (loadObj.nDims == 1) {

		// write to div element loadMatrix a set of smaller divs which will 
		// indicate loading, or lack thereof
		txt = 'Load Matrix: <br /> <br />';
		for ( var i = 0; i < loadObj.xBins; i++) {
			divTxt = sprintf('<div class="loadBox" id="#load_%d"></div>', i + 1);
			txt = txt + divTxt;
		}		
		document.getElementById('loadMatrix').innerHTML = txt;
		
		// color the new divs in with grey
		// TODO: clean this - this is duplicate code with loadImage!
		for ( var i = 0; i < loadObj.xBins; i++) {
			loadBoxName = sprintf('#load_%d', i+1); 
			imgBoxSet(loadBoxName, "#AAAAAA", loadObj.xBins);
		}				
		
	// if two-dimension
	} else {
		
		// write to div element loadMatrix a set of smaller divs which will 
		// indicate loading, or lack thereof
		txt = 'Load Matrix: <br /> <br />';
		for ( var i = 0; i < loadObj.yBins; i++) {
			for ( var j = 0; j < loadObj.xBins; j++) {
				divTxt = sprintf(
						'<div class="loadBox" id="#load_%d_%d"></div>', i + 1,
						j + 1);
				txt += divTxt;
			}
		}
		document.getElementById('loadMatrix').innerHTML = txt;
		
		// color the new divs in with grey
		// TODO: clean this - this is duplicate code with loadImage!
		for ( var i = 0; i < loadObj.yBins; i++) {
			for ( var j = 0; j < loadObj.xBins; j++) {
				loadBoxName = sprintf('#load_%d_%d', i + 1, j + 1); // TODO: - fix copied code with loadImage!
				imgBoxSet(loadBoxName, "#AAAAAA", loadObj.xBins);
			}
		}
	}
}

/**
 * Load an image
 * 
 * @param loadObj - loading object, see spec @ launchDisplay() 
 * @param idx - array representing index of the loading image. If this is a 1d 
 * 	set, then the array has one element, otherwise it has 2.
 * @returns pictureBox, an object with the following fiels:
 * 	img - the Image object 
 * 	loaded - boolean whether the image is loaded or not
 * 	fileName - the file name of the image
 *  loadBoxName - the div element name of the image 
 */
function loadImage(loadObj, idx) {
	// idx is an element of an array of 2 elements, all elements start at 1

	// start from
	// http://stackoverflow.com/questions/5678899/change-image-source-if-file-exists
	
	var pictureBox = {};
	pictureBox.img = new Image();
	pictureBox.loaded = false;
	
	if (idx.length == 1) {
		pictureBox.fileName = sprintf(loadObj.fileName, idx[0]);
		pictureBox.loadBoxName = sprintf('#load_%d', idx[0]);

	} else {
		pictureBox.fileName = sprintf(loadObj.fileName, idx[0], idx[1]);
		pictureBox.loadBoxName = sprintf('#load_%d_%d', idx[0], idx[1]);
	}
	
	// set css and write loading time for this image 	
	pictureBox.img.onload = function() {
		imgBoxSet(pictureBox.loadBoxName, "#99db99", loadObj.xBins);
		pictureBox.loaded = true;
		writeLoadingTime();
	};

	// set css and write loading time for this image
	pictureBox.img.onerror = function() {
		imgBoxSet(pictureBox.loadBoxName, "#db9999", loadObj.xBins);
		writeLoadingTime();
	};

	// fires off loading of image
	pictureBox.img.src = pictureBox.fileName;

	return pictureBox;
}



/**
 * Pre-load pictureBoxes into image objects
 * 
 * @param loadObj -
 *            the loading object, has fields: nDims - number of dimensions, 1 or
 *            2 xBins - the number of x bins yBins - the number of y bins
 *            fileName - format string (including path) for the file names
 * @returns {Array} the image objects (1 or 2 dim array).
 */
function loadImages(loadObj) {

	// should have one or two dimensions
	assert(loadObj.nDims == 1 || loadObj.nDims == 2);

	// some setup
	document.getElementById('time').innerHTML = "Loading...";
	buildLoadMatrix(loadObj);
	
	// record starting time
	startTime = new Date().getTime();

	// should be xBins if nDims == 1, yBins otherwise
	mainBins = (loadObj.nDims == 1 ? loadObj.xBins : loadObj.yBins);

	// go through the sources
	var pictureBoxes = new Array(mainBins);
	for ( var i = 0; i < mainBins; i++) {

		// add pictureBox objects
		if (loadObj.nDims == 1) {
			pictureBoxes[i] = loadImage(loadObj, [ i + 1 ]);

		} else {
			pictureBoxes[i] = new Array(loadObj.xBins);
			for (j = 0; j < loadObj.xBins; j++) {
				pictureBoxes[i][j] = loadImage(loadObj, [ i + 1, j + 1 ]);
			}
		} // nDims if
	} // for loop
	
	// clean current picture box
	curPictureBox = null;
	
	// return pictureBoxes
	return pictureBoxes;
}



/** get a discrete position in the range of 1..nDiscretes
 * 
 * @param pos - the current mouse position in the canvas
 * @param canvasLen - the length of the canvas
 * @param nDiscretes - the number of bins desired
 * @returns the discrete position
 */
function getDiscretePosition(pos, canvasLen, nDiscretes) {

	// make sure the error on pos is no larger than 5 pixels
	assert((pos - 5) < canvasLen, 'Mouse position much bigger than canvas end');
	assert(pos > - 5, 'Mouse position much smaller than canvas begin');
	pos = Math.max(pos, 0);
	pos = Math.min(pos, canvasLen);
	
	// normalize the position to be between (nDiscrets/canvasLen)/2 and 1
	normPos = Math.max(pos / canvasLen, (nDiscretes / canvasLen) / 2);
	debugMsg = sprintf('%d, %2.2f, %2.2f', 
			Math.ceil(normPos * nDiscretes) - 1, normPos * nDiscretes, pos);
	writeDebug(debugMsg);
	return (Math.ceil(normPos * nDiscretes) - 1);
}


/**
 * Write a debug message in the debug div element
 * @param msg the string message to write
 */
function writeDebug(msg) {
	document.getElementById('debug').innerHTML = msg;
}



/** Draw the given images
 * 
 * @param pos - the position of the mouse
 */
function drawImage(pos) {
	nDims = loadObj.nDims;
	var context = canvas.getContext('2d');

	var redraw = false;
	if (nDims == 1) {
		discretePos = getDiscretePosition(pos.x, canvas.width,
				pictureBoxes.length);

		if (currentX != discretePos) {
			redraw = true;
			currentX = discretePos;
		} else {
			redraw = false;
		}

		msg = "Mouse Position:" + discretePos;
		pictureBox = pictureBoxes[discretePos];

	} else {

		discreteX = getDiscretePosition(pos.x, canvas.width,
				pictureBoxes[1].length);
		discreteY = getDiscretePosition(pos.y, canvas.height,
				pictureBoxes.length);

		if (currentX != discreteX) {
			redraw = true;
			currentX = discreteX;
		}
		if (currentY != discreteY) {
			redraw = true;
			currentY = discreteY;
		}

		msg = "Mouse Position Y:" + discreteY + " X:" + discreteX;
		pictureBox = pictureBoxes[discreteY][discreteX];
	}

	// draw the image
	// recolor old picture box to original color, and new picture box to new color
	if (redraw) {
		
		// color the load box of previous image back to original color
		if (curPictureBox != null) { 
			curColor = (curPictureBox.loaded) ? "#99db99" : "#db9999";
			imgBoxSet(curPictureBox.loadBoxName, curColor, loadObj.xBins);
		}
		
		// display the image
		if (pictureBox.loaded) {
			document.getElementById('imgnr').innerHTML = msg;
			context.drawImage(pictureBox.img, 0, 0);
		}
		
		// color the load box 
		curColor = (pictureBox.loaded) ? "green" : "red";
		imgBoxSet(pictureBox.loadBoxName, curColor, loadObj.xBins);
	}
	curPictureBox = pictureBox;
}

/** Obtain mouse position
 * 
 * @param canvas - the canvas
 * @param evt - the event.
 * @returns object with x and y variables
 */
function getMousePos(canvas, evt) {
	var rect = canvas.getBoundingClientRect();
	return {
		x : evt.clientX - rect.left,
		y : evt.clientY - rect.top
	};
}

/** Standard assert function
 * source: http://cse.csusb.edu/turner/wiki/Javascript_Assert_Function
 * @param expression - the expression to assert
 * @param msg [optional] - the message if assertion fails
 */
function assert(expression, msg) {
	if (!expression) {
		if (msg === undefined) {
			window.alert("Assertion failed.");
		} else {
			window.alert("Assertion failed: " + msg);
		}
	}
}

/** 
 * Writes loading time to the time div.
 * TODO: eliminate need for startTime being global 
 * @requires global variable startTime
 */
function writeLoadingTime() {
	// write the time difference from global var startTime.
	var end = new Date().getTime();
	var time = end - startTime;
	var timeMsg = 'Loading time:' + time + ' millis';
	document.getElementById('time').innerHTML = timeMsg;
}

/** Set the image box (div) with the given color and size
 * TODO: should set size and float at initiation!. 
 * 
 * @param loadBoxName
 * @param color
 * @param xBins
 */
function imgBoxSet(loadBoxName, color, xBins) {
	var width = document.getElementById('loadMatrix').offsetWidth;
	var binWidth = Math.floor(width / xBins);
	document.getElementById(loadBoxName).style.backgroundColor = color;
	document.getElementById(loadBoxName).style.width = "" + binWidth + "px";
	document.getElementById(loadBoxName).style.cssFloat = "left";
}