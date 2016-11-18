var args = process.argv.slice(2);

if (args.length != 3) {
    console.error("Usage: node lbclient.js ENDPOINT CLIENT_ID REQUEST_MESSAGE");
    process.exit();
}

var endpoint = args[0];
var client_id = args[1];
var request_message = args[2];
var isVerbose = true;

var zmq       = require('zmq')
  , requester = zmq.socket('req');

requester.identity = client_id;
requester.connect(endpoint);
logVerbose("connected to " + endpoint + ' ...');

requester.on('message', function(msg) {
    console.log('has received reply: ' + msg);
    requester.close();
    process.exit();
});

requester.send(request_message);
logVerbose('has sent its msg: ' + request_message);

function logVerbose(text, showHeader = true) {
    var header = "client (" + client_id + ") ";
    if (isVerbose) {
            if (showHeader) {
                console.log(header, text)
            } else {
                console.log(text)
            }
    }
}