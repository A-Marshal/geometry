function reOrderZs() {
    document.getElementById("webcam").style.zIndex = "-1";
    //Change z-index to be on top
    document.getElementById("imageView").style.zIndex = "2";
    document.getElementById("imageTemp").style.zIndex = "3";
}