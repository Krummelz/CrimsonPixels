var Net = (function(){

  var instance;

  function init(game){

    //private
    var msgTypeEnums = {
      UpdatePlayer: 'UpdatePlayer',
      SpawnEnemy: 'SpawnEnemy',
      KillEnemy: 'KillEnemy',
      PlayerShoot: 'PlayerShoot'
    };

    function getGameState(){
      return game.state.getCurrentState();
    }


    //TODO: nodejs UDP stuffs
    var dgram = require('dgram');

    var s = dgram.createSocket('udp4');

    s.on('listening', function(){
      console.log('listening..');
    });

    s.on('error',function(err){
      console.log("server error:\n" + err.stack);
      s.dropMembership('224.1.2.3');
    });
    s.on('close',function(err){
      //not sure we need this? isn't it handled automatically?
      s.dropMembership('224.1.2.3');
    });

    //to handle receiving messages from the network
    s.on('message',function(msg, rinfo){

      var msgObj = JSON.parse(msg);

      //get the network data, and pass it onto the game to update what it needs to
      getGameState()[msgTypeEnums[msgObj.msgType]](msgObj);

    });

    s.bind(3001, function(){
      s.addMembership('224.1.2.3');
    });

    //to send messages over the network
    function sendMessage(packetData, encoding) {
      try {
        var string = JSON.stringify(packetData);
        var message = new Buffer(string, encoding);
        s.send(message, 0, message.length, 3001, "224.1.2.3", function (err, bytes) {
          if (err) {
            console.log("Error: " + err);
          }
        });
      } catch (ex){
        console.log("EXCEPTION: " + ex.message);
      }
    }


    //public
    return {
      msgType: msgTypeEnums,
      send: sendMessage
    };
  }

  return (function(game){
    if(!instance){
      instance = init(game);
    }
    return instance;
  });


})();