// Enemy constructor
var Enemy = function(game, x, y, player){
  //call the bass Sprite class
  Phaser.Sprite.call(this, game, x, y, "zombieSheet");

  //TODO: Try to fix this somehow: need to reference the global directly
  this.player = player; //set the global player to a local player.

  //set some properties
  this.animations.add('walk');
  this.scale.setTo(2);
  this.rotation = game.rnd.integerInRange(0, Math.PI*2);
  this.anchor.setTo(0.5, 0.5);
};

// Enemy is a type of Phaser.Sprite
Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.update = function() {
  //only rotate the enemy towards the player if they are in range

  if(game.physics.arcade.distanceBetween(this, this.player) < 200) {
    if(game.physics.arcade.distanceBetween(this, this.player) < 16) {
      //don't play their walk animation
      this.animations.stop(true);
      
    }
    else{
      //play their walk animation
      this.animations.play('walk', 2, true);

      //move towards the player
      game.physics.arcade.moveToObject(this, this.player, 10);

      //rotate towards the player
      this.rotation = game.physics.arcade.angleBetween(this, this.player);//.angleToXY(player.body.x, player.body.y);
    }
  }
  else{
    //don't play their walk animation
    this.animations.stop(true);
    //zero their velocity
    this.body.velocity.x = this.body.velocity.y = 0;
  }
};