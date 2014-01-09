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
http://www.mit.edu/~adalca/tipiX/?path=http://www.mit.edu/~adalca/tipiX/imageSets/boston4day/average_img_$_$.jpg&xBins=5&nDims=2&yBins=24#
- path: same as the path required in the load menu
- xBins, yBins, nDims - all self-explanatory :)

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
Bugs:
- iframe --> full link should have '$' instead of '%d' in number placeholders. 

Bug Reports:
------------
- for 1-D example (timelapse) initiated right after loading website, the canvas does not re-size to max possible.