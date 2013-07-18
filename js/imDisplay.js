/** tipiX - TIme PIcture eXplorer
 *
 * Copyright (c) 2013 TIPIX <adalca@mit.edu>
 *
 * tipiX is licensed under the MIT License:
 * http://www.opensource.org/licenses/mit-license.php
 *
 * See LICENSE file for more information
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
 * @param type - the type of matrix, e.g. "load" or "preview"
 */
function buildMatrix(loadObj, type) {

	matrixID = sprintf('%sMatrix', type);
	
	// if one-dimension
	if (loadObj.nDims == 1) {

		// write to div element typeMatrix a set of smaller divs which will 
		// indicate loading, or lack thereof
		txt = sprintf('%s Matrix: <br />', type);
		for ( var i = 0; i < loadObj.xBins; i++) {
			divTxt = sprintf('<div class="%sBox" id="#%s_%d"></div>', type, type, i);
			txt = txt + divTxt;
		}		
		document.getElementById(matrixID).innerHTML = txt;
		
		// color the new divs in with grey
		// TODO: clean this - this is duplicate code with loadImage!
		for ( var i = 0; i < loadObj.xBins; i++) {
			loadBoxName = sprintf('#%s_%d', type, i); 
			imgBoxSet(loadBoxName, "#AAAAAA", loadObj.xBins);
		}				
		
	// if two-dimension
	} else {
		
		// write to div element loadMatrix a set of smaller divs which will 
		// indicate loading, or lack thereof
		txt = sprintf('%s Matrix: <br />', type);
		for ( var i = 0; i < loadObj.yBins; i++) {
			for ( var j = 0; j < loadObj.xBins; j++) {
				divTxt = sprintf(
						'<div class="%sBox" id="#%s_%d_%d"></div>', type, type, i, j);
				txt += divTxt;
			}
		}
		document.getElementById(matrixID).innerHTML = txt;
		
		// color the new divs in with grey
		// TODO: clean this - this is duplicate code with loadImage!
		for ( var i = 0; i < loadObj.yBins; i++) {
			for ( var j = 0; j < loadObj.xBins; j++) {
				loadBoxName = sprintf('#%s_%d_%d', type, i, j); // TODO: - fix copied code with loadImage!
				imgBoxSet(loadBoxName, "#AAAAAA", loadObj.xBins);
			}
		}
	}
}



