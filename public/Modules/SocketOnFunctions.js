const {rgbaToText} = require("./PixelFunctions.js")
const {CreatePath} = require("./FillToolFunctions.js")
var $ = require("jquery")

function Socket_DrawEvents_Recieved(ctx,color,socket,DrawingEnviroment){

    socket.on('draw', function (data) {
        data.data.forEach((point) => {
          if (point.command === "DrawMouseEvent") {
            ctx.fillStyle = rgbaToText(point.data.color)
            ctx.fillRect(point.data.x, point.data.y, point.data.BrushSize, point.data.BrushSize)
          }
          if (point.command === "FillMouseEvent") {
            var temp = color.slice(0)
            color[0] = point.data.hostColor[0]
            color[1] = point.data.hostColor[1]
            color[2] = point.data.hostColor[2]
            color[3] = point.data.hostColor[3]
            DrawingEnviroment.tools.bucket.FillArea({
              x: point.data.x,
              y: point.data.y,
              color: point.data.color
            }, ctx, color)
            color[0] = temp[0]
            color[1] = temp[1]
            color[2] = temp[2]
            color[3] = temp[3]
          }
        })   
      })
}


function Socket_MouseEvents_Recieved(ctx,socket){
    socket.on("MouseEvent", function (data) {
        data.points.forEach((item, i) => {
          if (item.y < ctx.canvas.height ) {
            ctx.fillStyle = rgbaToText(data.color)
            ctx.beginPath()
            ctx.arc(item.x, item.y, 0.5, 0, 2 * Math.PI)
            ctx.fill()
          }
        })
      
      })
}

function Socket_HandleUserMovement_Recieved(socket){
    socket.on("UserMoved", function (data) {
        if (document.getElementById(data.id) === null) {
          var tempspan = document.createElement("span")
          var tempcursor = document.createElement("div")
          var tempcursorImage = document.createElement("img")
          tempspan.id = data.id
          tempcursor.id = data.cursorid
          document.getElementById("container").appendChild(tempspan)
          document.getElementById("container").appendChild(tempcursor)
          tempcursor.appendChild(tempcursorImage)
          $("#" + data.id).css("left", data.x)
          $("#" + data.id).css("top", data.y)
          $("#" + data.id).css("position", "absolute")
          tempcursorImage.src = "Cursor.png"
          tempcursor.id = data.cursorid
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
}

function Socket_NewUser_Recieved(socket){
    socket.on("newUserSpans", function (data) {
        data.forEach(function (data) {
          var tempspan = document.createElement("span")
          var tempcursorImage = document.createElement("img")
          tempspan.id = data.id
          var tempcursor = document.createElement("div")
          //var tempCursorToolIcon=document.createElement("img")
      
          document.getElementById("container").appendChild(tempspan)
          document.getElementById("container").appendChild(tempcursor)
          tempcursor.appendChild(tempcursorImage)
          //tempcursor.appendChild(tempCursorToolIcon)
        
          tempcursorImage.src = "Cursor.png"
          tempcursor.id = data.cursorid
          $("#" + data.id).css("left", data.x)
          $("#" + data.id).css("top", data.y)
          $("#" + data.id).css("position", "absolute")
          $("#" + data.cursorid).css("left", data.x - 12)
          $("#" + data.cursorid).css("top", data.y - 12)
          $("#" + data.cursorid).css("position", "absolute")
          document.getElementById(data.id).innerHTML = data.Username
        })
      })

}


function Socket_FillEvent_Recieved(ctx,color,socket,DrawingEnviroment){
    socket.on('fill', function (data) {

        var temp = color.slice(0)
        color[0] = data.hostColor[0]
        color[1] = data.hostColor[1]
        color[2] = data.hostColor[2]
        color[3] = data.hostColor[3]
      
        DrawingEnviroment.tools.bucket.FillArea({
          x: data.x,
          y: data.y,
          color: data.color
        }, ctx, color)
      
        color[0] = temp[0]
        color[1] = temp[1]
        color[2] = temp[2]
        color[3] = temp[3]
      
      
      })
}
function Socket_NameChangeEvent_Recieved(socket){

    socket.on("NameChange", function (data) {
        document.getElementById(data.id).innerHTML = data.Username
      })
}

function Socket_CommentEvent_Recieved(socket){
   
    socket.on('comment', function (data) { 
        var chat = document.getElementById("chatArea")
        var RecievedCommentSpan = document.createElement('div')
        RecievedCommentSpan.classList = "blueSpan"
        RecievedCommentSpan.style.font = ' italic bold 18px Times, Times New Roman, serif'
        RecievedCommentSpan.value = "  " + data + "\n"
        RecievedCommentSpan.innerHTML = " \n" + data
        if (chatCounter > chatLimit) {
          chatCounter = 0
          chat.innerHTML = ''
        }
        chatCounter++
        chat.append(RecievedCommentSpan)
      
      })
}

function ReturnChatCount(){ return chatCounter}
function ChatCount_Inc(){  chatCounter++}
function ChatCount_Set(num){  chatCounter=num}
function ReturnChatLimit(){ return chatLimit }

module.exports = {
    Socket_DrawEvents_Recieved,Socket_MouseEvents_Recieved,Socket_HandleUserMovement_Recieved,
    Socket_NewUser_Recieved,Socket_FillEvent_Recieved,Socket_NameChangeEvent_Recieved,
    Socket_CommentEvent_Recieved,ReturnChatCount,ReturnChatLimit,
    ChatCount_Inc,ChatCount_Set
   
}