//Initialisering av mer eller mindre globala variabler, refaktorering pågår

//Video frame info
const videoWidth = 640;
const videoHeight = 480;

//Variabler för fokusareor, webcamFeed
let sumTotalX = 0, sumTotalY = 0, sumLowThX = 0, sumLowThXPrev = 0, sumLowThY = 0, sumLowThYPrev = 0;
let sumMidThX = 0, sumMidThXPrev = 0, sumMidThY = 0, sumMidThYPrev = 0;
let sumHiThX = 0, sumHiThXPrev = 0, sumHiThY = 0, sumHiThYPrev = 0;
let maxTotalX = -999, minTotalX = 999, maxTotalY = -999, minTotalY = 999;
let maxLowThX = -999, maxLowThXPrev = -999, minLowThX = 999, minLowThXPrev = 999, maxLowThY = -999, maxLowThYPrev = -999, minLowThY = 999, minLowThYPrev = 999;
let maxMidThX = -999, maxMidThXPrev = -999, minMidThX = 999, minMidThXPrev = 999, maxMidThY = -999, maxMidThYPrev = -999, minMidThY = 999, minMidThYPrev = 999;
let maxHiThX = -999, maxHiThXPrev = -999, minHiThX = 999, minHiThXPrev = 999, maxHiThY = -999, maxHiThYPrev = -999, minHiThY = 999, minHiThYPrev = 999;

//Variabler för canny linjer, ROI
let sumCannyX = 0, sumCannyY = 0, maxCannyX = -999, maxCannyY = -999, minCannyX = 999, minCannyY = 999;
let countCannyROI = 0;
let countWhiteCannyTot = 0;
let countWhiteCannyROI = 0;

//Variabler för att kvantifiera/sortera/möga med FAST punkterna
let maxCornersScore = -999;
let minCornersScore = 999;

//Variabler för fokusareors kvadranter, webcamFeed, röd fokusarea
let sumLowThXQ = [];
let sumLowThXQPrev = [];
sumLowThXQPrev = [0, 0, 0, 0, 0];
let sumLowThYQ = [];
let sumLowThYQPrev = [];
sumLowThYQPrev = [0, 0, 0, 0, 0];
let maxLowThXQ = [];
let maxLowThXQPrev = [];
maxLowThXQPrev = [-999, -999, -999, -999, -999];
let minLowThXQ = [];
let minLowThXQPrev = [];
minLowThXQPrev = [999, 999, 999, 999, 999];
let maxLowThYQ = [];
let maxLowThYQPrev = [];
maxLowThYQPrev = [-999, -999, -999, -999, -999];
let minLowThYQ = [];
let minLowThYQPrev = [];
minLowThYQPrev = [-999, -999, -999, -999, -999];
//Variabler för fokusareors kvadranter, webcamFeed, röd fokusarea(SLUT)

//Variabler för fokusareors kvadranter, webcamFeed, grön fokusarea
let sumMidThXQ = [];
let sumMidThXQPrev = [];
sumMidThXQPrev = [0, 0, 0, 0, 0];
let sumMidThYQ = [];
let sumMidThYQPrev = [];
sumMidThYQPrev = [0, 0, 0, 0, 0];
let maxMidThXQ = [];
let maxMidThXQPrev = [];
maxMidThXQPrev = [-999, -999, -999, -999, -999];
let minMidThXQ = [];
let minMidThXQPrev = [];
minMidThXQPrev = [999, 999, 999, 999, 999];
let maxMidThYQ = [];
let maxMidThYQPrev = [];
maxMidThYQPrev = [-999, -999, -999, -999, -999];
let minMidThYQ = [];
let minMidThYQPrev = [];
minMidThYQPrev = [-999, -999, -999, -999, -999];
//Variabler för fokusareors kvadranter, webcamFeed, grön fokusarea(SLUT)

//Variabler för fokusareors kvadranter, webcamFeed, blå fokusarea
let sumHiThXQ = [];
let sumHiThXQPrev = [];
sumHiThXQPrev = [0, 0, 0, 0, 0];
let sumHiThYQ = [];
let sumHiThYQPrev = [];
sumHiThYQPrev = [0, 0, 0, 0, 0];
let maxHiThXQ = [];
let maxHiThXQPrev = [];
maxHiThXQPrev = [-999, -999, -999, -999, -999];
let minHiThXQ = [];
let minHiThXQPrev = [];
minHiThXQPrev = [999, 999, 999, 999, 999];
let maxHiThYQ = [];
let maxHiThYQPrev = [];
maxHiThYQPrev = [-999, -999, -999, -999, -999];
let minHiThYQ = [];
let minHiThYQPrev = [];
minHiThYQPrev = [-999, -999, -999, -999, -999];
//Variabler för fokusareors kvadranter, webcamFeed, blå fokusarea(SLUT)

//Frame info variabler
let corners = [];
let cornersStationary = [];
let allThZero = false;

//Nu jävlar i min lilla låda, liesom rörendes ROI
let sumROIX = 0;
let sumROIXPrev = 0;
let sumROIY = 0;
let sumROIYPrev = 0;
let moveROIX = 0;
let moveROIY = 0;
let countZeroFrames = 0;
//Nu jävlar i min lilla låda, liesom rörendes ROI(SLUT)

//Skapa arrayer för FAST - punkterna
let maxIdxVidArr = videoWidth * videoHeight;
while (--maxIdxVidArr >= 0) {
    corners[maxIdxVidArr] = new jsfeat.keypoint_t(0, 0, 0, 0);
    cornersStationary[maxIdxVidArr] = 0;
}

//App variabler 
let roiWidth, roiHeight, roiX0, roiY0, minCornerScoreForStationary;
let gui, options;

let demo_opt = function () {
    this.roiWidth = 485;
    this.roiHeight = 229;
    this.roiX0 = 98;
    this.roiY0 = 58;
    this.minCornerScoreForStationary = 50;
}

//Förinställt gör livet enklare att hitta tv'n blann annet.
roiWidth = 485;
roiHeight = 229;
roiX0 = 98;
roiY0 = 58;
minCornerScoreForStationary = 50;

//Mina variabler för att särskilja stationära vs icke - stationära FAST
let stationaryCornerHitVal = 4
let minValForStationary = 1;
let stationaryNeighbourhood = 3;

//Mainliknande funktion, styr vad som görs varje frame
function canvasVideoFeed(imageObj) {
    let canvas = document.getElementById('videoCanvas');
    let context = canvas.getContext('2d');
    let canvasMellan = document.getElementById('mellanLager');
    let contextMellan = canvasMellan.getContext('2d');

    context.drawImage(imageObj, 0, 0, videoWidth, videoHeight);
    contextMellan.drawImage(imageObj, 0, 0, videoWidth, videoHeight);

    let imageData = context.getImageData(0, 0, videoWidth, videoHeight);

    //Write video frame to canvases
    context.putImageData(imageData, 0, 0);
    contextMellan.putImageData(imageData, 0, 0);

    //Sen måste ju vi "vise" att vi liesom mögar lidda grann här

    //testa av timing
    let innanMitt, efterMitt;
    innanMitt = Date.now();
    //drawCannyLines(context, allThZero);
    bloodyStupidJohnsonCannyLines0002(context);
    drawFastPoints(contextMellan, context);
    extractMajorColour(context);
    efterMitt = Date.now();
    //testa av timing(SLUT)

    let pSkiteria = document.getElementById("count");

    pSkiteria.innerHTML += "<br>Elapsed time for my mög: " + (efterMitt - innanMitt) + " (ms)";
    pSkiteria.innerHTML += "<br>Max FAST score in ROI: " + maxCornersScore;
    pSkiteria.innerHTML += "<br>Min FAST score in ROI: " + minCornersScore;
    pSkiteria.innerHTML += "<br>White canny point count Tot: " + countWhiteCannyTot;
    pSkiteria.innerHTML += "<br>White canny point count in ROI: " + countWhiteCannyROI;
    pSkiteria.innerHTML += "<br>Total Canny point count in ROI: " + countCannyROI;

    //Uppdatera range slider variablernas värden
    //Update roiWidth from slider
    if (roiWidth != options.roiWidth) {
        roiWidth = options.roiWidth | video.width;
    }

    //Update roiHeight from slider
    if (roiHeight != options.roiHeight) {
        roiHeight = options.roiHeight | video.height;
    }

    //Update roiX0 from slider
    if (roiX0 != options.roiX0) {
        roiX0 = options.roiX0 | 0;
    }

    //Update roiY0 from slider
    if (roiY0 != options.roiY0) {
        roiY0 = options.roiY0 | 0;
    }

    //Update minCornerScoreForStationary from slider
    if (minCornerScoreForStationary != options.minCornerScoreForStationary) {
        minCornerScoreForStationary = options.minCornerScoreForStationary | 0;
    }
}
//Mainliknande funktion, styr vad som görs varje frame(SLUT)

