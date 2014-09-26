var GameState = function (game) {
  this.allPlayers = [];
  this.player = {};
};

GameState.prototype = {
  preload: function(){
    //load all assets
    game.load.image("bullet", "assets/bullet.png");
    game.load.image('grass', 'assets/grass.png');
    game.load.spritesheet('playerSheet', 'assets/playerSheet.png', 16, 16);
    game.load.spritesheet('zombieSheet', 'assets/zombieSheet.png', 16, 16);

    //allows upscaling pixel art without blur
    game.stage.smoothed = false;
  },
  create: function(){
    //background color
    this.game.stage.backgroundColor = '#000000';

    //grass
    game.add.tileSprite(0, 0, 640, 480, 'grass');

    //set game world bounds
    game.world.setBounds(0, 0, 640, 480);

    //add this player
    var temp = Date.now();
    this.player = new Player(game, {
      id:temp,
      nickname:'test_' + temp,
      x:50,//game.world.randomX,
      y:50,//game.world.randomY,
      current:true
    });
    this.allPlayers.push(this.player);
  },
  update: function() {


  },
  updateFromNetwork: function(packetData) {
    console.log("updateFromNetwork: " + JSON.stringify(packetData));
    //this packetData would be from one player at a time
    var exists = false;
    for(var i = 0; i < this.allPlayers.length; i++){
      //find this player and update their data
      if(this.allPlayers[i].id === packetData.id) {
        exists = true;
        //if this is not the current player, update their position
        if(this.allPlayers[i].current !== true) {
          this.allPlayers[i].x = packetData.x;
          this.allPlayers[i].y = packetData.y;
          this.allPlayers[i].rotation = packetData.rotation;
          if(packetData.shotFired){
            this.allPlayers[i].netShoot(packetData.shotFired.x, packetData.shotFired.y);
          }
        }
      }
    }

    //the player for this packet was not found, add a player
    if(exists === false){
      console.log('New Player added: ' + packetData.nickname);
      //add to the game using the packetData

      var newPlayer = new Player(game, {
        id:packetData.id,
        nickname:packetData.nickname,
        x:packetData.x,
        y:packetData.y,
        rotation:packetData.rotation,
        current:false
      });

      //add to allPLayers
      this.allPlayers.push(newPlayer);
    }
  }
};