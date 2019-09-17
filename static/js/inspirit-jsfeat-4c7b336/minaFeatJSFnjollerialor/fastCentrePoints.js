function drawImage(imageObj) {
    var canvasCentre = document.getElementById('canvas');
    var contextCentre = canvasCentre.getContext('2d');
    var x = imageObj.width;
    var y = imageObj.height;
  
    contextCentre.drawImage(imageObj, 0, 0, x, y);
  
    var imageDataCentre = contextCentre.getImageData(0, 0, x, y);
    var data = imageDataCentre.data;
    var rowCounter = 0;
  
    for (var i = 0; i < data.length; i += 4) {
      //Init
      var brightness = 0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2];
      var j = i / 4;
  
      //Calculate row
      if ((j > 0) && (j % x == 0)) {
        rowCounter++
      }
  
      //Calculate grey level RBG values
      if ((j % x < 3 * x / 4) && (rowCounter < y / 2)) {
        // red
        data[i] = brightness;
        // green
        data[i + 1] = 0.5 * brightness;
        // blue
        data[i + 2] = 0;//brightness;
      } else if ((j % x >= x / 2) && (rowCounter < y / 2)) {
        // red
        data[i] = brightness;
        // green
        data[i + 1] = 0;//brightness;
        // blue
        data[i + 2] = 0.5 * brightness;
      } else if ((j % x < x / 4) && (rowCounter >= y / 2)) {
        // red
        data[i] = 0;//brightness;
        // green
        data[i + 1] = brightness;
        // blue
        data[i + 2] = 0.5 * brightness;
      } else {
        // red
        data[i] = 0;//brightness;
        // green
        data[i + 1] = 0.5 * brightness;
        // blue
        data[i + 2] = brightness;
      }
    }
  
    // overwrite original image
    contextCentre.putImageData(imageDataCentre, 0, 0);
  }