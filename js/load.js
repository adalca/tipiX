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


function loadUserSetAddressBar() {
    loadObj.type = "web";
    var dims = getParameterByName('nDims');
    if (dims == '' || parseInt(dims) == 1) {
        loadObj.nDims = 1;
    } else {
        assert(parseInt(dims) == 2, 'need dims to be 1 or 2');
        loadObj.nDims = 2;
    }
    
    var xBins = getParameterByName('xBins');
    loadObj.xBins = xBins;
    assert(!isNaN(parseInt(xBins)), 'need xBins to be integer');
    
    if (loadObj.nDims == 2) {
        var yBins = getParameterByName('yBins');
        assert(!isNaN(parseInt(yBins)), 'need yBins to be integer');
        loadObj.yBins = yBins;
    }
    
    var path = getParameterByName('path');
    assert(path != '', 'Need a full path');
    loadObj.fileName = path;
    
    loadObj.crossOrigin = getParameterByName('crossOrigin');
    
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
	
    return loadObj;
    
}

function loadUserSetWeb() {
    var oForm = document.getElementById('userSet');
    
    var radios = document.getElementsByName('nDims');
    for (var i = 0, length = radios.length; i < length; i++) {
        if (radios[i].checked) {
            loadObj.nDims = radios[i].value;
        }
    }
    
    loadObj.xBins = parseInt(oForm.elements['xBins'].value);
    if (loadObj.nDims == 2) {
        loadObj.yBins = parseInt(oForm.elements['yBins'].value);    
    }
    loadObj.fileName = oForm.elements['filename'].value;
    loadObj.type = "web";
    
    loadObj.crossOrigin = false;
    
    return loadObj;
}


function loadUserSetLocal(evt) {
    
    var files = evt.target.files; // FileList object
    if (!files)
        files = evt.dataTransfer.files; // FileList object.
    loadObj.files = files;    
    
    
    // detect which type of images there are - 1D or 2D
    var f = files[0];
    var name = f.name; escape(f.name)
    var innr = false;
    var chrIndex = 0;
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
    assert(dims == 1 || dims == 2, msg);
    loadObj.nDims = dims;
    
    
    // get the min and max numbers, and populate loadObj.files
    if (loadObj.nDims == 1) {
        
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
        loadObj.fileIdx = new Array(maxx-minx+1);
        for (var i = 0, f; f = files[i]; i++) {
            x = sscanf(f.name, template);
            loadObj.fileIdx[x - minx] = i;
        }
        
    } else {
        
        // get min and max nrs
        var minx = Infinity;    
        var miny = Infinity;    
        var maxx = 0;    
        var maxy = 0;    
        for (var i = 0, f; f = files[i]; i++) {
            xy = sscanf(f.name, template);
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

        // prepare structure
        loadObj.fileIdx = new Array(maxy-miny+1);
        for (var i = 0; i < (maxy-miny+1); i++) {
            loadObj.fileIdx[i] = new Array(maxy-miny+1);
        }
        
        // populate files structure
        for (var i = 0, f; f = files[i]; i++) {
            x = sscanf(f.name, template);
            loadObj.fileIdx[x[0] - miny][x[1] - minx] = i;
        }
    }
    
    
    if (loadObj.nDims == 1) {
        loadObj.xBins = maxx-minx+1;
    } else {
        loadObj.yBins = maxy-miny+1;
        loadObj.xBins = maxx-minx+1;
    }
        
    loadObj.type = "local";
    
    loadObj.crossOrigin = true;
    
    return loadObj;
}

function loadBoston4Day() {
    loadObj.type = "web";
    loadObj.nDims = 2;
    loadObj.xBins = 5;
    loadObj.yBins = 24;
    loadObj.fileName = CORE_SET_PATH + '/imageSets/boston4day/average_img_%d_%d.jpg'; 
    loadObj.crossOrigin = true;
    return loadObj;
}

function lupus() {
    loadObj.type = "web";
    loadObj.nDims = 2;
    loadObj.xBins = 5;
    loadObj.yBins = 56;
    loadObj.fileName = CORE_SET_PATH + '/imageSets/lupus/lupus_%d_%d.jpg'; 
    loadObj.crossOrigin = true;
    return loadObj;
}

function loadEmerald() {
    loadObj.type = "web";
    loadObj.nDims = 1;
    loadObj.xBins = 337;
    loadObj.fileName = CORE_SET_PATH + '/imageSets/emerald/img (%d).jpg';
    loadObj.crossOrigin = true;
    return loadObj;
}