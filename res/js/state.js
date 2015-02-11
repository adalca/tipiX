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


var tipixObj = function(verbose) {
  this.consts = initConst();
  this.state = initState(this.consts, verbose);
  this.loadObj = new Object();
  this.pictureBoxes = [];
  this.loadActiveData;
}

function initState(consts, verbose) {

  var state = {};
  state.workspace = {}; // dark or light
  state.workspace.mood = "light";
  state.workspace.embedded = false;

  state.cores = {nLoadCores:3}; // number of loading cores
  state.video = {fps:30, play:false};

  // fill in logo
  state.tipixLogoImage = new Image();
  state.tipixLogoImage.onerror = function () {
    console.error("Could not load log image.");
  };
  state.tipixLogoImage.src = consts.path.logo;

  /***************************************
   * Times
   **************************************/
   state.times = {};
   state.times.init = new Date().getTime() / 1000;

  /***************************************
   * Current data display
   **************************************/
   state.tipix = {};
   state.tipix.datapos = []; // position in dataset
   state.tipix.canvaspos = []; // position on canvas, OLDWAS: currentY, currentX
   state.tipix.lockx = false;
   state.tipix.locky = false;
   state.tipix.rotationAngle = 0; // TODO: rotation for each dimension?

   state.tipix.canvas = {};
   state.tipix.canvas.canvas = document.getElementById(consts.html.tipixCanvas);
   state.tipix.canvas.maxWidth = 1200;
   state.tipix.canvas.maxHeight = 900;
   state.tipix.canvas.minWidth = 400;
   state.tipix.canvas.minHeight = 300;

   state.tipix.currentPictureBox = null;
   state.tipix.state = true;

  /***************************************
   * GUI states
   **************************************/

  // general GUI states
  state.gui = {};
  state.gui.allow = true;
  state.gui.info = false;

  // GUI status bar
  state.gui.status = {};

  // center panel
  state.gui.centerPanel = {display:false, current: undefined};

  if (verbose) {
    console.log('State initialized.');
    console.log('working with ' + state.cores.nLoadCores + ' cores');
  }

  return state;
}


function initConst() {
  var consts = {};

  /***********************************************************
   * Shortcuts
   **********************************************************/
  consts.shortcuts = {};
  consts.shortcuts.lockx = {key:"x", desc:"switch lock x"};
  consts.shortcuts.locky = {key:"y", desc:"switch lock y"};
  consts.shortcuts.locky = {key:"esc", desc:"unlock x&y"};
  consts.shortcuts.mood = {key:"m", desc:"switch mood"};
  consts.shortcuts.mood = {key:"i", desc:"info panel"};
  consts.shortcuts.labels = {key:"l", desc:"switch labels"};

  // setup keyup
  $(document).keyup(function(e) {
    var code = e.keyCode || e.which;

    if (code == 88) { // x
      tipix.state.tipix.lockx = !tipix.state.tipix.lockx;
      toggleVisibility('lockx-status-button');
    }

    if (code == 89) { // y
      tipix.state.tipix.locky = !tipix.state.tipix.locky;
      toggleVisibility('locky-status-button');
    }

    if (code == 27) { // esc
      tipix.state.tipix.lockx = false;
      tipix.state.tipix.locky = false;
      hide('lockx-status-button');
      hide('locky-status-button');
    }

    if (e.keyCode == 77) { // m
      alert("Mood change not yet implemented"); // TODO
    }

    if (e.keyCode == 73) { // i
      toggleVisibility("gui-right-container"); // TODO swipe left/right effect.
    }

    if (e.keyCode == 76) { // l
      toggleLabels();
    }
  });

  /***********************************************************
   * Path
   **********************************************************/
  consts.path = {};
  consts.path.core = "http://tipix.csail.mit.edu/tipix.html";
  consts.path.logo = "http://tipix.csail.mit.edu/images/logo.png";
  consts.path.logo10 = "http://tipix.csail.mit.edu/images/logoText_10.png";

  /***********************************************************
   * HTML
   **********************************************************/
  consts.html = {gui:{xlabel:{}, ylabel:{}}};
  consts.html.gui.xlabel.container = 'gui-xlabel-container';
  consts.html.gui.ylabel.container = 'gui-ylabel-container';
  consts.html.tipixCanvas = 'mainDisplay';

  return consts;
}
