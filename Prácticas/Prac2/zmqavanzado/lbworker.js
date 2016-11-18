var args = process.argv.slice(2);

if (args.length != 5) {
    console.error("Usage: node lbworker.js ENDPOINT SERVER_ID AVAILABLE_TEXT RESPONSE_TEXT VERBOSE_FLAG");
    process.exit();
}

var endpoint = args[0];
var server_id = args[1];
var available_text = args[2];
var response_text = args[3];
var isVerbose = args[4];

var active_time = 20000;
var timeout = setTimeout(process.exit, active_time);

var zmq = require('zmq')
  , requester = zmq.socket('req');

var auxfunctions = require('./auxfunctions')

requester.identity = server_id;
requester.connect(endpoint);
logVerbose("connected to " + endpoint + "...");

var repliesCount = 0;

requester.on('message', function() {  
    renewTimeout();
    var args = Array.apply(null, arguments);
    var client_id = args[0].toString();

    logVerbose('has received request: ' + args[2] + ' from client ( ' + client_id + ' )');

    if(isVerbose) { // This is so bad coded, but I'm not going to change the specs of a defined func
        auxfunctions.showArguments(args);
    }

    args[2] = response_text;

    requester.send(args)
    logVerbose('has sent its reply');
    if (isVerbose) auxfunctions.showArguments(args);

    logVerbose('has sent ' + ++repliesCount + ' replies')
});

requester.send(available_text);
logVerbose("has sent READY msg: " + available_text);

function logVerbose(text, showHeader = true) {
    var header = "worker (" + server_id + ") ";
    if (isVerbose) {
            if (showHeader) {
                console.log(header, text)
            } else {
                console.log(text)
            }
    }
}

function renewTimeout() {
    clearTimeout(timeout);
    setTimeout(process.exit, active_time);
}