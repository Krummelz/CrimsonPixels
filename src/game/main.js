/**
 *
 * This is a simple state template to use for getting a Phaser game up
 * and running quickly. Simply add your own game logic to the default
 * state object or delete it and make your own.
 *
 */

var player,
  enemyGroup,
  bulletGroup;

var fireRate = 100,
  nextFire = 0;

var state = {
  init: function () {

  },
  preload: function () {

    //load all assets
    game.load.image("player", "assets/player.png");
    game.load.image("enemy", "assets/enemy.png");
    game.load.image("bullet", "assets/bullet.png");

  },
  create: function () {

    game.stage.backgroundColor = "#eeeeee";

    //start the arcade physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //create the player
    player = game.add.sprite(game.world.width / 2, game.world.height / 2, "player");
    player.anchor.setTo(0.5, 0.5);
    game.physics.enable(player, Phaser.Physics.ARCADE);

    //create enemies
    enemyGroup = game.add.group();
    enemyGroup.enableBody = true;
    enemyGroup.physicsBodyType = Phaser.Physics.ARCADE;
    for (var i = 0; i < 20; i++) {
      var enemy = game.add.sprite(game.rnd.integerInRange(16, game.world.width - 16), game.rnd.integerInRange(16, game.world.height - 16), "enemy");
      enemyGroup.add(enemy);
      enemy.rotation = game.rnd.integerInRange(0, Math.PI*2);
      enemy.anchor.setTo(0.5, 0.5);
    }

    //bullets
    bulletGroup = game.add.group();
    bulletGroup.enableBody = true;
    bulletGroup.physicsBodyType = Phaser.Physics.ARCADE;
    //create 50, and set some collision handlers for all of them
    bulletGroup.createMultiple(50, "bullet");
    bulletGroup.setAll('checkWorldBounds', true);
    bulletGroup.setAll('outOfBoundsKill', true);

    //hook up an event handler for a click event
    game.input.onDown.add(this.playerShoot, this);
  },
  update: function () {

    //check input

    //make the player point towards the mouse cursor
    player.rotation = game.physics.arcade.angleToPointer(player);

    enemyGroup.forEachAlive(function (enemy) {
      //only rotate the enemy towards the player if they are in range
      if(game.physics.arcade.distanceBetween(enemy, player) < 200) {
        //move towards the player
        game.physics.arcade.moveToObject(enemy, player, 10);

        //rotate towards the player
        enemy.rotation = game.physics.arcade.angleBetween(enemy, player);//.angleToXY(player.body.x, player.body.y);
      }
      else{
        enemy.body.velocity.x = enemy.body.velocity.y = 0;
      }
    }, this);

    //TODO: do some Pythagoras later
    //movement
    if (game.input.keyboard.isDown(Phaser.Keyboard.A)) {
      player.body.x -= 3;
    }
    else if (game.input.keyboard.isDown(Phaser.Keyboard.D)) {
      player.body.x += 3;
    }
    if (game.input.keyboard.isDown(Phaser.Keyboard.W)) {
      player.body.y -= 3;
    }
    else if (game.input.keyboard.isDown(Phaser.Keyboard.S)) {
      player.body.y += 3;
    }

    //check collisions between bullets and enemies
    game.physics.arcade.overlap(bulletGroup, enemyGroup, this.enemyHit, null, this);
  },
  playerShoot: function () {
    //make the player shoot
    if(game.time.now > nextFire && bulletGroup.countDead() > 0){
      nextFire = game.time.now + fireRate;
      var bullet = bulletGroup.getFirstDead();
      bullet.reset(player.x, player.y);
      game.physics.arcade.moveToPointer(bullet, 300);
    }
  },
  enemyHit: function(bullet, enemy){
    bullet.kill();
    enemy.destroy();

    //spawn a new enemy
    var enemy = game.add.sprite(game.rnd.integerInRange(16, game.world.width - 16), game.rnd.integerInRange(16, game.world.height - 16), "enemy");
    enemyGroup.add(enemy);
    enemy.rotation = game.rnd.integerInRange(0, Math.PI*2);
    enemy.anchor.setTo(0.5, 0.5);
  }
};

var game = new Phaser.Game(
  800,
  480,
  Phaser.AUTO,
  'game',
  state
);