//Canny lines, ett måste
function drawCannyLines(ctxx, allThZero) {
    let img_u8 = new jsfeat.matrix_t(videoWidth, videoHeight, jsfeat.U8C1_t | jsfeat.C1_t);

    let imageData = ctxx.getImageData(0, 0, videoWidth, videoHeight);

    jsfeat.imgproc.grayscale(imageData.data, videoWidth, videoHeight, img_u8);

    let r = 2; //options.blur_radius | 0;
    let kernel_size = (r + 1) << 1;

    jsfeat.imgproc.gaussian_blur(img_u8, img_u8, kernel_size, 0);

    jsfeat.imgproc.canny(img_u8, img_u8, 20, 50 /* options.low_threshold | 0, options.high_threshold | 0 */);

    // render result back to canvas
    let data_u32 = new Uint32Array(imageData.data.buffer);
    let alpha = (0xff << 24);
    let i = img_u8.cols * img_u8.rows, pix = 0;
    while (--i >= 0) {
        pix = img_u8.data[i];
        if (pix > 0) {
            if (!allThZero) {
                data_u32[i] = alpha | (pix << 16) | (pix << 8) | pix; //white
            } else {
                data_u32[i] = alpha | (pix << 16) | (0x00 << 8) | pix; //purple
            }
        }
    }

    ctxx.putImageData(imageData, 0, 0);
}

function bloodyStupidJohnsonCannyLines(ctxx, allThZero) {
    let img_u8 = new jsfeat.matrix_t(videoWidth, videoHeight, jsfeat.U8C1_t | jsfeat.C1_t);

    let imageData = ctxx.getImageData(0, 0, videoWidth, videoHeight);

    jsfeat.imgproc.grayscale(imageData.data, videoWidth, videoHeight, img_u8);

    let r = 2; //options.blur_radius | 0;
    let kernel_size = (r + 1) << 1;

    //Initiering av globaler
    sumCannyX = 0;
    sumCannyY = 0;
    maxCannyX = -999;
    maxCannyY = -999;
    minCannyX = 999;
    minCannyY = 999;
    countCannyROI = 0;

    jsfeat.imgproc.gaussian_blur(img_u8, img_u8, kernel_size, 0);

    jsfeat.imgproc.canny(img_u8, img_u8, 20, 50 /* options.low_threshold | 0, options.high_threshold | 0 */);

    // render result back to canvas
    let data_u32 = new Uint32Array(imageData.data.buffer);
    let alpha = (0xff << 24);
    let i = img_u8.cols * img_u8.rows, pix = 0, row = 0;
    //while (--i >= 0) {
    for (var ii = 0; ii < i; ii++) {
        pix = img_u8.data[ii];

        if ((ii != 0) && (ii % 640 == 0)) {
            row++;
        }

        if (pix > 0) {
            //Canny ROI info
            let xx = ii - row * 640;
            let yy = row;
            if (cannyWithinROI(xx, yy)) {
                sumCannyX += xx;
                sumCannyY += yy;
                maxCannyX = Math.max(maxCannyX, xx);
                maxCannyY = Math.max(maxCannyY, yy);
                minCannyX = Math.min(minCannyX, xx);
                minCannyY = Math.min(minCannyY, yy);
                countCannyROI++;
            }
            //Canny ROI info(SLUT)
            if (!allThZero) {
                data_u32[ii] = alpha | (pix << 16) | (pix << 8) | pix; //white
            } else {
                data_u32[ii] = alpha | (pix << 16) | (0x00 << 8) | pix; //purple
            }
        }
    }

    ctxx.putImageData(imageData, 0, 0);
}

