self.window = self;
importScripts('../ext-js/xio.js');
importScripts('niitools.js');
importScripts('tools.js');
importScripts('imDisplay.js');

self.onmessage = function(e) {

  var _cmd = e.data.cmd;
  var filenames = e.data.filenames;
  var loadObj = e.data.loadObj;
  var idx = e.data.idx;
  var TMP_DISPLAY = e.data.TMP_DISPLAY;

  if (_cmd == 'load') {

    // callback, when everything was loaded
    X.io.onparse = function(file) {
        
        if (file) {
            var thisidx = niiFile2idx(filenames, file);
        
            // get the file, constructor, and useful dimensions
            input = X.io.get(file);
            
            // pass back
            self.postMessage({'cmd':'load', 'input':input, 'thisidx':thisidx});
        }
    } 
    
    //    
    if (loadObj.type === 'web') {
        var name = loadObj.fileName;
    } else {
        var name = loadObj.files[0].name;
    }
        
        
    var extidx = name.lastIndexOf('.');
    var ext = name.substr(extidx + 1);
    X.io.load(filenames[idx], ext);
    
  }; 
};
