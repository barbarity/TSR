// Hello World server
// Binds REP socket to tcp://*:5555
// Expects "Hello" from client, replies with "world"

var args = process.argv.slice(2);

if (args.length != 3) {
    console.error("Usage: node hwserver.js PORT WAIT_TIME RESPONSE");
    process.exit();
}

var port = parseInt(args[0]);
var wait_time = parseInt(args[1]);
var response = args[2];

var zmq = require('zmq');

// socket to talk to clients
var responder = zmq.socket('rep');

responder.on('message', function(request) {
    console.log("Received request: [", request.toString(), "]");

    // do some 'work'
    setTimeout(function() {
        // send reply back to client.
        responder.send(response);
    }, wait_time);
});

responder.bind('tcp://*:' + port, function(err) {
    if (err) {
        console.log(err);
    } else {
        console.log("Listening on " + port + "...");
    }
});

process.on('SIGINT', function() {
    responder.close();
});
