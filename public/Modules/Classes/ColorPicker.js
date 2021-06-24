var $ = require("jquery")
var {Tool}= require("./Tool")
class ColorPicker extends Tool {
  constructor(iconSrc, iconDivId, isActive, cursorIcon) {
    super(iconSrc, iconDivId, isActive, cursorIcon)

  }
}
module.exports = {
  ColorPicker
}