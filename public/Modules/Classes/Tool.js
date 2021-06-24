var $ = require("jquery");

class Tool {
  constructor(iconSrc, iconDivId, isActive, cursorIcon) {
    this.isActive = isActive
    this.iconSrc = iconSrc
    this.iconDivId = iconDivId
    this.cursorIcon = cursorIcon
    this.setIcon()
  }
  activationSetUp(DrawingEnviroment) {
    DrawingEnviroment.setBrushColor(DrawingEnviroment.savedColor)
    $("#ColorInput").value = DrawingEnviroment.savedColor
    $("#Image_2").attr("src", this.cursorIcon)
    $("#toolsDiv").children().css("opacity", "100%")
    $("#" + this.iconDivId).css("opacity", "30%")
  }
  setIcon = () => $("#" + this.iconDivId).css("background-image", `url(${this.iconSrc})`)
}
module.exports = {
  Tool
}