// Hello World client
// Connects REQ socket to tcp://localhost:5555
// Sends "Hello" to server.
var zmq = require('zmq');

var args = process.argv.slice(2);

if (args.length != 3) {
    console.error("Usage: node hwclient.js ENDPOINT REQUEST_NUM REQUEST_MESSAGE");
    process.exit();
}

var endpoint = args[0];
var request_num = parseInt(args[1]);
var request_message = args[2];
// socket to talk to server
console.log("Connecting to hello world server...");
var requester = zmq.socket('req');

var x = 0;
requester.on("message", function(reply) {
    console.log("Received reply", x, ": [", reply.toString(), ']');
    x += 1;
    if (x === 10) {
        requester.close();
        process.exit(0);
    }
});

requester.connect(endpoint);

for (var i = 0; i < request_num; i++) {
    console.log("Sending request", i, '...');
    requester.send(request_message);
}

process.on('SIGINT', function() {
    requester.close();
});