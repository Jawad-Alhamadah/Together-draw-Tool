 
let Queue = require("./Queue.js"); 

const {GetBoolIndex}=require("./PixelMath.js");
const {getPixel,setPixel, rgbaToText}=require("./PixelFunctions.js")
function CreatePath(startingPoint,ctx,points,color){
//console.log("background Color"+startingPoint.color)
    var backGroundColor=startingPoint.color;
    var startPoint=startingPoint;
    var currentPoint=startingPoint;
    imageData=ctx.getImageData(0, 0, ctx.canvas.width ,ctx.canvas.height)
   // var buf = new ArrayBuffer(imageData.data.length);
    
    splitFillBool({x:startPoint.x,y:startingPoint.y,color:backGroundColor},points,ctx,color)
   // JustFill(startPoint.x,startPoint.y,ctx,backGroundColor,color)
   //FillAlgorithm(startPoint.x,startPoint.y,color,backGroundColor,ctx)
   // console.log(startPoint.x,startPoint.y)
  }

 /*
  function FillAlgorithm(x,y,color,color,backGroundColor,ctx){
    //var array=[]; 
     // var temp=rgbaToText(color);
   console.time("fuck");
     var Q=new Queue();
    console.log("userColor: ",color[3]);
    console.log("background color",backGroundColor[3])
    Q.enqueue({x:x,y:y,color:color});
    //var CurrentPixel={x:x,y:y};
    var CurrentPixel;
    while(Q.getLength()>0){
      CurrentPixel=Q.dequeue();
      setPixel(imageData,CurrentPixel.x,CurrentPixel.y,CurrentPixel.color[0],CurrentPixel.color[1],CurrentPixel.color[2],CurrentPixel.color[3])
      var FrontPixel={x:CurrentPixel.x+1,y:CurrentPixel.y,rgba:getPixel(imageData,CurrentPixel.x+1,CurrentPixel.y)};
      var BackPixel={x:CurrentPixel.x-1,y:CurrentPixel.y,rgba:getPixel(imageData,CurrentPixel.x-1,CurrentPixel.y)};
      //setPixel(imageData,CurrentPixel.x,CurrentPixel.y,CurrentPixel.color[0],CurrentPixel.color[1],CurrentPixel.color[2],CurrentPixel.color[3])
      while( 
             (FrontPixel.rgba[0]===backGroundColor[0]) && 
             (FrontPixel.rgba[1]===backGroundColor[1]) &&
             (FrontPixel.rgba[2]===backGroundColor[2]) && 
             (FrontPixel.rgba[3]===backGroundColor[3]) && FrontPixel.x>0 && FrontPixel.x<ctx.canvas.width)
            {
              var topPixel={x:FrontPixel.x,y:FrontPixel.y-1,rgba:getPixel(imageData,FrontPixel.x,FrontPixel.y-1)}
              var audjacentPixelRight={x:topPixel.x+1,y:topPixel.y,rgba:getPixel(imageData,topPixel.x+1,topPixel.y)}
              var audjacentPixelLeft={x:topPixel.x-1,y:topPixel.y,rgba:getPixel(imageData,topPixel.x-1,topPixel.y)}
              ////
              var BottomPixel={x:FrontPixel.x,y:FrontPixel.y+1,rgba:getPixel(imageData,FrontPixel.x,FrontPixel.y+1)}
              var audjacentPixelRightBottom={x:BottomPixel.x+1,y:BottomPixel.y,rgba:getPixel(imageData,BottomPixel.x+1,topPixel.y)}
              var audjacentPixelLeftBottom={x:BottomPixel.x-1,y:BottomPixel.y,rgba:getPixel(imageData,BottomPixel.x-1,topPixel.y)}
              setPixel(imageData,FrontPixel.x,FrontPixel.y,color[0],color[1],color[2],color[3])
              //ctx.fillRect(FrontPixel.x,FrontPixel.y,1,1)
              FrontPixel={x:FrontPixel.x+1,y:FrontPixel.y,rgba:getPixel(imageData,FrontPixel.x+1,FrontPixel.y)}
              if(!(topPixel.rgba[0]===backGroundColor[0] && topPixel.rgba[1]===backGroundColor[1] && topPixel.rgba[2]===backGroundColor[2] && topPixel.rgba[3]===backGroundColor[3] && topPixel.y>0 && topPixel.y<ctx.canvas.height))
                {
                 // var audjacentPixel={x:topPixel.x+1,y:topPixel.y,rgba:getPixel(imageData,topPixel.x+1,topPixel.y)}
                  if(audjacentPixelRight.rgba[0]===backGroundColor[0] &&
                    audjacentPixelRight.rgba[1]===backGroundColor[1] &&
                    audjacentPixelRight.rgba[2]===backGroundColor[2] && 
                    audjacentPixelRight.rgba[3]===backGroundColor[3] ){Q.enqueue({x:audjacentPixelRight.x,y:audjacentPixelRight.y,color});  }
                      if(audjacentPixelLeft.rgba[0]===backGroundColor[0] &&
                        audjacentPixelLeft.rgba[1]===backGroundColor[1] &&
                        audjacentPixelLeft.rgba[2]===backGroundColor[2] && 
                        audjacentPixelLeft.rgba[3]===backGroundColor[3] ){Q.enqueue({x:audjacentPixelLeft.x,y:audjacentPixelLeft.y,color});  }
                  
                }
                 if(!(audjacentPixelRight.rgba[0]===backGroundColor[0] && audjacentPixelRight.rgba[1]===backGroundColor[1] && audjacentPixelRight.rgba[2]===backGroundColor[2] && audjacentPixelRight.rgba[3]===backGroundColor[3] && audjacentPixelRight.y>0 && audjacentPixelRight.y<ctx.canvas.height))
                {
                  var tempTop=getPixel(imageData,audjacentPixelRight.x,audjacentPixelRight.y-1);
                  var tempRight=getPixel(imageData,audjacentPixelRight.x+1,audjacentPixelRight.y);
                  if(!(tempTop[0]===backGroundColor[0] && tempTop[1]===backGroundColor[1] && tempTop[2]===backGroundColor[2] && tempTop[3]===backGroundColor[3] && audjacentPixelRight.y-1>0 && audjacentPixelRight.y-1<ctx.canvas.height))Q.enqueue({x:audjacentPixelRight.x,y:audjacentPixelRight.y-1,color});
                  if(!(tempRight[0]===backGroundColor[0] && tempRight[1]===backGroundColor[1] && tempRight[2]===backGroundColor[2] && tempRight[3]===backGroundColor[3] && audjacentPixelRight.y>0 && audjacentPixelRight.y<ctx.canvas.height))Q.enqueue({x:audjacentPixelRight.x+1,y:audjacentPixelRight.y,color});

                }
                 if(!(audjacentPixelLeft.rgba[0]===backGroundColor[0] && audjacentPixelLeft.rgba[1]===backGroundColor[1] && audjacentPixelLeft.rgba[2]===backGroundColor[2] && audjacentPixelLeft.rgba[3]===backGroundColor[3] && audjacentPixelLeft.y>0 && audjacentPixelLeft.y<ctx.canvas.height))
                {
                  if(audjacentPixelRight.rgba[0]===backGroundColor[0] &&
                    audjacentPixelRight.rgba[1]===backGroundColor[1] &&
                    audjacentPixelRight.rgba[2]===backGroundColor[2] && 
                    audjacentPixelRight.rgba[3]===backGroundColor[3] ){Q.enqueue({x:audjacentPixelRight.x,y:audjacentPixelRight.y,color});  }

                }


            }

            //////////////

            while( 
              (BackPixel.rgba[0]===backGroundColor[0]) && 
              (BackPixel.rgba[1]===backGroundColor[1]) &&
              (BackPixel.rgba[2]===backGroundColor[2]) && 
              (BackPixel.rgba[3]===backGroundColor[3]) && BackPixel.x>0 && BackPixel.x<ctx.canvas.width)
             {
               var topPixel={x:BackPixel.x,y:BackPixel.y+1,rgba:getPixel(imageData,BackPixel.x,BackPixel.y-1)}
               var audjacentPixelRight={x:topPixel.x+1,y:topPixel.y,rgba:getPixel(imageData,topPixel.x+1,topPixel.y)}
               var audjacentPixelLeft={x:topPixel.x-1,y:topPixel.y,rgba:getPixel(imageData,topPixel.x-1,topPixel.y)}
               setPixel(imageData,BackPixel.x,BackPixel.y,color[0],color[1],color[2],color[3])
              // ctx.fillRect(BackPixel.x,BackPixel.y,1,1)
               BackPixel={x:BackPixel.x-1,y:BackPixel.y,rgba:getPixel(imageData,BackPixel.x-1,BackPixel.y)}
               if(!(topPixel.rgba[0]===backGroundColor[0] && topPixel.rgba[1]===backGroundColor[1] && topPixel.rgba[2]===backGroundColor[2] && topPixel.rgba[3]===backGroundColor[3] && topPixel.y>0 && topPixel.y<ctx.canvas.height))
                 {
                  if(audjacentPixelRight.rgba[0]===backGroundColor[0] &&
                    audjacentPixelRight.rgba[1]===backGroundColor[1] &&
                    audjacentPixelRight.rgba[2]===backGroundColor[2] && 
                    audjacentPixelRight.rgba[3]===backGroundColor[3] ){Q.enqueue({x:audjacentPixelRight.x,y:audjacentPixelRight.y,color});  }
                      if(audjacentPixelLeft.rgba[0]===backGroundColor[0] &&
                        audjacentPixelLeft.rgba[1]===backGroundColor[1] &&
                        audjacentPixelLeft.rgba[2]===backGroundColor[2] && 
                        audjacentPixelLeft.rgba[3]===backGroundColor[3] ){Q.enqueue({x:audjacentPixelLeft.x,y:audjacentPixelLeft.y,color});  }
                   
                 }
                 else if(!(audjacentPixelRight.rgba[0]===backGroundColor[0] && audjacentPixelRight.rgba[1]===backGroundColor[1] && audjacentPixelRight.rgba[2]===backGroundColor[2] && audjacentPixelRight.rgba[3]===backGroundColor[3] && audjacentPixelRight.y>0 && audjacentPixelRight.y<ctx.canvas.height))
                {
                  if(audjacentPixelLeft.rgba[0]===backGroundColor[0] &&
                    audjacentPixelLeft.rgba[1]===backGroundColor[1] &&
                    audjacentPixelLeft.rgba[2]===backGroundColor[2] && 
                    audjacentPixelLeft.rgba[3]===backGroundColor[3] ){Q.enqueue({x:audjacentPixelLeft.x,y:audjacentPixelLeft.y,color});  }

                }
                else if(!(audjacentPixelLeft.rgba[0]===backGroundColor[0] && audjacentPixelLeft.rgba[1]===backGroundColor[1] && audjacentPixelLeft.rgba[2]===backGroundColor[2] && audjacentPixelLeft.rgba[3]===backGroundColor[3] && audjacentPixelLeft.y>0 && audjacentPixelLeft.y<ctx.canvas.height))
                {
                  if(audjacentPixelRight.rgba[0]===backGroundColor[0] &&
                    audjacentPixelRight.rgba[1]===backGroundColor[1] &&
                    audjacentPixelRight.rgba[2]===backGroundColor[2] && 
                    audjacentPixelRight.rgba[3]===backGroundColor[3] ){Q.enqueue({x:audjacentPixelRight.x,y:audjacentPixelRight.y,color});  }

                }
             }
          //  var BackPixel=getPixel(imageData,CurrentPixel.x-1,CurrentPixel.y);
     // if(tempPixel[0]===)
    }
    ctx.putImageData(imageData,0,0);
    //console.log("userColor: ",color);
    //console.log("background color",backGroundColor)
    //while(array.length>0){
    // }
    console.timeEnd("fuck");
  }

  */
  function splitFillBool(firstpoint,points,ctx,color)
  {
    
    //var pointsBool=[];
    var bottomPointsBool =[]
    var i=0;
    var bottomPoints =new Queue();
    //points.push({x:firstpoint.x,y:firstpoint.y,color:firstpoint.color})
    bottomPoints.enqueue({x:firstpoint.x,y:firstpoint.y,color:firstpoint.color})
    //pointsBool[GetBoolIndex(firstpoint.x,firstpoint.y,ctx.canvas.width)]=true;
    bottomPointsBool[GetBoolIndex(firstpoint.x,firstpoint.y,ctx.canvas.width)]=true;
      setPixel(imageData,firstpoint.x,firstpoint.y,color[0],color[1],color[2],color[3])
    
  
    var bgColor=firstpoint.color;
    var backGroundColor=firstpoint.color;
    bgColor="rgba("+backGroundColor[0]+','+backGroundColor[1]+','+backGroundColor[2]+','+backGroundColor[3]+')';
    var topBool=true;
    var bottomBool=true;
    var leftBool=true;
    var rightBool=true;
    var topLeftBool=true;
    var bottomLeftBool=true;
    var bottomRightBool=true;
    var topRightBool=true;
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
          pixel,r,g,b,a
          top;
  r=color[0];
  g=color[1]
  b=color[2]
  a=color[3]
  i=0
  //var t,b,l,r,tr,tl,br;
  console.time("time");
    while(bottomPoints.getLength()>0){
      topBool=false;
      bottomBool=false;
      leftBool=false;
      rightBool=false;
      topLeftBool=false;
      bottomLeftBool=false;
      bottomRightBool=false;
      topRightBool=false;
  
      pixel=bottomPoints.dequeue();
  
      setPixel(imageData,pixel.x,pixel.y,r,g,b,a)
     // FillImage[i]={x:pixel.x,y:pixel.y};
      i++;
      if(!  bottomPointsBool[GetBoolIndex(pixel.x-1,pixel.y-1,ctx.canvas.width)])
      { 
        lData=getPixel(imageData,pixel.x-1,pixel.y-1)
        left='rgba('
        +lData[0]+','
        +lData[1]+','
        +lData[2]+','
        +lData[3]+')';
        leftBool=true;
      }
  
  
      if(!bottomPointsBool[GetBoolIndex(pixel.x-1,pixel.y+1,ctx.canvas.width)])
      { 
          blData=getPixel(imageData,pixel.x-1,pixel.y+1)
        bottomLeft='rgba('
        +blData[0]+','
        +blData[1]+','
        +blData[2]+','
        +blData[3]+')';
        bottomLeftBool=true;
      }
   
      if(!bottomPointsBool[GetBoolIndex(pixel.x,pixel.y-1,ctx.canvas.width)])
      { 
          tData=getPixel(imageData,pixel.x,pixel.y-1)
        top='rgba('
        +tData[0]+','
        +tData[1]+','
        +tData[2]+','
        +tData[3]+')';
        topBool=true;
      }
  
      if(!bottomPointsBool[GetBoolIndex(pixel.x+1,pixel.y-1,ctx.canvas.width)])
      {
          trData=getPixel(imageData,pixel.x+1,pixel.y-1)
        topRight='rgba('
        +trData[0]+','
        +trData[1]+','
        +trData[2]+','
        +trData[3]+')';
        topRightBool=true;
      }
  
      if(!bottomPointsBool[GetBoolIndex(pixel.x-1,pixel.y-1,ctx.canvas.width)])
      {
          tlData=getPixel(imageData,pixel.x-1,pixel.y-1)
        topLeft='rgba('
        +tlData[0]+','
        +tlData[1]+','
        +tlData[2]+','
        +tlData[3]+')';
        topLeftBool=true;
      }
  
      if(!bottomPointsBool[GetBoolIndex(pixel.x,pixel.y+1,ctx.canvas.width)])
      { 
         bData=getPixel(imageData,pixel.x,pixel.y+1)
        bottom='rgba('
        +bData[0]+','
        +bData[1]+','
        +bData[2]+','
        +bData[3]+')';
        bottomBool=true;
      }
  
  
      if(!bottomPointsBool[GetBoolIndex(pixel.x+1,pixel.y+1,ctx.canvas.width)])
      { 
        brData=getPixel(imageData,pixel.x+1,pixel.y+1)
        bottomRight='rgba('
        +brData[0]+','
        +brData[1]+','
        +brData[2]+','
        +brData[3]+')';
        bottomRightBool=true;
      }
  
      if(!bottomPointsBool[GetBoolIndex(pixel.x+1,pixel.y,ctx.canvas.width)])
      { 
        rData=getPixel(imageData,pixel.x+1,pixel.y)
        right='rgba('
        +rData[0]+','
        +rData[1]+','
        +rData[2]+','
        +rData[3]+')';
        rightBool=true;
      }
  
      if(bgColor===topLeft&& topLeftBool === true){bottomPointsBool[GetBoolIndex(pixel.x-1,pixel.y-1,ctx.canvas.width)]=true;      bottomPoints.enqueue({x:pixel.x-1,y:pixel.y-1,color:bgColor})}
      if(bgColor===bottomRight&& bottomRightBool === true){bottomPointsBool[GetBoolIndex(pixel.x-1,pixel.y-1,ctx.canvas.width)]=true;   bottomPoints.enqueue({x:pixel.x+1,y:pixel.y+1,color:bgColor})}
      if(bgColor===bottomLeft&& bottomLeftBool=== true){bottomPointsBool[GetBoolIndex(pixel.x-1,pixel.y+1,ctx.canvas.width)]=true;     bottomPoints.enqueue({x:pixel.x-1,y:pixel.y+1,color:bgColor})}
      if(bgColor===topRight&& topRightBool === true){ bottomPointsBool[GetBoolIndex(pixel.x+1,pixel.y-1,ctx.canvas.width)]=true;      bottomPoints.enqueue({x:pixel.x+1,y:pixel.y-1,color:bgColor})}
      if(bgColor===bottom&& bottomBool===true){bottomPointsBool[GetBoolIndex(pixel.x,pixel.y+1,ctx.canvas.width)]=true;       bottomPoints.enqueue({x:pixel.x  ,y:pixel.y+1,color:bgColor})}
      if(bgColor===left&& leftBool===true ){ bottomPointsBool[GetBoolIndex(pixel.x-1,pixel.y,ctx.canvas.width)]=true;         bottomPoints.enqueue({x:pixel.x-1,y:pixel.y  ,color:bgColor})}
      if(bgColor===right&& rightBool===true ){ bottomPointsBool[GetBoolIndex(pixel.x+1,pixel.y,ctx.canvas.width)]=true;       bottomPoints.enqueue({x:pixel.x+1,y:pixel.y  ,color:bgColor})}
      if(bgColor===top&& topBool===true){   bottomPointsBool[GetBoolIndex(pixel.x,pixel.y-1,ctx.canvas.width)]=true;       bottomPoints.enqueue({x:pixel.x  ,y:pixel.y-1,color:bgColor})}
    }
    console.timeEnd('time')
     ctx.putImageData(imageData,0,0);
  
 
  
  }



  function splitFillBoolTest(firstpoint,points,ctx,color)
  {
    console.time("time");
    //var pointsBool=[];
    var bottomPointsBool =[]
    var i=0;
    var bottomPoints =new Queue();
    
    //points.push({x:firstpoint.x,y:firstpoint.y,color:firstpoint.color})
    bottomPoints.enqueue({x:firstpoint.x,y:firstpoint.y,color:firstpoint.color})
    //pointsBool[GetBoolIndex(firstpoint.x,firstpoint.y,ctx.canvas.width)]=true;
    bottomPointsBool[GetBoolIndex(firstpoint.x,firstpoint.y,ctx.canvas.width)]=true;
      setPixel(imageData,firstpoint.x,firstpoint.y,color[0],color[1],color[2],color[3])
  
    var bgColor=firstpoint.color;
    var backGroundColor=firstpoint.color;
    bgColor="rgba("+backGroundColor[0]+','+backGroundColor[1]+','+backGroundColor[2]+','+backGroundColor[3]+')';
    var topBool=true;
    var bottomBool=true;
    var leftBool=true;
    var rightBool=true;
    var topLeftBool=true;
    var bottomLeftBool=true;
    var bottomRightBool=true;
    var topRightBool=true;
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
          pixel,r,g,b,a
          top;
  r=color[0];
  g=color[1]
  b=color[2]
  a=color[3]
  i=0
  //var t,b,l,r,tr,tl,br;
    while(bottomPoints.getLength()>0){
      topBool=false;
      bottomBool=false;
      leftBool=false;
      rightBool=false;
      topLeftBool=false;
      bottomLeftBool=false;
      bottomRightBool=false;
      topRightBool=false;
  
      pixel=bottomPoints.dequeue();
  
      setPixel(imageData,pixel.x,pixel.y,r,g,b,a)
      FillAlgorithmTest(pixel,bottomPointsBool,backGroundColor,ctx,color);
     // FillImage[i]={x:pixel.x,y:pixel.y};
      i++;
      if(!  bottomPointsBool[GetBoolIndex(pixel.x-1,pixel.y-1,ctx.canvas.width)])
      { 
        lData=getPixel(imageData,pixel.x-1,pixel.y-1)
        left='rgba('
        +lData[0]+','
        +lData[1]+','
        +lData[2]+','
        +lData[3]+')';
        leftBool=true;
      }
  
  
      if(!bottomPointsBool[GetBoolIndex(pixel.x-1,pixel.y+1,ctx.canvas.width)])
      { 
          blData=getPixel(imageData,pixel.x-1,pixel.y+1)
        bottomLeft='rgba('
        +blData[0]+','
        +blData[1]+','
        +blData[2]+','
        +blData[3]+')';
        bottomLeftBool=true;
      }
   
      if(!bottomPointsBool[GetBoolIndex(pixel.x,pixel.y-1,ctx.canvas.width)])
      { 
          tData=getPixel(imageData,pixel.x,pixel.y-1)
        top='rgba('
        +tData[0]+','
        +tData[1]+','
        +tData[2]+','
        +tData[3]+')';
        topBool=true;
      }
  
      if(!bottomPointsBool[GetBoolIndex(pixel.x+1,pixel.y-1,ctx.canvas.width)])
      {
          trData=getPixel(imageData,pixel.x+1,pixel.y-1)
        topRight='rgba('
        +trData[0]+','
        +trData[1]+','
        +trData[2]+','
        +trData[3]+')';
        topRightBool=true;
      }
  
      if(!bottomPointsBool[GetBoolIndex(pixel.x-1,pixel.y-1,ctx.canvas.width)])
      {
          tlData=getPixel(imageData,pixel.x-1,pixel.y-1)
        topLeft='rgba('
        +tlData[0]+','
        +tlData[1]+','
        +tlData[2]+','
        +tlData[3]+')';
        topLeftBool=true;
      }
  
      if(!bottomPointsBool[GetBoolIndex(pixel.x,pixel.y+1,ctx.canvas.width)])
      { 
         bData=getPixel(imageData,pixel.x,pixel.y+1)
        bottom='rgba('
        +bData[0]+','
        +bData[1]+','
        +bData[2]+','
        +bData[3]+')';
        bottomBool=true;
      }
  
  
      if(!bottomPointsBool[GetBoolIndex(pixel.x+1,pixel.y+1,ctx.canvas.width)])
      { 
        brData=getPixel(imageData,pixel.x+1,pixel.y+1)
        bottomRight='rgba('
        +brData[0]+','
        +brData[1]+','
        +brData[2]+','
        +brData[3]+')';
        bottomRightBool=true;
      }
  
      if(!bottomPointsBool[GetBoolIndex(pixel.x+1,pixel.y,ctx.canvas.width)])
      { 
        rData=getPixel(imageData,pixel.x+1,pixel.y)
        right='rgba('
        +rData[0]+','
        +rData[1]+','
        +rData[2]+','
        +rData[3]+')';
        rightBool=true;
      }
  
      if(bgColor===topLeft&& topLeftBool === true){bottomPointsBool[GetBoolIndex(pixel.x-1,pixel.y-1,ctx.canvas.width)]=true;      bottomPoints.enqueue({x:pixel.x-1,y:pixel.y-1,color:bgColor})}
      if(bgColor===bottomRight&& bottomRightBool === true){bottomPointsBool[GetBoolIndex(pixel.x-1,pixel.y-1,ctx.canvas.width)]=true;   bottomPoints.enqueue({x:pixel.x+1,y:pixel.y+1,color:bgColor})}
      if(bgColor===bottomLeft&& bottomLeftBool=== true){bottomPointsBool[GetBoolIndex(pixel.x-1,pixel.y+1,ctx.canvas.width)]=true;     bottomPoints.enqueue({x:pixel.x-1,y:pixel.y+1,color:bgColor})}
      if(bgColor===topRight&& topRightBool === true){ bottomPointsBool[GetBoolIndex(pixel.x+1,pixel.y-1,ctx.canvas.width)]=true;      bottomPoints.enqueue({x:pixel.x+1,y:pixel.y-1,color:bgColor})}
      if(bgColor===bottom&& bottomBool===true){bottomPointsBool[GetBoolIndex(pixel.x,pixel.y+1,ctx.canvas.width)]=true;       bottomPoints.enqueue({x:pixel.x  ,y:pixel.y+1,color:bgColor})}
      if(bgColor===left&& leftBool===true ){ bottomPointsBool[GetBoolIndex(pixel.x-1,pixel.y,ctx.canvas.width)]=true;         bottomPoints.enqueue({x:pixel.x-1,y:pixel.y  ,color:bgColor})}
      if(bgColor===right&& rightBool===true ){ bottomPointsBool[GetBoolIndex(pixel.x+1,pixel.y,ctx.canvas.width)]=true;       bottomPoints.enqueue({x:pixel.x+1,y:pixel.y  ,color:bgColor})}
      if(bgColor===top&& topBool===true){   bottomPointsBool[GetBoolIndex(pixel.x,pixel.y-1,ctx.canvas.width)]=true;       bottomPoints.enqueue({x:pixel.x  ,y:pixel.y-1,color:bgColor})}
    }
  
     ctx.putImageData(imageData,0,0);
  
 console.timeEnd('time')
  
  }
 



  
 
 module.exports={splitFillBool,CreatePath}  