function bloodyStupidJohnsonCannyLines0002(ctxx) {
    let img_u8 = new jsfeat.matrix_t(videoWidth, videoHeight, jsfeat.U8C1_t | jsfeat.C1_t);
    let img_u8Inflection = [];

    let imageData = ctxx.getImageData(0, 0, videoWidth, videoHeight);

    jsfeat.imgproc.grayscale(imageData.data, videoWidth, videoHeight, img_u8);

    let r = 2; //options.blur_radius | 0;
    let kernel_size = (r + 1) << 1;

    //Initiering av globaler
    sumCannyX = 0;
    sumCannyY = 0;
    maxCannyX = -999;
    maxCannyY = -999;
    minCannyX = 999;
    minCannyY = 999;
    countCannyROI = 0;
    countWhiteCannyTot = 0;
    countWhiteCannyROI = 0;

    jsfeat.imgproc.gaussian_blur(img_u8, img_u8, kernel_size, 0);

    jsfeat.imgproc.canny(img_u8, img_u8, 20, 50 /* options.low_threshold | 0, options.high_threshold | 0 */);

    // render result back to canvas
    let data_u32 = new Uint32Array(imageData.data.buffer);
    let alpha = (0xff << 24);
    let noImagePix = img_u8.cols * img_u8.rows, row = 0;
    let pix = 0, pixR = 0, pixB = 0, pixG = 0, pctPartOf = 0.1;
    //while (--i >= 0) {
    for (var ii = 0; ii < noImagePix; ii++) {
        pix = img_u8.data[ii];

        if ((ii != 0) && (ii % 640 == 0)) {
            row++;
        }

        if (pix > 0) {
            //Canny ROI info
            let xx = ii - row * 640;
            let yy = row;
            if (cannyWithinROI(xx, yy)) {
                sumCannyX += xx;
                sumCannyY += yy;
                maxCannyX = Math.max(maxCannyX, xx);
                maxCannyY = Math.max(maxCannyY, yy);
                minCannyX = Math.min(minCannyX, xx);
                minCannyY = Math.min(minCannyY, yy);
                countCannyROI++;
            }
            //Canny ROI info(SLUT)

            //En första liden liden Bloody Stupid Johnson lina
            //Horisontaler1
            if ((img_u8.data[ii - 1] > 0) && (img_u8.data[ii + 1] > 0)) {
                data_u32[ii] = alpha | (0x00 << 16) | (0xff << 8) | 0xff; //yellow
                //Horisontaler2 - dessa kan vara intressanta att färga annerledes
            } else if ((img_u8.data[ii - 1] > 0) && (img_u8.data[ii + 1 + videoWidth] > 0)) {
                data_u32[ii] = alpha | (0x00 << 16) | (0xff << 8) | 0x00; //green - TYDLIGEN...
                //data_u32[ii] = alpha | (0x00 << 16) | (0xff << 8) | 0xff; //yellow
                //Horisontaler3 - dessa kan vara intressanta att färga annerledes
            } else if ((img_u8.data[ii - 1] > 0) && (img_u8.data[ii + 1 - videoWidth] > 0)) {
                data_u32[ii] = alpha | (0xff << 16) | (0xff << 8) | 0x00; //cyan - TYDLIGEN...
                //data_u32[ii] = alpha | (0x00 << 16) | (0xff << 8) | 0xff; //yellow
                //Horisontaler4 - dessa kan vara intressanta att färga annerledes
            } else if ((img_u8.data[ii - 1 + videoWidth] > 0) && (img_u8.data[ii + 1] > 0)) {
                data_u32[ii] = alpha | (0xff << 16) | (0xff << 8) | 0x00; //cyan - TYDLIGEN...
                //data_u32[ii] = alpha | (0x00 << 16) | (0xff << 8) | 0xff; //yellow
                //Horisontaler5 - dessa kan vara intressanta att färga annerledes
            } else if ((img_u8.data[ii - 1 - videoWidth] > 0) && (img_u8.data[ii + 1] > 0)) {
                data_u32[ii] = alpha | (0x00 << 16) | (0xff << 8) | 0x00; //green - TYDLIGEN...
                //data_u32[ii] = alpha | (0x00 << 16) | (0xff << 8) | 0xff; //yellow
                //Vertikaler
            } else if ((img_u8.data[ii - videoWidth] > 0) && (img_u8.data[ii + videoWidth] > 0)) {
                data_u32[ii] = alpha | (0x00 << 16) | (0x00 << 8) | 0xff; //red
                //Snett upp åt höger1
            } else if ((img_u8.data[ii + 1 - videoWidth] > 0) && (img_u8.data[ii - 1 + videoWidth] > 0)) {
                data_u32[ii] = alpha | (0xff << 16) | (0xff << 8) | 0x00; //cyan
                //Snett upp åt höger2 - dessa kan vara intressanta att färga annerledes
            } else if ((img_u8.data[ii + 1 - videoWidth] > 0) && (img_u8.data[ii + videoWidth] > 0)) {
                data_u32[ii] = alpha | (0xff << 16) | (0xff << 8) | 0x00; //cyan
                //Snett upp åt höger3 - dessa kan vara intressanta att färga annerledes
            } else if ((img_u8.data[ii - videoWidth] > 0) && (img_u8.data[ii - 1 + videoWidth] > 0)) {
                data_u32[ii] = alpha | (0xff << 16) | (0xff << 8) | 0x00; //cyan
                //Snett upp åt vänster1
            } else if ((img_u8.data[ii - 1 - videoWidth] > 0) && (img_u8.data[ii + 1 + videoWidth] > 0)) {
                data_u32[ii] = alpha | (0x00 << 16) | (0xff << 8) | 0x00; //green
                //Snett upp åt vänster2 - dessa kan vara intressanta att färga annerledes
            } else if ((img_u8.data[ii - 1 - videoWidth] > 0) && (img_u8.data[ii + videoWidth] > 0)) {
                data_u32[ii] = alpha | (0x00 << 16) | (0xff << 8) | 0x00; //green
                //Snett upp åt vänster3 - dessa kan vara intressanta att färga annerledes
            } else if ((img_u8.data[ii - videoWidth] > 0) && (img_u8.data[ii + 1 + videoWidth] > 0)) {
                data_u32[ii] = alpha | (0x00 << 16) | (0xff << 8) | 0x00; //green
                //Allt annat, kan tas om hand om också... typ palla..., FAST hé é intressante punkte
            } else {
                data_u32[ii] = alpha | (pix << 16) | (pix << 8) | pix; //white
                img_u8Inflection[ii] = 255;
                countWhiteCannyTot++;
                if (cannyWithinROI(xx, yy)) {
                    countWhiteCannyROI++;
                }
            }
            //En första liden liden Bloody Stupid Johnson lina(SLUT)
        }
    }

    for (ii = 0; ii < videoWidth * videoHeight; ii++) {
        //Get the RGB value for colour plane inflection points
        pixR = imageData.data[ii];
        pixG = imageData.data[ii + 1];
        pixB = imageData.data[ii + 2];


        if ((ii != 0) && (ii % 640 == 0)) {
            row++;
        }
        //Testa lite grann
        let upperLeftR = imageData.data[ii - 4 - 4 * videoWidth];
        let upperLeftG = imageData.data[ii - 4 - 4 * videoWidth + 1];
        let upperLeftB = imageData.data[ii - 4 - 4 * videoWidth + 2];

        let upperCenterR = imageData.data[ii - 4 * videoWidth];
        let upperCenterG = imageData.data[ii - 4 * videoWidth + 1];
        let upperCenterB = imageData.data[ii - 4 * videoWidth + 2];

        let upperRightR = imageData.data[ii + 4 - 4 * videoWidth];
        let upperRightG = imageData.data[ii + 4 - 4 * videoWidth + 1];
        let upperRightB = imageData.data[ii + 4 - 4 * videoWidth + 2];

        let centerLeftR = imageData.data[ii - 4];
        let centerLeftG = imageData.data[ii - 4 + 1];
        let centerLeftB = imageData.data[ii - 4 + 2];

        let centerRightR = imageData.data[ii + 4];
        let centerRightG = imageData.data[ii + 4 + 1];
        let centerRightB = imageData.data[ii + 4 + 2];

        let lowerLeftR = imageData.data[ii - 4 + 4 * videoWidth];
        let lowerLeftG = imageData.data[ii - 4 + 4 * videoWidth + 1];
        let lowerLeftB = imageData.data[ii - 4 + 4 * videoWidth + 2];

        let lowerCenterR = imageData.data[ii + 4 * videoWidth];
        let lowerCenterG = imageData.data[ii + 4 * videoWidth + 1];
        let lowerCenterB = imageData.data[ii + 4 * videoWidth + 2];

        let lowerRightR = imageData.data[ii + 4 + videoWidth];
        let lowerRightG = imageData.data[ii + 4 + videoWidth + 1];
        let lowerRightB = imageData.data[ii + 4 + videoWidth + 2];

        if (img_u8Inflection[ii] > 0) {
            //Upper left
            if ((Math.abs(1 - (upperLeftR / pixR)) < pctPartOf) && (Math.abs(1 - (upperLeftG / pixG)) < pctPartOf) && (Math.abs(1 - (upperLeftB / pixB)) > pctPartOf)) {
                //data_u32[ii - 1 - videoWidth] = alpha | (0xff << 16) | (0xff << 8) | 0xff; //white
            } else if ((upperLeftR / pixR > pctPartOf) && ((upperLeftG / pixG) > pctPartOf) && ((upperLeftB / pixB) > pctPartOf)) {
                //data_u32[ii - 1 - videoWidth] = alpha | (0xff << 16) | (0xff << 8) | 0xff; //white
            } else {
                //data_u32[ii - 1 - videoWidth] = alpha | (0x00 << 16) | (0x00 << 8) | 0x00; //black
            }

            //Upper center
            if ((Math.abs(1 - (upperCenterR / pixR)) < pctPartOf) && (Math.abs(1 - (upperCenterG / pixG)) < pctPartOf) && (Math.abs(1 - (upperCenterB / pixB)) > pctPartOf)) {
                data_u32[ii - videoWidth] = alpha | (0xff << 16) | (0xff << 8) | 0xff; //white
            } else if ((upperCenterR / pixR > pctPartOf) && ((upperCenterG / pixG) > pctPartOf) && ((upperCenterB / pixB) > pctPartOf)) {
                data_u32[ii - videoWidth] = alpha | (0xff << 16) | (0xff << 8) | 0xff; //white
            } else {
                data_u32[ii - videoWidth] = alpha | (0x00 << 16) | (0x00 << 8) | 0x00; //black
            }

            //Upper right
            if ((Math.abs(1 - (upperRightR / pixR)) < pctPartOf) && (Math.abs(1 - (upperRightG / pixG)) < pctPartOf) && (Math.abs(1 - (upperRightB / pixB)) > pctPartOf)) {
                //data_u32[ii + 1 - videoWidth] = alpha | (0xff << 16) | (0xff << 8) | 0xff; //white
            } else if ((upperRightR / pixR > pctPartOf) && ((upperRightG / pixG) > pctPartOf) && ((upperRightB / pixB) > pctPartOf)) {
                //data_u32[ii + 1 - videoWidth] = alpha | (0xff << 16) | (0xff << 8) | 0xff; //white
            } else {
                //data_u32[ii + 1 - videoWidth] = alpha | (0x00 << 16) | (0x00 << 8) | 0x00; //black
            }

            //Center left
            if ((Math.abs(1 - (centerLeftR / pixR)) < pctPartOf) && (Math.abs(1 - (centerLeftG / pixG)) < pctPartOf) && (Math.abs(1 - (centerLeftB / pixB)) > pctPartOf)) {
                data_u32[ii - 1] = alpha | (0xff << 16) | (0xff << 8) | 0xff; //white
            } else if ((centerLeftR / pixR > pctPartOf) && ((centerLeftG / pixG) > pctPartOf) && ((centerLeftB / pixB) > pctPartOf)) {
                data_u32[ii - 1] = alpha | (0xff << 16) | (0xff << 8) | 0xff; //white
            } else {
                data_u32[ii - 1] = alpha | (0x00 << 16) | (0x00 << 8) | 0x00; //black
            }

            //Center right
            if ((Math.abs(1 - (centerRightR / pixR)) < pctPartOf) && (Math.abs(1 - (centerRightG / pixG)) < pctPartOf) && (Math.abs(1 - (centerRightB / pixB)) > pctPartOf)) {
                data_u32[ii + 1] = alpha | (0xff << 16) | (0xff << 8) | 0xff; //white
            } else if ((centerRightR / pixR > pctPartOf) && ((centerRightG / pixG) > pctPartOf) && ((centerRightB / pixB) > pctPartOf)) {
                data_u32[ii + 1] = alpha | (0xff << 16) | (0xff << 8) | 0xff; //white
            } else {
                data_u32[ii + 1] = alpha | (0x00 << 16) | (0x00 << 8) | 0x00; //black
            }


            //Lower left
            if ((Math.abs(1 - (lowerLeftR / pixR)) < pctPartOf) && (Math.abs(1 - (lowerLeftG / pixG)) < pctPartOf) && (Math.abs(1 - (lowerLeftB / pixB)) > pctPartOf)) {
                //data_u32[ii - 1 + videoWidth] = alpha | (0xff << 16) | (0xff << 8) | 0xff; //white
            } else if ((lowerLeftR / pixR > pctPartOf) && ((lowerLeftG / pixG) > pctPartOf) && ((lowerLeftB / pixB) > pctPartOf)) {
                //data_u32[ii - 1 + videoWidth] = alpha | (0xff << 16) | (0xff << 8) | 0xff; //white
            } else {
                //data_u32[ii - 1 + videoWidth] = alpha | (0x00 << 16) | (0x00 << 8) | 0x00; //black
            }

            //Lower center
            if ((Math.abs(1 - (lowerCenterR / pixR)) < pctPartOf) && (Math.abs(1 - (lowerCenterG / pixG)) < pctPartOf) && (Math.abs(1 - (lowerCenterB / pixB)) > pctPartOf)) {
                data_u32[ii + videoWidth] = alpha | (0xff << 16) | (0xff << 8) | 0xff; //white
            } else if ((lowerCenterR / pixR > pctPartOf) && ((lowerCenterG / pixG) > pctPartOf) && ((lowerCenterB) / pixB > pctPartOf)) {
                data_u32[ii + videoWidth] = alpha | (0xff << 16) | (0xff << 8) | 0xff; //white
            } else {
                data_u32[ii + videoWidth] = alpha | (0x00 << 16) | (0x00 << 8) | 0x00; //black
            }

            //Lower right
            if ((Math.abs(1 - (lowerRightR / pixR)) < pctPartOf) && (Math.abs(1 - (lowerRightG / pixG)) < pctPartOf) && (Math.abs(1 - (lowerRightB / pixB)) > pctPartOf)) {
                //data_u32[ii + 1 + videoWidth] = alpha | (0xff << 16) | (0xff << 8) | 0xff; //white
            } else if ((lowerRightR / pixR > pctPartOf) && ((lowerRightG / pixG) > pctPartOf) && ((lowerRightB / pixB) > pctPartOf)) {
                //data_u32[ii + 1 + videoWidth] = alpha | (0xff << 16) | (0xff << 8) | 0xff; //white
            } else {
                //data_u32[ii + 1 + videoWidth] = alpha | (0x00 << 16) | (0x00 << 8) | 0x00; //black
            }
            //Testa lite grann(SLUT)
        }
    }

    ctxx.putImageData(imageData, 0, 0);
}

