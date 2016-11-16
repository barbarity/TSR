var args = process.argv.slice(2);

if (args.length != 2) {
    console.error("Usage: node subscriber.js ENDPOINT DESCRIPTOR");
    process.exit();
}

var endpoint = args[0];
var descriptor = args[1];

var zmq = require('zmq');

var subscriber = zmq.socket('sub');

subscriber.on("message", function (descriptor, reply) {
    console.log("Received message: ", descriptor.toString(), reply.toString());
});

subscriber.connect(endpoint);
subscriber.subscribe(descriptor);

process.on("SIGINT", function() {
    subscriber.close();
    console.log("\nClosed");
});