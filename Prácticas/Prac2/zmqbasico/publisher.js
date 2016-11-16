var args = process.argv.slice(2);

if (args.length != 4) {
    console.error("Usage: node publisher.js PORT MESSAGES_NUM MESSAGES_TYPE1 MESSAGES_TYPE2");
    process.exit();
}

var port = parseInt(args[0]);
var messages_num = parseInt(args[1]);
var messages_type1 = args[2]; // This is not clean code, but it's how it is asked (Ugh :/)
var messages_type2 = args[3];

var zmq = require('zmq');
var auxfunctions = require('./auxfunctions');

var publisher = zmq.socket('pub');


publisher.bind('tcp://*:' + port, function(err) {
    if (err) {
        console.log(err)
    } else {
        console.log('Listening on ' + port);
    }
})

for (var i = 1; i < (messages_num+1); i++) {
    (function(index) {
        setTimeout(function() {
            console.log('sent', index, messages_num);
            publisher.send([messages_type1, auxfunctions.randNumber(100, 0)]);
            publisher.send([messages_type2, auxfunctions.randNumber(100, 0)]);
        }, 1000 * index)
    })(i);
}

process.on("SIGINT", function() {
    publisher.close();
    console.log("\nClosed");
});