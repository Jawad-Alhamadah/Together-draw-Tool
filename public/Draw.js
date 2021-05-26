//the Nodemon run script
//nodemon --exec npm start --ignore 'public/bundle/*'  

/////////
//nodemon.json config
///
//{
 // "events": {
    //  "restart": "watchify public/Draw.js -o public/bundle/bundle.js & node server.js",
   //   "start":"watchify public/Draw.js -o public/bundle/bundle.js & node server.js"
      
 //   }
// }
//
//const io = require('socket.io')(80);
var $ = require( "jquery" );
let { saveAs } =require('file-saver');
const {calcStraightLine}=require("./Modules/PixelMath.js");
const {rgbaToText,hexToRGB}=require("./Modules/PixelFunctions.js")
const {CreatePath}= require("./Modules/FillToolFunctions.js")
var socket=io.connect();
var canvas=document.getElementById('Canvas');
var ctx=canvas.getContext('2d');
//var button=document.getElementById('myButton');
var  id,Username;
Username="anon"
var cont=false;
var mouseX;
var mouseY;
var PreviousMouseX;
var PreviousMouseY;
var ColorPalette=[];
var ColorPaletteWidth;
var ColorPaletteHeight;
var numberOfColors=50;
var PalletTop=530;
var color='#000000';
color=hexToRGB(color,255)
//console.log(color)
//console.time("GetImage")
//ctx.getImageData(50,50,1,1)
//console.timeEnd("GetImage")
//ctx.fillStyle="white";
//ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height);
//ctx.fillStyle="black";


//console.log(sdgsdg)
var allColors=[]
var points=[];
var MouseEventsList=[];
ctx.canvas.width  = 1094;
ctx.canvas.height = 500;
//ctx.strokeRect(20,20,1040,445);
////ctx.fillStyle="white";
//ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height)
var canvWidth=ctx.canvas.width ;
//ctx.fillStyle="black";
var canvHeight=ctx.canvas.height;
var ColorRowNums=25
ColorPaletteWidth=Math.floor(ctx.canvas.width/numberOfColors+10);
var ColorBlocksPadding=Math.floor((canvas.width-(ColorRowNums*ColorPaletteWidth))/2);
var chat=document.getElementById("chatArea")
chat.value="\n";
var NamePicked=false;
const listOfUserNameSpan=new Map();
$("#SaveBtn").click((e)=> document.getElementById("Canvas").toBlob(function(blob) {
  saveAs(blob, "pretty image.png");
}))
/* 
//attach this to any $(button).click so that itsaves the file no click

*/


//console.log(socket)
socket.on('connect', () => {
  
  listOfUserNameSpan.set(socket.id,{span:document.createElement("span"),cursor:document.createElement("div")});
  listOfUserNameSpan.get(socket.id).span.id=socket.id+"-span";
  listOfUserNameSpan.get(socket.id).cursor.id=socket.id+"-cursor";
  //console.log(listOfUserNameSpan.get(socket.id))
  document.getElementById("container").appendChild(listOfUserNameSpan.get(socket.id).span)
  document.getElementById("container").appendChild(listOfUserNameSpan.get(socket.id).cursor)
  //console.log(listOfUserNameSpan)

  var tempcursorImage=document.createElement("img")
  listOfUserNameSpan.get(socket.id).cursor.appendChild(tempcursorImage)
    tempcursorImage.src="Cursor.png"

  document.getElementById(socket.id+"-span").innerHTML=Username
  ////
//
});

/*
ctx.save()
ctx.fillStyle='#622339'
ctx.fillRect(0,520,1200,500)
ctx.restore();
ctx.save()
ctx.translate(ColorPaletteWidth*ColorRowNums+ColorBlocksPadding,ctx.canvas.height-160);
ctx.fillStyle=rgbaToText(color);
ctx.fillRect(0,0,40,40)
ctx.strokeStyle='black'
ctx.strokeRect(0,0,40,40)
ctx.restore();*/
//mouse click for painting
  canvas.addEventListener('mousedown', function(){
  //var p =getMousePos(ctx.canvas,event)
  cont=true;
  /*
  ColorPalette.forEach((block) => {
    if(p.x>block.x &&p.x<block.x+block.width && p.y>block.y &&p.y<block.y+block.height){color=hexToRGB(block.color,255) ;console.log(color)}
  });
  ctx.save()
  ctx.translate(ColorPaletteWidth*ColorRowNums+ColorBlocksPadding+20,ctx.canvas.height-160);
  ctx.fillStyle=rgbaToText(color);
  ctx.fillRect(0,0,40,40)
  ctx.strokeStyle='black'
  //ctx.lineWidth=3
  ctx.strokeRect(0,0,40,40)
  ctx.restore();


*/
});
///

