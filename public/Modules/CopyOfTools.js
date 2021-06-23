let Queue = require("./Queue.js");
const {GetBoolIndex} = require("./PixelMath.js");
const {setPixel,getColorOfPixel} = require("./PixelFunctions.js")
const {Pixel} =require ("./Pixel.js")
 
  
class Tools {
    constructor() {
        this.isBrushActive = true;
        this.isEraserActive = false;
        this.isColorPickerActive = false;
        this.isBucketActive = false;
    
          }
    activateBrushTool() {
        isBrushToolActive = true;
        isEraserToolActive = false;
        isColorPickerToolActive = false;
        isBucketToolActive = false;
    }
    activateEraserTool() {
        isBrushToolActive = false;
        isEraserToolActive = true;
        isColorPickerToolActive = false;
        isBucketToolActive = false;
    }
    activateColorPickerTool() {
        isBrushToolActive = false;
        isEraserToolActive = false;
        isColorPickerToolActive = true;
        isBucketToolActive = false;
    }
    activateBucketTool() {
        isBrushToolActive = false;
        isEraserToolActive = false;
        isColorPickerToolActive = false;
        isBucketToolActive = true;
    }
     useBucketTool(BucketColor,socket,isNamePicked,DrawingEnviroment,ctx) {
         //Setup variables for eaiser to read If statments.
         var mouse = DrawingEnviroment.mouse
         var width=DrawingEnviroment.canvWidth
         var height=DrawingEnviroment.canvHeight
         var isInsideWidth = mouse.x < width && mouse.x>0
         var isInsideHeight = mouse.y < height && mouse.y>0
         var isInsideDrawingArea= isInsideWidth && isInsideHeight
         if (isInsideDrawingArea && isNamePicked) {
            var tempColor = ctx.getImageData(mouse.x - mouse.CorrectionX, mouse.y - mouse.CorrectionY, 1, 1).data;
            this.FillAreaAndEmitToOtherUsers(mouse, tempColor, BucketColor, socket,ctx);
         }
     }

