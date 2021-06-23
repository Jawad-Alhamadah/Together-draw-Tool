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

var BackgroundIcon_1="kitty-1.png"
var BackgroundIcon_3="painting-3.png"
var $ = require("jquery")
let {saveAs} = require('file-saver')
const {calcStraightLine} = require("../Modules/PixelMath.js")
const {rgbaToText,hexToRGB} = require("../Modules/PixelFunctions.js")
const {RandomizeChatIcon,setUpInitialEnviroment}=require("../Modules/SetUpFunctions.js")
const {ReturnChatCount,ReturnChatLimit,ChatCount_Set,ChatCount_Inc}=require("../Modules/SocketOnFunctions.js")
const DrawingEnv=require("../Modules/DrawingEnviroment.js")

//https://together-draw-stuff.herokuapp.com
//http://localhost:3000
var socket = io.connect('https://together-draw-stuff.herokuapp.com', {
  transports: ['websocket']
})
var canvas = document.getElementById('Canvas')
var ctx = canvas.getContext('2d')
var canvWidth = 1094
var canvHeight = 500
ctx.canvas.width=canvWidth
ctx.canvas.height=canvHeight
var CorrectionX = 120
var CorrectionY = 19

let DrawingEnviroment=new DrawingEnv.DrawingEnviroment(canvWidth,canvHeight,0,0,"anon","#000000",CorrectionX,CorrectionY)

socket.on('connect', () => {
  RandomizeChatIcon(BackgroundIcon_1,BackgroundIcon_3)
  setUpInitialEnviroment(ctx,socket,DrawingEnviroment.color,DrawingEnviroment.userName,DrawingEnviroment)
  setInterval(sendUsersMovments,1)
  
  })


canvas.addEventListener('mousedown', function (event) {
  var isEventALeftClick=event.which==1
  if(isEventALeftClick){
    DrawingEnviroment.mouse.isDown = true
    if (DrawingEnviroment.tools.bucket.isActive) {
      DrawingEnviroment.tools.bucket.useBucket(DrawingEnviroment.color,socket,DrawingEnviroment.isNamePicked,DrawingEnviroment,ctx)
    }
    if(DrawingEnviroment.tools.colorPicker.isActive){
     var pickedColor=ctx.getImageData(DrawingEnviroment.mouse.x - DrawingEnviroment.mouse.CorrectionX, DrawingEnviroment.mouse.y - DrawingEnviroment.mouse.CorrectionY, 1, 1).data
     DrawingEnviroment.setBrushColor(pickedColor)
    }
  }
})
///

canvas.addEventListener('mouseup', function () {
  DrawingEnviroment.mouse.isDown = false
})


function drawAndEmitInterval() {
  var mouse=DrawingEnviroment.mouse
  var eraser=DrawingEnviroment.tools.eraser
  var brush=DrawingEnviroment.tools.brush
  if (mouse.isDown && (brush.isActive || eraser.isActive)) {
    var straightLineListPoints = calcStraightLine({
      left: mouse.x - mouse.CorrectionX,
      top: mouse.y - mouse.CorrectionY
    }, {
      left: mouse.previousX - mouse.CorrectionX,
      top: mouse.previousY - mouse.CorrectionY
    }, DrawingEnviroment.color, DrawingEnviroment.brushSize)

    for (var i = 0; i < straightLineListPoints.length; i++) {
      var x=straightLineListPoints[i].x
      var y =straightLineListPoints[i].y
      var fillSize=DrawingEnviroment.brushSize
      ctx.fillStyle = rgbaToText(DrawingEnviroment.color)
      ctx.fillRect(x, y, fillSize, fillSize)
    }
    //
    socket.emit("MouseEvents", straightLineListPoints)
  }
}
//


$("#ColorInput").on("input",(e) => {
  DrawingEnviroment.color = hexToRGB(e.target.value, 255)

})

$("body").mousemove(function (e) {
  var mouse =DrawingEnviroment.mouse
  $("#" + socket.id + "-span").css("left", e.pageX - (mouse.CorrectionX - 15))
  $("#" + socket.id + "-span").css("top", e.pageY - (mouse.CorrectionY - 15))
  $("#" + socket.id + "-cursor").css("left", e.pageX - (mouse.CorrectionX + 18))
  $("#" + socket.id + "-cursor").css("top", e.pageY - (mouse.CorrectionY + 12))
  DrawingEnviroment.mouse.previousX = mouse.x
  DrawingEnviroment.mouse.previousY = mouse.y
  mouse.x = e.pageX
  mouse.y = e.pageY
 
})

$("#CommentBtn").click(function () {
  var commBox = document.getElementById("commentBox")
  socket.emit('comment', "  " + DrawingEnviroment.userName + ": " + commBox.value + "\n")
  var commentSpan = document.createElement('div')
  var chat = document.getElementById("chatArea")
  commentSpan.value = DrawingEnviroment.userName + ": " + commBox.value + '\n'
  commentSpan.innerHTML = DrawingEnviroment.userName + ": " + commBox.value + '\n'
  commBox.value = ""
  commentSpan.classList = 'redSpan'
  commentSpan.style.font = ' italic bold 18px Times, Times New Roman, serif'
  chat.value = chat.value + commentSpan.value
  if (ReturnChatCount() > ReturnChatLimit()) {
    chat.innerHTML = ''
    ChatCount_Set(0)
  }
  chat.append(commentSpan)
  ChatCount_Inc()
})
document.querySelector("#commentBox").addEventListener("keydown", event => {
  if (event.key !== "Enter") return
  document.querySelector("#CommentBtn").click()
  event.preventDefault()
})

$("#NameBtn").click(function () {
  var NameBox = document.getElementById("NameBox")
  NameBox.value = NameBox.value.trim()
  if (!DrawingEnviroment.isNamePicked && NameBox.value != "") {
    var NameBox = document.getElementById("NameBox")
    DrawingEnviroment.userName = NameBox.value
    DrawingEnviroment.isNamePicked = true
    DrawingEnviroment.userName = NameBox.value
    document.getElementById(socket.id + "-span").innerHTML = DrawingEnviroment.userName
    socket.emit("NameChange", {
      id: socket.id + "-span",
      Username: DrawingEnviroment.userName
    })
    NameBox.value = ""
    NameBox.setAttribute('readonly', 'readonly')
    $("#PickANameWindow").css("animation", "MoveUp 0.7s")
    $("#fullCanv").css("pointer-events", "auto")
    $("#fullCanv").css("animation", " OpacityUp 1.2s")
    $("#fullCanv").css("animation-fill-mode", "  forwards")
  }
})
setInterval(drawAndEmitInterval, 10)

function sendUsersMovments(){
  socket.emit("UserMoved", {
    x: DrawingEnviroment.mouse.x - DrawingEnviroment.mouse.CorrectionX,
    y: DrawingEnviroment.mouse.y - DrawingEnviroment.mouse.CorrectionY,
    id: socket.id + "-span",
    cursorid: socket.id + "-cursor",
    Username: DrawingEnviroment.userName
  })
}
window.onkeydown = handleKeyDown
/////////////////
function handleKeyDown(event) {
  if (event.key === "t") {
    DrawingEnviroment.tools.bucket.useBucket(DrawingEnviroment.color,socket,DrawingEnviroment.isNamePicked,DrawingEnviroment,ctx)
  }
}