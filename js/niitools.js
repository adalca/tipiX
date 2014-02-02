



function niiFile2pictureBoxs(loadObj, filenames, idx, TMP_DISPLAY) {

	var worker = new Worker('js/webworker.js');
	
	worker.onmessage = function(e) {
	
		input = e.data.input;
		thisidx = e.data.thisidx;
	
		slices = nii2sliceArray(input, TMP_DISPLAY);
	
		for (var i = 0; i < loadObj.yBins; i++) {
			//imgBoxSet(pictureBoxes[i][thisidx].loadBoxName, "#99db99", loadObj.xBins);
			pictureBoxes[i][thisidx].loaded = true;
			pictureBoxes[i][thisidx].img = slices[i];
		}
		
		checkLoaded(loadObj);
		writeLoadingTime();
		
		if (curPictureBox == null) { 
			var canvas = document.getElementById(DRAW_CANVAS_NAME); 
			drawImage(pictureBoxes[0][thisidx].img, canvas);
			curPictureBox = pictureBoxes;
		}
		
		// load the next nii on this core.
		var nextIdx = thisidx + txLoadCores;
		if (nextIdx < loadObj.xBins)  {
		
			worker.postMessage({
				'cmd':'load', 
				'filenames':filenames, 
				'loadObj':loadObj,
				'idx':new Number(nextIdx)
			});
		}
		
	}
	
	worker.postMessage({
		'cmd':'load', 
		'filenames':filenames, 
		'loadObj':loadObj,
		'idx':new Number(idx)
	});
	
}

function niiFile2idx(filenames, file) {
	
	var idx = undefined;
	for (var i = 0; i < filenames.length; i++) {
		if (file.localeCompare(filenames[i]) == 0) {
			idx = i;
			break;
		}
	}
	
	assert(typeof idx != 'undefined');
	return idx;

}

function nii2sliceArray(input, TMP_DISPLAY) {
	
	var classConstructor = input.header.data_type.constructor;
	var width = input.header.dim[1];
	var height = input.header.dim[2];
	var nSlices = input.header.dim[3];
	var isColor = input.header.dim[5] == 3;
	
	// get the slices in the image form.
	var slices = new Array(nSlices)
	var slice = 0;
	
	//console.log(input.data.image.length);
	//console.log(input);
	//console.log(nSlices);
	
	for (var i = 0; i < nSlices; i++) {
		 slice = new classConstructor(input.data.image[i]); 
		 //console.log(slice);
		 slices[i] = array2img(slice, width, height, isColor, TMP_DISPLAY);
	}
	
	return slices;
}


