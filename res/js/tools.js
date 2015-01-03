/* tools.js */

/*
 *    inputType
 *    returns the type of file @fileName is, based on the extension
 *    options so far are 'nifti' and 'image'
 *        
 *
 */
function inputType(fileName) {
    var idx = fileName.lastIndexOf('.');
    
    
    if (idx == 0) {
        return 0;
    }
    
    var ext = fileName.substr(idx + 1);
    var file = fileName.substr(0, idx); 
    
    // if it's .gz', recurse. This may fail for jpg.gz, etc...
    if (ext.localeCompare('gz') == 0) {
        assert(inputType(file).localeCompare('nifti') == 0, 'wrong inputType (' + inputType(file) + ')');
        return 'nifti';
    } else if (ext.localeCompare('jpg') == 0 || ext.localeCompare('png') == 0) {
        return 'image';
    } else if (ext.localeCompare('nii') == 0) {
        return 'nifti';
    } else {
        return undefined;
    }
}


function randString() {
    return Math.random().toString(36).slice(2);
}



function openDataURL(target) {
    window.open(getDataURL(), target);
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

/** Obtain mouse position inside canvas
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



/**
 * Transform an integer array to a img object.
 * 
 * Note: This function uses TMP_DISPLAY to write and read the image, so be aware of race conditions
 * Example: TMP_DISPLAY is 'mainDisplayTest' in tipiX site
 *
 * @param array the integer array to transform into an image object
 * @param width the width of the image object
 * @param height the height of the image object. width * height should be the size of the given array
 * @param TMP_DISPLAY a temporary canvas
 *
 * @TODO make height and TMP_DISPLAY optional. if TMP_DISPLAY not provided, make a random string and 
 *     create a canvas with that name.
 */
function array2img(array, width, height, isColor, TMP_DISPLAY) {

    // first, get image data

    var imgData = array2imgData(array, width, height, isColor, TMP_DISPLAY);
    return arrayData2img(imgData, width, height, TMP_DISPLAY);

}

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



/**
 * Transform an integer array to a imgData object.
 * 
 * Note: This function uses TMP_DISPLAY to write and read the image, so be aware of race conditions
 * Example: TMP_DISPLAY is 'mainDisplayTest' in tipiX site
 *
 * @param array the integer array to transform into an image object
 * @param width the width of the image object
 * @param height the height of the image object. width * height should be the size of the given array
 * @param TMP_DISPLAY a temporary canvas
 *
 * @TODO make height and TMP_DISPLAY optional. if TMP_DISPLAY not provided, make a random string and 
 *     create a canvas with that name.
 */
function array2imgData(array, width, height, colorMode, TMP_DISPLAY) {

    // first, get image data
    var canvas = document.getElementById(TMP_DISPLAY);
    var ctx = canvas.getContext('2d');
    var imgData = ctx.createImageData(width, height); 
    var data = imgData.data;
    
    //console.log(array.length);
    //console.log(width * height);
    
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

function onOff(containerName) {

    state = document.getElementById(containerName).className
    if (state == 'on')
        document.getElementById(containerName).className = 'off';
    else
        document.getElementById(containerName).className = 'on';
}


function updownContainer(containerName) {

    state = document.getElementById(containerName).className
    if (state == 'up')
        document.getElementById(containerName).className = 'down';
    else
        document.getElementById(containerName).className = 'up';
}
        
        
function inoutContainer(containerName) {

    state = document.getElementById(containerName).className
    if (state == 'in')
        document.getElementById(containerName).className = 'out';
    else
        document.getElementById(containerName).className = 'in';
}

function permuteData() {
    
    // put image on canvas
    
    // take images from canvas as 2-D array (not 1D!)
    
    // put all images in the last two  dimensions
    
    // get all dimension lengths.

    // go over 

}


function arrayFlipHorz(array, width, height) {
// does not preserve class

    newarr = new Array(array.length);
    for (var j = 0; j < height; j++) {
        for (var i = 0; i < width; i++) {
            newarr[j*width+i] = array[j*width + width - i - 1];
        }
    }
    
    return newarr;
}

function arrayFlipVert(array, width, height) {
// does not preserve class

    newarr = new Array(array.length);
    for (var j = 0; j < height; j++) {
        for (var i = 0; i < width; i++) {
            newarr[j*width+i] = array[(height - j - 1)*width + i];
        }
    }
    
    return newarr;
}






/** Swap axes of 4D arrays **/
function swap01(a) {
    t = [];
    for (var j=0; j < a[0].length; j++) {
        t[j] = [];
        for (var i=0; i< a.length; i++) {
            t[j][i] = [];
            for (var k=0; k < a[0][0].length; k++) {
                t[j][i][k] = [];
                for (var l=0; l < a[0][0][0].length; l++) {
                    t[j][i][k][l] = a[i][j][k][l];
                }
            }
        }
    }
    return t;
}
function swap02(a) {
    t = [];
    for (var k=0; k < a[0][0].length; k++) {
        t[k] = [];
        for (var j=0; j < a[0].length; j++) {
            t[k][j] = [];
            for (var i=0; i< a.length; i++) {
                t[k][j][i] = [];
                for (var l=0; l < a[0][0][0].length; l++) {
                    t[k][j][i][l] = a[i][j][k][l];
                }
            }
        }
    }
    return t;
}
function swap03(a) {
    t = [];
    for (var l=0; l < a[0][0][0].length; l++) {
        t[l] = [];
        for (var j=0; j < a[0].length; j++) {
            t[l][j] = [];
            for (var k=0; k < a[0][0].length; k++) {
                t[l][j][k] = [];
                for (var i=0; i< a.length; i++) {
                    t[l][j][k][i] = a[i][j][k][l];
                }
            }
        }
    }
    return t;
}
function swap12(a) {
    t = [];
    for (var i=0; i< a.length; i++) {
        t[i] = [];
        for (var k=0; k < a[0][0].length; k++) {
            t[i][k] = [];
            for (var j=0; j < a[0].length; j++) {
                t[i][k][j] = [];
                for (var l=0; l < a[0][0][0].length; l++) {
                    t[i][k][j][l] = a[i][j][k][l];
                }
            }
        }
    }
    return t;
}
function swap13(a) {
    t = [];
    for (var i=0; i< a.length; i++) {
        t[i] = [];
        for (var l=0; l < a[0][0][0].length; l++) {
            t[i][j] = [];
            for (var k=0; k < a[0][0].length; k++) {
                t[i][l][k] = [];
                for (var j=0; j < a[0].length; j++) {
                    t[i][l][k][j] = a[i][j][k][l];
                }
            }
        }
    }
    return t;
}
function swap23(a) {
    t = [];
    for (var i=0; i< a.length; i++) {
        t[i] = [];
        for (var j=0; j < a[0].length; j++) {
            t[i][j] = [];
            for (var l=0; l < a[0][0][0].length; l++) {
                t[i][j][l] = [];
                for (var k=0; k < a[0][0].length; k++) {
                    t[i][j][l][k] = a[i][j][k][l];
                }
            }
        }
    }
    return t;
}


function addRotateion(del) {
    rotationAngle=rotationAngle+del;
    drawImage(pictureBox.img, canvas, rotationAngle);
}

function swapClick(form) {
    a1 = parseInt(form.swap1.value, 10);
    a2 = parseInt(form.swap2.value, 10);
    swapAxes(a1, a2);
}

