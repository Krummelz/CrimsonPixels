// Player constructor
var Player = function (game, settings) {

  //call the bass Sprite class
  Phaser.Sprite.call(this, game, settings.x, settings.y, "playerSheet");

  game.physics.enable(this, Phaser.Physics.ARCADE);

  this.id = settings.id;
  this.nickname = settings.nickname;
  this.current = settings.current || undefined;
  this.ddlEncoding = document.getElementById("ddlEncoding");

  this.body.bounce.setTo(5);
  this.body.acceleration = 2;
  this.body.setSize(10, 10, 0, 0);
  this.body.collideWorldBounds = true;

  this.game.add.existing(this);

  this.health = 10; //built in - you can call Sprite.damage function too

  //some private vars
  this.fireRate = 100;
  this.nextFire = 0;
  this.bulletGroup = {};
  this.speed = 150;
  //using Pythagoras
  this.diagonalSpeed = Math.sqrt((this.speed * this.speed) * 2) / 2;

  //set some properties
  this.animations.add('walk');
  this.anchor.setTo(0.5, 0.5);
  this.scale.setTo(2);

  //setup bullets for the player
  this.bulletGroup = game.add.group();
  this.bulletGroup.enableBody = true;
  this.bulletGroup.physicsBodyType = Phaser.Physics.ARCADE;
  //create 50, and set some collision handlers for all of them
  this.bulletGroup.createMultiple(50, "bullet");
  this.bulletGroup.setAll('checkWorldBounds', true);
  this.bulletGroup.setAll('outOfBoundsKill', true);

  //hook up events only for the current player
  if(this.current === true) {
    game.camera.follow(this);
    this.keyboard = game.input.keyboard;
    //hook up an event handler for a click event
    game.input.onDown.add(this.PlayerShoot, this);
  }
};

// Player is a type of Phaser.Sprite
Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function () {

  if(this.current === true) {
      //TODO: sync over the network
      //  //make the player point towards the mouse cursor
      this.rotation = game.physics.arcade.angleToXY(this, game.input.activePointer.x, game.input.activePointer.y);

      //left
      if (this.keyboard.isDown(Phaser.Keyboard.A)) {
        this.body.velocity.x = -this.speed;
        this.body.velocity.y = 0;
      }
      //right
      if (this.keyboard.isDown(Phaser.Keyboard.D)) {
        this.body.velocity.x = this.speed;
        this.body.velocity.y = 0;
      }
      //up
      if (this.keyboard.isDown(Phaser.Keyboard.W)) {
        this.body.velocity.y = -this.speed;
        this.body.velocity.x = 0;
      }
      //down
      if (this.keyboard.isDown(Phaser.Keyboard.S)) {
        this.body.velocity.y = this.speed;
        this.body.velocity.x = 0;
      }

      //top left
      if ((this.keyboard.isDown(Phaser.Keyboard.W)) && (this.keyboard.isDown(Phaser.Keyboard.A))) {
        this.body.velocity.x = -this.diagonalSpeed;
        this.body.velocity.y = -this.diagonalSpeed;
      }
      //top right
      if ((this.keyboard.isDown(Phaser.Keyboard.W)) && (this.keyboard.isDown(Phaser.Keyboard.D))) {
        this.body.velocity.x = this.diagonalSpeed;
        this.body.velocity.y = -this.diagonalSpeed;
      }
      //bottom right
      if ((this.keyboard.isDown(Phaser.Keyboard.D)) && (this.keyboard.isDown(Phaser.Keyboard.S))) {
        this.body.velocity.x = this.diagonalSpeed;
        this.body.velocity.y = this.diagonalSpeed;
      }
      //bottom left
      if ((this.keyboard.isDown(Phaser.Keyboard.S)) && (this.keyboard.isDown(Phaser.Keyboard.A))) {
        this.body.velocity.x = -this.diagonalSpeed;
        this.body.velocity.y = this.diagonalSpeed;
      }


    //if no keys are down, stop the animation and movement
    if (!this.keyboard.isDown(Phaser.Keyboard.A) && !this.keyboard.isDown(Phaser.Keyboard.D) && !this.keyboard.isDown(Phaser.Keyboard.W) && !this.keyboard.isDown(Phaser.Keyboard.S)) {
      this.animations.stop(true);
      this.body.velocity.x = 0;
      this.body.velocity.y = 0;
    }
    else {
      this.animations.play('walk', 4, true);

      //broadcast player data over the network
      var obj = {
        id: this.id,
        nickname: this.nickname,
        x:this.x,
        y:this.y,
        rotation: this.rotation,
        current: this.current,
        msgType: _net.msgType.UpdatePlayer
      };
      _net.send(obj, ddlEncoding.value);
    }

  }
};

Player.prototype.PlayerShoot = function (packetData) {
  //make the player shoot
  if (game.time.now > this.nextFire && this.bulletGroup.countDead() > 0) {
    this.nextFire = game.time.now + this.fireRate;
    var bullet = this.bulletGroup.getFirstDead();
    bullet.reset(this.x, this.y);

//    if(packetData && packetData.msgType === _net.msgType.PlayerShoot) {
//      //spawn a bullet that was fired by someone else
//      game.physics.arcade.moveToXY(bullet, packetData.x, packetData.y, 300);
//    }
//    else {
      //sync shoots over the network
      var targetX = game.input.activePointer.x,
          targetY = game.input.activePointer.y;
      var obj = {
        id:this.id,
        x:targetX,
        y:targetY,
        msgType:_net.msgType.PlayerShoot
      };
      _net.send(obj, ddlEncoding.value);

      game.physics.arcade.moveToXY(bullet, targetX, targetY, 300);
//    }
  }
};

Player.prototype.net_Shoot = function(x, y){
  if (game.time.now > this.nextFire && this.bulletGroup.countDead() > 0) {
    this.nextFire = game.time.now + this.fireRate;
    var bullet = this.bulletGroup.getFirstDead();
    bullet.reset(this.x, this.y);
    game.physics.arcade.moveToXY(bullet, x, y, 300);
  }
};
