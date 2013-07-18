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
- allow people to share via address bar if data is from the web with a share button (email, facebook, g+)
 - allow embedding? via iframe. (done)
- have loading screen (just 0..100) separate from <i> panel
- + and - button to change size of window.
- (repeating) play button for 1D stuff. (done! needs cleanup maybe)
- First load: have a (non-obvious) drag & drop over tipix, or a button over tipix that launches 'About', or: all three About \cdot load \cdot example - that dissapear once a button is clicked, and reappears as long as nothing is loaded?
- clean code 
- add nifti support via xio.
- fix +1 issue 
- clean loading screens, etc 
 - have a loading screen even for Very large images?
- preview - have a button that, when pressed, shows that matrix (or similar one) in the main window. 
- maintain a separate page with *many* of my own datasets.
 - Add some information about the original images (Camera Make, Total Count, ETC)
- change of set should really clear all variables, etc.
- clean-up css
- put images in preview div as they load
- do youtube-style tutorial

Bug Reports:
------------
- for 1-D example (timelapse) initiated right after loading website, the canvas does not re-size to max possible.