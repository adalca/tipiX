function preload(sources) {	
	 	    images = [];
			for (i = 0; i < sources.length; i++) {
				images[i] = new Image();
				images[i].src = sources[i];
			}
			return(images);
		}
	
		function writeMessage(canvas, images, pos) {
			var context = canvas.getContext('2d');		  
			
			
			imgnr = Math.floor(pos.x / (canvas.width/3 + 1)) + 1;
			
			document.getElementById('imgnr').innerHTML = imgnr;
			
			context.drawImage(images[imgnr-1], 0, 0);
		}
		
		function getMousePos(canvas, evt) {
			var rect = canvas.getBoundingClientRect();
			return {
			  x: evt.clientX - rect.left,
			  y: evt.clientY - rect.top
			};
		}
		
		var canvas = document.getElementById('myCanvas');
		var context = canvas.getContext('2d');
		
		sources = ["./img (1).jpg", "./img (2).jpg","./img (3).jpg"];
		images = preload(sources);

		canvas.addEventListener('mousemove', function(evt) {
			var mousePos = getMousePos(canvas, evt);
			writeMessage(canvas, images, mousePos);
		}, false);
