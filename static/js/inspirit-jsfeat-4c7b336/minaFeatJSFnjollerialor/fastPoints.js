$(window).load(function () {
    "use strict";
var stat = new profiler();

var gui, options, ctx, canvasWidth, canvasHeight;
var img_u8, corners, threshold;

var demo_opt = function () {
    this.threshold = 20;
}

function demo_app(videoWidth, videoHeight) {
    canvasWidth = canvas.width;
    canvasHeight = canvas.height;
    ctx = canvas.getContext('2d');

    ctx.fillStyle = "rgb(0,255,0)";
    ctx.strokeStyle = "rgb(0,255,0)";

    img_u8 = new jsfeat.matrix_t(640, 480, jsfeat.U8_t | jsfeat.C1_t);

    corners = [];
    var i = 640 * 480;
    while (--i >= 0) {
        corners[i] = new jsfeat.keypoint_t(0, 0, 0, 0);
    }

    threshold = 20;

    jsfeat.fast_corners.set_threshold(threshold);

    options = new demo_opt();
    gui = new dat.GUI();

    gui.add(options, 'threshold', 5, 100).step(1);

    stat.add("grayscale");
    stat.add("fast corners");
}

function tick() {
    compatibility.requestAnimationFrame(tick);
    stat.new_frame();
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
        ctx.drawImage(video, 0, 0, 640, 480);
        var imageData = ctx.getImageData(0, 0, 640, 480);

        stat.start("grayscale");
        jsfeat.imgproc.grayscale(imageData.data, 640, 480, img_u8);
        stat.stop("grayscale");

        if (threshold != options.threshold) {
            threshold = options.threshold | 0;
            jsfeat.fast_corners.set_threshold(threshold);
        }

        stat.start("fast corners");
        var count = jsfeat.fast_corners.detect(img_u8, corners, 5);
        stat.stop("fast corners");

        // render result back to canvas
        var data_u32 = new Uint32Array(imageData.data.buffer);
        render_corners(corners, count, data_u32, 640);

        ctx.putImageData(imageData, 0, 0);

        $('#log').html(stat.log());
    }
}

function render_corners(corners, count, img, step) {
    var pix = (0xff << 24) | (0x00 << 16) | (0xff << 8) | 0x00;
    for (var i = 0; i < count; ++i) {
        var x = corners[i].x;
        var y = corners[i].y;
        var off = (x + y * step);
        img[off] = pix;
        img[off - 1] = pix;
        img[off + 1] = pix;
        img[off - step] = pix;
        img[off + step] = pix;
    }
}

$(window).unload(function () {
    video.pause();
    video.src = null;
});
});