function prepareFilenames(loadObj) {
	
	
	if (loadObj.type == 'web') {
		// TODO - +1 issue??? Right now, default to 1..N, but code is for 0..(N-1)
		if (loadObj.nDims == 1) {
			filenames = new Array(loadObj.xBins);
			for ( var i = 0; i < loadObj.xBins; i++) {
				filenames[i] = sprintf(loadObj.fileName, i+1);
			}
		} else {
			assert(loadObj.nDims == 2);
			filenames = new Array(loadObj.yBins);
			for ( var i = 0; i < loadObj.yBins; i++) {
				filenames[i] = new Array(loadObj.xBins);
				for ( var j = 0; j < loadObj.xBins; j++) {
					filenames[i][j] = sprintf(loadObj.fileName, i+1, j+1);
				}
			}
		}
		
		
	} else {
		assert(loadObj.type == 'local');
		
		if (loadObj.nDims == 1) {
			filenames = new Array(loadObj.xBins);
			for ( var i = 0; i < loadObj.xBins; i++) {
				if (loadObj.fileIdx[i] != undefined)
					filenames[i] = URL.createObjectURL(loadObj.files[loadObj.fileIdx[i]]);
			}
		} else {
			assert(loadObj.nDims == 2);
			filenames = new Array(loadObj.yBins);
			for ( var i = 0; i < loadObj.yBins; i++) {
				filenames[i] = new Array(loadObj.xBins);
				for ( var j = 0; j < loadObj.xBins; j++) {
					if (loadObj.fileIdx[i][j] != undefined)
						filenames[i][j] = URL.createObjectURL(loadObj.files[loadObj.fileIdx[i][j]]);
				}
			}
		}
	}
	
	return filenames;
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
function loadImage(loadObj, filenames, idx) {
	// idx is an element of an array of 2 elements, all elements start at 1

	// start from
	// http://stackoverflow.com/qfuestions/5678899/change-image-source-if-file-exists
	
	var pictureBox = {};
	pictureBox.img = new Image();
	pictureBox.loaded = false;
	pictureBox.error = false;

	if (idx.length == 1) {
		pictureBox.fileName = filenames[idx[0]]; //sprintf(loadObj.fileName, idx[0]);
		pictureBox.loadBoxName = sprintf('#load_%d', idx[0]);
		pictureBox.previewBoxName = sprintf('#preview_%d', idx[0]);

	} else {
		pictureBox.fileName = filenames[idx[0]][idx[1]]; //sprintf(loadObj.fileName, idx[0], idx[1]);
		pictureBox.loadBoxName = sprintf('#load_%d_%d', idx[0], idx[1]);
		pictureBox.previewBoxName = sprintf('#preview_%d_%d', idx[0], idx[1]);
	}
	
	// set css and write loading time for this image 	
	pictureBox.img.onload = function() {
		imgBoxSet(pictureBox.loadBoxName, "#99db99", loadObj.xBins);
		//imgBoxSet(pictureBox.previewBoxName, pictureBox.fileName, loadObj.xBins);
		pictureBox.loaded = true;
		checkLoaded(loadObj);
		writeLoadingTime();
	};

	// set css and write loading time for this image
	pictureBox.img.onerror = function() {
		imgBoxSet(pictureBox.loadBoxName, "#db9999", loadObj.xBins);
		imgBoxSet(pictureBox.previewBoxName, "#db9999", loadObj.xBins);
		pictureBox.error = true;
		checkLoaded(loadObj);
		writeLoadingTime();
	};

	// fires off loading of image
	pictureBox.img.src = pictureBox.fileName;//pictureBox.fileName;

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
	assert(loadObj.nDims == 1 || loadObj.nDims == 2, 'nDims is not 1 or 2');

	// some setup
	document.getElementById('loadTime').innerHTML = "Loading...";
	buildMatrix(loadObj, 'load');
	buildMatrix(loadObj, 'preview');
	document.getElementById('previewMatrixLink').style.display = 'inherit';
	writeLoadingPerc(0); // clean loading percentage
	
	filenames = prepareFilenames(loadObj);
	
	// record starting time
	startTime = new Date().getTime();
	writeLoadingTime(startTime); // clean loading times

	// should be xBins if nDims == 1, yBins otherwise
	mainBins = (loadObj.nDims == 1 ? loadObj.xBins : loadObj.yBins);

	// go through the sources
	var pictureBoxes = new Array(mainBins);
	for ( var i = 0; i < mainBins; i++) {

		// add pictureBox objects
		if (loadObj.nDims == 1) {
			pictureBoxes[i] = loadImage(loadObj, filenames, [i]);

		} else {
			pictureBoxes[i] = new Array(loadObj.xBins);
			for (j = 0; j < loadObj.xBins; j++) {
				pictureBoxes[i][j] = loadImage(loadObj, filenames, [i, j]);
			}
		} // nDims if
	} // for loop
	
	// clean current picture box
	curPictureBox = null;
	
	// return pictureBoxes
	return pictureBoxes;
}


function loadPreviewMatrix(loadObj) {
	
	if (loadObj.xBins == undefined) {
		alert('Please first load a dataset!');
		return;
	}
	
	if (loadObj.xBins > 36) {
		alert('Dataset too large for preview!');
		return;
	}	
	
	var ans = confirm("Warning: Preview can be *very* memory intensive! Continue?");
	if (!ans) return;
	
	if (loadObj.nDims == 1) {
		for (var j = 0; j < loadObj.xBins; j++) {
			if (pictureBoxes[j].loaded){
				imgBoxSet(pictureBoxes[j].previewBoxName, pictureBoxes[j].fileName, loadObj.xBins);
			}
		}
		
	} else {	
		for ( var i = 0; i < loadObj.yBins; i++) {
			for (var j = 0; j < loadObj.xBins; j++) {
				if (pictureBoxes[i][j].loaded){
					imgBoxSet(pictureBoxes[i][j].previewBoxName, pictureBoxes[i][j].fileName, loadObj.xBins);
				}
			}
		}
	}
}

function clearPreviewMatrix(loadObj) {
	
	if (loadObj.xBins == undefined) {
		alert('Please first load a dataset!');
		return;
	} 
	
	buildMatrix(loadObj, 'preview');
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
	assert((pos - 5) < canvasLen, 'Mouse position much bigger than canvas end ');
	assert(pos > - 5, 'Mouse position much smaller than canvas begin');
	pos = Math.max(pos, 0);
	pos = Math.min(pos, canvasLen);
	
	// normalize the position to be between (1/canvasLen)/2 and 1
	normPos = Math.max(pos / canvasLen, (1 / canvasLen) / 2);
	debugMsg = sprintf('%d, %2.2f, %2.2f, %d.', 
			Math.ceil(normPos * nDiscretes) - 1, normPos * nDiscretes, pos, nDiscretes);
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
function drawImageAtPosition(pos) {
	if (playState) return;
	
	nDims = loadObj.nDims;
	
	// TODO: add lockx, locky information on screen
	if (lockx) {
		pos.x = previouspos.x
	}
	if (locky) {
		pos.y = previouspos.y
	}
	previouspos = pos;

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

		msg = "" + discretePos;
		pictureBox = pictureBoxes[discretePos];

	} else {

		discreteX = getDiscretePosition(pos.x, canvas.width,
				pictureBoxes[1].length);
		discreteY = getDiscretePosition(pos.y, canvas.height,
				pictureBoxes.length);

		global_x = discreteX;

		if (currentX != discreteX) {
			redraw = true;
			currentX = discreteX;
		}
		if (currentY != discreteY) {
			redraw = true;
			currentY = discreteY;
		}

		msg = "(" + discreteX + ',' + discreteY + ")";
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
//			document.getElementById('imgnr').innerHTML = msg;
			document.getElementById('mouse-position').innerHTML = msg;
			drawImage(pictureBox.img, canvas);
		}
		
		// color the load box 
		curColor = (pictureBox.loaded) ? "#00FF00" : "#FF0000";
		imgBoxSet(pictureBox.loadBoxName, curColor, loadObj.xBins);
	}
	curPictureBox = pictureBox;
}



