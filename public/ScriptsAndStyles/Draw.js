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
//const io = require('socket.io')(80);
var BucketToolImageUrl = "paint-Bukcet3.png";
var EarserToolImageUrl = "eraser.png";
var ColorPickerToolImageUrl = "color-picker.png";
var BrushToolImageUrl = "BrushTool.png";
var BrushUpImageUrl = "paint-brush.png";

var $ = require("jquery");
let {saveAs} = require('file-saver');
const {calcStraightLine} = require("../Modules/PixelMath.js");
const {rgbaToText,hexToRGB} = require("../Modules/PixelFunctions.js")
const {CreatePath} = require("../Modules/FillToolFunctions.js")
const {UserNameAndCursorDivsSetup, PushColors}=require("../Modules/SetUpFunctions.js")
const {Socket_DrawEvents_Recieved,
       Socket_MouseEvents_Recieved,
       Socket_NewUser_Recieved,
       Socket_HandleUserMovement_Recieved,
       Socket_FillEvent_Recieved,
       Socket_NameChangeEvent_Recieved,
       Socket_CommentEvent_Recieved,
       ReturnChatCount,
       ReturnChatLimit,
       ChatCount_Set,
       ChatCount_Inc   }=require("../Modules/SocketOnFunctions.js")
//https://together-draw-stuff.herokuapp.com
//http://localhost:3000
var socket = io.connect('http://localhost:3000', {
  transports: ['websocket']
});
var canvas = document.getElementById('Canvas');
var ctx = canvas.getContext('2d');
var  Username;
Username = "anon"
//var chatLimit = 20;
var cont = false;
var CorrectionX = 120;
var CorrectionY = 19;
var mouseX;
var mouseY;
var PreviousMouseX;
var PreviousMouseY;

var color = '#000000';
var BrushSize = 2;
color = hexToRGB(color, 255)

var BucketColor = []
BucketColor[0] = color[0];
BucketColor[1] = color[1];
BucketColor[2] = color[2];
BucketColor[3] = color[3];
var allColors = []
var MouseEventsList = [];
ctx.canvas.width = 1094;
ctx.canvas.height = 500;
ctx.strokeRect(20, 20, 1040, 445);
ctx.fillStyle = "white";
ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
var canvWidth = ctx.canvas.width;
ctx.fillStyle = "black";
var canvHeight = ctx.canvas.height;

//var chat = document.getElementById("chatArea")

var NamePicked = false;
var chatCounter = 0;
var EraserBool = false;
var BrushBool = true;
var ColorPickerBool = false;
var BucketBool = false;


socket.on('connect', () => {
  //////
  UserNameAndCursorDivsSetup(socket,Username)
  
  Socket_DrawEvents_Recieved(ctx,color,socket)
  Socket_MouseEvents_Recieved(ctx,socket);
  Socket_HandleUserMovement_Recieved(socket)
  Socket_NewUser_Recieved(socket)
  Socket_FillEvent_Recieved(ctx,color,socket)
  Socket_NameChangeEvent_Recieved(socket)
  Socket_CommentEvent_Recieved(socket)
    setInterval(SendMoves,30)
  
  });




$("#SaveBtn").click((e) => document.getElementById("Canvas").toBlob(function (blob) {
  saveAs(blob, "pretty image.png");
}))

$("#BrushSizeUP").click((e) => {

  if (BrushSize < 6) BrushSize++

})
$("#BrushSizeDown").click((e) => {
  if (BrushSize > 2) BrushSize--
})
$("#EraserTool").click((e) => {
  if (!EraserBool) {
    $("#Image_2").attr("src", "")
    color = hexToRGB("#ffffff", 255);
    $("#toolsDiv ").children().css("opacity", "100%")
    $(e.target).css("opacity", "30%")
    BrushBool = false;
    ColorPickerBool = false;
    EraserBool = true;
    BucketBool = false;
  }

})
$("#BrushTool").click((e) => {
  if (!BrushBool) {
    $("#Image_2").attr("src", "")
    $("#toolsDiv").children().css("opacity", "100%")
    $(e.target).css("opacity", "30%")
    BrushBool = true;
    ColorPickerBool = false;
    EraserBool = false;
    BucketBool = false;
  }

})

