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

    txStartTime = new Date().getTime() / 1000;
    console.log('display launched');

    // get file type
    if (loadObj.fileName) {
        loadObj.inputType = inputType(loadObj.fileName);
    } else {
        loadObj.inputType = inputType(loadObj.files[0].name);
    }

    var delt = new Date().getTime() / 1000 - txStartTime;
    console.log('loading started @ ' + sprintf('%5.3f', delt) + ' seconds');

    // get the images according to the sources.
    if (loadObj.inputType.localeCompare('image') == 0) {
        loadImages(loadObj);
    } else {
        loadNiisWithPrep(loadObj);
    }



    // draw logo on main canvas
    var canvas = document.getElementById(DRAW_CANVAS_NAME); // main canvas
    canvas.getContext('2d').clearRect(0,0,canvas.width,canvas.height);
    drawLogo();

    // close nav
    nav(currentTab);

    // force a reshape of window on first picture draw.
    fixedAspectRatio = 0;
}



/******************************************************************************
 * Execution
 *****************************************************************************/

// original settings and global variables
var orig_4d = [];
var DRAW_CANVAS_NAME = 'mainDisplay';
var MAX_CANVAS_WIDTH = 1200;
var MAX_CANVAS_HEIGHT = 900;
var MAX_EMPTY_CANVAS_WIDTH = 600;
var MAX_EMPTY_CANVAS_HEIGHT = 450;
var MIN_CANVAS_WIDTH = 400;
var MIN_CANVAS_HEIGHT = 300;
var PLAY_MS_WAIT = 30;
var canvasOn = false;
var currentX = 0;
var currentY = 0;
var pictureBoxes = [];
var startTime = 0;
var loadObj = new Object();
var loadActiveData;
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
var iFrameMode = false;
var txStartTime = 0;
var txLoadCores = 3; // number of loading cores
console.log('working with ' + txLoadCores + ' cores');
var txLoaded = false;
var rotationAngle = 0;

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


canvas.addEventListener('click', function(evt) {

    if (iFrameMode && loadObj.nDims == 1) {
        changePlayState();
        continuousPlay(0);
    }
}, false);

