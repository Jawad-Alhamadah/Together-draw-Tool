var express = require('express')
var app = express()
var socket = require('socket.io')
let port = process.env.PORT

if (port == null || port == "") port = 4500
console.log(port)
//let dockerPort = 4500
/////
let counter=0;
var server = app.listen(port, function () {
  console.log(port+"......")
})

let getRandom = integer => Math.floor(Math.random()*integer)

var io = socket(server)
//var UserNameList = []
var MouseEventsList = []
var SpanInfo = []

app.use(express.static('public/bundle'))
app.use(express.static('public/ScriptsAndStyles'))
app.use(express.static('public/Resources'))
app.use(express.static('public/Modules'))
app.use(express.static('public/bundle'))

app.get('/home', (request,response) =>{
    
    response.status(200).json([
        {
            'id':"1",
            "name":"johnjnn",
            "order":"burgerssss"
        },
        {
            'id':"2",
            "name":"sam",
            "order":"noodles"
        },
        {
            'id':"3",
            "name":"eric",
            "order":"pancakes"
        }
    ])
})

io.on('connection', function (socket) {
  // let randomUser = getRandom(UserNameList.length)
  // if(UserNameList.length>0) {
  //   io.to(randomUser.Id).emit("UserConnected",{Id:socket.id})
  // }
  
  // socket.on('UserConnected', function (data) {
  //   io.to(data.id).emit('DrawCanvas', data);
  // })
  
  // UserNameList.push({
  //   Name: "anon",
  //   Id: socket.id
  // })

  // socket.on('draw', function (data) {
  //   console.log("on draw : ", data)
  //   io.sockets.emit('draw', data);
  // })

  socket.on('fill', function (data) {
    counter++;
    console.log(counter);
    //console.log("on fill : ", data)
    socket.broadcast.emit('fill', data)

    MouseEventsList.push({
      data: data,
      command: "FillMouseEvent"
    })
  })
  socket.on('comment', function (data) {
    counter++;
    console.log(counter);
 
    socket.broadcast.emit('comment', data)
  })
  socket.on("NameChange", function (data) {
    counter++;
    console.log(counter);
 
    var temp;
 
    SpanInfo.forEach(item => {
      if (item.id === data.id) {
        item.Username = data.Username;
        temp = item
      }
    })
  
    counter++
    console.log(counter)
    socket.broadcast.emit("NameChange", temp)

  })
  socket.on('UserMoved', function (data) {
    counter++
    console.log(counter)

    counter++
    console.log(counter)
    socket.broadcast.emit('UserMoved', data)
    var tempBool = false
    for (var i = 0; i < SpanInfo.length; i++) {
      if (SpanInfo[i].id === data.id) {
        SpanInfo[i] = data;
        tempBool = true;
      }
    }
    if (!tempBool) SpanInfo.push(data)

  })
  socket.on("MouseEvents", function (data) {
    counter++
    console.log(counter)
   
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
    counter++
    console.log(counter)
    socket.broadcast.emit("draw", {
      data: templist
    });
  })


  socket.emit("draw", {
    data: MouseEventsList
  })
  counter++
    console.log(counter)
  socket.emit("newUserSpans", SpanInfo)
})

//
//