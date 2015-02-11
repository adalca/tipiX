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


//inputType == web
function loadUserSetAddressBar() {
    var loabObj = new LoadObj()
    loadObj.setProperty('inputType', "web");

    var dims = getParameterByName('nDims');
    if (dims == '') {
        loadObj.setProperty('nDims', 1);
    } else {
        loadObj.setProperty('nDims', parseInt(dims));
    }
    
    loadObj.setProperty('xBins', getParameterByName('xBins'));
    
    nDims = loadObj.getProperty('nDims');
    if (nDims == 2) {
        loadObj.setProperty('yBins', getParameterByName('yBins'));
    }
    
    loadObj.setProperty('fileName', getParameterByName('path')); 
    loadObj.setProperty('crossOrigin', getParameterByName('crossOrigin'));
    
	var xlabel = getParameterByName('xlabel');
	if (xlabel != '') {
		document.getElementById('xlabel').style.display = 'inline';
		document.getElementById('xlabelspan').innerHTML = xlabel;
		}
	
	var ylabel = getParameterByName('ylabel');
	if (ylabel != '') {
		document.getElementById('ylabel').style.display = 'inline';
		document.getElementById('ylabelspan').innerHTML = ylabel;
		}

    loadObj.verify();
	
    return loadObj;
    
}

//inputType == web
function loadUserSetWeb() {
    var loadObj = new LoadObj();
    loadObj.setProperty('inputType', 'web');

    var oForm = document.getElementById('userSet');
    
    var radios = document.getElementsByName('nDims');
    for (var i = 0, length = radios.length; i < length; i++) {
        if (radios[i].checked) {
            loadObj.setProperty('nDims', radios[i].value);
        }
    }
    
    loadObj.setProperty('xBins', parseInt(oForm.elements['xBins'].value));
    if (loadObj.getProperty('nDims') == 2) {
        loadObj.setProperty('yBins', parseInt(oForm.elements['yBins'].value));    
    }
    loadObj.setProperty('fileName', oForm.elements['filename'].value);
    
    loadObj.setProperty('crossOrigin', false);

    loadObj.verify();
    
    return loadObj;
}

function loadUserSetLocal(evt) {

    var loadObj = new LoadObj();

    var files = evt.target.files; // FileList object
    if (!files)
        files = evt.dataTransfer.files; // FileList object -> List of files
    //loadObj.files = files; //a file has attributes like name, size, type, etc.
    loadObj.setProperty("files", files); 

    // detect which type of images there are - 1D or 2D
    var f = files[0];
    var name = f.name; escape(f.name) //f.name = "MassGen_2_2.jpg"
    var innr = false;
    //var chrIndex = 0;
    var template = '';
    var dims = 0;
    for (var j = 0; j < name.length; j++) {
        var isdigit = !isNaN(name[j]) && name[j] != ' ';
        if (isdigit && !innr) {
            innr = true;
            template = template + '%d';
            dims++;
        }
        
        if (!isdigit) {
            innr = false;
            template = template + name[j];
        }
    }
    
    
    // warn if don't find 1 or 2 directions
    msg = 'did not find 1 or 2 direction naming';
    assert(dims === 1 || dims === 2, msg);
    loadObj.setProperty("nDims", dims);
    
    
    // get the min and max numbers, and populate loadObj.files
    var dimSizes = [];
    if (loadObj.getProperty("nDims") === 1) {
        
        // get min and max nrs
        minx = Infinity;
        maxx = 0;
        for (var i = 0, f; f = files[i]; i++) {
            x = sscanf(f.name, template);
            
            minx = Math.min(minx, x);
            maxx = Math.max(maxx, x);
        }
        
        msg = 'Found files ranging from %d to %d';
        writeDebug(sprintf(msg, minx, maxx));
        
        // populate new files array in the right order.
        fileOrder = new Array(maxx - minx + 1);
        for (var i = 0, f; f = files[i]; i++) {
            x = sscanf(f.name, template);
            fileOrder[x - minx] = i;
        }
        dimSizes.push([minx,maxx]);

    } else if (loadObj.getProperty("nDims") ===  2) {
        
        // get min and max nrs
        var minx = Infinity;    
        var miny = Infinity;    
        var maxx = 0;    
        var maxy = 0;    
        for (var i = 0, f; f = files[i]; i++) {
            xy = sscanf(f.name, template);
            console.log("Iteration :" + i.toString());
            console.log("Name: " + f.name);
            console.log("Template: " + template);
            console.log("xy: " + xy.toString());
            y = xy[0];
            x = xy[1];
            
            minx = Math.min(minx, x);
            maxx = Math.max(maxx, x);
            miny = Math.min(miny, y);
            maxy = Math.max(maxy, y);
        }

        // dump some info
        msg = 'Found files ranging from [%d, %d] to [%d, %d]';
        writeDebug(sprintf(msg, miny, minx, maxy, maxx));
        console.log(msg, miny, minx, maxy, maxx);

        // prepare structure
        fileOrder = new Array(maxy-miny+1);
        for (var i = 0; i < (maxy-miny+1); i++) {
            fileOrder[i] = new Array(maxy-miny+1);
        }
        
        // populate files structure
        for (var i = 0, f; f = files[i]; i++) {
            x = sscanf(f.name, template);
            fileOrder[x[0] - miny][x[1] - minx] = i;
        }

        dimSizes.push([minx, maxx]);
        dimSizes.push([miny, maxy]);
    }

    loadObj.setProperty("fileOrder", fileOrder);
    loadObj.setProperty('dimSizes', dimSizes);
    
    
    
    /*
    if (loadObj.getProperty("nDims") == 1) {
        loadObj.setProperty("xBins", maxx-minx+1);
    } else {
        loadObj.setProperty("yBins", maxy-miny+1);
        loadObj.setProperty("xBins", maxx-minx+1);  
    } */
        
    loadObj.setProperty("loadType", "local");
    
    loadObj.setProperty("crossOrigin", true);

    loadObj.verify();
    
    return loadObj;
}

function loadBoston4Day() {
    loadObj.type = "web";
    loadObj.nDims = 2;
    loadObj.xBins = 5;
    loadObj.yBins = 24;
    loadObj.fileName = consts.path.core + '/imageSets/boston4day/average_img_%d_%d.jpg'; 
    loadObj.crossOrigin = true;
    return loadObj;
}

function lupus() {
    loadObj.type = "web";
    loadObj.nDims = 2;
    loadObj.xBins = 5;
    loadObj.yBins = 56;
    loadObj.fileName = consts.path.core + '/imageSets/lupus/lupus_%d_%d.jpg'; 
    loadObj.crossOrigin = true;
    return loadObj;
}

function loadEmerald() {
    loadObj.type = "web";
    loadObj.nDims = 1;
    loadObj.xBins = 337;
    loadObj.fileName = consts.path.core + '/imageSets/emerald/img (%d).jpg';
    loadObj.crossOrigin = true;
    return loadObj;
}