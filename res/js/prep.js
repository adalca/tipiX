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

/* prepare tipiX on load */
$(window).load(function () {


  if (location.search.indexOf('?') >= 0) {

    // check for iframe mode
    var iframeRes = getParameterByName('iframe');
    // TODO - force a minimum iframe size!
    // TODO - error checking.....
    if (iframeRes != '') {
      state.workspace.embedded  = true;
      var xLoc = iframeRes.indexOf('x');
      state.tipix.canvas.minWidth = iframeRes.substring(0, xLoc);
      state.tipix.canvas.maxWidth = state.tipix.canvas.minWidth;
      MAX_EMPTY_CANVAS_WIDTH = state.tipix.canvas.minWidth;
      state.tipix.canvas.minHeight = iframeRes.substring(xLoc + 1);
      state.tipix.canvas.maxHeight = state.tipix.canvas.minHeight;
      MAX_EMPTY_CANVAS_HEIGHT = state.tipix.canvas.minHeight;
      document.getElementById('iframe-controls-container').style.visibility = 'visible';
      document.getElementById('nav-container').style.visibility = 'hidden';
    }

    var debug = getParameterByName('debug');
    if (debug != '') {
      onOff('info-clip');
      updownContainer('info-container');
    }

    var crossOrigin = getParameterByName('crossOrigin');

    // get any pre-load datasets:
    try {
      launchDisplay('userSetAddressBar');
    } catch (err) {
      console.log('No addressbar dataset loaded');
      console.log(err);
      console.log(loadObj);
    }

    var playRes = getParameterByName('play');
    if (playRes != '') {
      if (playRes != 'true') {
        state.video.fps = parseInt(playRes);
        assert(!isNaN(state.video.fps));
      }
      changePlayState();
      continuousPlay(0);
    }

    // iframe controls (quiet mode)
    var quiet = getParameterByName('quiet');
    if (quiet != '') {
      document.getElementById('iFrameLogoText').src = consts.path.logo10;
      document.getElementById('iframe-controls-container').style.height = "10px";
      document.getElementById('info-clip').style.visibility = "hidden";
      document.getElementById('info-container').style.visibility = "hidden";
    }
  }
});
