/** tipiX - TIme PIcture eXplorer
 * 
 * Copyright (c) 2013 TIPIX <adalca@mit.edu>
 *
 * tipiX is licensed under the MIT License:
 * http://www.opensource.org/licenses/mit-license.php
 *
 * See LICENSE file for more information
 *
 * Author: Adrian V. Dalca, http://www.mit.edu/~adalca/
 */


/** Launch display of a set given a set choice
 * 
 * @param choice - String - a set choice (see cases for options).
 * @returns {Array} - 1d or 2d pictureBox objects 
 */ 
function launchDisplay(choice, evt) {
	switch (choice) {
		case "boston4day":
			loadObj = loadBoston4Day();
			break;
		case "lupus":
			loadObj = lupus();
			break;
		case "emerald":
			loadObj = loadEmerald();
			break;
		case "userSetWeb":
			loadObj = loadUserSetWeb();
			break;
		case "userSetLocal":
			loadObj = loadUserSetLocal(evt);
			break;
		case "userSetAddressBar":
			loadObj = loadUserSetAddressBar();
			currentTabState = true;
			break;
		default:
			alert('Not a valid case'); 
			break;
	}
	
	// get the images according to the sources.
	pictureBoxes = loadImages(loadObj);
	
	// canvas should be turned on
	canvasOn = true;

	var canvas = document.getElementById(DRAW_CANVAS_NAME); // main canvas
	canvas.getContext('2d').clearRect(0,0,canvas.width,canvas.height);
	drawLogo();
	
	// close nav
	nav(currentTab);
	
	// TODO: initiate loading canvas
	/*xSize = document.getElementById("loadingCanvas").width;
	binsPerPixel = loadObj.xBins / xSize;
	
	if (loadObj.yBins == undefined)
		yBins = 1;
	else
		yBins = loadObj.yBins;

	ySize = Math.ceil(yBins / binsPerPixel);
	ySize = Math.max(ySize, 10);
	ySize = Math.min(ySize, 300); //TODO hardcoded?
	document.getElementById("loadingCanvas").height = ySize;
	document.getElementById("loadMatrix").height = ySize;*/
	//TODO get also the loading parent to be that big!
	
	// force a reshape of window on first picture draw.
	fixedAspectRatio = 0;
	
	// return the images
	return pictureBoxes;
}

function loadBoston4Day() {
	loadObj.type = "web";
	loadObj.nDims = 2;
	loadObj.xBins = 5;
	loadObj.yBins = 24;
	loadObj.fileName = CORE_SET_PATH + '/imageSets/boston4day/average_img_%d_%d.jpg'; 
	return loadObj;
}

function lupus() {
	loadObj.type = "web";
	loadObj.nDims = 2;
	loadObj.xBins = 5;
	loadObj.yBins = 56;
	loadObj.fileName = CORE_SET_PATH + '/imageSets/lupus/lupus_%d_%d.jpg'; 
	return loadObj;
}

function loadEmerald() {
	loadObj.type = "web";
	loadObj.nDims = 1;
	loadObj.xBins = 337;
	loadObj.fileName = CORE_SET_PATH + '/imageSets/emerald/img (%d).jpg';
	return loadObj;
}

function loadUserSetAddressBar() {
	loadObj.type = "web";
	var dims = getParameterByName('nDims');
	if (dims == '' || parseInt(dims) == 1) {
		loadObj.nDims = 1;
	} else {
		assert(parseInt(dims) == 2, 'need dims to be 1 or 2');
		loadObj.nDims = 2;
	}
	
	var xBins = getParameterByName('xBins');
	loadObj.xBins = xBins;
	assert(!isNaN(parseInt(xBins)), 'need xBins to be integer');
	
	if (loadObj.nDims == 2) {
		var yBins = getParameterByName('yBins');
		assert(!isNaN(parseInt(yBins)), 'need yBins to be integer');
		loadObj.yBins = yBins;
	}
	
	var path = getParameterByName('path');
	assert(path != '', 'Need a full path');
	loadObj.fileName = path;
	
	console.log(loadObj)
	
	return loadObj;
	
}

function loadUserSetWeb() {
	var oForm = document.getElementById('userSet');
	
	var radios = document.getElementsByName('nDims');
	for (var i = 0, length = radios.length; i < length; i++) {
		if (radios[i].checked) {
			loadObj.nDims = radios[i].value;
		}
	}
	
	loadObj.xBins = parseInt(oForm.elements['xBins'].value);
	if (loadObj.nDims == 2) {
		loadObj.yBins = parseInt(oForm.elements['yBins'].value);	
	}
	loadObj.fileName = oForm.elements['filename'].value;
	loadObj.type = "web";
	return loadObj;
}



/******************************************************************************
 * Execution
 *****************************************************************************/

// original settings and global variables
var DRAW_CANVAS_NAME = 'mainDisplay';
var MAX_CANVAS_WIDTH = 1200;
var MAX_CANVAS_HEIGHT = 900;
var MAX_EMPTY_CANVAS_WIDTH = 600;
var MAX_EMPTY_CANVAS_HEIGHT = 450;
var MIN_CANVAS_WIDTH = 400;
var MIN_CANVAS_HEIGHT = 300;
var canvasOn = false; 
var currentX = 0;
var currentY = 0;
var pictureBoxes = [];
var startTime = 0;
var loadObj = new Object();
var curPictureBox = null;
var currentTab = 'about';
var currentLoadTab = 'local';
var currentTabState = false;
var CORE_SET_PATH = 'http://www.mit.edu/~adalca/tipiX';
var logoImage;
var lockx = false;
var locky = false;
var global_x = -1;
var fixedAspectRatio = 0;
var playState = false;

// key presses
$(document).keyup(function(e) {
  if (e.keyCode == 88) { 
  	lockx = !lockx; 
	document.getElementById('lockx').innerHTML = lockx;
	}   // x
  if (e.keyCode == 89) { 
  	locky = !locky; 
	document.getElementById('locky').innerHTML = locky;
	}   // x
  if (e.keyCode == 27) { 
  	lockx = false; 
  	locky = false; 
	document.getElementById('lockx').innerHTML = lockx;
	document.getElementById('locky').innerHTML = locky;
	}   // esc
	if (e.keyCode == 67) { //c
		nav('about');
	}
	if (e.keyCode == 73) { //i
		onOff('info-clip');
		updownContainer('info-container');
	}
});



// files listener. TODO: why is this like this, can't it be a click event?
document.getElementById('files').addEventListener('change', handleFileSelect, false);

// Setup the dnd listeners.
var dropZone = document.getElementById('drop_zone');
dropZone.addEventListener('dragover', handleDragOver, false);
dropZone.addEventListener('drop', handleFileSelectDrop, false);

var dropZoneMain = document.getElementById('drop_zone_main');
dropZoneMain.addEventListener('dragover', handleDragOver, false);
dropZoneMain.addEventListener('drop', handleFileSelectDrop, false);


// canvas and listener
var canvas = document.getElementById(DRAW_CANVAS_NAME); // main canvas



canvas.onclick = function () { console.log((global_x+1).toString()); };
canvas.addEventListener('mousemove', function(evt) {
	if (canvasOn) {
		var mousePos = getMousePos(canvas, evt);
		drawImageAtPosition(mousePos);
	}
}, false);
