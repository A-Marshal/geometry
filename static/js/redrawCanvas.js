function drawImage(imageObj) {
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
    var x = 0;
    var y = 0;

    context.drawImage(imageObj, -250, -50);

    var imageData = context.getImageData(0, 0, 640, 480);
    var data = imageData.data;

    for(var i = 0; i < data.length; i += 4) {
      var brightness = 0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2];
      // red
      data[i] = brightness;
      // green
      data[i + 1] = brightness;
      // blue
      data[i + 2] = brightness;
    }

    // overwrite original image
    context.putImageData(imageData, x, y);
  }