// Player constructor
var Player = function(game, x, y) {
  //call the bass Sprite class
  Phaser.Sprite.call(this, game, x, y, "playerSheet");

  game.physics.enable(this, Phaser.Physics.ARCADE);

  //some private vars
  this.fireRate = 100;
  this.nextFire = 0;
  this.bulletGroup = {};

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

  //hook up an event handler for a click event
  game.input.onDown.add(this.shoot, this);
};

// Player is a type of Phaser.Sprite
Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function(){
  //make the player point towards the mouse cursor
  this.rotation = game.physics.arcade.angleToPointer(this);

  //TODO: do some Pythagoras later

  //movement
  if (game.input.keyboard.isDown(Phaser.Keyboard.A)) {
    this.body.x -= 3;
    this.animations.play('walk', 4, true);
  }
  else if (game.input.keyboard.isDown(Phaser.Keyboard.D)) {
    this.body.x += 3;
    this.animations.play('walk', 4, true);
  }
  if (game.input.keyboard.isDown(Phaser.Keyboard.W)) {
    this.body.y -= 3;
    this.animations.play('walk', 4, true);
  }
  else if (game.input.keyboard.isDown(Phaser.Keyboard.S)) {
    this.body.y += 3;
    this.animations.play('walk', 4, true);
  }
  //if no keys are down, stop the animation
  if(!game.input.keyboard.isDown(Phaser.Keyboard.A) && !game.input.keyboard.isDown(Phaser.Keyboard.D) && !game.input.keyboard.isDown(Phaser.Keyboard.W) && !game.input.keyboard.isDown(Phaser.Keyboard.S))
  {
    this.animations.stop(true);
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
