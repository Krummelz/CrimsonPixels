var express = require("express"),
    app = express(),
    server = require("http").createServer(app),
    io = require("socket.io").listen(server);

app.use(express.static(__dirname + "/public"));

server.listen(3002);

console.log("Server running on port 3002");


io.sockets.on("connection", function (socket) {
  console.log('socket connected');
  socket.emit('hello', 'testing, testing');


  socket.on('disconnect', function () {
    console.log('socket disconnect');
  });
});