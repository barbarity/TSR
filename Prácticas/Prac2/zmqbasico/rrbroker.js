// Simple request-reply broker in Node.js
var args = process.argv.slice(2);

if (args.length != 2) {
    console.error("Usage: node publisher.js PORT_CLIENT PORT_SERVER");
    process.exit();
}

var port_client = parseInt(args[0]);
var port_server = parseInt(args[1]);

var zmq      = require('zmq')
  , frontend = zmq.socket('router')
  , backend  = zmq.socket('dealer');

frontend.bindSync('tcp://*:' + port_client);
backend.bindSync('tcp://*:' + port_server);

frontend.on('message', function() {
    // Note that separate message parts come as function arguments.
    var args = Array.apply(null, arguments);
    // Pass array of strings/buffers to send multipart messages.
    backend.send(args);
});

backend.on('message', function() {
    var args = Array.apply(null, arguments);
    frontend.send(args);
});