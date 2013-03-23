// JavaScript Document

$(document).ready(function(){
			$('#yBins').hide();
	$('#userSet').change(function() {
		if ($('#nDims2').prop('checked')) {
			$('#yBins').show();
		} else {
			$('#yBins').hide();
		}
	});
});
 