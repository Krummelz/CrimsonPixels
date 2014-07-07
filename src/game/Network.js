(function (window) {

  // privat vars
  var events = [
    'connect',
    'connecting',
    'disconnect',
    'connect_failed',
    'error',

    'addPlayer',
    'updatePlayers'
  ];

  var players = [];
  var socket;
  var _gameState;

  var Net = {

    connect: function() {
      console.log("socket connect");
    },
    connecting: function() {
      console.log("socket connecting");
    },
    disconnect: function() {
      console.log("socket disconnect");
    },
    connect_failed: function() {
      console.log("socket connect_failed");
    },
    error: function() {
      console.log("socket error");
    },



    addPlayer: function(nickname, x, y) {
      console.log("socket addPlayer");
      socket.emit('addPlayer', nickname, x, y);
    },

    updatePlayers: function(allPlayers, currentPlayer){
      console.log("socket updatePlayers");
      _gameState.initPlayer(currentPlayer);
      _gameState.updatePlayers(allPlayers);
    },


    init: function(gameState) {
      _gameState = gameState;
      //create and connect socket.io
      socket = io();

      //hook up event handlers
      for (var i = 0; i < events.length; i++) {
        socket.on(events[i], this[events[i]]);
      }
    }

  };

  window.Net = Net;

})(window);