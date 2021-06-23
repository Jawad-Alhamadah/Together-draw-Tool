let Queue = require("../Queue.js")
const {GetBoolIndex} = require("../PixelMath.js")
const {setPixel,getColorOfPixel} = require("../PixelFunctions.js")
const {Pixel} = require ("./Pixel.js")
var {Tool}= require("./Tool")

class Bucket extends Tool{
  constructor(iconSrc,iconDivId,isActive) {
  super(iconSrc,iconDivId,isActive)

  }
  useBucket(fillColor,socket,isNamePicked,DrawingEnviroment,ctx) {
    //Setup variables for eaiser to read If statments.
    var mouse = DrawingEnviroment.mouse
    var width=DrawingEnviroment.canvWidth
    var height=DrawingEnviroment.canvHeight
    var isInsideWidth = mouse.x < width && mouse.x>0
    var isInsideHeight = mouse.y < height && mouse.y>0
    var isInsideDrawingArea= isInsideWidth && isInsideHeight
    if (isInsideDrawingArea && isNamePicked) {
       var tempColor = ctx.getImageData(mouse.x - mouse.CorrectionX, mouse.y - mouse.CorrectionY, 1, 1).data
       this.FillAreaAndEmitToOtherUsers(mouse, tempColor, fillColor, socket,ctx)
    }
}

FillAreaAndEmitToOtherUsers(mouse, tempColor, fillColor, socket,ctx) {
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
 CreatePath(startingPoint, ctx, fillColor) {
   
   this.FillArea({
     x: startingPoint.x,
     y: startingPoint.y,
     color: startingPoint.color
   }, ctx, fillColor,imageData)
 }
 FillArea(firstpoint, ctx, fillColor) {
   var imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height)
   var isPixelCheckedList = []
   var pointsQueue = new Queue()
   var backGroundColor = firstpoint.color
   var pixel
   var r
   var g
   var b
   var a
   var width=ctx.canvas.width
   r = fillColor[0]
   g = fillColor[1]
   b = fillColor[2]
   a = fillColor[3]
   backGroundColor = `rgba(${backGroundColor[0]},${backGroundColor[1]},${backGroundColor[2]},${backGroundColor[3]})`
   pointsQueue.enqueue(new Pixel(firstpoint.x,firstpoint.y,width))
   
   while (pointsQueue.getLength() > 0) {
     pixel = pointsQueue.dequeue(isPixelCheckedList)
     setPixel(imageData, pixel.x, pixel.y, r, g, b, a)  
     if (!pixel.isLeftPointProcessed(isPixelCheckedList)) {
       var leftColor = getColorOfPixel(imageData, pixel.x - 1, pixel.y)
       if (backGroundColor === leftColor) {
           isPixelCheckedList[pixel.leftIndex] = true
           pointsQueue.enqueue(new Pixel(pixel.x - 1, pixel.y,width))
         }
     }
     if (!pixel.isBottomLeftPointProcessed(isPixelCheckedList)) {
       var bottomLeftColor = getColorOfPixel(imageData, pixel.x - 1, pixel.y + 1)
       if (backGroundColor === bottomLeftColor ) {
           isPixelCheckedList[pixel.bottomLeftIndex] = true
           pointsQueue.enqueue(new Pixel(pixel.x - 1, pixel.y + 1,width))
       }
     }  
     if (!pixel.isTopPointProcessed(isPixelCheckedList)) {
       var topColor = getColorOfPixel(imageData, pixel.x, pixel.y - 1)
       if (backGroundColor === topColor ) {
           isPixelCheckedList[pixel.topIndex] = true
           pointsQueue.enqueue(new Pixel(pixel.x, pixel.y - 1,width))
         }
     }
     if (!pixel.isTopRightPointProcessed(isPixelCheckedList)) {
       var topRightColor = getColorOfPixel(imageData, pixel.x + 1, pixel.y - 1)
       if (backGroundColor === topRightColor ) {
           isPixelCheckedList[pixel.topRightIndex] = true
           pointsQueue.enqueue(new Pixel(pixel.x + 1, pixel.y - 1,width))
         }
     }
     if (!pixel.isTopLeftPointProcessed(isPixelCheckedList)) {
       var topLeftColor = getColorOfPixel(imageData, pixel.x - 1, pixel.y - 1)
       if (backGroundColor === topLeftColor ) {
           isPixelCheckedList[pixel.topLeftIndex] = true
           pointsQueue.enqueue(new Pixel(pixel.x - 1, pixel.y - 1,width))
         }
     }
     if (!pixel.isBottomPointProcessed(isPixelCheckedList)) {
       var bottomColor = getColorOfPixel(imageData, pixel.x, pixel.y + 1)
       if (backGroundColor === bottomColor ) {
           isPixelCheckedList[pixel.bottomIndex] = true
           pointsQueue.enqueue(new Pixel(pixel.x, pixel.y + 1,width))
           }
     }
     if (!pixel.isBottomRightPointProcessed(isPixelCheckedList)) {
       var bottomRightColor = getColorOfPixel(imageData, pixel.x + 1, pixel.y + 1)
       if (backGroundColor === bottomRightColor ) {
           isPixelCheckedList[pixel.bottomRightIndex] = true
           pointsQueue.enqueue(new Pixel(pixel.x + 1,pixel.y + 1,width))
         }
     }

     if (!pixel.isRightPointProcessed(isPixelCheckedList)) {
       var rightColor = getColorOfPixel(imageData, pixel.x + 1, pixel.y)
       if (backGroundColor === rightColor ) {
           isPixelCheckedList[pixel.rightIndex] = true
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