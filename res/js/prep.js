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

  // fill in logo.
  logoImage = new Image();
  logoImage.onload = function () { drawLogo(); };
  logoImage.src = CORE_SET_PATH_LOGO;

  if (location.search.indexOf('?') >= 0) {

    // check for iframe mode
    var iframeRes = getParameterByName('iframe');
    // TODO - force a minimum iframe size!
    // TODO - error checking.....
    if (iframeRes != '') {
      iFrameMode = true;
      var xLoc = iframeRes.indexOf('x');
      MIN_CANVAS_WIDTH = iframeRes.substring(0, xLoc);
      MAX_CANVAS_WIDTH = MIN_CANVAS_WIDTH;
      MAX_EMPTY_CANVAS_WIDTH = MIN_CANVAS_WIDTH;
      MIN_CANVAS_HEIGHT = iframeRes.substring(xLoc + 1);
      MAX_CANVAS_HEIGHT = MIN_CANVAS_HEIGHT;
      MAX_EMPTY_CANVAS_HEIGHT = MIN_CANVAS_HEIGHT;
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
        PLAY_MS_WAIT = parseInt(playRes);
        assert(!isNaN(PLAY_MS_WAIT));
      }
      changePlayState();
      continuousPlay(0);
    }

    // iframe controls (quiet mode)
    var quiet = getParameterByName('quiet');
    if (quiet != '') {
      document.getElementById('iFrameLogoText').src = CORE_SET_PATH_IFRAME_LOGO;
      document.getElementById('iframe-controls-container').style.height = "10px";
      document.getElementById('info-clip').style.visibility = "hidden";
      document.getElementById('info-container').style.visibility = "hidden";
    }
  }
});
