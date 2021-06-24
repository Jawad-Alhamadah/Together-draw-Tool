var {Tool}= require("./Tool")
var $ = require("jquery");
const {hexToRGB} = require("../PixelFunctions.js")
class Eraser extends Tool {
  constructor(iconSrc, iconDivId, isActive, cursorIcon) {
    super(iconSrc, iconDivId, isActive, cursorIcon)
  }
  activationSetUp(DrawingEnviroment) {
    var white = hexToRGB("#ffffff", 255)
    DrawingEnviroment.savedColor = DrawingEnviroment.color
    DrawingEnviroment.setBrushColor(white)
    $("#ColorInput").value = DrawingEnviroment.savedColor
    $("#Image_2").attr("src", this.cursorIcon)
    $("#toolsDiv ").children().css("opacity", "100%")
    $("#" + this.iconDivId).css("opacity", "30%")
  }
}
module.exports = {
  Eraser
}