//Är en corner pixel inom ROI?
function cannyWithinROI(x, y) {
    let isWithin = false;
    let minX, minY, maxX, maxY;

    minX = options.roiX0;
    maxX = options.roiX0 + options.roiWidth;
    minY = options.roiY0;
    maxY = options.roiY0 + options.roiHeight;

    if ((x > minX) && (x < maxX) && (y > minY) && (y < maxY)) {
        isWithin = true;
    }

    return isWithin;
}
//Är en corner pixel inom ROI?(SLUT)

//Canny lines, ett måste(SLUT)

//Är en corner pixel inom ROI?
function withinROI(idx) {
    let isWithin = false;
    let minX, minY, maxX, maxY;

    minX = options.roiX0 + moveROIX;
    maxX = options.roiX0 + moveROIX + options.roiWidth;
    minY = options.roiY0 + moveROIY;
    maxY = options.roiY0 + moveROIY + options.roiHeight;

    if ((corners[idx].x > minX) && (corners[idx].x < maxX) && (corners[idx].y > minY) && (corners[idx].y < maxY)) {
        isWithin = true;
    }

    return isWithin;
}
//Är en corner pixel inom ROI?(SLUT)

//Inom vilken kvadrant i röda ROI'en ligger en FAST punkt?
function obtainRedQuadrant(i) {
    var quadrant = 4;

    //1st quadrant
    if ((corners[i].x > minLowThX) && (corners[i].x < parseInt(minLowThX + (maxLowThX - minLowThX) / 2)) && (corners[i].y > minLowThY) && (corners[i].y < parseInt(minLowThY + (maxLowThY - minLowThY) / 2))) {
        quadrant = 0;
    }

    //2nd quadrant
    if ((corners[i].x > (parseInt(minLowThX + (maxLowThX - minLowThX) / 2)) && (corners[i].x < maxLowThX) && (corners[i].y > minLowThY) && (corners[i].y < parseInt(minLowThY + (maxLowThY - minLowThY) / 2)))) {
        quadrant = 1;
    }

    //3rd quadrant
    if ((corners[i].x > minLowThX) && (corners[i].x < parseInt(minLowThX + (maxLowThX - minLowThX) / 2)) && (corners[i].y > parseInt(minLowThY + (maxLowThY - minLowThY) / 2)) && (corners[i].y < maxLowThY)) {
        quadrant = 2;
    }

    //3rd quadrant
    if ((corners[i].x > (parseInt(minLowThX + (maxLowThX - minLowThX) / 2)) && (corners[i].x < maxLowThX) && (corners[i].y > parseInt(minLowThY + (maxLowThY - minLowThY) / 2)) && (corners[i].y < maxLowThY))) {
        quadrant = 3;
    }

    return quadrant;
}
//Inom vilken kvadrant i röda ROI'en ligger en FAST punkt?(SLUT)