$("#ColorPickerTool").click((e) => {
  if (!ColorPickerBool) {
    $("#Image_2").attr("src", "dropper.png")
    $("#toolsDiv").children().css("opacity", "100%")
    // $("#toolsDiv").children().hover(function(){$(this).css("opacity", "100%")})
    $(e.target).css("opacity", "30%")
    BrushBool = false;
    ColorPickerBool = true;
    EraserBool = false;
    BucketBool = false;
  }

})


$("#BucketTool").click((e) => {
  if (!BucketBool) {
    BucketColor[0] = color[0];
    BucketColor[1] = color[1];
    BucketColor[2] = color[2];
    BucketColor[3] = color[3];
    $("#toolsDiv").children().css("opacity", "100%")
    $(e.target).css("opacity", "30%")
    $("#Image_2").attr("src", "paint-bucket-4.png")
    BrushBool = false;
    ColorPickerBool = false;
    EraserBool = false;
    BucketBool = true;
  }
//k

})

canvas.addEventListener('mousedown', function (e) {
  if(e.which==1){
    cont = true;
    if (BucketBool) {
      var tempColor = ctx.getImageData(mouseX - CorrectionX, mouseY - CorrectionY, 1, 1).data;
      if (!(mouseX - 9 > canvWidth || mouseY - 9 > canvHeight)) {
        BoolFill = true;
        CreatePath({
          x: mouseX - CorrectionX,
          y: mouseY - CorrectionY,
          color: tempColor
        }, ctx, BucketColor) //ctx.getImageData(mouseX, mouseY, 1, 1).data
        socket.emit('fill', {
          x: mouseX - CorrectionX,
          y: mouseY - CorrectionY,
          color: tempColor,
          hostColor: BucketColor
        })
      }
    }
    if(ColorPickerBool){
     var tempCol=ctx.getImageData(mouseX - CorrectionX, mouseY - CorrectionY, 1, 1).data;
      color[0]=tempCol[0];
      color[1]=tempCol[1];
      color[2]=tempCol[2];
      color[3]=tempCol[3];
    }
  }
  
});
///

canvas.addEventListener('mouseup', function () {
  cont = false;
});


function DrawCanv() {
  if (cont && (BrushBool || EraserBool)) {
    var list = calcStraightLine({
      left: mouseX - CorrectionX,
      top: mouseY - CorrectionY
    }, {
      left: PreviousMouseX - CorrectionX,
      top: PreviousMouseY - CorrectionY
    }, color, BrushSize);
    //
    for (var i = 0; i < list.length; i++) {
      ctx.fillStyle = rgbaToText(list[i].color);
      ctx.fillRect(list[i].x, list[i].y, BrushSize, BrushSize);
    }
    //
    socket.emit("MouseEvents", list);
  }
}

function CreatePalletDivs() {
  PushColors(allColors)
  var colorpallentTemp = document.getElementById("ColorPallet")
  for (var i = 0; i < allColors.length; i++) {
    let tempPallet = document.createElement("div");
    colorpallentTemp.appendChild(tempPallet);
    tempPallet.id = allColors[i].substring(1);
    tempPallet.style.backgroundColor = "#" + tempPallet.id
    $("#" + tempPallet.id).click((e) => {
        if (BucketBool) {
          BucketColor = hexToRGB("#" + e.target.id, 255)
        }
        if (BrushBool) {
          color = hexToRGB("#" + e.target.id, 255)
        }
      }
    )
  }
}

