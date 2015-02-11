//LoadObj represents an object of all the images that the user loads

/*
AGENDA
1. recoding
2. tipiX GUI
3. gridding an extra dimension
	cDragon (Microsoft) - onload/use image compression for the images we don't see/etc.
	img_1_5_7.png
4. interaction with slice:drop
5. interface with many tipiX for other projects (embedding)
*/

var LoadObj = function() {
	///////////////////////////////////////////////////////////////
	// Representation
	//
	this.imgFileNames; // typeof imgFileNames !== "undefined" ? imgFileNames : [];
	this.segFileNames;
	this.labels = [];
	this.inputType; // to be determined from images user loads
	this.nDims; // example: now: 2
	this.dimSizes; // Should be: [[0, 10], [101, 127]] indicating that x ranges from 0 to 10, etc
	this.loadType;
	this.fileType;
	this.globalSegFile;

	this.files; // FileList containing the image files
	this.fileOrder; // position of each image file within grid
	//this.xBins; should be deleted
	//this.yBins; should be deleted
	this.crossOrigin; // permissions
	this.fileName; // for loading images from the web

	this.getProperty = function(property){
		return this[property];
	}

	//property should be one of the already defined attributes
	//risky!!
	this.setProperty = function(property, value){
		this[property] = value;
	}

	this.getImgFileNamesString = function(){
		var imgs = ""
		var lastIndex = this.imgFileNames.length-1
		for (var i=0; i<lastIndex; i++) {asd
			imgs = imgs.concat(this.imgFileNames[i] + ", ");
		}
		imgs = imgs.concat(this.imgFileNames[lastIndex])
		return imgs
	}

	this.verify = function(){
		assert(this.labels.length <= this.nDims, "More labels than dimensions.");
		assert(this.dimSizes.length === this.nDims, "Discrepancy in number of dimensions");

		for (var i = 0; i < this.nDims; i++){
			var istr = i.toString();

			var tuple = this.dimSizes[i];
			assert(tuple.length === 2, "dimSizes has too many values in dimension: " + istr );
			var min = parseInt(tuple[0]);
			var max = parseInt(tuple[1]);
			assert(!isNaN(min) && min >= 0, "dimSizes has faulty minimum value in dimension: " + istr );
			assert(!isNaN(max) && max >= min, "dimSizes has faulty maximum value in dimension: " + istr );
		}

		assert(this.nDims === 1 || this.nDims === 2, "Number of dimensions should be 1 or 2.");

		assert(!(this.loadType === 'web' && this.fileName === ''), 'Need a full path');
	}
}
