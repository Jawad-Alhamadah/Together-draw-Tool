
function setPixel(imageData, x, y, r, g, b, a) {
    index = (x + y * imageData.width) * 4;
    imageData.data[index+0] = r;
    imageData.data[index+1] = g;
    imageData.data[index+2] = b;
    imageData.data[index+3] = a;
}

function getPixel(imageData, x, y) {
    index = (x + y * imageData.width) * 4;
  return[imageData.data[index+0] ,imageData.data[index+1],imageData.data[index+2],imageData.data[index+3]]
}

function rgbaToText(colorRGBA){
return "rgba("+colorRGBA[0]+','+colorRGBA[1]+','+colorRGBA[2]+','+colorRGBA[3]+')'

}
function hexToRGB(hex, alpha) {
  var r = parseInt(hex.slice(1, 3), 16),
      g = parseInt(hex.slice(3, 5), 16),
      b = parseInt(hex.slice(5, 7), 16);

  if (alpha) {
      return  [r,g,b,alpha]
  } else {
      return "rgb(" + r + ", " + g + ", " + b + ")";
  }
}

function rgbaToHex (rgba) {
  var inParts = rgba.substring(rgba.indexOf("(")).split(","),
      r = parseInt(trim(inParts[0].substring(1)), 10),
      g = parseInt(trim(inParts[1]), 10),
      b = parseInt(trim(inParts[2]), 10),
      a = parseFloat(trim(inParts[3].substring(0, inParts[3].length - 1))).toFixed(2);
  var outParts = [
    r.toString(16),
    g.toString(16),
    b.toString(16),
    Math.round(a * 255).toString(16).substring(0, 2)
  ];

  // Pad single-digit output values
  outParts.forEach(function (part, i) {
    if (part.length === 1) {
      outParts[i] = '0' + part;
    }
  })

  return ('#' + outParts.join(''));
}

if (process.argv.length >= 3) {
  console.log(rgbaToHex(process.argv[2]));
} else {
 
}


module.exports={getPixel,rgbaToText,hexToRGB,setPixel,rgbaToHex}

