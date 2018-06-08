export function getBase64Image(imgUrl, callback) {
  var img = new Image();

  // onload fires when the image is fully loadded, and has width and height

  img.onload = function() {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    var dataURL = canvas.toDataURL("image/png"),
      dataURL = dataURL.replace(/^data:image\/(png|jpg);base64,/, "");

    callback(dataURL); // the base64 string
  };

  // set attributes and src
  img.setAttribute("crossOrigin", "anonymous"); //
  img.src = imgUrl;
}