canvas.addEventListener('mouseup', function(){cont=false; });
socket.on("NameChange",function(data){
  document.getElementById(data.id).innerHTML=data.Username
})
socket.on('draw',function(data){
  data.data.forEach((item, i) => {
    
      if(item.command==="DrawMouseEvent"){
      ctx.fillStyle=rgbaToText(item.data.color);
      //ctx.beginPath();
    //  ctx.arc(item.data.x, item.data.y, 0.5, 0, 2 * Math.PI);
      //ctx.fill();
       ctx.fillRect(item.data.x,item.data.y,2,2);
     }
      if(item.command==="FillMouseEvent"){
        var temp=color.slice(0);
        color[0]=item.data.hostColor[0];
        color[1]=item.data.hostColor[1];
        color[2]=item.data.hostColor[2];
        color[3]=item.data.hostColor[3];

        CreatePath({x:item.data.x,y:item.data.y,color:item.data.color},ctx,points,color)
        color[0]=temp[0];
        color[1]=temp[1];
        color[2]=temp[2];
        color[3]=temp[3];
      }
    
  });

})

socket.on("MouseEvent",function(data){
  data.points.forEach((item, i) => {
    if(item.y<PalletTop-10){
    ctx.fillStyle=rgbaToText(data.color);
    ctx.beginPath();
      ctx.arc(item.x, item.y, 0.5, 0, 2 * Math.PI);
      ctx.fill();
    //ctx.fillRect(item.x,item.y,2,2);
    }
  });  

})
socket.on("UserMoved",function(data){
 //console.log("fuckme")
  if(document.getElementById(data.id)===null){
    var tempspan =document.createElement("span")
    var tempcursor =document.createElement("div")
   // var tempcursorImage=document.createElement("img")
   // console.log("adding div")
    tempspan.id=data.id;
    tempcursor.id=data.cursorid;
    $("#"+data.id).css("left",data.x)
    $("#"+data.id).css("top",data.y) 
    $("#"+data.id).css("position","absolute") 

    $("#"+data.cursorid).css("left",data.x-20)
    $("#"+data.cursorid).css("top",data.y-20) 
    $("#"+data.cursorid).css("position","absolute") 
    //$("#"+data.id).html("text") 
    
    
    document.getElementById(data.id).innerHTML=data.Username
    
  }
  else{
   // console.log("adding div")
    $("#"+data.id).css("left",data.x)
    $("#"+data.id).css("top",data.y) 
    $("#"+data.id).css("position","absolute")
    $("#"+data.cursorid).css("left",data.x-20)
    $("#"+data.cursorid).css("top",data.y-20) 
    $("#"+data.cursorid).css("position","absolute") 
    ///fill the else
  }
})
socket.on("newUserSpans",function(data){
  //console.log(data)
data.forEach(function(data){
  var tempspan =document.createElement("span")
  var tempcursorImage=document.createElement("img")
    tempspan.id=data.id;
    
   // tempspan.id=data.id;
    var tempcursor =document.createElement("div")
    document.getElementById("container").appendChild(tempspan)
    document.getElementById("container").appendChild(tempcursor)
    tempcursor.appendChild(tempcursorImage)
    tempcursorImage.src="Cursor.png"
    tempcursor.id=data.cursorid;
    $("#"+data.id).css("left",data.x)
    $("#"+data.id).css("top",data.y) 
    $("#"+data.id).css("position","absolute") 
    //$("#"+data.id).html("text") 
    $("#"+data.cursorid).css("left",data.x-20)
    $("#"+data.cursorid).css("top",data.y-20) 
    $("#"+data.cursorid).css("position","absolute") 
    ///fill the else
    
    document.getElementById(data.id).innerHTML=data.Username
})
})

