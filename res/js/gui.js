function toggleVisibility(idname) {
  vis = $('#' + idname).css('visibility');
  if ('hidden'.localeCompare(vis) == 0)
    $('#' + idname).css('visibility', 'visible');
  else
    $('#' + idname).css('visibility', 'hidden');
}


function hide(idname) {
  $('#' + idname).css('visibility', 'hidden');
}

/**************************************
 * Specific Buttons
 **************************************/

function toggleLabels() {
  toggleVisibility('gui-xlabel-container');
  toggleVisibility('gui-ylabel-container');
}