     FillAreaAndEmitToOtherUsers(mouse, tempColor, BucketColor, socket,ctx) {
        this.CreatePath({
             x: mouse.x - mouse.CorrectionX,
             y: mouse.y - mouse.CorrectionY,
             color: tempColor
         }, ctx, BucketColor);
         socket.emit('fill', {
             x: mouse.x - mouse.CorrectionX,
             y: mouse.y - mouse.CorrectionY,
             color: tempColor,
             hostColor: BucketColor
         });
     }
      CreatePath(startingPoint, ctx, color) {
        var imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height)
        this.bucketFillArea({
          x: startingPoint.x,
          y: startingPoint.y,
          color: startingPoint.color
        }, ctx, color,imageData)
      }
       bucketFillArea(firstpoint, ctx, color,imageData) {
        var isPixelCheckedList = []
        var pointsQueue = new Queue();
        var backGroundColor = firstpoint.color;
        var pixel, r, g, b, a
        var width=ctx.canvas.width
        var firstPointIndex=GetBoolIndex(firstpoint.x, firstpoint.y, width)
        
        r = color[0];
        g = color[1]
        b = color[2]
        a = color[3]
        
        isPixelCheckedList[firstPointIndex] = true;
       // console.log(PIXEL)
        pointsQueue.enqueue({x:firstpoint.x,y:firstpoint.y,color:firstpoint.color})
        setPixel(imageData, firstpoint.x, firstpoint.y, r, g, b, a)
        backGroundColor = "rgba(" + backGroundColor[0] + ',' + backGroundColor[1] + ',' + backGroundColor[2] + ',' + backGroundColor[3] + ')';
        while (pointsQueue.getLength() > 0) {

          pixel = pointsQueue.dequeue();
          var x = pixel.x
          var y = pixel.y
          setPixel(imageData, x, y, r, g, b, a)
          //var color = color
          var leftIndex = GetBoolIndex(x - 1, y, width)
          var bottomLeftIndex = GetBoolIndex(x - 1, y + 1, width)
          var topIndex = GetBoolIndex(x, y - 1, width)
          var topRightIndex = GetBoolIndex(x + 1, y - 1, width)
          var topLeftIndex = GetBoolIndex(x - 1, y - 1, width)
          var bottomIndex = GetBoolIndex(x, y + 1, width)
          var bottomRightIndex = GetBoolIndex(x + 1, y + 1, width)
          var rightIndex = GetBoolIndex(x + 1, y, width)
          var isLeftPointProcessed = isPixelCheckedList[leftIndex]
          var isBottomLeftPointProcessed = isPixelCheckedList[bottomLeftIndex]
          var isTopPointProcessed = isPixelCheckedList[topIndex]
          var isTopRightPointProcessed = isPixelCheckedList[topRightIndex]
          var isTopLeftPointProcessed = isPixelCheckedList[topLeftIndex]
          var isBottomPointProcessed = isPixelCheckedList[bottomIndex]
          var isBottomRightPointProcessed = isPixelCheckedList[bottomRightIndex]
          var isRightPointProcessed = isPixelCheckedList[rightIndex]

          if (!isLeftPointProcessed) {
            var leftColor = getColorOfPixel(imageData, x - 1, y)
            if (backGroundColor === leftColor) {
                isPixelCheckedList[leftIndex] = true;
                pointsQueue.enqueue({x :x - 1, y :y, color: backGroundColor})
              }
          }
     
          if (!isBottomLeftPointProcessed) {
            var bottomLeftColor = getColorOfPixel(imageData, x - 1, y + 1)
            if (backGroundColor === bottomLeftColor ) {
                isPixelCheckedList[bottomLeftIndex] = true;
                pointsQueue.enqueue({x :x - 1, y :y+1, color: backGroundColor})
            }
          }
           
          if (!isTopPointProcessed) {
            var topColor = getColorOfPixel(imageData, x, y - 1)
            if (backGroundColor === topColor ) {
                isPixelCheckedList[topIndex] = true;
                pointsQueue.enqueue({x :x, y :y-1, color: backGroundColor})
              }
          }
     
          if (!isTopRightPointProcessed) {
            var topRightColor = getColorOfPixel(imageData, x + 1, y - 1)
            if (backGroundColor === topRightColor ) {
                isPixelCheckedList[topRightIndex] = true;
                pointsQueue.enqueue({x :x +1, y :y-1, color: backGroundColor})
              }
          }
     
          if (!isTopLeftPointProcessed) {
            var topLeftColor = getColorOfPixel(imageData, x - 1, y - 1)
            if (backGroundColor === topLeftColor ) {
                isPixelCheckedList[topLeftIndex] = true;
                pointsQueue.enqueue({x :x - 1, y :y-1, color: backGroundColor})
              }
          }
     
          if (!isBottomPointProcessed) {
            var bottomColor = getColorOfPixel(imageData, x, y + 1)
            if (backGroundColor === bottomColor ) {
                isPixelCheckedList[bottomIndex] = true;
                pointsQueue.enqueue({x :x , y :y+1, color: backGroundColor})
                }
          }
     
          if (!isBottomRightPointProcessed) {
            var bottomRightColor = getColorOfPixel(imageData, x + 1, y + 1)
            if (backGroundColor === bottomRightColor ) {
                isPixelCheckedList[bottomRightIndex] = true;
                pointsQueue.enqueue({x :x + 1, y :y+1, color: backGroundColor})
              }
          }
     
          if (!isRightPointProcessed) {
            var rightColor = getColorOfPixel(imageData, x + 1, y)
            if (backGroundColor === rightColor ) {
                isPixelCheckedList[rightIndex] = true;
                pointsQueue.enqueue({x :x +1, y :y, color: backGroundColor})
            }
          }
        }
        ctx.putImageData(imageData, 0, 0);
      }
    }
  module.exports = {
    Tools
  }