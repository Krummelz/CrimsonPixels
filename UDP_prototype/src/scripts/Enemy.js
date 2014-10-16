// Enemy constructor
var Enemy = function (game, settings) {
  //call the bass Sprite class
  Phaser.Sprite.call(this, game, settings.x, settings.y, "zombieSheet");

  game.physics.enable(this, Phaser.Physics.ARCADE);

  this.body.bounce.setTo(5);
  this.body.collideWorldBounds = true;
  this.body.acceleration = 2;
  this.body.setSize(10, 10, 0, 0);

  this.id = settings.id;
  //get and cache the collection of players in the game
  this._allPlayers = game.state.getCurrentState().allPlayers;

  //set some properties
  this.animations.add('walk');
  this.scale.setTo(2);
  this.rotation = game.rnd.integerInRange(0, Math.PI * 2);
  this.anchor.setTo(0.5, 0.5);
};

// Enemy is a type of Phaser.Sprite
Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.update = function () {
    //only rotate the enemy towards the player if they are in range

  this._allPlayers.forEach(function(player) {

    if (game.physics.arcade.distanceBetween(this, player) < 200) {
//      if (game.physics.arcade.distanceBetween(this, player) < 32) {
//        //don't play their walk animation
//        this.animations.stop(true);
//      }
//      else {
        //play their walk animation
        this.animations.play('walk', 2, true);

        //move towards the player
        game.physics.arcade.moveToObject(this, player, 10);

        //rotate towards the player
        this.rotation = game.physics.arcade.angleBetween(this, player);
//      }
    }
    else {
      //don't play their walk animation
      this.animations.stop(true);
      //zero their velocity
      this.body.velocity.x = this.body.velocity.y = 0;
    }
  }, this);
};