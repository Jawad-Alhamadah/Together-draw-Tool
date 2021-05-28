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
let {
  saveAs
} = require('file-saver');
const {
  calcStraightLine
} = require("../Modules/PixelMath.js");
const {
  rgbaToText,
  hexToRGB
} = require("../Modules/PixelFunctions.js")
const {
  CreatePath
} = require("../Modules/FillToolFunctions.js")
// /https://warm-lake-32915.herokuapp.com
var socket = io.connect('https://warm-lake-32915.herokuapp.com', {
  transports: ['websocket']
});
var canvas = document.getElementById('Canvas');
var ctx = canvas.getContext('2d');
var id, Username;
Username = "anon"
var chatLimit = 20;
var cont = false;
var CorrectionX = 120;
var CorrectionY = 19;
var mouseX;
var mouseY;
var PreviousMouseX;
var PreviousMouseY;
var PalletTop = 530;
var color = '#000000';
var BrushSize = 2;
var BrushSizeBool;
color = hexToRGB(color, 255)

var BucketColor = []
BucketColor[0] = color[0];
BucketColor[1] = color[1];
BucketColor[2] = color[2];
BucketColor[3] = color[3];
var allColors = []
var points = [];
var MouseEventsList = [];
ctx.canvas.width = 1094;
ctx.canvas.height = 500;
ctx.strokeRect(20, 20, 1040, 445);
ctx.fillStyle = "white";
ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
var canvWidth = ctx.canvas.width;
ctx.fillStyle = "black";
var canvHeight = ctx.canvas.height;

var chat = document.getElementById("chatArea")
chat.value = "\n";
var NamePicked = false;
const listOfUserNameSpan = new Map();
var chatCounter = 0;
var EraserBool = false;
var BrushBool = true;
var ColorPickerBool = false;
var BucketBool = false;
$("#SaveBtn").click((e) => document.getElementById("Canvas").toBlob(function (blob) {
  saveAs(blob, "pretty image.png");
}))


$("#BrushSizeUP").click((e) => {
  
  if (BrushSize < 6) BrushSize++
  // $("#fullCanv").children.css("opacity","100%")
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

    //$("#" + socket.id + "-cursor >img").attr("src",'')
    
    
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
    // $("#toolsDiv").children().hover(function(){$(this).css("opacity", "100%")})
    $(e.target).css("opacity", "30%")
    $("#Image_2").attr("src", "paint-bucket-4.png")
    //$("#" + socket.id + "-cursor >img").css("width","40px")
 
   // $("#" + socket.id + "-cursor").css("background-image", "url(Cursor.png)")
    // console.log("#" + socket.id + "-cursor")
    BrushBool = false;
    ColorPickerBool = false;
    EraserBool = false;
    BucketBool = true;
  }
//k

})
socket.on('connect', () => {

  listOfUserNameSpan.set(socket.id, {
    span: document.createElement("span"),
    cursor: document.createElement("div")
  });
  listOfUserNameSpan.get(socket.id).span.id = socket.id + "-span";
  listOfUserNameSpan.get(socket.id).cursor.id = socket.id + "-cursor";
  document.getElementById("container").appendChild(listOfUserNameSpan.get(socket.id).span)
  document.getElementById("container").appendChild(listOfUserNameSpan.get(socket.id).cursor)
  var tempcursorImage = document.createElement("img")
  var tempcursorImage_2 = document.createElement("img")
  listOfUserNameSpan.get(socket.id).cursor.appendChild(tempcursorImage)
  listOfUserNameSpan.get(socket.id).cursor.appendChild(tempcursorImage_2)
  tempcursorImage.src = "Cursor.png"
  tempcursorImage.id="Image_1";
  tempcursorImage_2.id="Image_2";
  document.getElementById(socket.id + "-span").innerHTML = Username

});
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
        }, ctx, points, BucketColor) //ctx.getImageData(mouseX, mouseY, 1, 1).data
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
socket.on("NameChange", function (data) {
  document.getElementById(data.id).innerHTML = data.Username
})
socket.on('draw', function (data) {
  data.data.forEach((item, i) => {

    if (item.command === "DrawMouseEvent") {
      ctx.fillStyle = rgbaToText(item.data.color);
      ctx.fillRect(item.data.x, item.data.y, item.data.BrushSize, item.data.BrushSize);
    }
    if (item.command === "FillMouseEvent") {
      var temp = color.slice(0);
      color[0] = item.data.hostColor[0];
      color[1] = item.data.hostColor[1];
      color[2] = item.data.hostColor[2];
      color[3] = item.data.hostColor[3];
      CreatePath({
        x: item.data.x,
        y: item.data.y,
        color: item.data.color
      }, ctx, points, color)
      color[0] = temp[0];
      color[1] = temp[1];
      color[2] = temp[2];
      color[3] = temp[3];
    }

  });

})

