// Hello World client in Node.js
// Connects REQ socket to tcp://localhost:5559
// Sends "Hello" to server, expects "World" back
var args = process.argv.slice(2);

if (args.length != 4) {
    console.error("Usage: node rrclient.js ENDPOINT CLIENT_ID REQUESTS_NUM REQUEST_MESSAGE");
    process.exit();
}

var endpoint = args[0];
var client_id = args[1];
var request_num = parseInt(args[2]);
var request_message = args[3];

var zmq       = require('zmq')
  , requester = zmq.socket('req');

requester.identity = client_id;
requester.connect(endpoint);
var replyNbr = 0;
requester.on('message', function(msg) {
    console.log('got reply', replyNbr, msg.toString());
    replyNbr += 1;
    if(replyNbr == request_num) {
        requester.close();
        process.exit();
    }
});

for (var i = 0; i < request_num; ++i) {
    requester.send(request_message);
}