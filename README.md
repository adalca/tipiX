tipiX
=====

tipiX - time picture explorer is an experimental tool for exploring time (or other dimensions) of image sets, generally images from similar view points (e.g. frames from timelapses). 
Take a test drive by trying an example dataset or load your own. Once loaded, movement with the mouse along x or y can explore difference dimensions of the data.

Use:
----
1. Load a dataset (see instructions under 'load' tab)
2. Move mouse over image to switch between images

Demo:
-----
http://www.mit.edu/~adalca/tipiX/

Address-bar query:
------------------------
example:
http://www.mit.edu/~adalca/tipiX/?path=http://people.csail.mit.edu/adalca/vb/initVol_%d_%d.jpg&xBins=30&nDims=2&yBins=30#
- path: same as the path required in the load menu
- xBins, yBins, dims - all self-explanatory :)

License Info:
-------------
tipiX is licensed under the MIT License:
http://www.opensource.org/licenses/mit-license.php
See LICENSE file for more information

External Libraries used:
------------------------
- [sprintf](http://www.diveintojavascript.com/projects/javascript-sprintf)
- [sscanf](http://phpjs.org/functions/sscanf/)
- [jquery](http://jquery.com/download/)
- [xio (not yet)](https://github.com/xtk/XIO)

TODOs:
------
Redesign as an entire website?
- think of redesign considering all current and near-future features and uses
- have succinct about page, but have several links to examples
 - maintain a separate page with *many* of my own datasets.
  - Add some information about the original images (Camera Make, Total Count, ETC)
 - have detailed description page, it's beginning to be very feature-heavy!
 - general exampled
 - embedding
 - video tutorial (do youtube-style tutorial)
 - example use for photographers (e.g.: changing two sliders on a image editing program)
 - example use in a vision project 
 - example: add graph exploration to tipiX examples. 
  - make better (prettier) gamma graphs, maybe with google charts or js
- consistent, well-designed page template
- think of it in the context of a js library


Sharing:
- allow people to share (via address bar) if data is from the web. Use a share button (email, facebook, g+, just copy to clipboard)
 - allow embedding? via iframe. (done)

Features:
- for iframes: don't load all dataset, have option for just loading one image!
- support video
 - http://html5doctor.com/video-canvas-magic/
- have loading screen (just 0..100) separate from <i> panel
- for drag&drop loading: if no number detection, just let images be 1d, random order, give warning.
- + and - buttons to change size of canvas.
- identify iframe
 - http://stackoverflow.com/questions/326069/how-to-identify-if-a-webpage-is-being-loaded-inside-an-iframe-or-directly-into-t
- (repeating) play button for 1D stuff. (done! needs code cleanup maybe)
- tipix canvas itself should be a drag and drop.
- add nifti support via xio.js.
- allow it to play videos on canvas? seems to be doable --> http://html5doctor.com/video-canvas-magic/
- clean loading and preview screens, - maybe these should be 'advanced' features? N/S
 - have a loading screen even for Very large images?
- preview: - have a button that, when pressed, shows that matrix (or similar one) in the main window.  
 - put images in preview div as they load?
- have a 'userAsset' method for communicating with the user? (similar to assert but better messages? N/S) 
 
- clean code 
 - change of set should really clear all variables, etc.
 - clean-up css
- add google +1 to tipiX in general?

Bug Reports:
------------
- for 1-D example (timelapse) initiated right after loading website, the canvas does not re-size to max possible.