socket.on("MouseEvent", function (data) {
  data.points.forEach((item, i) => {
    if (item.y < PalletTop - 10) {
      ctx.fillStyle = rgbaToText(data.color);
      ctx.beginPath();
      ctx.arc(item.x, item.y, 0.5, 0, 2 * Math.PI);
      ctx.fill();
    }
  });

})
socket.on("UserMoved", function (data) {
  if (document.getElementById(data.id) === null) {
    var tempspan = document.createElement("span")
    var tempcursor = document.createElement("div")
    var tempcursorImage = document.createElement("img")
    tempspan.id = data.id;
    tempcursor.id = data.cursorid;
    document.getElementById("container").appendChild(tempspan)
    document.getElementById("container").appendChild(tempcursor)
    tempcursor.appendChild(tempcursorImage)
    $("#" + data.id).css("left", data.x)
    $("#" + data.id).css("top", data.y)
    $("#" + data.id).css("position", "absolute")
    tempcursorImage.src = "Cursor.png"
    tempcursor.id = data.cursorid;
    $("#" + data.cursorid).css("left", data.x - 12)
    $("#" + data.cursorid).css("top", data.y - 12)
    $("#" + data.cursorid).css("position", "absolute")
    document.getElementById(data.id).innerHTML = data.Username
  } else {
    $("#" + data.id).css("left", data.x)
    $("#" + data.id).css("top", data.y)
    $("#" + data.id).css("position", "absolute")
    $("#" + data.cursorid).css("left", data.x - 12)
    $("#" + data.cursorid).css("top", data.y - 12)
    $("#" + data.cursorid).css("position", "absolute")
  }
})
socket.on("newUserSpans", function (data) {
  data.forEach(function (data) {
    var tempspan = document.createElement("span")
    var tempcursorImage = document.createElement("img")
    tempspan.id = data.id;
    var tempcursor = document.createElement("div")
    //var tempCursorToolIcon=document.createElement("img")

    document.getElementById("container").appendChild(tempspan)
    document.getElementById("container").appendChild(tempcursor)
    tempcursor.appendChild(tempcursorImage)
    //tempcursor.appendChild(tempCursorToolIcon)
  
    tempcursorImage.src = "Cursor.png"
    tempcursor.id = data.cursorid;
    $("#" + data.id).css("left", data.x)
    $("#" + data.id).css("top", data.y)
    $("#" + data.id).css("position", "absolute")
    $("#" + data.cursorid).css("left", data.x - 12)
    $("#" + data.cursorid).css("top", data.y - 12)
    $("#" + data.cursorid).css("position", "absolute")
    document.getElementById(data.id).innerHTML = data.Username
  })
})

socket.on('fill', function (data) {

  var temp = color.slice(0);
  color[0] = data.hostColor[0];
  color[1] = data.hostColor[1];
  color[2] = data.hostColor[2];
  color[3] = data.hostColor[3];

  CreatePath({
    x: data.x,
    y: data.y,
    color: data.color
  }, ctx, points, color)

  color[0] = temp[0];
  color[1] = temp[1];
  color[2] = temp[2];
  color[3] = temp[3];


})
///////////////////

socket.on('comment', function (data) {
  chat = document.getElementById("chatArea")
  var RecievedCommentSpan = document.createElement('div')
  RecievedCommentSpan.classList = "blueSpan";
  RecievedCommentSpan.style.font = ' italic bold 18px Times, Times New Roman, serif;'
  RecievedCommentSpan.value = "  " + data + "\n";
  RecievedCommentSpan.innerHTML = " \n" + data;
  if (chatCounter > chatLimit) {
    chatCounter = 0;
    chat.innerHTML = ''
  }
  chatCounter++;
  chat.append(RecievedCommentSpan);

})
socket.on('new', function (data) {
  ctx.putImageData(data.image, 0, 0);
})

