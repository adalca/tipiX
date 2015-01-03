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

/** tools.js - general tools (not necessarily only applicable to tipiX) */

/** randString generates a random string
 *  @return a random string
 */
function randString() {
    return Math.random().toString(36).slice(2);
}

/** Standard assert function
 *  source: http://cse.csusb.edu/turner/wiki/Javascript_Assert_Function
 *  @param expression - the expression to assert
 *  @param msg [optional] - the message if assertion fails
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

/** Obtain mouse position inside canvas
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

/** Transform an integer array to a img object.
 *
 *  Note: This function uses TMP_DISPLAY to write and read the image, so be aware
 *  of race conditions
 *  Example: TMP_DISPLAY is 'mainDisplayTest' in tipiX site
 *
 *  @param array the integer array to transform into an image object
 *  @param width the width of the image object
 *  @param height the height of the image object. width * height should be the
 *     size of the given array
 *  @param colorMode 1 if 3 entire channel arrays one after another, 2 if imgData ordering (rgba,rgba,rgba...)
 *  @param TMP_DISPLAY a temporary canvas
 *
 *  @TODO make height and TMP_DISPLAY optional. if TMP_DISPLAY not provided,
 *       make a random string and create a canvas with that name.
 */
function array2img(array, width, height, colorMode, TMP_DISPLAY) {

    // first, get image data
    var imgData = array2imgData(array, width, height, colorMode, TMP_DISPLAY);
    return arrayData2img(imgData, width, height, TMP_DISPLAY);
}

/** Transform an imgData array to a img object.
 *
 *  Note: This function uses TMP_DISPLAY to write and read the image, so be aware
 *  of race conditions
 *  Example: TMP_DISPLAY is 'mainDisplayTest' in tipiX site
 *
 *  @param imgData the imgData array to transform into an image object
 *  @param width the width of the image object
 *  @param height the height of the image object. width * height should be the
 *     size of the given array
 *  @param TMP_DISPLAY a temporary canvas
 *
 *  @TODO make height and TMP_DISPLAY optional. if TMP_DISPLAY not provided,
 *       make a random string and create a canvas with that name.
 */
function arrayData2img(imgData, width, height, TMP_DISPLAY){

    var canvas = document.getElementById(TMP_DISPLAY);
    var ctx = canvas.getContext('2d');

    // put the imgData in the canvas
    // NOTSURE: need to set canvas width and height for when you do toDataURL?
    canvas.width = width;
    canvas.height = height;
    ctx.putImageData(imgData, 0, 0);

    // get the image from the hidden canvas
    var img = document.createElement("img");
    img.src = canvas.toDataURL("image/png");

    // return
    return img;
}

/** Transform an integer array to a imgData object.
 *
 * Note: This function uses TMP_DISPLAY to write and read the image, so be aware of race conditions
 * Example: TMP_DISPLAY is 'mainDisplayTest' in tipiX site
 *
 * @param array the integer array to transform into an image object
 * @param width the width of the image object
 * @param height the height of the image object. width * height should be the size of the given array
 * @param colorMode 1 if 3 entire channel arrays one after another, 2 if imgData ordering (rgba,rgba,rgba...)
 * @param TMP_DISPLAY a temporary canvas
 *
 * @TODO make height and TMP_DISPLAY optional. if TMP_DISPLAY not provided,
 *     make a random string and create a canvas with that name.
 */
function array2imgData(array, width, height, colorMode, TMP_DISPLAY) {

    // first, get image data
    var canvas = document.getElementById(TMP_DISPLAY);
    var ctx = canvas.getContext('2d');
    var imgData = ctx.createImageData(width, height);
    var data = imgData.data;

    // copy img byte-per-byte into our ImageData
    for (var i = 0, len = width * height * 4; i < len; i += 4) {
        var j = i/4

        // assuming 3 channels one after another.
        if (colorMode == 1) {
            k = j + width*height;
            l = k + width*height;

        // assuming imgData ordering
        } else if (colorMode == 2) {
            j = i;
            k = j + 1;
            l = k + 1;

        } else {
            k = j; l = j;
        }

        data[i] = array[j];
        data[i+1] = array[k];
        data[i+2] = array[l];
        data[i+3] = 255;
    }

    // return the image data
    return imgData

}

/** Transform a imgData array to a 2d matrix
*/
function imgData2Matrix(data, width, height) {
    var data2d = new Array(height);
    for (var i = 0; i < height; i++) {
        data2d[i] = new Array(width);

        for (var j = 0; j < width; j++) {
            data2d[i][j] = new Array(4);

            for (var c = 0; c < 4; c++) {
                data2d[i][j][c] = data[width*4*i+j*4+c];
            }
        }
    }

    return data2d;
}

/** Transform a 2d matrix to an array
*/
function matrix2dcol2array(data2d) {
    var width = data2d[0].length;
    var height = data2d.length;

    var data = new Array(height * width * 4);
    for (var i = 0; i < height; i++) {
        for (var j = 0; j < width; j++) {
            for (var c = 0; c < 4; c++) {
                data[width*4*i+j*4+c] = data2d[i][j][c];
            }
        }
    }
    return data;
}
