var $ = require("jquery");

class Tool {
  constructor(iconSrc,iconDivId,isActive,cursorIcon) {
    this.isActive = isActive
    this.iconSrc=iconSrc
    this.iconDivId=iconDivId
    this.cursorIcon=cursorIcon
    this.setIcon()
  }
  activationSetUp(event,DrawingEnviroment){
    DrawingEnviroment.setBrushColor(DrawingEnviroment.savedColor)
    $("#Image_2").attr("src", this.cursorIcon)
    $("#toolsDiv ").children().css("opacity", "100%")
    $(event.target).css("opacity", "30%")
  }
    
  setIcon = ()=>$("#"+this.iconDivId).css("background-image", `url(${this.iconSrc})`)
}
module.exports = {
    Tool
}