function drawImage(imageObj) {
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
    var x = 640;
    var y = 480;

    context.drawImage(imageObj, 0, 0, x, y);

    var imageData = context.getImageData(0, 0, x, y);
    var data = imageData.data;

    for(var i = 0; i < data.length; i += 4) {
      var brightness = 0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2];
      // red
      data[i] = brightness+10;
      // green
      data[i + 1] = brightness;
      // blue
      data[i + 2] = brightness-50;
    }

    // overwrite original image
    context.putImageData(imageData, 0, 0);
  }