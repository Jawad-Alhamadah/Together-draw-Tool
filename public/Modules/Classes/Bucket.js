let Queue = require("../Queue.js")
const {setPixel,getColorOfPixel} = require("../PixelFunctions.js")
const {Pixel} = require ("./Pixel.js")
var {Tool}= require("./Tool")

class Bucket extends Tool{
  constructor(iconSrc,iconDivId,isActive,cursorIcon) {
  super(iconSrc,iconDivId,isActive,cursorIcon)

  }
  useBucket(fillColor, socket, isNamePicked, mouse,width,height, ctx) {
    var isInsideWidth = mouse.x < width && mouse.x > 0
    var isInsideHeight = mouse.y < height && mouse.y > 0
    var isInsideDrawingArea = isInsideWidth && isInsideHeight
    if (isInsideDrawingArea && isNamePicked) {
      var tempColor = ctx.getImageData(mouse.x - mouse.CorrectionX, mouse.y - mouse.CorrectionY, 1, 1).data
      this.FillAreaAndEmitToOtherUsers(mouse, tempColor, fillColor, socket, ctx)
    }
  }

FillAreaAndEmitToOtherUsers(mouse, tempColor, fillColor, socket, ctx) {
  this.FillArea({
    x: mouse.x - mouse.CorrectionX,
    y: mouse.y - mouse.CorrectionY,
    color: tempColor
  }, ctx, fillColor)
  socket.emit('fill', {
    x: mouse.x - mouse.CorrectionX,
    y: mouse.y - mouse.CorrectionY,
    color: tempColor,
    hostColor: fillColor
  })
}

 FillArea(firstpoint, ctx, fillColor) {
   var imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height)
   var isPixelProcessedList = []
   var pointsQueue = new Queue()
   var backGroundColor = firstpoint.color
   var pixel
   var r
   var g
   var b
   var a
   var width = ctx.canvas.width
   r = fillColor[0]
   g = fillColor[1]
   b = fillColor[2]
   a = fillColor[3]
   backGroundColor = `rgba(${backGroundColor[0]},${backGroundColor[1]},${backGroundColor[2]},${backGroundColor[3]})`
   pointsQueue.enqueue(new Pixel(firstpoint.x, firstpoint.y, width))
   while (pointsQueue.getLength() > 0) {
     pixel = pointsQueue.dequeue(isPixelProcessedList)
     setPixel(imageData, pixel.x, pixel.y, r, g, b, a)  
    
     if (!pixel.isLeftPointProcessed(isPixelProcessedList)) {
      var leftPixelColor = getColorOfPixel(imageData, pixel.x - 1, pixel.y)
      if (backGroundColor === leftPixelColor) {
        isPixelProcessedList[pixel.leftIndex] = true
        pointsQueue.enqueue(new Pixel(pixel.x - 1, pixel.y, width))
      }
    }
     if (!pixel.isBottomLeftPointProcessed(isPixelProcessedList)) {
       var bottomLeftPixelColor = getColorOfPixel(imageData, pixel.x - 1, pixel.y + 1)
       if (backGroundColor === bottomLeftPixelColor) {
         isPixelProcessedList[pixel.bottomLeftIndex] = true
         pointsQueue.enqueue(new Pixel(pixel.x - 1, pixel.y + 1, width))
       }
     }
     if (!pixel.isTopPointProcessed(isPixelProcessedList)) {
       var topPixelColor = getColorOfPixel(imageData, pixel.x, pixel.y - 1)
       if (backGroundColor === topPixelColor) {
         isPixelProcessedList[pixel.topIndex] = true
         pointsQueue.enqueue(new Pixel(pixel.x, pixel.y - 1, width))
       }
     }
     if (!pixel.isTopRightPointProcessed(isPixelProcessedList)) {
       var topRightPixelColor = getColorOfPixel(imageData, pixel.x + 1, pixel.y - 1)
       if (backGroundColor === topRightPixelColor) {
         isPixelProcessedList[pixel.topRightIndex] = true
         pointsQueue.enqueue(new Pixel(pixel.x + 1, pixel.y - 1, width))
       }
     }
     if (!pixel.isTopLeftPointProcessed(isPixelProcessedList)) {
       var topLeftPixelColor = getColorOfPixel(imageData, pixel.x - 1, pixel.y - 1)
       if (backGroundColor === topLeftPixelColor) {
         isPixelProcessedList[pixel.topLeftIndex] = true
         pointsQueue.enqueue(new Pixel(pixel.x - 1, pixel.y - 1, width))
       }
     }
     if (!pixel.isBottomPointProcessed(isPixelProcessedList)) {
       var bottomPixelColor = getColorOfPixel(imageData, pixel.x, pixel.y + 1)
       if (backGroundColor === bottomPixelColor) {
         isPixelProcessedList[pixel.bottomIndex] = true
         pointsQueue.enqueue(new Pixel(pixel.x, pixel.y + 1, width))
       }
     }
     if (!pixel.isBottomRightPointProcessed(isPixelProcessedList)) {
       var bottomRightPixelColor = getColorOfPixel(imageData, pixel.x + 1, pixel.y + 1)
       if (backGroundColor === bottomRightPixelColor) {
         isPixelProcessedList[pixel.bottomRightIndex] = true
         pointsQueue.enqueue(new Pixel(pixel.x + 1, pixel.y + 1, width))
       }
     }

     if (!pixel.isRightPointProcessed(isPixelProcessedList)) {
       var rightPixelColor = getColorOfPixel(imageData, pixel.x + 1, pixel.y)
       if (backGroundColor === rightPixelColor ) {
           isPixelProcessedList[pixel.rightIndex] = true
           pointsQueue.enqueue(new Pixel(pixel.x + 1, pixel.y,width))
       }
     }
   }
   ctx.putImageData(imageData, 0, 0)
 }

}
module.exports = {
  Bucket
}