//Inom vilken kvadrant i gröna ROI'en ligger en FAST punkt?
function obtainGreenQuadrant(i) {
    var quadrant = 4;

    //1st quadrant
    if ((corners[i].x > minMidThX) && (corners[i].x < parseInt(minMidThX + (maxMidThX - minMidThX) / 2)) && (corners[i].y > minMidThY) && (corners[i].y < parseInt(minMidThY + (maxMidThY - minMidThY) / 2))) {
        quadrant = 0;
    }

    //2nd quadrant
    if ((corners[i].x > (parseInt(minMidThX + (maxMidThX - minMidThX) / 2)) && (corners[i].x < maxMidThX) && (corners[i].y > minMidThY) && (corners[i].y < parseInt(minMidThY + (maxMidThY - minMidThY) / 2)))) {
        quadrant = 1;
    }

    //3rd quadrant
    if ((corners[i].x > minMidThX) && (corners[i].x < parseInt(minMidThX + (maxMidThX - minMidThX) / 2)) && (corners[i].y > parseInt(minMidThY + (maxMidThY - minMidThY) / 2)) && (corners[i].y < maxMidThY)) {
        quadrant = 2;
    }

    //3rd quadrant
    if ((corners[i].x > (parseInt(minMidThX + (maxMidThX - minMidThX) / 2)) && (corners[i].x < maxMidThX) && (corners[i].y > parseInt(minMidThY + (maxMidThY - minMidThY) / 2)) && (corners[i].y < maxMidThY))) {
        quadrant = 3;
    }

    return quadrant;
}
//Inom vilken kvadrant i gröna ROI'en ligger en FAST punkt?(SLUT)

//Inom vilken kvadrant i blåa ROI'en ligger en FAST punkt?
function obtainBlueQuadrant(i) {
    var quadrant = 4;

    //1st quadrant
    if ((corners[i].x > minHiThX) && (corners[i].x < parseInt(minHiThX + (maxHiThX - minHiThX) / 2)) && (corners[i].y > minHiThY) && (corners[i].y < parseInt(minHiThY + (maxHiThY - minHiThY) / 2))) {
        quadrant = 0;
    }

    //2nd quadrant
    if ((corners[i].x > (parseInt(minHiThX + (maxHiThX - minHiThX) / 2)) && (corners[i].x < maxHiThX) && (corners[i].y > minHiThY) && (corners[i].y < parseInt(minHiThY + (maxHiThY - minHiThY) / 2)))) {
        quadrant = 1;
    }

    //3rd quadrant
    if ((corners[i].x > minHiThX) && (corners[i].x < parseInt(minHiThX + (maxHiThX - minHiThX) / 2)) && (corners[i].y > parseInt(minHiThY + (maxHiThY - minHiThY) / 2)) && (corners[i].y < maxHiThY)) {
        quadrant = 2;
    }

    //3rd quadrant
    if ((corners[i].x > (parseInt(minHiThX + (maxHiThX - minHiThX) / 2)) && (corners[i].x < maxHiThX) && (corners[i].y > parseInt(minHiThY + (maxHiThY - minHiThY) / 2)) && (corners[i].y < maxHiThY))) {
        quadrant = 3;
    }

    return quadrant;
}
//Inom vilken kvadrant i blåa ROI'en ligger en FAST punkt?(SLUT)

