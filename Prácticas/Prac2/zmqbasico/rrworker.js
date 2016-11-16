// Hello World server in Node.js
// Connects REP socket to tcp://*:5560
// Expects "Hello" from client, replies with "World"
var args = process.argv.slice(2);

if (args.length != 3) {
    console.error("Usage: node hwserver.js ENDPOINT WAIT_TIME RESPONSE");
    process.exit();
}

var endpoint = args[0];
var wait_time = parseInt(args[1]);
var response = args[2];

var zmq = require('zmq')
  , responder = zmq.socket('rep');

responder.connect(endpoint);
responder.on('message', function(msg) {
    console.log('received request:', msg.toString());
    setTimeout(function() {
      responder.send(response);
    }, wait_time);
});