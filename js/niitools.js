



function niiFile2pictureBoxs(loadObj, filenames, idx, TMP_DISPLAY) {

	
	
	for (var i = 0; i < loadObj.yBins; i++) {
		pictureBoxes[i][idx] = {}
		pictureBoxes[i][idx].loaded = false;
		pictureBoxes[i][idx].error = false;
		
		pictureBoxes[i][idx].fileName = filenames[idx]; 
		pictureBoxes[i][idx].loadBoxName = sprintf('#load_%d_%d', i, idx);
		pictureBoxes[i][idx].previewBoxName = sprintf('#preview_%d_%d', i, idx);
	}
	
	// callback, when everything was loaded
    X.io.onparse = function(file) {
		
		if (file) {
			var thisidx = niiFile2idx(filenames, file);
		
			// get the file, constructor, and useful dimensions
			input = X.io.get(file);
			slices = nii2sliceArray(input, TMP_DISPLAY);
			
			for (var i = 0; i < loadObj.yBins; i++) {
				imgBoxSet(pictureBoxes[i][thisidx].loadBoxName, "#99db99", loadObj.xBins);
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
		}
	}
	
	//
	X.io.load(filenames[idx], 'nii');
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
	
	// get the slices in the image form.
	var slices = new Array(nSlices)
	var slice = 0;
	
	for (var i = 0; i < nSlices; i++) {
		 slice = new classConstructor(input.data.image[i]); 
		 slices[i] = array2img(slice, width, height, TMP_DISPLAY);
	}
	
	return slices;
}