//FAST corners, liesom likeså, ett måste vill säge
function drawFastPoints(ctxVideo, ctxCanvas) {
    let imageData = ctxVideo.getImageData(0, 0, videoWidth, videoHeight);
    let imageDataCanvas = ctxCanvas.getImageData(0, 0, videoWidth, videoHeight);
    let img_u8 = new jsfeat.matrix_t(videoWidth, videoHeight, jsfeat.U8_t | jsfeat.C1_t);
    let threshold = 14;

    //Set FAST corners threshold
    jsfeat.fast_corners.set_threshold(threshold);

    //Den här ska vi möge té själve, vi har liesom en fan så möge bättre algo
    jsfeat.imgproc.grayscale(imageData.data, videoWidth, videoHeight, img_u8);

    //Här mögas då FAST punkterna té, corners fylls o vi erhåller count
    let countTot = jsfeat.fast_corners.detect(img_u8, corners, 5);
    //Variabler för antal FAST punkter i de olika fokusareorna
    let countHiTh = 0;
    let countMidTh = 0;
    let countLowTh = 0;

    //Variabler för antal FAST punkter i de olika fokusarerornas kvadranter
    let countLowThQ = [];
    let countMidThQ = [];
    let countHiThQ = [];

    //Initiera variabler för fokusareor
    sumTotalX = 0;
    sumTotalY = 0;
    sumLowThX = 0;
    sumLowThY = 0;
    sumMidThX = 0;
    sumMidThY = 0;
    sumHiThX = 0;
    sumHiThY = 0;
    maxTotalX = -999;
    minTotalX = 999;
    maxTotalY = -999;
    minTotalY = 999;
    maxLowThX = -999;
    minLowThX = 999;
    maxLowThY = -999;
    minLowThY = 999;
    maxMidThX = -999;
    minMidThX = 999;
    maxMidThY = -999;
    minMidThY = 999;
    maxHiThX = -999;
    minHiThX = 999;
    maxHiThY = -999;
    minHiThY = 999;
    //Initiera variabler för fokusareor(SLUT)

    //Initiera max, min corner score
    maxCornersScore = -999;
    minCornersScore = 999;
    //Initiera max, min corner score(SLUT)

    //Initiera variabler för fokusareors kvadranter, röd
    sumLowThXQ = [0, 0, 0, 0, 0];
    sumLowThYQ = [0, 0, 0, 0, 0];
    maxLowThXQ = [-999, -999, -999, -999, -999];
    minLowThXQ = [999, 999, 999, 999, 999];
    maxLowThYQ = [-999, -999, -999, -999, -999];
    minLowThYQ = [999, 999, 999, 999, 999];
    //Initiera variabler för fokusareors kvadranter, röd(SLUT)

    //Initiera variabler för fokusareors kvadranter, grön
    sumMidThXQ = [0, 0, 0, 0, 0];
    sumMidThYQ = [0, 0, 0, 0, 0];
    maxMidThXQ = [-999, -999, -999, -999, -999];
    minMidThXQ = [999, 999, 999, 999, 999];
    maxMidThYQ = [-999, -999, -999, -999, -999];
    minMidThYQ = [999, 999, 999, 999, 999];
    //Initiera variabler för fokusareors kvadranter, grön(SLUT)

    //Initiera variabler för fokusareors kvadranter, blå
    sumHiThXQ = [0, 0, 0, 0, 0];
    sumHiThYQ = [0, 0, 0, 0, 0];
    maxHiThXQ = [-999, -999, -999, -999, -999];
    minHiThXQ = [999, 999, 999, 999, 999];
    maxHiThYQ = [-999, -999, -999, -999, -999];
    minHiThYQ = [999, 999, 999, 999, 999];
    //Initiera variabler för fokusareors kvadranter, blå(SLUT)

    countLowThQ = [0, 0, 0, 0, 0];
    countMidThQ = [0, 0, 0, 0, 0];
    countHiThQ = [0, 0, 0, 0, 0];

    /*****************************************************/
    /************Själve fonktionaliteta börjer ***********/
    /*****************************************************/

    for (var i = 0; i < videoWidth * videoHeight; i++) {
        if (cornersStationary[i] > 0)
            cornersStationary[i]--;
    }

    //Fokusareor i bilden
    for (var i = 0; i < countTot; i++) {
        //Erhåll fokusareor
        if ((withinROI(i))) {
            sumTotalX += corners[i].x;
            sumTotalY += corners[i].y;
            maxTotalX = Math.max(maxTotalX, corners[i].x);
            maxTotalY = Math.max(maxTotalY, corners[i].y);
            minTotalX = Math.min(minTotalX, corners[i].x);
            minTotalY = Math.min(minTotalY, corners[i].y);
            maxCornersScore = Math.max(maxCornersScore, corners[i].score);
            minCornersScore = Math.min(minCornersScore, corners[i].score);
            if ((corners[i].score > 20) && (corners[i].score < 40)) {
                sumLowThX += corners[i].x;
                sumLowThY += corners[i].y;
                maxLowThX = Math.max(maxLowThX, corners[i].x);
                maxLowThY = Math.max(maxLowThY, corners[i].y);
                minLowThX = Math.min(minLowThX, corners[i].x);
                minLowThY = Math.min(minLowThY, corners[i].y);
                countLowTh++;

            } else if ((corners[i].score > 41) && (corners[i].score < 60)) {
                sumMidThX += corners[i].x;
                sumMidThY += corners[i].y;
                maxMidThX = Math.max(maxMidThX, corners[i].x);
                maxMidThY = Math.max(maxMidThY, corners[i].y);
                minMidThX = Math.min(minMidThX, corners[i].x);
                minMidThY = Math.min(minMidThY, corners[i].y);
                countMidTh++;
            } else if (corners[i].score > 61) {
                sumHiThX += corners[i].x;
                sumHiThY += corners[i].y;
                maxHiThX = Math.max(maxHiThX, corners[i].x);
                maxHiThY = Math.max(maxHiThY, corners[i].y);
                minHiThX = Math.min(minHiThX, corners[i].x);
                minHiThY = Math.min(minHiThY, corners[i].y);
                countHiTh++;
            }
        }
    }

    //Uppdatera allThZero för att kolla av om vi ska glo in dåliga
    //FAST punkter etc eller ej
    if (countHiTh == 0 && countMidTh == 0 && countLowTh == 0) {
        allThZero = true;
    } else {
        allThZero = false;
    }

    //Räkna ut geo. medelvärden för fokusareornas kvadranter
    for (var i = 0; i < countTot; i++) {
        //Erhåll fokusareor
        if ((withinROI(i))) {
            var quadrant;

            if ((corners[i].score > 20) && (corners[i].score < 40)) {
                quadrant = obtainRedQuadrant(i);
                sumLowThXQ[quadrant] += corners[i].x;
                sumLowThYQ[quadrant] += corners[i].y;
                maxLowThXQ[quadrant] = Math.max(maxLowThXQ[quadrant], corners[i].x);
                maxLowThYQ[quadrant] = Math.max(maxLowThYQ[quadrant], corners[i].y);
                minLowThXQ[quadrant] = Math.min(minLowThXQ[quadrant], corners[i].x);
                minLowThYQ[quadrant] = Math.min(minLowThYQ[quadrant], corners[i].y);
                countLowThQ[quadrant] += 1;

            } else if ((corners[i].score > 41) && (corners[i].score < 60)) {
                quadrant = obtainGreenQuadrant(i);
                sumMidThXQ[quadrant] += corners[i].x;
                sumMidThYQ[quadrant] += corners[i].y;
                maxMidThXQ[quadrant] = Math.max(maxMidThXQ[quadrant], corners[i].x);
                maxMidThYQ[quadrant] = Math.max(maxMidThYQ[quadrant], corners[i].y);
                minMidThXQ[quadrant] = Math.min(minMidThXQ[quadrant], corners[i].x);
                minMidThYQ[quadrant] = Math.min(minMidThYQ[quadrant], corners[i].y);
                countMidThQ[quadrant] += 1;
            } else if (corners[i].score > 61) {
                quadrant = obtainBlueQuadrant(i);
                sumHiThXQ[quadrant] += corners[i].x;
                sumHiThYQ[quadrant] += corners[i].y;
                maxHiThXQ[quadrant] = Math.max(maxHiThXQ[quadrant], corners[i].x);
                maxHiThYQ[quadrant] = Math.max(maxHiThYQ[quadrant], corners[i].y);
                minHiThXQ[quadrant] = Math.min(minHiThXQ[quadrant], corners[i].x);
                minHiThYQ[quadrant] = Math.min(minHiThYQ[quadrant], corners[i].y);
                countHiThQ[quadrant] += 1;
            }
        }
    }
    //Räkna ut geo. medelvärden för fokusareornas kvadranter(SLUT)

    // render result back to canvas
    let data_u32 = new Uint32Array(imageDataCanvas.data.buffer);

    //render_corners(corners, countTot, data_u32, videoWidth);

    render_corners2(corners, cornersStationary, countTot, countHiTh, countMidTh, countLowTh, data_u32, videoWidth);

    ctxCanvas.putImageData(imageDataCanvas, 0, 0);

    //Ett område, 3 x 3 px stort, fylls med stationaryCornerHitVal
    //i cornersStationaryarrayen för varje FAST punkt i corners
    //senare sorteras punkter efter FAST score
    for (var i = 0; i < countTot; i++) {
        let x = corners[i].x;
        let y = corners[i].y;
        let off = (x + y * videoWidth);
        cornersStationary[off] = stationaryCornerHitVal;
        cornersStationary[off - 1] = stationaryCornerHitVal;
        cornersStationary[off + 1] = stationaryCornerHitVal;
        cornersStationary[off - videoWidth] = stationaryCornerHitVal;
        cornersStationary[off - videoWidth - 1] = stationaryCornerHitVal;
        cornersStationary[off - videoWidth + 1] = stationaryCornerHitVal;
        cornersStationary[off + videoWidth] = stationaryCornerHitVal;
        cornersStationary[off + videoWidth - 1] = stationaryCornerHitVal;
        cornersStationary[off + videoWidth + 1] = stationaryCornerHitVal;
    }

    //Här ridas då infon ud
    if (countTot > 2) {
        sumTotalX /= countTot;
        sumTotalY /= countTot;
    }
    if (countLowTh > 2) {
        sumLowThX /= countLowTh;
        sumLowThY /= countLowTh;

        //Räkna ut centrum för geometriska medelvärden i kvadranterna
        for (var i = 0; i < 4; i++) {
            sumLowThXQ[i] /= countLowThQ[i];
            sumLowThYQ[i] /= countLowThQ[i];
        }

        // Red rectangle
        ctxCanvas.beginPath();
        ctxCanvas.lineWidth = "2";
        ctxCanvas.strokeStyle = "red";
        ctxCanvas.rect(minLowThX, minLowThY, (maxLowThX - minLowThX), (maxLowThY - minLowThY));
        ctxCanvas.stroke();
        //Röda rektangelns centerlijer
        ctxCanvas.beginPath();
        ctxCanvas.moveTo((minLowThX + (maxLowThX - minLowThX) / 2), minLowThY);
        ctxCanvas.lineTo((minLowThX + (maxLowThX - minLowThX) / 2), maxLowThY);
        ctxCanvas.stroke();
        ctxCanvas.beginPath();
        ctxCanvas.moveTo(minLowThX, (minLowThY + (maxLowThY - minLowThY) / 2));
        ctxCanvas.lineTo(maxLowThX, (minLowThY + (maxLowThY - minLowThY) / 2));
        ctxCanvas.stroke();
        //Röda rektangelns centerlijer(SLUT)
        ctxCanvas.beginPath();
        ctxCanvas.arc(sumLowThX, sumLowThY, 8, 0, 2 * Math.PI);
        ctxCanvas.stroke();
        ctxCanvas.beginPath();
        ctxCanvas.strokeStyle = "#FFAAAA"
        ctxCanvas.arc(sumLowThXPrev, sumLowThYPrev, 8, 0, 2 * Math.PI);
        ctxCanvas.stroke();
    }
    if (countMidTh > 2) {
        sumMidThX /= countMidTh;
        sumMidThY /= countMidTh;

        //Räkna ut centrum för geometriska medelvärden i kvadranterna
        for (var i = 0; i < 4; i++) {
            sumMidThXQ[i] /= countMidThQ[i];
            sumMidThYQ[i] /= countMidThQ[i];
        }

        // Green rectangle
        ctxCanvas.beginPath();
        ctxCanvas.strokeStyle = "limegreen";
        ctxCanvas.rect(minMidThX, minMidThY, (maxMidThX - minMidThX), (maxMidThY - minMidThY));
        ctxCanvas.stroke();
        //Gröna rektangelns centerlijer
        ctxCanvas.beginPath();
        ctxCanvas.moveTo((minMidThX + (maxMidThX - minMidThX) / 2), minMidThY);
        ctxCanvas.lineTo((minMidThX + (maxMidThX - minMidThX) / 2), maxMidThY);
        ctxCanvas.stroke();
        ctxCanvas.beginPath();
        ctxCanvas.moveTo(minMidThX, (minMidThY + (maxMidThY - minMidThY) / 2));
        ctxCanvas.lineTo(maxLowThX, (minMidThY + (maxMidThY - minMidThY) / 2));
        ctxCanvas.stroke();
        //Gröna rektangelns centerlijer(SLUT)
        ctxCanvas.beginPath();
        ctxCanvas.arc(sumMidThX, sumMidThY, 8, 0, 2 * Math.PI);
        ctxCanvas.stroke();
        ctxCanvas.beginPath();
        ctxCanvas.strokeStyle = "#AAFFAA"
        ctxCanvas.arc(sumMidThXPrev, sumMidThYPrev, 8, 0, 2 * Math.PI);
        ctxCanvas.stroke();
    }
    if (countHiTh > 2) {
        sumHiThX /= countHiTh;
        sumHiThY /= countHiTh;

        //Räkna ut centrum för geometriska medelvärden i kvadranterna
        for (var i = 0; i < 4; i++) {
            sumHiThXQ[i] /= countHiThQ[i];
            sumHiThYQ[i] /= countHiThQ[i];
        }

        // Blue rectangle
        ctxCanvas.beginPath();
        ctxCanvas.strokeStyle = "blue";
        ctxCanvas.rect(minHiThX, minHiThY, (maxHiThX - minHiThX), (maxHiThY - minHiThY));
        ctxCanvas.stroke();
        //Blåa rektangelns centerlijer
        ctxCanvas.beginPath();
        ctxCanvas.moveTo((minHiThX + (maxHiThX - minHiThX) / 2), minHiThY);
        ctxCanvas.lineTo((minHiThX + (maxHiThX - minHiThX) / 2), maxHiThY);
        ctxCanvas.stroke();
        ctxCanvas.beginPath();
        ctxCanvas.moveTo(minHiThX, (minHiThY + (maxHiThY - minHiThY) / 2));
        ctxCanvas.lineTo(maxHiThX, (minHiThY + (maxHiThY - minHiThY) / 2));
        ctxCanvas.stroke();
        //Blåa rektangelns centerlijer(SLUT)
        ctxCanvas.beginPath();
        ctxCanvas.arc(sumHiThX, sumHiThY, 8, 0, 2 * Math.PI);
        ctxCanvas.stroke();
        ctxCanvas.beginPath();
        ctxCanvas.strokeStyle = "#AAAAFF"
        ctxCanvas.arc(sumHiThXPrev, sumHiThYPrev, 8, 0, 2 * Math.PI);
        ctxCanvas.stroke();
    }
    //ROI rectangle
    ctxCanvas.beginPath();
    ctxCanvas.lineWidth = "1";
    ctxCanvas.strokeStyle = "white";
    ctxCanvas.rect(options.roiX0 + moveROIX, options.roiY0 + moveROIY, options.roiWidth, options.roiHeight);
    ctxCanvas.stroke();

    //I det fall vi har dålig bildkvalité, d v s inga FAST punkter pga
    //ur fokus, mörkt, väldigt ljust, grått, utsmeta, vadsomhelst
    //då visar vi lila rektangel kring canny linjerna, om sådana finnes
    if (countCannyROI > 2) {
        sumCannyX /= countCannyROI;
        sumCannyY /= countCannyROI;
        // Purple rectangle
        ctxCanvas.beginPath();
        ctxCanvas.strokeStyle = "fuchsia";
        ctxCanvas.rect(minCannyX, minCannyY, (maxCannyX - minCannyX), (maxCannyY - minCannyY));
        ctxCanvas.stroke();
        //Lila rektangelns centerlijer
        ctxCanvas.beginPath();
        ctxCanvas.moveTo((minCannyX + (maxCannyX - minCannyX) / 2), minCannyY);
        ctxCanvas.lineTo((minCannyX + (maxCannyX - minCannyX) / 2), maxCannyY);
        ctxCanvas.stroke();
        ctxCanvas.beginPath();
        ctxCanvas.moveTo(minCannyX, (minCannyY + (maxCannyY - minCannyY) / 2));
        ctxCanvas.lineTo(maxCannyX, (minCannyY + (maxCannyY - minCannyY) / 2));
        ctxCanvas.stroke();
        //Blåa rektangelns centerlijer(SLUT)
        ctxCanvas.beginPath();
        ctxCanvas.arc(sumCannyX, sumCannyY, 8, 0, 2 * Math.PI);
        ctxCanvas.stroke();
        ctxCanvas.beginPath();
    }
    //I det fall vi har dålig bildkvalité, d v s inga FAST punkter pga(SLUT)
    //ur fokus, mörkt, väldigt ljust, grått, utsmeta, vadsomhelst(SLUT)
    //då visar vi lila rektangel kring canny linjerna, om sådana finnes(SLUT)

    //Update frame geometry variables
    sumLowThXPrev = sumLowThX;
    sumLowThYPrev = sumLowThY;
    sumMidThXPrev = sumMidThX;
    sumMidThYPrev = sumMidThY;
    sumHiThXPrev = sumHiThX;
    sumHiThYPrev = sumHiThY;
    minLowThXPrev = minLowThX;
    maxLowThYPrev = maxLowThX;
    minLowThYPrev = minLowThY;
    maxLowThYPrev = maxLowThY;
    maxMidThXPrev = maxMidThX;
    //Update frame geometry variables(SLUT)

    //Update frame quadrant geometry variables
    for (var i = 0; i < 4; i++) {
        sumLowThXQPrev[i] = sumLowThXQ[i];
        sumLowThYQPrev[i] = sumLowThYQ[i];
    }
    //Update frame quadrant geometry variables(SLUT)

    //Update frame quadrant geometry variables
    for (var i = 0; i < 4; i++) {
        sumMidThXQPrev[i] = sumMidThXQ[i];
        sumMidThYQPrev[i] = sumMidThYQ[i];
    }
    //Update frame quadrant geometry variables(SLUT)

    //Update frame quadrant geometry variables
    for (var i = 0; i < 4; i++) {
        sumHiThXQPrev[i] = sumHiThXQ[i];
        sumHiThYQPrev[i] = sumHiThYQ[i];
    }
    //Update frame quadrant geometry variables(SLUT)

    /*
    //Nu jävlar i min lilla låda, liesom rörendes ROI
    sumROIX = (sumHiThX + sumMidThX + sumLowThX) / 3;
    sumROIXPrev = (sumHiThXPrev + sumMidThXPrev + sumLowThXPrev) / 3;
    sumROIY = (sumHiThY + sumMidThY + sumLowThY) / 3;
    sumROIYPrev = (sumHiThYPrev + sumMidThYPrev + sumLowThYPrev) / 3;

    if ((countHiTh != 0) && (countMidTh != 0) && (countLowTh != 0)) {
        moveROIX = sumROIX - 320;
        if ((options.roiX0 + moveROIX < 10) || (options.roiX0 + moveROIX > 560)) {
            moveROIX = 0;
        }

        moveROIY = sumROIY - 240;
        if ((options.roiY0 + moveROIY < 10) || (options.roiY0 + moveROIY > 420)) {
            moveROIY = 0;
        }

        sumROIXPrev = sumROIX;
        sumROIYPrev = sumROIY;
    }

    if ((countHiTh = 0) && (countMidTh = 0) && (countLowTh = 0)) {
        countZeroFrames++;
    }

    //Om vi fastnar i ett område utan FAST stannar vi ju kvar om vi
    //inte räknar o nollställer efter x frames utan någeting
    if (countZeroFrames > 2) {
        moveROIX = 0;
        moveROIY = 0;
    }
    //Nu jävlar i min lilla låda, liesom rörendes ROI(SLUT)
    */

    //Kolla av vad som skerkod
    let nåtSkit = document.getElementById("count");

    nåtSkit.innerHTML = "FAST point count, tot: " + countTot;
    nåtSkit.innerHTML += "<br>FAST point count, unused: " + (countTot - countHiTh - countMidTh - countLowTh);
    nåtSkit.innerHTML += "<br>FAST point count, hi th: " + countHiTh;
    nåtSkit.innerHTML += "<br>FAST point count, mid th: " + countMidTh;
    nåtSkit.innerHTML += "<br>FAST point count, low th: " + countLowTh;
}

