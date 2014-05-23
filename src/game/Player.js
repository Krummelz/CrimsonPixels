// Player constructor
var Player = function(game, x, y) {
  //call the bass Sprite class
  Phaser.Sprite.call(this, game, x, y, "playerSheet");

  game.physics.enable(this, Phaser.Physics.ARCADE);

  this.body.bounce.setTo(1.5);
  this.body.setSize(8, 8, 4, 4);
  this.game.add.existing(this); //TODO: move to Player class
  game.camera.follow(this);

  //some private vars
  this.fireRate = 100;
  this.nextFire = 0;
  this.bulletGroup = {};
  this.speed = 150;
  //using Pythagoras
  this.diagonalSpeed = Math.sqrt((this.speed*this.speed) * 2) / 2;

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

  this.keyboard = game.input.keyboard;

  //hook up an event handler for a click event
  game.input.onDown.add(this.shoot, this);
};

// Player is a type of Phaser.Sprite
Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function(){
  //make the player point towards the mouse cursor
  this.rotation = game.physics.arcade.angleToPointer(this);

  //either left or right
  if (this.keyboard.isDown(Phaser.Keyboard.A)) {
    this.body.velocity.x = -this.speed;
  }
  if (this.keyboard.isDown(Phaser.Keyboard.D)) {
    this.body.velocity.x = this.speed;
  }

  //either up or down
  if (this.keyboard.isDown(Phaser.Keyboard.W)) {
    this.body.velocity.y = -this.speed;
  }
  if (this.keyboard.isDown(Phaser.Keyboard.S)) {
    this.body.velocity.y = this.speed;
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
  if(!this.keyboard.isDown(Phaser.Keyboard.A) && !this.keyboard.isDown(Phaser.Keyboard.D) && !this.keyboard.isDown(Phaser.Keyboard.W) && !this.keyboard.isDown(Phaser.Keyboard.S))
  {
    this.animations.stop(true);
    this.body.velocity.x = 0;
    this.body.velocity.y = 0;
  }
  else{
    this.animations.play('walk', 4, true);
  }
};

Player.prototype.shoot = function() {
  //make the player shoot
  if(game.time.now > this.nextFire && this.bulletGroup.countDead() > 0){
    this.nextFire = game.time.now + this.fireRate;
    var bullet = this.bulletGroup.getFirstDead();
    bullet.reset(this.x, this.y);
    game.physics.arcade.moveToPointer(bullet, 300);
  }
};
