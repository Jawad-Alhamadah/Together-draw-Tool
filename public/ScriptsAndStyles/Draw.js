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
const {rgbaToText,hexToRGB, RGBToHex} = require("../Modules/PixelFunctions.js")
const {RandomizeChatIcon,setUpInitialEnviroment}=require("../Modules/SetUpFunctions.js")
const DrawingEnv=require("../Modules/DrawingEnviroment.js")
//
//https://draw-with-us.herokuapp.com/ 
//http://localhost:3000
var socket = io.connect('https://draw-with-us.herokuapp.com', {
  transports: ['websocket']
})

var setup={
  canvWidth:1100,
  canvHeight:500,
  correctionX:135,
  correctionY:22,
  userName:"anon",
  color:"#000000",
  brushSize : 2,
  brushSizeUpperLimit : 6,
  brushSizeLowerLimit : 2,
  chatLimit : 18,
  chatCounter : 0,
}
var canvas = document.getElementById('Canvas')
var ctx = canvas.getContext('2d')
ctx.canvas.width = setup.canvWidth
ctx.canvas.height = setup.canvHeight
var DrawingEnviroment = new DrawingEnv.DrawingEnviroment(setup)

socket.on('connect', () => {
  RandomizeChatIcon(BackgroundIcon_1, BackgroundIcon_3)
  setUpInitialEnviroment(ctx, socket, DrawingEnviroment.color, DrawingEnviroment.userName, DrawingEnviroment)
  setInterval(sendUsersMovments, 20)
  setInterval(drawAndEmitInterval, 10)
  window.onkeydown = handleKeyDown
})
//listener for mouseDown on canvas.  
canvas.addEventListener('mousedown', function (event) {
  var isEventALeftClick = event.which == 1
  if (!isEventALeftClick) return
    DrawingEnviroment.mouse.isDown = true
    if (DrawingEnviroment.tools.bucket.isActive) 
      DrawingEnviroment.tools.bucket.useBucket(
        DrawingEnviroment.color, 
        socket, 
        DrawingEnviroment.isNamePicked, 
        DrawingEnviroment.mouse,
        DrawingEnviroment.canvWidth,
        DrawingEnviroment.canvHeight, 
        ctx)
    if (DrawingEnviroment.tools.colorPicker.isActive) {
      var mouse = DrawingEnviroment.mouse
      var pickedColor = ctx.getImageData(mouse.x - mouse.CorrectionX, mouse.y - mouse.CorrectionY, 1, 1).data
      DrawingEnviroment.setBrushColor(pickedColor)
      DrawingEnviroment.savedColor = pickedColor
      //val function needs hex
      var colorInHex = RGBToHex(pickedColor)
      $("#ColorInput").val(colorInHex)
    }
 
})
canvas.addEventListener('mouseup', function () {
  DrawingEnviroment.mouse.isDown = false
})

function drawAndEmitInterval() {
  var mouse = DrawingEnviroment.mouse
  var eraser = DrawingEnviroment.tools.eraser
  var brush = DrawingEnviroment.tools.brush
  if (mouse.isDown && (brush.isActive || eraser.isActive)) {
    var straightLineListPoints = calcStraightLine({
      left: mouse.x - mouse.CorrectionX,
      top: mouse.y - mouse.CorrectionY
    }, {
      left: mouse.previousX - mouse.CorrectionX,
      top: mouse.previousY - mouse.CorrectionY
    }, DrawingEnviroment.color, DrawingEnviroment.brushSize)

    for (var i = 0; i < straightLineListPoints.length; i++) {
      var x = straightLineListPoints[i].x
      var y = straightLineListPoints[i].y
      var fillSize = DrawingEnviroment.brushSize
      ctx.fillStyle = rgbaToText(DrawingEnviroment.color)
      ctx.fillRect(x, y, fillSize, fillSize)
    }
    //
    socket.emit("MouseEvents", straightLineListPoints)
  }
}

$("#ColorInput").on("input",(event) => {
  DrawingEnviroment.setBrushColor(hexToRGB(event.target.value, 255))
  DrawingEnviroment.savedColor = hexToRGB(event.target.value, 255)
  //the Eraser sets the color to white. We need to set the tool to brush to avoid painting color with an eraser.
  if (DrawingEnviroment.tools.eraser.isActive) DrawingEnviroment.tools.activateBrush(DrawingEnviroment)

})

$("body").mousemove(function (event) {
  DrawingEnviroment.iconFollowMouse(socket, event)
})

$("#CommentBtn").click(function () {
  var commentBox = document.getElementById("commentBox")
  var comment = `${DrawingEnviroment.userName} : ${commentBox.value} \n`
  DrawingEnviroment.makeAComment(comment, "redSpan")
  commentBox.value = ""
  socket.emit('comment', comment)
})
document.querySelector("#commentBox").addEventListener("keydown", event => {
  if (event.key !== "Enter") return
  document.querySelector("#CommentBtn").click()
  event.preventDefault()
})

$("#NameBtn").click(function () {
  var NameBox = document.getElementById("NameBox")
  NameBox.value = NameBox.value.trim()
  var isNameAccepted = !DrawingEnviroment.isNamePicked && NameBox.value != ""
  if (isNameAccepted) {
    DrawingEnviroment.changeName()
    document.getElementById(socket.id + "-span").innerHTML = DrawingEnviroment.userName
    socket.emit("NameChange", {
      id: socket.id + "-span",
      Username: DrawingEnviroment.userName
    })
  }
})

function sendUsersMovments(){
  socket.emit("UserMoved", {
    x: DrawingEnviroment.mouse.x - DrawingEnviroment.mouse.CorrectionX,
    y: DrawingEnviroment.mouse.y - DrawingEnviroment.mouse.CorrectionY,
    id: socket.id + "-span",
    cursorid: socket.id + "-cursor",
    Username: DrawingEnviroment.userName
  })
}

function handleKeyDown(event) {
  if (event.key === "t") {
    DrawingEnviroment.tools.bucket.useBucket(
      DrawingEnviroment.color, 
      socket, 
      DrawingEnviroment.isNamePicked, 
      DrawingEnviroment.mouse,
      DrawingEnviroment.canvWidth,
      DrawingEnviroment.canvHeight, 
      ctx)
  }
}