function drawImage(img, canvas) {
	picWidth = img.width;
	picHeight = img.height;
	// TODO - should have asserted ONLOAD that picWidth and picHeight are within canvas size. 
	canWidth = canvas.width;
	canHeight = canvas.height;
	
	// reshape canvas to fit aspect ratio, and fit image in aspect ratio!
	newFixedAspectRatio = picHeight / picWidth;
	if (fixedAspectRatio != newFixedAspectRatio) {
		fixedAspectRatio = newFixedAspectRatio;
		reshapeCanvas();
	}
	
	
	//startX = Math.ceil((canWidth - picWidth)/2);
	//startY = Math.ceil((canHeight - picHeight)/2);
	//context.drawImage(img, startX, startY);
	
	// draw image
	var context = canvas.getContext('2d');
	context.drawImage(img, 0, 0, canvas.width, canvas.height);
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
		throw "stop execution";
	}
}

/** 
 * Writes loading time to the loadTime span.
 * TODO: eliminate need for startTime being global 
 * @requires global variable startTime
 */
function writeLoadingTime(endTime) {
	// write the time difference from global var startTime.
	if (endTime == undefined) {
		var endTime = new Date().getTime();
	}
	var time = endTime - startTime;
	var timeMsg = '' + time + ' ms';
	document.getElementById('loadTime').innerHTML = timeMsg;
}

/** 
 * Writes loading percentage to the loadPerc span.
 * TODO: eliminate need for startTime being global 
 * @requires global variable startTime
 */
function writeLoadingPerc(perc) {

	var percMsg = sprintf('%3d%%', perc);
	document.getElementById('loadPerc').innerHTML = percMsg;
}

/** Set the image box (div) with the given color and size
 * TODO: should set size and float at initiation!. 
 * 
 * @param loadBoxName
 * @param bgStr
 * @param xBins
 */
function imgBoxSet(loadBoxName, bgStr, xBins) {
	var width = document.getElementById('loadMatrix').offsetWidth;
	var binWidth = Math.floor(width / xBins);
	
	
	if (bgStr[0] == '#') { // if it's a color
		document.getElementById(loadBoxName).style.backgroundColor = bgStr;
	} else {
		document.getElementById(loadBoxName).style.backgroundColor = "transparent";
		document.getElementById(loadBoxName).style.backgroundImage = sprintf("url('%s')", bgStr);
		document.getElementById(loadBoxName).style.backgroundSize = sprintf("%dpx 10px", binWidth);
	}
	
	document.getElementById(loadBoxName).style.width = "" + binWidth + "px";
	document.getElementById(loadBoxName).style.cssFloat = "left";
	
	// TODO - add processing for xBIns' pixel --- http://www.w3schools.com/tags/canvas_imagedata_data.asp
}


function drawLogo() {
	canvas = document.getElementById(DRAW_CANVAS_NAME);
	drawImage(logoImage, canvas);
}

