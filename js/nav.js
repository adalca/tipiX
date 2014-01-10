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



$(document).ready(function(){

	
	
	// navigation
	$('#sets-container').hide();
	$('#userSet-container').hide();
	$('#todos-container').hide();
	
	// hide preview matrix link
	document.getElementById('previewMatrixLink').style.display = 'none';

	if (currentTabState) {
		// show selected tab
		tabName = currentTab + '-tab';
		document.getElementById(tabName).style.display = 'inline-block';
		
		// highlight selected tab title
		tabTitle = currentTab + '-tab-title';
		document.getElementById(tabTitle).style.lineHeight = '20px';
		document.getElementById(tabTitle).style.paddingBottom = '2px';
		document.getElementById(tabTitle).style.borderBottom = '3px solid #0370ea';
	} else {
		document.getElementById('tab-container').style.display = 'none';
		document.getElementById('menu-container').style.display = 'none';
	}


	// fill in logo. 
	logoImage = new Image();
	logoImage.onload = function () { drawLogo(); };
	logoImage.src = 'http://www.mit.edu/~adalca/tipiX/images/logo.png';
	
	



	// form hide yBins by default
	$('#yBins').hide();
	$('#userSet').change(function() {
		if ($('#nDims2').prop('checked')) {
			$('#yBins').show();
		} else {
			$('#yBins').hide();
		}
	});
});
 
 
$(window).load(function () {
	if (location.search.indexOf('?') >= 0) {
		
		
		// check for iframe mode
		var iframeRes = getParameterByName('iframe');
		// TODO - force a minimum iframe size!
		// TODO - error checking.....
		if (iframeRes != '') {
			iFrameMode = true;	
			var xLoc = iframeRes.indexOf('x');
			MIN_CANVAS_WIDTH = iframeRes.substring(0, xLoc);
			MAX_CANVAS_WIDTH = MIN_CANVAS_WIDTH;
			MAX_EMPTY_CANVAS_WIDTH = MIN_CANVAS_WIDTH;
			MIN_CANVAS_HEIGHT = iframeRes.substring(xLoc + 1);
			MAX_CANVAS_HEIGHT = MIN_CANVAS_HEIGHT;
			MAX_EMPTY_CANVAS_HEIGHT = MIN_CANVAS_HEIGHT;
			document.getElementById('iframe-controls-container').style.visibility = 'visible';
			document.getElementById('nav-container').style.visibility = 'hidden';
		}		
		
		var debug = getParameterByName('debug');
		if (debug != '') {
			onOff('info-clip');
			updownContainer('info-container');
		}
		
		// get any pre-load datasets:
		try {
			launchDisplay('userSetAddressBar');
		} catch (err) {
			console.log('No addressbar dataset loaded');
			console.log(err);	
			console.log(loadObj);	
		}
		
		var playRes = getParameterByName('play');
		if (playRes != '') {
			if (playRes != 'true') {
				PLAY_MS_WAIT = parseInt(playRes);
				assert(!isNaN(PLAY_MS_WAIT));
			}
			changePlayState(); 
			continuousPlay(0);
		}
		
		var quiet = getParameterByName('quiet');
		if (quiet != '') {
			document.getElementById('iFrameLogoText').src = "http://www.mit.edu/~adalca/tipiX/images/logoText_10.png";
			document.getElementById('iframe-controls-container').style.height = "10px";
			document.getElementById('info-clip').style.visibility = "hidden";
			document.getElementById('info-container').style.visibility = "hidden";
		}
		

		
	}
});


function nav(newTabName) {
	// if different tab:
	
	if (currentTab != newTabName) {
		// hide current tab
		var tabName = currentTab + '-tab';
		document.getElementById(tabName).style.display = 'none';
				
		// un-highlight current tab title
		var tabTitle = currentTab + '-tab-title';
		document.getElementById(tabTitle).style.lineHeight = '20px';
		document.getElementById(tabTitle).style.paddingBottom = '2px';
		document.getElementById(tabTitle).style.borderBottom = '3px solid #008dfd';
		
		// show selected tab
		tabName = newTabName + '-tab';
		document.getElementById('menu-container').style.display = 'inline';
		document.getElementById('tab-container').style.display = 'inline';
		document.getElementById(tabName).style.display = 'inline-block';
		
		// highlight selected tab title
		tabTitle = newTabName + '-tab-title';
		document.getElementById(tabTitle).style.lineHeight = '20px';
		document.getElementById(tabTitle).style.paddingBottom = '2px';
		document.getElementById(tabTitle).style.borderBottom = '3px solid #0370ea';
		
		// updated currentTab
		currentTab = newTabName;
		currentTabState = true;
		
	} else if (currentTabState == true) {
		// hide current tab
		var tabName = currentTab + '-tab';
		document.getElementById(tabName).style.display = 'none';
		document.getElementById('tab-container').style.display = 'none';
		document.getElementById('menu-container').style.display = 'none';
				
		// un-highlight current tab title
		var tabTitle = currentTab + '-tab-title';
		document.getElementById(tabTitle).style.lineHeight = '20px';
		document.getElementById(tabTitle).style.paddingBottom = '2px';
		document.getElementById(tabTitle).style.borderBottom = '3px solid #008dfd';
		
		currentTabState = false;
		
	} else if (currentTabState == false) {
		// show selected tab
		tabName = currentTab + '-tab';
		document.getElementById('menu-container').style.display = 'inline';
		document.getElementById('tab-container').style.display = 'inline';
		document.getElementById(tabName).style.display = 'inline-block';
		
		// highlight selected tab title
		tabTitle = currentTab + '-tab-title';
		document.getElementById(tabTitle).style.lineHeight = '20px';
		document.getElementById(tabTitle).style.paddingBottom = '2px';
		document.getElementById(tabTitle).style.borderBottom = '3px solid #0370ea';
		
		currentTabState = true;
			
	}
}



function navLoad(newTabName) {
	// if different tab:
	
	if (currentLoadTab != newTabName) {

		if (currentLoadTab != '') {
			// hide current tab
			var tabName = 'load-' + currentLoadTab;
			document.getElementById(tabName).style.display = 'none';
					
			// un-highlight current tab title
			var tabTitle = 'load-' + currentLoadTab + '-title';
			document.getElementById(tabTitle).style.borderBottom = '0px solid #008dfd';
		}
		
		// show selected tab
		tabName = 'load-' + newTabName;
		document.getElementById('menu-container').style.display = 'inline';
		document.getElementById('tab-container').style.display = 'inline';
		document.getElementById(tabName).style.display = 'inline-block';
		
		// highlight selected tab title
		var tabTitle = 'load-' + newTabName + '-title';
		document.getElementById(tabTitle).style.borderBottom = '3px solid #0370ea';
		
		// updated currentTab
		currentLoadTab = newTabName;
	}
}