socket.on('fill',function(data){

var temp=color.slice(0);
color[0]=data.hostColor[0];
color[1]=data.hostColor[1];
color[2]=data.hostColor[2];
color[3]=data.hostColor[3];
 
  CreatePath({x:data.x,y:data.y,color:data.color},ctx,points,color)

  color[0]=temp[0];
  color[1]=temp[1];
  color[2]=temp[2];
  color[3]=temp[3];
 

})
///////////////////

socket.on('comment',function(data){
  chat=document.getElementById("chatArea")
  var RecievedCommentSpan=document.createElement('div')
  RecievedCommentSpan.classList="blueSpan";
  RecievedCommentSpan.style.font=' italic bold 15px arial,serif'
  RecievedCommentSpan.value="  "+data+"\n";
  RecievedCommentSpan.innerHTML= " \n"+data;
  chat.append(RecievedCommentSpan);

})
socket.on('new',function(data){
ctx.putImageData(data.image,0,0);
//console.log('im painting')
})

socket.on('myname',function(data){
id=data.id
})

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: (evt.clientX - rect.left) / (rect.right - rect.left) * canvas.width,
        y: (evt.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
    };
}

function DrawCanv(){
  if(cont ){
    var list=calcStraightLine({left:mouseX-12,top:mouseY-12},{left:PreviousMouseX-12,top:PreviousMouseY-12},color);
  
 //
 for(var i=0;i<list.length;i++){
  ctx.fillStyle=rgbaToText(list[i].color);
  ctx.fillRect(list[i].x,list[i].y,2,2);
 }
//
    socket.emit("MouseEvents",list);
  }
}
function createPalette(){
  ColorPaletteWidth=Math.floor(ctx.canvas.width/numberOfColors);
  var colorInc=Math.floor(255/numberOfColors);
//pushing colorLines
  allColors.push('#000000');
  allColors.push('#FFFFFF');allColors.push('#999900');
  allColors.push('#4C9900');allColors.push('#009900');
  allColors.push('#00994C');allColors.push('#009999');
  allColors.push('#004C99');allColors.push('#000099');
  allColors.push('#4C0099');allColors.push('#990099');
  allColors.push('#99004C')

  allColors.push('#FF0000');
  allColors.push('#FF8000');allColors.push('#FFFF00');
  allColors.push('#80FF00');allColors.push('#00FF00');
  allColors.push('#00FF80');allColors.push('#00FFFF');
  allColors.push('#0080FF');allColors.push('#0000FF');
  allColors.push('#7F00FF');allColors.push('#FF00FF');
  allColors.push('#FF007F');allColors.push('#FF007F');
  //

  allColors.push('#FF9999');allColors.push('#FFCC99');
  allColors.push('#FFFF99');allColors.push('#CCFF99');
  allColors.push('#99FF99');allColors.push('#99FFCC');
  allColors.push('#99FFFF');allColors.push('#99CCFF');
  allColors.push('#9999FF');allColors.push('#CC99FF');
  allColors.push('#FF99FF');allColors.push('#FF99CC');
////////////////////////////////////////
allColors.push('#663CE6');
allColors.push('#1413ED');
allColors.push('#1B46D6');
allColors.push('#2986F0');
allColors.push('#12A6E3');/////
allColors.push('#2027E3');
allColors.push('#5D37F0');
allColors.push('#7729D6');
allColors.push('#AF21ED');
allColors.push('#4C0099');
allColors.push('#DC49E6');///////////////
allColors.push('#C72DE3')

allColors.push('#F046D3');
allColors.push('#D63574');
allColors.push('#D62F8B');
allColors.push('#D62F3B');
allColors.push('#E66250');
allColors.push('#E612C3');
allColors.push('#F03C7D');
allColors.push('#D6332D');
allColors.push('#D64A2D');
allColors.push('#E67D4E');
allColors.push('#E64B07');
allColors.push('#FF007F');
allColors.push('#F07D22');
//

allColors.push('#D68715');
allColors.push('#D69815');
allColors.push('#E6BE35');
allColors.push('#E6C412');
allColors.push('#F0E216');
allColors.push('#BFD60B');
allColors.push('#7BD60B');
allColors.push('#52E629');
allColors.push('#0EE612');
allColors.push('#1AF045');
allColors.push('#FF99FF');
allColors.push('#10D65B');
allColors.push('#E6456C');

//positioning the Color Blocks for color Pallets
  for (var i=0;i<ColorRowNums;i++){
    ColorPalette.push({x:i*ColorPaletteWidth+ColorBlocksPadding,y:PalletTop+20,width:ColorPaletteWidth,height:25,color:'black'})
  }
  for (var i=0;i<ColorRowNums;i++){
    ColorPalette.push({x:i*ColorPaletteWidth+ColorBlocksPadding,y:PalletTop+26+20,width:ColorPaletteWidth,height:25,color:'black'})
  }

  for (var i=0;i<ColorRowNums;i++){
    ColorPalette.push({x:i*ColorPaletteWidth+ColorBlocksPadding,y:PalletTop+52+20,width:ColorPaletteWidth,height:25,color:'black'})
  }

//assigning a color block to a position
  ColorPalette.forEach((block) => {
    var temp =allColors.shift();
    if(temp!=null && temp!=undefined){block.color=temp}
  });
//rendering each block
  ColorPalette.forEach((block) => {
    ctx.save();
    ctx.translate(block.x,block.y);
    ctx.fillStyle=block.color;;
    ctx.fillRect(0,0,block.width,block.height)
    ctx.strokeStyle='black'
    ctx.strokeRect(0,0,block.width,block.height)
    ctx.restore();
  });
}


