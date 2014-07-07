var express = require("express"),
  app = express(),
  http = require("http").Server(app),
  io = require("socket.io")(http);

app.use(express.static(__dirname + "/../public"));


var ConnectedPlayerModel = require("./ConnectedPlayer");
var connectedPlayers = [];


io.on("connection", function (socket) {
  console.log('a user connected', socket.id);
  //var newPlayer = new connectedPlayer({id:socket.id});
  //players.push(newPlayer);

  socket.emit('newPlayerConnected', null);

  socket.on('addPlayer', function(nickname, x, y){
    console.log('server addPlayer');
    var newPlayer = new ConnectedPlayerModel(socket.id, nickname, x, y);
    connectedPlayers.push(newPlayer);
    socket.emit('updatePlayers', connectedPlayers, newPlayer);
  });


  socket.on('disconnect', function () {
    console.log('socket disconnect');

    //find and remove the player from the list of connected players

  });
});

http.listen(3002, function () {
  console.log('listening on *:3000');
});