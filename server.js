var express = require('express');
var app = express();
var socket = require('socket.io');
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
//
var server = app.listen(port, function () {
  console.log("3000......")
})
var io = socket(server);
var canvWidth = 1150;
var UserNameList = [];
var connectCounter = 0;
var MouseEventsList = [];
var SpanInfo = [];

app.use(express.static('public/bundle'));

app.use(express.static('public/ScriptsAndStyles'));
app.use(express.static('public/Resources'));
app.use(express.static('public/Modules'));
app.use(express.static('public/bundle'));
io.on('connection', function (socket) {
  socket.on('connect', function () {
    connectCounter++;
  });
  socket.on('disconnect', function () {
    connectCounter--;
  });
  socket.emit('myname', socket.id);
  UserNameList.push({
    Name: "anon",
    Id: socket.id
  })
  socket.on('draw', function (data) {
    io.sockets.emit('draw', data);
  })

  socket.on('fill', function (data) {
    socket.broadcast.emit('fill', data);
    MouseEventsList.push({
      data: data,
      command: "FillMouseEvent"
    })
  })
  socket.on('comment', function (data) {
    socket.broadcast.emit('comment', data)
  })
  socket.on("NameChange", function (data) {
    var temp;
    SpanInfo.forEach(item => {
      if (item.id === data.id) {
        item.Username = data.Username;
        temp = item
      }

    })
    socket.broadcast.emit("NameChange", temp)

  })
  socket.on('UserMoved', function (data) {
    socket.broadcast.emit('UserMoved', data)
    var tempBool = false;
    for (var i = 0; i < SpanInfo.length; i++) {
      if (SpanInfo[i].id === data.id) {
        SpanInfo[i] = data;
        tempBool = true;
      }
    }
    if (!tempBool) SpanInfo.push(data)

  })
  socket.on("MouseEvents", function (data) {
    var templist = []
    for (var i = 0; i < data.length; i++) {
      MouseEventsList.push({
        data: data[i],
        command: "DrawMouseEvent"
      });
      templist.push({
        data: data[i],
        command: "DrawMouseEvent"
      });
    }
    socket.broadcast.emit("draw", {
      data: templist
    });


  })
  socket.emit("draw", {
    data: MouseEventsList
  })
  socket.emit("newUserSpans", SpanInfo);

})

function GetBoolIndex(x, y) {
  return (y * canvWidth) + x

}
//