//$("#SmileyFace").css("background-image","url('prettyimage.png')")
function CreatePalletDivs(){
  allColors.push('#000000');
  allColors.push('#FFFFFF');allColors.push('#999900');
  allColors.push('#4C9900');allColors.push('#009900');
  allColors.push('#00994C');allColors.push('#009999');
  allColors.push('#004C99');allColors.push('#000099');
  allColors.push('#4C0099');allColors.push('#990099');
  allColors.push('#99004C')

  allColors.push('#FF0000');
  allColors.push('#FF8000');allColors.push('#FFFF00');
  allColors.push('#80FF00');allColors.push('#00FF00');
  allColors.push('#00FF80');allColors.push('#00FFFF');
  allColors.push('#0080FF');allColors.push('#0000FF');
  allColors.push('#7F00FF');allColors.push('#FF00FF');
  allColors.push('#58906F');allColors.push('#FF007F');
  //

  allColors.push('#FF9999');allColors.push('#FFCC99');
  allColors.push('#FFFF99');allColors.push('#CCFF99');
  allColors.push('#99FF99');allColors.push('#99FFCC');
  allColors.push('#99FFFF');allColors.push('#99CCFF');
  allColors.push('#9999FF');allColors.push('#CC99FF');
  allColors.push('#FF99FF');allColors.push('#FF99CC');
////////////////////////////////////////
allColors.push('#663CE6');
allColors.push('#1413ED');
allColors.push('#1B46D6');
allColors.push('#2986F0');
allColors.push('#12A6E3');/////
allColors.push('#2027E3');
allColors.push('#5D37F0');
allColors.push('#7729D6');
allColors.push('#AF21ED');
allColors.push('#DC0099');
allColors.push('#DC49E6');///////////////
allColors.push('#C72DE3')

allColors.push('#F046D3');
allColors.push('#D63574');
allColors.push('#D62F8B');
allColors.push('#D62F3B');
allColors.push('#E66250');
allColors.push('#E612C3');
allColors.push('#F03C7D');
allColors.push('#D6332D');
allColors.push('#D64A2D');
allColors.push('#E67D4E');
allColors.push('#E64B07');
allColors.push('#9F475F');
allColors.push('#F07D22');
//

allColors.push('#D68715');
allColors.push('#D69815');
allColors.push('#E6BE35');
allColors.push('#E6C412');
allColors.push('#F0E216');
allColors.push('#BFD60B');
allColors.push('#7BD60B');
allColors.push('#52E629');
allColors.push('#0EE612');
allColors.push('#1AF045');
allColors.push('#FD99FD');
allColors.push('#10D65B');
allColors.push('#E6456C');
var colorpallentTemp = document.getElementById("ColorPallet")

for(var i=0;i<allColors.length;i++){
  let tempPallet=document.createElement("div");
  
  colorpallentTemp.appendChild(tempPallet);
  tempPallet.id=allColors[i].substring(1);
  tempPallet.style.backgroundColor="#"+tempPallet.id
  
  $("#"+tempPallet.id).click((e)=>color=hexToRGB("#"+e.target.id,255))
 /* 
 //attach this to any $(button).click so that itsaves the file no click
  document.getElementById("Canvas").toBlob(function(blob) {
    saveAs(blob, "pretty image.png");
});
*/

  }
}


