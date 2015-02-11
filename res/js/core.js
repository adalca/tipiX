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


// initialize.
tipix = tipixObj(false);












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
            state.gui.centerPanel.display = true;
            break;
        default:
            alert('Not a valid case');
            break;
    }


    // get file type
    var fileName = loadObj.getProperty('fileName');

    var files = loadObj.getProperty('files');
    if (fileName) {
        loadObj.setProperty("inputType", inputType(fileName));
    } else {
        loadObj.setProperty("inputType", inputType(files[0].name));
    }
    var iT = loadObj.getProperty("inputType");

    var delt = new Date().getTime() / 1000 - state.times.init;
    console.log('loading started @ ' + sprintf('%5.3f', delt) + ' seconds');

    // get the images according to the sources.
    if (iT.localeCompare('image') === 0) {
        loadImages(loadObj);
    } else {
        loadNiisWithPrep(loadObj);
    }

    // draw logo on main canvas
    var canvas = document.getElementById(consts.html.tipix.canvas); // main canvas
    canvas.getContext('2d').clearRect(0,0,canvas.width,canvas.height);
    drawLogo();

    // close nav
    nav(currentTab);
}



/******************************************************************************
 * ?
 *****************************************************************************/

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
var canvas = state.tipix.canvas.canvas



canvas.onclick = function () { console.log((global_x+1).toString()); };

canvas.addEventListener('mousemove', function(evt) {
    if (state.tipix.state) {
        var mousePos = getMousePos(canvas, evt);
        drawImageAtPosition(mousePos);
    }
}, false);


canvas.addEventListener('click', function(evt) {

    if (state.workspace.embedded  && loadObj.nDims == 1) {
        changePlayState();
        continuousPlay(0);
    }
}, false);
