var GameState = function (game) {
  this.allPlayers = [];
  this.player = {};
  this.enemyGroup = {};
  this.crosshair;
  this.damageOverlay;
};

GameState.prototype = {
  preload: function(){
    //load all assets
    game.load.image("bullet", "assets/bullet.png");
    game.load.image('grass', 'assets/grass.png');
    game.load.image('crosshair', 'assets/crosshair.png');
    game.load.spritesheet('playerSheet', 'assets/playerSheet.png', 16, 16);
    game.load.spritesheet('zombieSheet', 'assets/zombieSheet.png', 16, 16);

    //allows upscaling pixel art without blur
    game.stage.smoothed = false;
  },
  create: function(){
    //background color
    this.game.stage.backgroundColor = '#000000';

    //grass
    game.add.tileSprite(0, 0, w, w, 'grass');
;
    //set game world bounds
    //TODO: find issue with world being larger than screen size, affecting cursor position
    game.world.setBounds(0, 0, w, h);

    this.crosshair = game.add.image(game.input.activePointer.x, game.input.activePointer.y, 'crosshair');
    this.crosshair.anchor.setTo(0.5, 0.5);

    this.enemyGroup = game.add.group();
    this.enemyGroup.enableBody = true;
    this.enemyGroup.physicsBodyType = Phaser.Physics.ARCADE;

    this.allPlayers = game.add.group();

    //add this player
    var temp = Date.now();
    this.player = new Player(game, {
      id: temp,
      nickname: 'PLayer_' + temp,
      x: game.world.randomX,
      y: game.world.randomY,
      current:true
    });
    this.AddPlayer(this.player);

    //spawn a new enemy every two seconds
    game.time.events.repeat(Phaser.Timer.SECOND * 2, 20, this.SpawnEnemy, this);
  },
  AddPlayer: function(newPlayer){
    //add to allPLayers
    this.allPlayers.add(newPlayer);

    //re-broadcast all enemy data when a new player joins
    this.enemyGroup.forEach(function(enemy){
      var obj = {
        id: enemy.id,
        x: enemy.body.x,
        y: enemy.body.y,
        msgType: _net.msgType.SpawnEnemy
      };
      _net.send(obj, ddlEncoding.value);
    });
  },
  update: function() {
    //update the player's crosshair
    this.crosshair.x = game.input.activePointer.x;
    this.crosshair.y = game.input.activePointer.y;

    this.allPlayers.forEach(function(player){
      //check collisions between bullets and enemies
      game.physics.arcade.overlap(player.bulletGroup, this.enemyGroup, this.bulletHitEnemy, null, this);

      //check collisions with the player and enemies
      game.physics.arcade.collide(player, this.enemyGroup);//, this.enemyHitPlayer);

      //check collisions with the players
      game.physics.arcade.collide(player, this.allPlayers);
    }, this);
  },
  render: function(){
    //some nice debugging
    //    game.debug.geom(new Phaser.Rectangle(this.player.body.x, this.player.body.y, this.player.body.width, this.player.body.height), 'rgba(255,0,0,1)' );
    //    this.enemyGroup.forEach(function(enemy){
    //      game.debug.spriteBounds(enemy);
    //      game.debug.geom(new Phaser.Rectangle(enemy.body.x, enemy.body.y, enemy.body.width, enemy.body.height), 'rgba(255,0,0,1)' );
    //    });
  },
  enemyHitPlayer: function(player, enemy){
    //TODO: damage the player

  },
  bulletHitEnemy: function(bullet, enemy){
    bullet.kill();

    var obj = {
      id: enemy.id,
      msgType: _net.msgType.KillEnemy
    };

    enemy.destroy();

    _net.send(obj, ddlEncoding.value);
  },
  SpawnEnemy:function(packetData) {
    //get a position that is far enough away from the player
    var tempPosition = {x: -200, y: -200}; //off screen far away
    var enemyID;

    if(packetData) { //update from the network
      tempPosition.x = packetData.x;
      tempPosition.y = packetData.y;
      enemyID = packetData.id;
    }
    else {
      //generate a new position
      tempPosition.x = game.world.randomX;
      tempPosition.y = game.world.randomY;

      //make sure the temp position is further than 200 units away from the player
      while (game.physics.arcade.distanceBetween(tempPosition, this.player) < 200) {
        //generate new random position until it's far enough away
        tempPosition.x = game.world.randomX;
        tempPosition.y = game.world.randomY;
      }

      enemyID = 'Enemy_' + Date.now();
    }

    //make sure an enemy with this id doesn't already exist
    var exists = false;
    this.enemyGroup.forEach(function(enemy){
      if(enemy.id === enemyID){
        exists = true;
      }
    });
    if(exists === true)
    {
      return;
    }

    //spawn a new enemy
    var enemy = new Enemy(game, {
      id: enemyID,
      x: tempPosition.x,
      y: tempPosition.y
    });
    //game.physics.enable(enemy, Phaser.Physics.ARCADE);
    this.enemyGroup.add(enemy);

    if(!packetData) {
      //sync with the network
      var obj = {
        id: enemy.id,
        x: tempPosition.x,
        y: tempPosition.y,
        msgType: _net.msgType.SpawnEnemy
      };
      _net.send(obj, ddlEncoding.value);
    }
  },
  KillEnemy: function(data) {
    this.enemyGroup.forEach(function (enemy) {
      if (enemy) {
        if(enemy.id && data.id) {
          if(enemy.id === data.id) {
            enemy.destroy();
          }
        }
      }
    });
  },
  UpdatePlayer: function(packetData) {
    //this packetData would be from one player at a time
    var exists = false;

    this.allPlayers.forEach(function(player){
      //find this player and update their data
      if(player.id === packetData.id) {
        exists = true;
        //if this is not the current player, update their position
        if(player.current !== true) {
          player.x = packetData.x;
          player.y = packetData.y;
          player.rotation = packetData.rotation;
          if(packetData.shotFired){
            player.shoot(packetData.shotFired.x, packetData.shotFired.y);
          }
        }
      }
    });

    //the player for this packet was not found, add a player
    if(exists === false){
      //add to the game using the packetData
      var newPlayer = new Player(game, {
        id:packetData.id,
        nickname:packetData.nickname,
        x:packetData.x,
        y:packetData.y,
        rotation:packetData.rotation,
        current:false
      });

      this.AddPlayer(newPlayer);
    }
  },
  PlayerShoot: function(packetData) {
    this.allPlayers.forEach(function(player){
      if(player.id === packetData.id){
        player.net_Shoot(packetData.x, packetData.y);
      }
    });
  }

};