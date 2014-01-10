/* tools.js */

/*
 *	inputType
 *	returns the type of file @fileName is, based on the extension
 *	options so far are 'nifti' and 'image'
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
		assert(inputType(file).localeCompare('nifti'));
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
 * 	create a canvas with that name.
 */
function array2img(array, width, height, TMP_DISPLAY) {

	// first, get image data
	var canvas = document.getElementById(TMP_DISPLAY);
	var ctx = canvas.getContext('2d');
	var imgData = array2imgData(array, width, height, TMP_DISPLAY);
	
	// put the imgData in the canvas
	// NOTSURE: need to set canvas width and height for when you do toDataURL?
	canvas.width = width;
	canvas.height = height;
	ctx.putImageData(imgData, 0, 0);
	
	// get the image from the hidden canvas? 
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
 * 	create a canvas with that name.
 */
function array2imgData(array, width, height, TMP_DISPLAY) {

	// first, get image data
	var canvas = document.getElementById(TMP_DISPLAY);
	var ctx = canvas.getContext('2d');
	var imgData = ctx.createImageData(width, height); 
	var data = imgData.data;

	// copy img byte-per-byte into our ImageData
	for (var i = 0, len = width * height * 4; i < len; i += 4) {
		var j = i/4
		data[i] = array[j];
		data[i+1] = array[j];
		data[i+2] = array[j];
		data[i+3] = 255;
	}
	
	// return the image data
	return imgData

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