function checkLoaded(loadObj) {
	assert(loadObj.nDims == 1 || loadObj.nDims == 2);
	
	if (loadObj.nDims == 1) {
		var nLoaded = 0;
		for (var i = 0; i < loadObj.xBins; i++) {
			if (pictureBoxes[i].loaded || pictureBoxes[i].error) {
				nLoaded++;
			}
		}
		var perc = nLoaded/loadObj.xBins * 100;
		
	} else {
		assert(loadObj.nDims == 2);
		
		var nLoaded = 0;
		for (var i = 0; i < loadObj.yBins; i++) {
			for (var j = 0; j < loadObj.xBins; j++) {
				if (pictureBoxes[i][j].loaded || pictureBoxes[i][j].error) {
					nLoaded++;
				}
			}
		}
		var perc = nLoaded/(loadObj.xBins * loadObj.yBins) * 100;
	}

	writeLoadingPerc(perc);	
}



function prepareLoadingCanvas(loadObj) {
	// TODO: create image as big as needed, and just when showing/putting it into canvas to re-size! Just make sure resize is proportional. Maybe do the latter... when you initiate page loadObj.
	if (loadObj.yBins == undefined)
		loadObj.yBins = 1;
	
	var ctx = document.getElementById("loadingCanvas").getContext("2d");
	var imgData = ctx.createImageData(loadObj.xBins, loadObj.yBins);
	
}






function handleFileSelectDrop(evt) {
	evt.stopPropagation();
    evt.preventDefault();
	handleFileSelect(evt);
	
}
 

function handleDragOver(evt) {

	//TODO why is this not working? :(
	document.getElementById('drop_zone').backgroundColor = '#CCC';
	evt.stopPropagation();
	evt.preventDefault();
	evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
}


function handleFileSelect(evt) {
	
	haveFileAPI = (window.File && window.FileReader && window.FileList && window.Blob);
	assert(haveFileAPI, 'The File APIs are not fully supported in this browser.');
	launchDisplay('userSetLocal', evt);
	
		
	/* files is a FileList of File objects. List some properties.
	var output = [];
	for (var i = 0, f; f = files[i]; i++) {
	  output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
				  f.size, ' bytes, last modified: ',
				  f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a',
				  '</li>');
	}
	document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';
	/// */
}


function loadUserSetLocal(evt) {
	
	var files = evt.target.files; // FileList object
	if (!files)
		files = evt.dataTransfer.files; // FileList object.
	loadObj.files = files;	
		
	// detect which type of images there are - 1D or 2D
	var f = files[0];
	var name = f.name; escape(f.name)
	var innr = false;
	var chrIndex = 0;
	var template = '';
	var dims = 0;
	for (var j = 0; j < name.length; j++) {
		var isdigit = !isNaN(name[j]) && name[j] != ' ';
		if (isdigit && !innr) {
			innr = true;
			template = template + '%d';
			dims++;
		}
		
		if (!isdigit) {
			innr = false;
			template = template + name[j];
		}
	}
	
	// warn if don't find 1 or 2 directions
	msg = 'did not find 1 or 2 direction naming';
	assert(dims == 1 || dims == 2, msg);
	loadObj.nDims = dims;
	
	
	
	
	
	
	
	// get the min and max numbers, and populate loadObj.files
	if (loadObj.nDims == 1) {
		
		// get min and max nrs
		minx = Infinity;
		maxx = 0;
		for (var i = 0, f; f = files[i]; i++) {
			x = sscanf(f.name, template);
			
			minx = Math.min(minx, x);
			maxx = Math.max(maxx, x);
		}
		
		msg = 'Found files ranging from %d to %d';
		writeDebug(sprintf(msg, minx, maxx));
		
		// populate new files array in the right order.
		loadObj.fileIdx = new Array(maxx-minx+1);
		for (var i = 0, f; f = files[i]; i++) {
			x = sscanf(f.name, template);
			loadObj.fileIdx[x - minx] = i;
		}
		
	} else {
		
		// get min and max nrs
		var minx = Infinity;	
		var miny = Infinity;	
		var maxx = 0;	
		var maxy = 0;	
		for (var i = 0, f; f = files[i]; i++) {
			xy = sscanf(f.name, template);
			y = xy[0];
			x = xy[1];
			
			minx = Math.min(minx, x);
			maxx = Math.max(maxx, x);
			miny = Math.min(miny, y);
			maxy = Math.max(maxy, y);
		}

		// dump some info
		msg = 'Found files ranging from [%d, %d] to [%d, %d]';
		writeDebug(sprintf(msg, miny, minx, maxy, maxx));

		// prepare structure
		loadObj.fileIdx = new Array(maxy-miny+1);
		for (var i = 0; i < (maxy-miny+1); i++) {
			loadObj.fileIdx[i] = new Array(maxy-miny+1);
		}
		
		// populate files structure
		for (var i = 0, f; f = files[i]; i++) {
			x = sscanf(f.name, template);
			loadObj.fileIdx[x[0] - miny][x[1] - minx] = i;
		}
	}
		
	
	if (loadObj.nDims == 1) {
		loadObj.xBins = maxx-minx+1;
	} else {
		loadObj.yBins = maxy-miny+1;
		loadObj.xBins = maxx-minx+1;
	}
		
	loadObj.type = "local";
	return loadObj;
}

