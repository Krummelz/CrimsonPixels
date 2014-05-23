var GameState = function(game) {

  this.Net = new Net('http://localhost:3002/');

  this.player = {};
  this.enemyGroup = {};
};
GameState.prototype.preload = function(){
  //load all assets
  game.load.image("bullet", "assets/bullet.png");
  game.load.image('grass', 'assets/grass.png');
  game.load.spritesheet('playerSheet', 'assets/playerSheet.png', 16, 16);
  game.load.spritesheet('zombieSheet', 'assets/zombieSheet.png', 16, 16);

  //allows upscaling pixel art without blur
  game.stage.smoothed = false;
};
GameState.prototype.create = function() {
  //background color for the game
  game.stage.backgroundColor = "#eeeeee";

  //grass
  game.add.tileSprite(0, 0, 2000, 2000, 'grass');

  //start the arcade physics system
  game.physics.startSystem(Phaser.Physics.ARCADE);
  //set game world bounds
  game.world.setBounds(0, 0, 1400, 1400);

  //create the player
  this.player = new Player(game, game.camera.width / 2, game.camera.height / 2);


  //create enemies
  this.enemyGroup = game.add.group();
  this.enemyGroup.enableBody = true;
  this.enemyGroup.physicsBodyType = Phaser.Physics.ARCADE;
  for (var i = 0; i < 200; i++) {
    //spawn a new enemy
    this.spawnEnemy();
  }
};
GameState.prototype.update = function() {
  //check collisions between bullets and enemies
  game.physics.arcade.overlap(this.player.bulletGroup, this.enemyGroup, this.bulletHitEnemy, null, this);

  //make player collide with zombies
  game.physics.arcade.collide(this.player, this.enemyGroup);
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
  tempPosition.x = game.world.randomX;
  tempPosition.y = game.world.randomY;

  while (game.physics.arcade.distanceBetween(tempPosition, this.player) < 200){
    //generate new random position until it's far enough away
    tempPosition.x = game.world.randomX;
    tempPosition.y = game.world.randomY;
  }

  //spawn a new enemy
  var enemy = new Enemy(game, tempPosition.x, tempPosition.y, this.player);
  //game.physics.enable(enemy, Phaser.Physics.ARCADE);
  this.enemyGroup.add(enemy);
};
