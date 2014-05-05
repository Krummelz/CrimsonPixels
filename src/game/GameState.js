var GameState = function(game) {
  this.player = {};
  this.enemyGroup = {};
};
GameState.prototype.preload = function(){
  //load all assets
  game.load.image("bullet", "assets/bullet.png");
  game.load.spritesheet('playerSheet', 'assets/playerSheet.png', 16, 16);
  game.load.spritesheet('zombieSheet', 'assets/zombieSheet.png', 16, 16);

  //allows upscaling pixel art without blur
  game.stage.smoothed = false;
};
GameState.prototype.create = function() {
  //background color for the game
  game.stage.backgroundColor = "#eeeeee";

  //start the arcade physics system
  game.physics.startSystem(Phaser.Physics.ARCADE);

  //create the player
  this.player = new Player(game, game.world.width / 2, game.world.height / 2);
  this.game.add.existing(this.player);

  //create enemies
  this.enemyGroup = game.add.group();
  this.enemyGroup.enableBody = true;
  this.enemyGroup.physicsBodyType = Phaser.Physics.ARCADE;
  for (var i = 0; i < 20; i++) {
    //spawn a new enemy
    this.spawnEnemy();
  }
};
GameState.prototype.update = function() {
  //check collisions between bullets and enemies
  game.physics.arcade.overlap(this.player.bulletGroup, this.enemyGroup, this.bulletHitEnemy, null, this);
};
GameState.prototype.bulletHitEnemy = function(bullet, enemy) {
  bullet.kill();
  enemy.destroy();

  //spawn a new enemy
  this.spawnEnemy();
};
GameState.prototype.spawnEnemy = function(){
  //get a position that is far enough away from the player
  var tempPosition = {x:-200, y:-200}; //off screen far away
  //generate a new position
  tempPosition.x = game.rnd.integerInRange(16, game.world.width - 16);
  tempPosition.y = game.rnd.integerInRange(16, game.world.height - 16)

  while (game.physics.arcade.distanceBetween(tempPosition, this.player) < 200){
    //generate new random position until it's far enough away
    tempPosition.x = game.rnd.integerInRange(16, game.world.width - 16);
    tempPosition.y = game.rnd.integerInRange(16, game.world.height - 16)
  }

  //spawn a new enemy
  var enemy = new Enemy(game, tempPosition.x, tempPosition.y, this.player);
  this.enemyGroup.add(enemy);
};