// JavaScript Document

$(document).ready(function(){


	// navigation
	$('#sets-container').hide();
	$('#userSet-container').hide();
	$('#todos-container').hide();

	// show selected tab
	tabName = currentTab + '-tab';
	document.getElementById(tabName).style.display = 'inline-block';
	
	// highlight selected tab title
	tabTitle = currentTab + '-tab-title';
	document.getElementById(tabTitle).style.backgroundColor = '#ABCDFF';

	// fill in logo. 
	logoImage = new Image();
	logoImage.onload = function () { drawLogo() };
	logoImage.src = 'http://www.mit.edu/~adalca/tipiX/images/logo.png'
	

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
 


function nav(newTabName) {
	// if different tab:
	if (currentTab != newTabName) {
		// hide current tab
		var tabName = currentTab + '-tab';
		document.getElementById(tabName).style.display = 'none';
				
		// un-highlight current tab title
		var tabTitle = currentTab + '-tab-title';
		document.getElementById(tabTitle).style.backgroundColor = '#FFFFFF';
		
		// show selected tab
		tabName = newTabName + '-tab';
		document.getElementById(tabName).style.display = 'inline-block';
		
		// highlight selected tab title
		tabTitle = newTabName + '-tab-title';
		document.getElementById(tabTitle).style.backgroundColor = '#ABCDFF';
		
		// updated currentTab
		currentTab = newTabName;
		
	} else if (currentTabState == true) {
		// hide current tab
		var tabName = currentTab + '-tab';
		document.getElementById(tabName).style.display = 'none';
				
		// un-highlight current tab title
		var tabTitle = currentTab + '-tab-title';
		document.getElementById(tabTitle).style.backgroundColor = '#FFFFFF';
		
		currentTabState = false;
		
	} else if (currentTabState == false) {
		// show selected tab
		tabName = currentTab + '-tab';
		document.getElementById(tabName).style.display = 'inline-block';
		
		// highlight selected tab title
		tabTitle = currentTab + '-tab-title';
		document.getElementById(tabTitle).style.backgroundColor = '#ABCDFF';
		
		currentTabState = true;
			
	}
}
