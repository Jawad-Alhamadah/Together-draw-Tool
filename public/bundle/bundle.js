(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],2:[function(require,module,exports){
(function (global){(function (){
(function(a,b){if("function"==typeof define&&define.amd)define([],b);else if("undefined"!=typeof exports)b();else{b(),a.FileSaver={exports:{}}.exports}})(this,function(){"use strict";function b(a,b){return"undefined"==typeof b?b={autoBom:!1}:"object"!=typeof b&&(console.warn("Deprecated: Expected third argument to be a object"),b={autoBom:!b}),b.autoBom&&/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(a.type)?new Blob(["\uFEFF",a],{type:a.type}):a}function c(a,b,c){var d=new XMLHttpRequest;d.open("GET",a),d.responseType="blob",d.onload=function(){g(d.response,b,c)},d.onerror=function(){console.error("could not download file")},d.send()}function d(a){var b=new XMLHttpRequest;b.open("HEAD",a,!1);try{b.send()}catch(a){}return 200<=b.status&&299>=b.status}function e(a){try{a.dispatchEvent(new MouseEvent("click"))}catch(c){var b=document.createEvent("MouseEvents");b.initMouseEvent("click",!0,!0,window,0,0,0,80,20,!1,!1,!1,!1,0,null),a.dispatchEvent(b)}}var f="object"==typeof window&&window.window===window?window:"object"==typeof self&&self.self===self?self:"object"==typeof global&&global.global===global?global:void 0,a=f.navigator&&/Macintosh/.test(navigator.userAgent)&&/AppleWebKit/.test(navigator.userAgent)&&!/Safari/.test(navigator.userAgent),g=f.saveAs||("object"!=typeof window||window!==f?function(){}:"download"in HTMLAnchorElement.prototype&&!a?function(b,g,h){var i=f.URL||f.webkitURL,j=document.createElement("a");g=g||b.name||"download",j.download=g,j.rel="noopener","string"==typeof b?(j.href=b,j.origin===location.origin?e(j):d(j.href)?c(b,g,h):e(j,j.target="_blank")):(j.href=i.createObjectURL(b),setTimeout(function(){i.revokeObjectURL(j.href)},4E4),setTimeout(function(){e(j)},0))}:"msSaveOrOpenBlob"in navigator?function(f,g,h){if(g=g||f.name||"download","string"!=typeof f)navigator.msSaveOrOpenBlob(b(f,h),g);else if(d(f))c(f,g,h);else{var i=document.createElement("a");i.href=f,i.target="_blank",setTimeout(function(){e(i)})}}:function(b,d,e,g){if(g=g||open("","_blank"),g&&(g.document.title=g.document.body.innerText="downloading..."),"string"==typeof b)return c(b,d,e);var h="application/octet-stream"===b.type,i=/constructor/i.test(f.HTMLElement)||f.safari,j=/CriOS\/[\d]+/.test(navigator.userAgent);if((j||h&&i||a)&&"undefined"!=typeof FileReader){var k=new FileReader;k.onloadend=function(){var a=k.result;a=j?a:a.replace(/^data:[^;]*;/,"data:attachment/file;"),g?g.location.href=a:location=a,g=null},k.readAsDataURL(b)}else{var l=f.URL||f.webkitURL,m=l.createObjectURL(b);g?g.location=m:location.href=m,g=null,setTimeout(function(){l.revokeObjectURL(m)},4E4)}});f.saveAs=g.saveAs=g,"undefined"!=typeof module&&(module.exports=g)});


}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],3:[function(require,module,exports){
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
let { saveAs } =require('file-saver');
const {calcStraightLine}=require("./Modules/PixelMath.js");
const {rgbaToText,hexToRGB}=require("./Modules/PixelFunctions.js")
const {CreatePath}= require("./Modules/FillToolFunctions.js")
var socket=io.connect('http://localhost:3000',{transports: ['websocket']});
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


},{"./Modules/FillToolFunctions.js":4,"./Modules/PixelFunctions.js":5,"./Modules/PixelMath.js":6,"file-saver":2}],4:[function(require,module,exports){
 
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
},{"./PixelFunctions.js":5,"./PixelMath.js":6,"./Queue.js":7}],5:[function(require,module,exports){
(function (process){(function (){

function setPixel(imageData, x, y, r, g, b, a) {
    index = (x + y * imageData.width) * 4;
    imageData.data[index+0] = r;
    imageData.data[index+1] = g;
    imageData.data[index+2] = b;
    imageData.data[index+3] = a;
}

function getPixel(imageData, x, y) {
    index = (x + y * imageData.width) * 4;
  return[imageData.data[index+0] ,imageData.data[index+1],imageData.data[index+2],imageData.data[index+3]]
}

function rgbaToText(colorRGBA){
return "rgba("+colorRGBA[0]+','+colorRGBA[1]+','+colorRGBA[2]+','+colorRGBA[3]+')'

}
function hexToRGB(hex, alpha) {
  var r = parseInt(hex.slice(1, 3), 16),
      g = parseInt(hex.slice(3, 5), 16),
      b = parseInt(hex.slice(5, 7), 16);

  if (alpha) {
      return  [r,g,b,alpha]
  } else {
      return "rgb(" + r + ", " + g + ", " + b + ")";
  }
}

function rgbaToHex (rgba) {
  var inParts = rgba.substring(rgba.indexOf("(")).split(","),
      r = parseInt(trim(inParts[0].substring(1)), 10),
      g = parseInt(trim(inParts[1]), 10),
      b = parseInt(trim(inParts[2]), 10),
      a = parseFloat(trim(inParts[3].substring(0, inParts[3].length - 1))).toFixed(2);
  var outParts = [
    r.toString(16),
    g.toString(16),
    b.toString(16),
    Math.round(a * 255).toString(16).substring(0, 2)
  ];

  // Pad single-digit output values
  outParts.forEach(function (part, i) {
    if (part.length === 1) {
      outParts[i] = '0' + part;
    }
  })

  return ('#' + outParts.join(''));
}

if (process.argv.length >= 3) {
  console.log(rgbaToHex(process.argv[2]));
} else {
 
}


module.exports={getPixel,rgbaToText,hexToRGB,setPixel,rgbaToHex}


}).call(this)}).call(this,require('_process'))
},{"_process":1}],6:[function(require,module,exports){
function calcStraightLine (startCoordinates, endCoordinates, color) {
    var coordinatesArray = new Array();
    // Translate coordinates
    var x1 = startCoordinates.left;
    var y1 = startCoordinates.top;
    var x2 = endCoordinates.left;
    var y2 = endCoordinates.top;
    // Define differences and error check
    var dx = Math.abs(x2 - x1);
    var dy = Math.abs(y2 - y1);
    var sx = (x1 < x2) ? 1 : -1;
    var sy = (y1 < y2) ? 1 : -1;
    var err = dx - dy;
    // Set first coordinates
    coordinatesArray.push({x:x1,y:y1,color:color});
    // Main loop
    while (!((x1 == x2) && (y1 == y2))) {
        var e2 = err << 1;
        if (e2 > -dy) {
            err -= dy;
            x1 += sx;
        }
        if (e2 < dx) {
            err += dx;
            y1 += sy;
        }
        // Set coordinates
        coordinatesArray.push({x:x1,y:y1,color:color});
    }
    // Return the result
    return coordinatesArray;
}

function GetBoolIndex(x,y,canvWidth){
return (y*canvWidth)+x

}

function GetBoolXY(index){
var y=index/canvWidth;
var x=index%canvWidth;

return {x:x,y:y}

}

module.exports={GetBoolIndex,GetBoolXY,calcStraightLine}
},{}],7:[function(require,module,exports){
////////////
function Queue(){

      var a=[],b=0;
      this.getLength=function(){return a.length-b};
      this.isEmpty=function(){return 0==a.length};
      this.enqueue=function(b){a.push(b)};
      this.dequeue=function(){if(0!=a.length){
        var c=a[b];2*++b>=a.length&&(a=a.slice(b),b=0);
        return c
        }
      };
      this.peek=function(){return 0<a.length?a[b]:void 0}


  };
module.exports=Queue;
},{}]},{},[3]);
