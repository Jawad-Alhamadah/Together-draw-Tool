var {Tool}= require("./Tool")
var $ = require("jquery");
const {hexToRGB} = require("../PixelFunctions.js")
class Eraser extends Tool{
  constructor(iconSrc,iconDivId,isActive) {
    super(iconSrc,iconDivId,isActive)
  }
  activationSetUp(event,DrawingEnviroment){
    var white=hexToRGB("#ffffff", 255)
    DrawingEnviroment.savedColor=DrawingEnviroment.color
    DrawingEnviroment.setBrushColor(white)
    $("#Image_2").attr("src", this.cursorIcon)
    $("#toolsDiv ").children().css("opacity", "100%")
    $(event.target).css("opacity", "30%")
  }
}
module.exports = {
  Eraser
}