function reshapeCanvas() {

	var windowHeight = $(window).height();
	var windowWidth = $(window).width();	
	
	if (curPictureBox) {
		var maxHeight = MAX_CANVAS_HEIGHT;
		var maxWidth = MAX_CANVAS_WIDTH;
	} else {
		var maxHeight = MAX_EMPTY_CANVAS_HEIGHT;
		var maxWidth = MAX_EMPTY_CANVAS_WIDTH;
	}
	

	
	canvasHeight = Math.min(maxHeight, windowHeight - 250);
	canvasHeight = Math.max(MIN_CANVAS_HEIGHT, canvasHeight);
	
	canvasWidth = Math.min(maxWidth, windowWidth - 250);
	canvasWidth = Math.max(MIN_CANVAS_WIDTH, canvasWidth);
	
	// if forced aspect ratio:
	if (fixedAspectRatio > 0) {
		if (canvasWidth * fixedAspectRatio > canvasHeight) 
			canvasWidth = canvasHeight / fixedAspectRatio;
		else
			canvasHeight = canvasWidth * fixedAspectRatio;
	}
	
	// initialize main-container to Max Size + 100 all around.
	canvas.width = canvasWidth;
	document.getElementById('mainDisplay').style.width = "" + canvasWidth + "px";
	document.getElementById('display-container').style.width = "" + canvasWidth + "px";
	document.getElementById('display-container').style.marginLeft = "-" + Math.round(canvasWidth/2) + "px";
	document.getElementById('main-container').style.width = "" + (canvasWidth + 100) + "px";
	document.getElementById('main-container').style.marginLeft = "-" + Math.round(canvasWidth/2+50) + "px";
	
	canvas.height = canvasHeight;
	document.getElementById('mainDisplay').style.height = "" + canvasHeight + "px";
	document.getElementById('display-container').style.height = "" + canvasHeight + "px";
	document.getElementById('display-container').style.marginTop = "-" + Math.round(canvasHeight/2) + "px";
	document.getElementById('main-container').style.height = "" + (canvasHeight + 100) + "px";
	document.getElementById('main-container').style.marginTop = "-" + Math.round(canvasHeight/2+50) + "px";
	
	
	// draw image. Warning: calling drawImage() would give a potentially infinite recursion.
	// warning: this checks if there is a reasonable curPictureBox variable, 
	// 		but that variable might have an unloaded image, which this does nto check for. 
	//		In that case, the currently drawn image will dissapear
	if (curPictureBox) {
		var context = canvas.getContext('2d');
		context.drawImage(curPictureBox.img, 0, 0, canvasWidth, canvasHeight);
	}
}




// http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values
function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
	return results == null ? "" : results[1].replace(/\+/g, " ");
//    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));

}




// TODO - make sure this works reasonably....
function changePlayState() {
	assert(loadObj.nDims == 1, 'dataset should be 1D for playing');
	
	playState = ~playState;	
	
	// TODO - check if js has ifelse ?:
	if (playState) {
		document.getElementById('play').value = "stop";
		document.getElementById('iframe-info').innerHTML = "video";
	} else {
		document.getElementById('play').value = "play";
		document.getElementById('iframe-info').innerHTML = "interactive (press x to lock frame)";			
	}
}

function continuousPlay(i) {
	var canvas = document.getElementById(DRAW_CANVAS_NAME);

	if (playState) {

		var pictureBox = pictureBoxes[i];
		var nexti = (i + 1) % loadObj.xBins;
	
		setTimeout(function() {
			drawImage(pictureBox.img, canvas);
			continuousPlay(nexti)
			}, PLAY_MS_WAIT);
	}
}




function getDataURL() {
	var url = 'http://www.mit.edu/~adalca/tipiX/'
	
	if (loadObj.type != 'web') {// TODO: check in a better way if dataset is loaded or exists?
		return url;
	}
	
	url = url + '?';
	
	url = url + 'path=' + loadObj.fileName;
	url = url + '&xBins=' + loadObj.xBins;
	
	if (loadObj.nDims == 2) {
		url = url + '&nDims=' + loadObj.nDims;
		url = url + '&yBins=' + loadObj.yBins;
	}
	
	return url;
	
	
	
}

function openDataURL(target) {
	window.open(getDataURL(), target);
}
