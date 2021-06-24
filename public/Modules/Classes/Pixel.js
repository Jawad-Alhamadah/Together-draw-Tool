const {GetBoolIndex} = require("../PixelMath.js");
var $ = require("jquery");
class Pixel {
    constructor(x, y, width) {
        this.x = x
        this.y = y
        this.leftIndex = GetBoolIndex(x - 1, y, width)
        this.bottomLeftIndex = GetBoolIndex(x - 1, y + 1, width)
        this.topIndex = GetBoolIndex(x, y - 1, width)
        this.topRightIndex = GetBoolIndex(x + 1, y - 1, width)
        this.topLeftIndex = GetBoolIndex(x - 1, y - 1, width)
        this.bottomIndex = GetBoolIndex(x, y + 1, width)
        this.bottomRightIndex = GetBoolIndex(x + 1, y + 1, width)
        this.rightIndex = GetBoolIndex(x + 1, y, width)

    }
    isLeftPointProcessed = (isPixelCheckedList) => isPixelCheckedList[this.leftIndex]
    isBottomLeftPointProcessed = (isPixelCheckedList) => isPixelCheckedList[this.bottomLeftIndex]
    isTopPointProcessed = (isPixelCheckedList) => isPixelCheckedList[this.topIndex]
    isTopRightPointProcessed = (isPixelCheckedList) => isPixelCheckedList[this.topRightIndex]
    isTopLeftPointProcessed = (isPixelCheckedList) => isPixelCheckedList[this.topLeftIndex]
    isBottomPointProcessed = (isPixelCheckedList) => isPixelCheckedList[this.bottomIndex]
    isBottomRightPointProcessed = (isPixelCheckedList) => isPixelCheckedList[this.bottomRightIndex]
    isRightPointProcessed = (isPixelCheckedList) => isPixelCheckedList[this.rightIndex]
}
module.exports = {
    Pixel
}