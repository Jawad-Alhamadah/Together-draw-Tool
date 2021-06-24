var {Tool} = require("./Tool")
var $ = require("jquery");
class Brush extends Tool {
  constructor(iconSrc, iconDivId, isActive, cursorIcon) {
    super(iconSrc, iconDivId, isActive, cursorIcon)
  }


}
module.exports = {
  Brush
}