$("#ColorInput").on("input",(e) => {
  if (BucketBool) {
    BucketColor = hexToRGB( e.target.value, 255)

  }
  if (BrushBool) {
    color = hexToRGB(e.target.value, 255)

  }
})
CreatePalletDivs();
$("body").mousemove(function (e) {
  $("#" + socket.id + "-span").css("left", e.pageX - (CorrectionX - 15))
  $("#" + socket.id + "-span").css("top", e.pageY - (CorrectionY - 15))
  $("#" + socket.id + "-cursor").css("left", e.pageX - (CorrectionX + 18))
  $("#" + socket.id + "-cursor").css("top", e.pageY - (CorrectionY + 12))
 
  PreviousMouseX = mouseX;
  PreviousMouseY = mouseY;
  mouseX = e.pageX;
  mouseY = e.pageY;
  MouseEventsList.push({
    x: e.pageX,
    y: e.pageY,
    lastx: PreviousMouseX,
    lasty: PreviousMouseY
  })
})

$("#CommentBtn").click(function () {
  var commBox = document.getElementById("commentBox")
  socket.emit('comment', "  " + Username + ": " + commBox.value + "\n")
  var commentSpan = document.createElement('div');
  var chat = document.getElementById("chatArea");
  commentSpan.value = Username + ": " + commBox.value + '\n';
  commentSpan.innerHTML = Username + ": " + commBox.value + '\n';
  commBox.value = "";
  commentSpan.classList = 'redSpan'
  commentSpan.style.font = ' italic bold 18px Times, Times New Roman, serif;'
  chat.value = chat.value + commentSpan.value;
  if (ReturnChatCount() > ReturnChatLimit()) {
    chat.innerHTML = '';
    ChatCount_Set(0);
  }
  chat.append(commentSpan);
  ChatCount_Inc()
})
document.querySelector("#commentBox").addEventListener("keydown", event => {
  if (event.key !== "Enter") return;
  document.querySelector("#CommentBtn").click();
  event.preventDefault();
});

$("#NameBtn").click(function () {
  var NameBox = document.getElementById("NameBox")
  NameBox.value = NameBox.value.trim();
  if (!NamePicked && NameBox.value != "") {
    var NameBox = document.getElementById("NameBox")
    Username = NameBox.value
    NamePicked = true;
    Username = NameBox.value
    document.getElementById(socket.id + "-span").innerHTML = Username
    socket.emit("NameChange", {
      id: socket.id + "-span",
      Username: Username
    })
    NameBox.value = "";
    NameBox.setAttribute('readonly', 'readonly');
    $("#PickANameWindow").css("animation", "MoveUp 0.7s");
    $("#fullCanv").css("pointer-events", "auto");
    $("#fullCanv").css("animation", " OpacityUp 1.2s");
    $("#fullCanv").css("animation-fill-mode", "  forwards")
  }

})
setInterval(DrawCanv, 10);

function SendMoves(){
  socket.emit("UserMoved", {
    x: mouseX - CorrectionX,
    y: mouseY - CorrectionY,
    id: socket.id + "-span",
    cursorid: socket.id + "-cursor",
    Username: Username
  })
}
window.onkeydown = handleKeyDown;
/////////////////
function handleKeyDown(event) {
  if (event.key === "t" && NamePicked) {
    var tempColor = ctx.getImageData(mouseX - CorrectionX, mouseY - CorrectionY, 1, 1).data;
    if (!(mouseX - 9 > canvWidth || mouseY - 9 > canvHeight)) {
      BoolFill = true;
      CreatePath({
        x: mouseX - CorrectionX,
        y: mouseY - CorrectionY,
        color: tempColor
      }, ctx, color) //ctx.getImageData(mouseX, mouseY, 1, 1).data
      socket.emit('fill', {
        x: mouseX - CorrectionX,
        y: mouseY - CorrectionY,
        color: tempColor,
        hostColor: color
      })
    }

  }
  if (event.key === "r") {}

}