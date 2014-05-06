var express = require("express"),
    app = express(),
    server = require("http").createServer(app),
    io = require("socket.io").listen(server);

app.use(express.static(__dirname + "/../deploy"));

server.listen(3001);

console.log("Server running on port 3001");

io.sockets.on("connection", function (socket) {
  //placeholder for socket.io stuffs
});