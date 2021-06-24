
const {Socket_DrawEvents_Recieved,
       Socket_MouseEvents_Recieved,
       Socket_NewUser_Recieved,
       Socket_HandleUserMovement_Recieved,
       Socket_FillEvent_Recieved,
       Socket_NameChangeEvent_Recieved,
       Socket_CommentEvent_Recieved,
      }=require("./SocketOnFunctions.js")
var $ = require("jquery")
function UserNameAndCursorDivsSetup(socket,Username) {

    var TempSpan = document.createElement("span")
    var TempCursor = document.createElement("div")

    TempSpan.id = socket.id + "-span"
    TempCursor.id = socket.id + "-cursor"
    document.getElementById("container").appendChild(TempSpan)
    document.getElementById("container").appendChild(TempCursor)
    var tempcursorImage = document.createElement("img")
    var tempcursorImage_2 = document.createElement("img")
    TempCursor.appendChild(tempcursorImage)
    TempCursor.appendChild(tempcursorImage_2)
    tempcursorImage.src = "Cursor.png"
    tempcursorImage.id = "Image_1"
    tempcursorImage_2.id = "Image_2"
    document.getElementById(socket.id + "-span").innerHTML = Username
    document.getElementById("LoadingSpan").innerText = "Pick A Name:"
    $("#NameBtn").css("pointer-events", "auto")
    $("#NameBtn").css("filter", "brightness(100%)")
    document.querySelector("#NameBox").addEventListener("keydown", event => {
        if (event.key !== "Enter") return
        document.querySelector("#NameBtn").click()
        event.preventDefault()
    })
}

function RandomizeChatIcon(BackgroundIcon_1,BackgroundIcon_3){
    var IconRandomNum=Math.floor(Math.random() * (200 - 1 + 1) + 1)
    if(IconRandomNum<100){$("#chatArea").css("background-image",`url(${BackgroundIcon_1})`)}else
    if(IconRandomNum<200){$("#chatArea").css("background-image",`url(${BackgroundIcon_3})`)}
  }
  function setUpInitialEnviroment(ctx,socket,color,userName,DrawingEnviroment) {
   
    DrawingEnviroment.fillWithWhite(ctx)
    DrawingEnviroment.CreatePalletDivs()
    DrawingEnviroment.tools.activateBrush(DrawingEnviroment)
    addClickEvents(DrawingEnviroment)
    UserNameAndCursorDivsSetup(socket, userName)
    Socket_DrawEvents_Recieved(ctx, color, socket,DrawingEnviroment)
    Socket_MouseEvents_Recieved(ctx, socket)
    Socket_HandleUserMovement_Recieved(socket)
    Socket_NewUser_Recieved(socket)
    Socket_FillEvent_Recieved(ctx, color, socket,DrawingEnviroment)
    Socket_NameChangeEvent_Recieved(socket)
    Socket_CommentEvent_Recieved(socket,DrawingEnviroment)
  }

  function addClickEvents(DrawingEnviroment) {
    $("#SaveBtn").click((event) => document.getElementById("Canvas").toBlob(function (blob) {
      saveAs(blob, "pretty image.png")
    }))
    $("#BrushSizeUP").click((event) => {
      if (DrawingEnviroment.brushSize < DrawingEnviroment.brushSizeUpperLimit)
        DrawingEnviroment.brushSize++
    })
    $("#BrushSizeDown").click((event) => {
      if (DrawingEnviroment.brushSize > DrawingEnviroment.brushSizeLowerLimit)
        DrawingEnviroment.brushSize--
    })
    $("#EraserTool").click((event) => {
      if (!DrawingEnviroment.tools.eraser.isActive) {
        DrawingEnviroment.tools.activateEraser(DrawingEnviroment)
      }
  
    })
    $("#BrushTool").click((event) => {
      if (!DrawingEnviroment.tools.brush.isActive) {
        DrawingEnviroment.tools.activateBrush(DrawingEnviroment)
      }
    })
  
    $("#ColorPickerTool").click((event) => {
      if (!DrawingEnviroment.tools.colorPicker.isActive) {
        DrawingEnviroment.tools.activateColorPicker(DrawingEnviroment)
      }
    })
  
    $("#BucketTool").click((event) => {
      if (!DrawingEnviroment.tools.bucket.isActive) {
        DrawingEnviroment.tools.activateBucket(DrawingEnviroment)
      }
    })
  }

module.exports = {
    UserNameAndCursorDivsSetup,RandomizeChatIcon,setUpInitialEnviroment,addClickEvents
}