socket.on('myname', function (data) {
  id = data.id
})

function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: (evt.clientX - rect.left) / (rect.right - rect.left) * canvas.width,
    y: (evt.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
  };
}

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

function InitialSetUp() {}

function CreatePalletDivs() {
  allColors.push('#000000');
  allColors.push('#FFFFFF');
  allColors.push('#999900');
  allColors.push('#4C9900');
  allColors.push('#009900');
  allColors.push('#00994C');
  allColors.push('#009999');
  allColors.push('#004C99');
  allColors.push('#000099');
  allColors.push('#4C0099');
  allColors.push('#990099');
  allColors.push('#99004C')

  allColors.push('#FF0000');
  allColors.push('#FF8000');
  allColors.push('#FFFF00');
  allColors.push('#80FF00');
  allColors.push('#00FF00');
  allColors.push('#00FF80');
  allColors.push('#00FFFF');
  allColors.push('#0080FF');
  allColors.push('#0000FF');
  allColors.push('#7F00FF');
  allColors.push('#FF00FF');
  allColors.push('#58906F');
  allColors.push('#FF007F');
  //

  allColors.push('#FF9999');
  allColors.push('#FFCC99');
  allColors.push('#FFFF99');
  allColors.push('#CCFF99');
  allColors.push('#99FF99');
  allColors.push('#99FFCC');
  allColors.push('#99FFFF');
  allColors.push('#99CCFF');
  allColors.push('#9999FF');
  allColors.push('#CC99FF');
  allColors.push('#FF99FF');
  allColors.push('#FF99CC');
  ////////////////////////////////////////
  allColors.push('#663CE6');
  allColors.push('#1413ED');
  allColors.push('#1B46D6');
  allColors.push('#2986F0');
  allColors.push('#12A6E3'); /////
  allColors.push('#2027E3');
  allColors.push('#5D37F0');
  allColors.push('#7729D6');
  allColors.push('#AF21ED');
  allColors.push('#DC0099');
  allColors.push('#DC49E6'); ///////////////
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
  var p = getMousePos(ctx.canvas, e);
  $("#" + socket.id + "-span").css("left", e.pageX - (CorrectionX - 15))
  $("#" + socket.id + "-span").css("top", e.pageY - (CorrectionY - 15))
  $("#" + socket.id + "-cursor").css("left", e.pageX - (CorrectionX + 18))
  $("#" + socket.id + "-cursor").css("top", e.pageY - (CorrectionY + 12))
  socket.emit("UserMoved", {
    x: e.pageX - CorrectionX,
    y: e.pageY - CorrectionY,
    id: socket.id + "-span",
    cursorid: socket.id + "-cursor",
    Username: Username
  })
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
  chat = document.getElementById("chatArea");
  commentSpan.value = Username + ": " + commBox.value + '\n';
  commentSpan.innerHTML = Username + ": " + commBox.value + '\n';
  commBox.value = "";
  commentSpan.classList = 'redSpan'
  commentSpan.style.font = ' italic bold 18px Times, Times New Roman, serif;'
  chat.value = chat.value + commentSpan.value;
  if (chatCounter > chatLimit) {
    chat.innerHTML = '';
    chatCounter = 0;
  }
  chat.append(commentSpan);
  chatCounter++
})
document.querySelector("#commentBox").addEventListener("keydown", event => {
  if (event.key !== "Enter") return;
  document.querySelector("#CommentBtn").click();
  event.preventDefault();
});
document.querySelector("#NameBox").addEventListener("keydown", event => {
  if (event.key !== "Enter") return;
  document.querySelector("#NameBtn").click();
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
setInterval(DrawCanv, 1);
window.onkeydown = handleKeyDown;

function handleKeyDown(event) {
  if (event.key === "t" && NamePicked) {
    var tempColor = ctx.getImageData(mouseX - CorrectionX, mouseY - CorrectionY, 1, 1).data;
    if (!(mouseX - 9 > canvWidth || mouseY - 9 > canvHeight)) {
      BoolFill = true;
      CreatePath({
        x: mouseX - CorrectionX,
        y: mouseY - CorrectionY,
        color: tempColor
      }, ctx, points, color) //ctx.getImageData(mouseX, mouseY, 1, 1).data
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