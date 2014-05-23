var Net = function(host){

  this.events = [
    'connect',
    'connecting',
    'disconnect',
    'connect_failed',
    'error',

    'hello'
  ];

  this.socket = io.connect(host);

  //hook up event handlers
  for(var i = 0; i < this.events.length; i++){
    this.socket.on(this.events[i], this[this.events[i]]);
  }
};

Net.prototype.constructor = Net;

Net.prototype.connect = function() {
  console.log("socket connect");
};
Net.prototype.connecting = function() {
  console.log("socket connecting");
};
Net.prototype.disconnect = function() {
  console.log("socket disconnect");
};
Net.prototype.connect_failed = function() {
  console.log("socket connect_failed");
};
Net.prototype.error = function() {
  console.log("socket error");
};

Net.prototype.hello = function(message) {
  console.log("socket hello:", message);
};