$("#ColorInput").change((e) => color= hexToRGB(e.target.value,255))

//createPalette()
CreatePalletDivs();
$("body").mousemove(function(e) {
    var p=getMousePos(ctx.canvas,e);
    $("#"+socket.id+"-span").css("left",e.pageX-4)
    $("#"+socket.id+"-span").css("top",e.pageY-4) 
    $("#"+socket.id+"-cursor").css("left",e.pageX-24)
    $("#"+socket.id+"-cursor").css("top",e.pageY-24) 
    //$("#"+socket.id+"-cursor").css("background-color","aqua") 
   // console('')
    socket.emit("UserMoved",{x:e.pageX-4,y:e.pageY-4,id:socket.id+"-span",cursorid:socket.id+"-cursor",Username:Username})
    PreviousMouseX=mouseX;
    PreviousMouseY=mouseY;
    mouseX = e.pageX;
    mouseY= e.pageY;
    MouseEventsList.push({x:e.pageX, y:e.pageY,lastx:PreviousMouseX,lasty:PreviousMouseY})
  })
  
  $("#CommentBtn").click(function(){
    var commBox=document.getElementById("commentBox")
      socket.emit('comment',"  "+Username+": "+ commBox.value+"\n")
      var commentSpan=document.createElement('div');
      chat=document.getElementById("chatArea");
      commentSpan.value= Username+": "+ commBox.value+'\n';
      commentSpan.innerHTML= Username+": "+ commBox.value+'\n';
       commBox.value="";
       commentSpan.classList='redSpan'
       commentSpan.style.font=' italic bold 15px arial,serif'
       chat.value= chat.value + commentSpan.value;
       chat.append(commentSpan);
  })
  document.querySelector("#commentBox").addEventListener("keydown", event => {
    if(event.key !== "Enter") return; // Use `.key` instead.
    document.querySelector("#CommentBtn").click(); // Things you want to do.
    event.preventDefault(); // No need to `return false;`.
});
  $("#NameBtn").click(function(){
 // console.log(`my name is ${Username}`)
  var NameBox=document.getElementById("NameBox")
  NameBox.value=NameBox.value.trim();
    if(!NamePicked && NameBox.value!="" && NameBox.value!="anon"){
      var NameBox=document.getElementById("NameBox")
      Username=NameBox.value
      NamePicked=true;
      Username=NameBox.value
      document.getElementById(socket.id).innerHTML=Username
      socket.emit("NameChange",{id:socket.id+"-span",Username:Username})
      NameBox.value="";
      NameBox.setAttribute('readonly', 'readonly');
    }
  })
setInterval(DrawCanv,1);
window.onkeydown = handleKeyDown;
function handleKeyDown(event) {
  if (event.key ==="t"){
    var tempColor=ctx.getImageData(mouseX-12, mouseY-12, 1, 1).data;
    if(!(mouseX-9>canvWidth || mouseY-9>canvHeight )){
      BoolFill=true; CreatePath({x:mouseX-12,y:mouseY-12,color:tempColor},ctx,points,color)//ctx.getImageData(mouseX, mouseY, 1, 1).data
      socket.emit('fill',{x:mouseX-12,y:mouseY-12,color:tempColor,hostColor:color})
    }

  }
    if (event.key ==="r"){}
  
    }

