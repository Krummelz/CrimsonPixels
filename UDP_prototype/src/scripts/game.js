var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)

var game = new Phaser.Game( w, h, Phaser.AUTO);
game.state.add("game", GameState, true);

var _net = Net(game);