function render_corners(corners, count, img, step) {
    let pix = (0xff << 24) | (0x00 << 16) | (0xff << 8) | 0x00;
    for (let i = 0; i < count; ++i) {
        let x = corners[i].x;
        let y = corners[i].y;
        let off = (x + y * step);
        img[off] = pix;
        img[off - 1] = pix;
        img[off + 1] = pix;
        img[off - step] = pix;
        img[off + step] = pix;
    }
}

function render_corners2(corners, cornersStationary, count, countHiTh, countMidTh, countLowTh, img, step) {
    var pix = (0xff << 24) | (0x32 << 16) | (0xCD << 8) | 0x32; //limegreen, ABGR
    var redPix = (0xff << 24) | (0x00 << 16) | (0x00 << 8) | 0xff; //red, ABGR
    var pinkPix = (0xff << 24) | (0x99 << 16) | (0x99 << 8) | 0xff; //pink, ABGR
    var purplePix = (0xff << 24) | (0xff << 16) | (0x00 << 8) | 0xff; //purple, ABGR

    for (var i = 0; i < count; ++i) {
        var x = corners[i].x;
        var y = corners[i].y;
        var off = (x + y * step);
        if ((countHiTh == 0) && (countMidTh == 0) && (countLowTh == 0)) {
            img[off] = purplePix;
            img[off - 3] = purplePix;
            img[off - 2] = purplePix;
            img[off - 1] = purplePix;
            img[off + 1] = purplePix;
            img[off + 2] = purplePix;
            img[off + 3] = purplePix;
            img[off - 3 * step] = purplePix;
            img[off - 2 * step] = purplePix;
            img[off - step] = purplePix;
            img[off + step] = purplePix;
            img[off + 2 * step] = purplePix;
            img[off + 3 * step] = purplePix;
        } else if ((cornersStationary[off] > minValForStationary) && corners[i].score > minCornerScoreForStationary) {
            img[off] = redPix;
            img[off - 1] = redPix;
            img[off + 1] = redPix;
            img[off - step] = redPix;
            img[off + step] = redPix;
        } else if (cornersStationary[off] > minValForStationary) {
            img[off] = pinkPix;
            img[off - 1] = pinkPix;
            img[off + 1] = pinkPix;
            img[off - step] = pinkPix;
            img[off + step] = pinkPix;
        } else {
            img[off] = pix;
            img[off - 1] = pix;
            img[off + 1] = pix;
            img[off - step] = pix;
            img[off + step] = pix;
        }
    }
}
//FAST corners, liesom likeså, ett måste vill säge(SlUT)

