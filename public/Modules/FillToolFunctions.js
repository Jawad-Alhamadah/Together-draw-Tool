 let Queue = require("./Queue.js");

 const {
   GetBoolIndex
 } = require("./PixelMath.js");
 const {
   getPixel,
   setPixel,
   rgbaToText
 } = require("./PixelFunctions.js")

 function CreatePath(startingPoint, ctx, points, color) {
   var backGroundColor = startingPoint.color;
   var startPoint = startingPoint;
   var currentPoint = startingPoint;
   imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height)
   splitFillBool({
     x: startPoint.x,
     y: startingPoint.y,
     color: backGroundColor
   }, points, ctx, color)
 }

 function splitFillBool(firstpoint, points, ctx, color) {

   var bottomPointsBool = []
   var i = 0;
   var bottomPoints = new Queue();
   bottomPoints.enqueue({
     x: firstpoint.x,
     y: firstpoint.y,
     color: firstpoint.color
   })
   bottomPointsBool[GetBoolIndex(firstpoint.x, firstpoint.y, ctx.canvas.width)] = true;
   setPixel(imageData, firstpoint.x, firstpoint.y, color[0], color[1], color[2], color[3])
   var bgColor = firstpoint.color;
   var backGroundColor = firstpoint.color;
   bgColor = "rgba(" + backGroundColor[0] + ',' + backGroundColor[1] + ',' + backGroundColor[2] + ',' + backGroundColor[3] + ')';
   var topBool = true;
   var bottomBool = true;
   var leftBool = true;
   var rightBool = true;
   var topLeftBool = true;
   var bottomLeftBool = true;
   var bottomRightBool = true;
   var topRightBool = true;
   var tlData,
     topLeft,
     lData,
     left,
     blData,
     bottomLeft,
     bData,
     bottom,
     brData,
     bottomRight,
     rData,
     right,
     trData,
     topRight,
     tData,
     pixel, r, g, b, a
   top;
   r = color[0];
   g = color[1]
   b = color[2]
   a = color[3]
   i = 0
   console.time("time");
   while (bottomPoints.getLength() > 0) {
     topBool = false;
     bottomBool = false;
     leftBool = false;
     rightBool = false;
     topLeftBool = false;
     bottomLeftBool = false;
     bottomRightBool = false;
     topRightBool = false;

     pixel = bottomPoints.dequeue();

     setPixel(imageData, pixel.x, pixel.y, r, g, b, a)
     // FillImage[i]={x:pixel.x,y:pixel.y};
     i++;
     if (!bottomPointsBool[GetBoolIndex(pixel.x - 1, pixel.y, ctx.canvas.width)]) {
       lData = getPixel(imageData, pixel.x - 1, pixel.y)
       left = 'rgba(' +
         lData[0] + ',' +
         lData[1] + ',' +
         lData[2] + ',' +
         lData[3] + ')';
       leftBool = true;
     }


     if (!bottomPointsBool[GetBoolIndex(pixel.x - 1, pixel.y + 1, ctx.canvas.width)]) {
       blData = getPixel(imageData, pixel.x - 1, pixel.y + 1)
       bottomLeft = 'rgba(' +
         blData[0] + ',' +
         blData[1] + ',' +
         blData[2] + ',' +
         blData[3] + ')';
       bottomLeftBool = true;
     }

     if (!bottomPointsBool[GetBoolIndex(pixel.x, pixel.y - 1, ctx.canvas.width)]) {
       tData = getPixel(imageData, pixel.x, pixel.y - 1)
       top = 'rgba(' +
         tData[0] + ',' +
         tData[1] + ',' +
         tData[2] + ',' +
         tData[3] + ')';
       topBool = true;
     }

     if (!bottomPointsBool[GetBoolIndex(pixel.x + 1, pixel.y - 1, ctx.canvas.width)]) {
       trData = getPixel(imageData, pixel.x + 1, pixel.y - 1)
       topRight = 'rgba(' +
         trData[0] + ',' +
         trData[1] + ',' +
         trData[2] + ',' +
         trData[3] + ')';
       topRightBool = true;
     }

     if (!bottomPointsBool[GetBoolIndex(pixel.x - 1, pixel.y - 1, ctx.canvas.width)]) {
       tlData = getPixel(imageData, pixel.x - 1, pixel.y - 1)
       topLeft = 'rgba(' +
         tlData[0] + ',' +
         tlData[1] + ',' +
         tlData[2] + ',' +
         tlData[3] + ')';
       topLeftBool = true;
     }

     if (!bottomPointsBool[GetBoolIndex(pixel.x, pixel.y + 1, ctx.canvas.width)]) {
       bData = getPixel(imageData, pixel.x, pixel.y + 1)
       bottom = 'rgba(' +
         bData[0] + ',' +
         bData[1] + ',' +
         bData[2] + ',' +
         bData[3] + ')';
       bottomBool = true;
     }

     if (!bottomPointsBool[GetBoolIndex(pixel.x + 1, pixel.y + 1, ctx.canvas.width)]) {
       brData = getPixel(imageData, pixel.x + 1, pixel.y + 1)
       bottomRight = 'rgba(' +
         brData[0] + ',' +
         brData[1] + ',' +
         brData[2] + ',' +
         brData[3] + ')';
       bottomRightBool = true;
     }

     if (!bottomPointsBool[GetBoolIndex(pixel.x + 1, pixel.y, ctx.canvas.width)]) {
       rData = getPixel(imageData, pixel.x + 1, pixel.y)
       right = 'rgba(' +
         rData[0] + ',' +
         rData[1] + ',' +
         rData[2] + ',' +
         rData[3] + ')';
       rightBool = true;
     }

     if (bgColor === topLeft && topLeftBool === true) {
       bottomPointsBool[GetBoolIndex(pixel.x - 1, pixel.y - 1, ctx.canvas.width)] = true;
       bottomPoints.enqueue({
         x: pixel.x - 1,
         y: pixel.y - 1,
         color: bgColor
       })
     }
     if (bgColor === bottomRight && bottomRightBool === true) {
       bottomPointsBool[GetBoolIndex(pixel.x - 1, pixel.y - 1, ctx.canvas.width)] = true;
       bottomPoints.enqueue({
         x: pixel.x + 1,
         y: pixel.y + 1,
         color: bgColor
       })
     }
     if (bgColor === bottomLeft && bottomLeftBool === true) {
       bottomPointsBool[GetBoolIndex(pixel.x - 1, pixel.y + 1, ctx.canvas.width)] = true;
       bottomPoints.enqueue({
         x: pixel.x - 1,
         y: pixel.y + 1,
         color: bgColor
       })
     }
     if (bgColor === topRight && topRightBool === true) {
       bottomPointsBool[GetBoolIndex(pixel.x + 1, pixel.y - 1, ctx.canvas.width)] = true;
       bottomPoints.enqueue({
         x: pixel.x + 1,
         y: pixel.y - 1,
         color: bgColor
       })
     }
     if (bgColor === bottom && bottomBool === true) {
       bottomPointsBool[GetBoolIndex(pixel.x, pixel.y + 1, ctx.canvas.width)] = true;
       bottomPoints.enqueue({
         x: pixel.x,
         y: pixel.y + 1,
         color: bgColor
       })
     }
     if (bgColor === left && leftBool === true) {
       bottomPointsBool[GetBoolIndex(pixel.x - 1, pixel.y, ctx.canvas.width)] = true;
       bottomPoints.enqueue({
         x: pixel.x - 1,
         y: pixel.y,
         color: bgColor
       })
     }
     if (bgColor === right && rightBool === true) {
       bottomPointsBool[GetBoolIndex(pixel.x + 1, pixel.y, ctx.canvas.width)] = true;
       bottomPoints.enqueue({
         x: pixel.x + 1,
         y: pixel.y,
         color: bgColor
       })
     }
     if (bgColor === top && topBool === true) {
       bottomPointsBool[GetBoolIndex(pixel.x, pixel.y - 1, ctx.canvas.width)] = true;
       bottomPoints.enqueue({
         x: pixel.x,
         y: pixel.y - 1,
         color: bgColor
       })
     }
   }
   console.timeEnd('time')
   ctx.putImageData(imageData, 0, 0);

 }

 module.exports = {
   splitFillBool,
   CreatePath
 }