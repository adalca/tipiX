/** Data viewer code. 
 * Warning: this is very rough code still.
 * 
 * see intDisplayFcns.js for main working functions. 
 * 
 * Author: Adrian V. Dalca, http://www.mit.edu/~adalca/
 */


/** Launch display of a set given a set choice
 * 
 * @param choice - String - a set choice (see cases for options).
 * @returns {Array} - 1d or 2d pictureBox objects 
 */ 
function launchDisplay(choice) {
	switch (choice) {
		case "boston4day":
			loadObj = loadBoston4Day();
			break;
		case "boston5day":
			loadObj = loadBoston5Day();
			break;
		case "bostonStorm":
			loadObj = loadBostonStorm();
			break;
		case "vermontDrive":
			loadObj = loadVermontDrive();
			break;
		case "lakePlacidDrive":
			loadObj = loadLakePlacidDrive();
			break;
		case "emerald":
			loadObj = loadEmerald();
			break;
		case "userSet":
			loadObj = loadUserSet();
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
	
	// close nav
	nav(currentTab);
	
	// return the images
	return pictureBoxes;
}

function loadBoston4Day() {
	loadObj.nDims = 2;
	loadObj.xBins = 5;
	loadObj.yBins = 24;
	loadObj.fileName = CORE_SET_PATH + '/imageSets/boston4day/average_img_%d_%d.jpg'; 
	return loadObj;
}

function loadBoston5Day() {
	loadObj.nDims = 2;
	loadObj.xBins = 5;
	loadObj.yBins = 24;
	loadObj.fileName = CORE_SET_PATH + '/imageSets/boston5day/l_average_img_%d_%d.jpg'; 
	return loadObj;
}

function loadBostonStorm() {
	loadObj.nDims = 1;
	loadObj.xBins = 30;
	loadObj.fileName = CORE_SET_PATH + '/imageSets/bostonStorm/l_average_img_%d.jpg'; 
	return loadObj;
}

function loadVermontDrive() {
	loadObj.nDims = 1;
	loadObj.xBins = 60;
	loadObj.fileName = CORE_SET_PATH + '/imageSets/vermontDrive/l_average_img_%d.jpg';
	return loadObj;
}

function loadLakePlacidDrive() {
	loadObj.nDims = 1;
	loadObj.xBins = 26;
	loadObj.fileName = CORE_SET_PATH + '/imageSets/lakePlacidDrive/l_average_img_%d.jpg';
	return loadObj;
}

function loadEmerald() {
	loadObj.nDims = 1;
	loadObj.xBins = 337;
	loadObj.fileName = CORE_SET_PATH + '/imageSets/emerald/img (%d).jpg';
	return loadObj;
}

function loadUserSet() {
	var oForm = document.getElementById('userSet');
	loadObj.nDims = parseInt(oForm.elements['nDims'].value);
	loadObj.xBins = parseInt(oForm.elements['xBins'].value);
	if (loadObj.nDims == 2) {
		loadObj.yBins = parseInt(oForm.elements['yBins'].value);	
	}
	loadObj.fileName = oForm.elements['filename'].value;
	return loadObj;
}


/******************************************************************************
 * Execution
 *****************************************************************************/

// original settings and global variables
var DRAW_CANVAS_NAME = 'mainDisplay';
var canvasOn = false; 
var currentX = 0;
var currentY = 0;
var pictureBoxes = [];
var startTime = 0;
var loadObj = new Object();
var curPictureBox = null;
var currentTab = 'about';
var currentTabState = true;
var CORE_SET_PATH = 'http://www.mit.edu/~adalca/tipiX';

// canvas and listener
var canvas = document.getElementById(DRAW_CANVAS_NAME); // main canvas
canvas.addEventListener('mousemove', function(evt) {
	if (canvasOn) {
		var mousePos = getMousePos(canvas, evt);
		drawImageAtPosition(mousePos);
	}
}, false);
