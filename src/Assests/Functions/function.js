/**
 * @param {File} image - Image File Object
 * @param {Object} pixelCrop - pixelCrop Object provided by react-image-crop
 */
export default function getCroppedImg(image, pixelCrop) {
  const canvas = document.createElement("canvas");
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  const ctx = canvas.getContext("2d");
  var newImage = new Image();
  newImage.onload = function() {
    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );
  };
  console.log(newImage.src);
  return newImage.src;
}
