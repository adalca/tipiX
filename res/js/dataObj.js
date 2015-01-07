var DataObj = function(){
	this.fileName; //= typeof filename !== "undefined" ? filename : "";
	this.img = "image object";
	this.segFileName = "segFileName";
	this.seg = "what is a segmentation object";
	this.height = undefined;
	this.width = undefined;
	this.loaded = true;
	this.size = "number of dimensions?";

	this.error; // ????
	this.y; // this should change to dimloc - an array of size loadobj.nDims.
	this.x;

	this.getProperty = function(property){
		return this[property];
	}

	//property should be one of the already defined attributes
	//risky!!
	this.setProperty = function(property, value){
		this[property] = value;
	}
}