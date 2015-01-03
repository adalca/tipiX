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