//Digitalisere färgerne, d v s modulo lidda grann
function digitizeColour(imageObj) {
    let canvas = document.getElementById('videoCanvas');
    let context = canvas.getContext('2d');
    let x = imageObj.width;
    let y = imageObj.height;

    context.drawImage(imageObj, 0, 0, videoWidth, videoHeight);

    let imageData = context.getImageData(0, 0, videoWidth, videoHeight);
    for (let i = 0; i < data.length; i += 4) {
        let range = 30;

        // red
        data[i] = Math.floor(data[i] / (range)) * range;
        // green
        data[i + 1] = Math.floor(data[i + 1] / (range)) * range;
        // blue
        data[i + 2] = Math.floor(data[i + 2] / (range)) * range;;
    }

    // overwrite original image
    context.putImageData(imageData, 0, 0);
}
//Digitalisere färgerne, d v s modulo lidda grann(SLUT)

//Extrahera dominerande färg
function extractMajorColour(context) {
    let imageData = context.getImageData(0, 0, videoWidth, videoHeight);
    for (let i = 0; i < imageData.data.length; i += 4) {
        let range = 100;
        let pctDiff = 4;
        let minForWhite = 230;
        let maxForBlack = 25;

        // red
        if (((imageData.data[i] < minForWhite) && (imageData.data[i + 1] < minForWhite) && (imageData.data[i + 2] < minForWhite)) || (imageData.data[i] < maxForBlack) || (imageData.data[i + 1] < maxForBlack) || (imageData.data[i + 3])) {
            if (((imageData.data[i] / imageData.data[i + 1]) > pctDiff) && ((imageData.data[i] / imageData.data[i + 2]) > pctDiff)) {
                imageData.data[i] = Math.ceil(imageData.data[i] / range) * range;
                imageData.data[i + 1] = 0;
                imageData.data[i + 2] = 0;
            } else if (((imageData.data[i + 1] / imageData.data[i]) > pctDiff) && ((imageData.data[i + 1] / imageData.data[i + 2]) > pctDiff)) {
                // green
                imageData.data[i + 1] = Math.ceil(imageData.data[i + 1] / range) * range;
                imageData.data[i] = 0;
                imageData.data[i + 2] = 0;
            } else if (((imageData.data[i + 2] / imageData.data[i]) > pctDiff) && ((imageData.data[i + 2] / imageData.data[i + 1]) > pctDiff)) {
                // blue
                imageData.data[i + 2] = Math.ceil(imageData.data[i + 2] / range) * range;
                imageData.data[i] = 0;
                imageData.data[i + 1] = 0;
            }
        } else {
            imageData.data[i] = Math.floor(imageData.data[i] / range) * range;
            imageData.data[i + 1] = Math.floor(imageData.data[i + 1] / range) * range;
            imageData.data[i + 2] = Math.floor(imageData.data[i + 2] / range) * range;
            imageData.data[i + 3] = imageData.data[i + 3]
        }
    }

    // overwrite original image
    context.putImageData(imageData, 0, 0);
}
//Extrahera dominerande färg(SLUT)

//En demoapp måste man ju ha, liesom, hallå...
function demo_app() {
    options = new demo_opt();
    gui = new dat.GUI();

    gui.add(options, 'roiWidth', 1, 639).step(1);
    gui.add(options, 'roiHeight', 1, 479).step(1);
    gui.add(options, 'roiX0', 1, 639).step(1);
    gui.add(options, 'roiY0', 1, 479).step(1);
    gui.add(options, 'minCornerScoreForStationary', 5, 100).step(1);
}
//En demoapp måste man ju ha, liesom, hallå...(SLUT)