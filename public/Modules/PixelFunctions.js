function setPixel(imageData, x, y, r, g, b, a) {
  index = (x + y * imageData.width) * 4
  imageData.data[index + 0] = r
  imageData.data[index + 1] = g
  imageData.data[index + 2] = b
  imageData.data[index + 3] = a
}

function getPixel(imageData, x, y) {
  index = (x + y * imageData.width) * 4
  return [imageData.data[index + 0], imageData.data[index + 1], imageData.data[index + 2], imageData.data[index + 3]]
}

function rgbaToText(colorRGBA) {
  return "rgba(" + colorRGBA[0] + ',' + colorRGBA[1] + ',' + colorRGBA[2] + ',' + colorRGBA[3] + ')'

}

function hexToRGB(hex, alpha) {
  var r = parseInt(hex.slice(1, 3), 16),
    g = parseInt(hex.slice(3, 5), 16),
    b = parseInt(hex.slice(5, 7), 16)

  if (alpha) {
    return [r, g, b, alpha]
  } else {
    return "rgb(" + r + ", " + g + ", " + b + ")"
  }
}

function getColorOfPixel(imageData, x, y) {
  var rgba = getPixel(imageData, x, y)
  return `rgba(${rgba[0]},${rgba[1]},${rgba[2]},${rgba[3]})`
}

function RGBToHex(rgba) {
  var r, g, b, a;

  r = rgba[0]
  g = rgba[1]
  b = rgba[2]
  a = rgba[3]
  r = r.toString(16);
  g = g.toString(16);
  b = b.toString(16);
  a = Math.round(a * 255).toString(16);

  if (r.length == 1)
    r = "0" + r;
  if (g.length == 1)
    g = "0" + g;
  if (b.length == 1)
    b = "0" + b;
  if (a.length == 1)
    a = "0" + a;

  return "#" + r + g + b;
}


module.exports = {
  getPixel,
  rgbaToText,
  hexToRGB,
  setPixel,
  RGBToHex,
  getColorOfPixel
}