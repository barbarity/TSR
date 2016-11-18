// Simple request-reply broker in Node.js
var args = process.argv.slice(2);

if (args.length != 3) {
    console.error("Usage: node lbbroker.js PORT_CLIENT PORT_SERVER VERBOSE_FLAG");
    process.exit();
}

var port_client = parseInt(args[0]);
var port_server = parseInt(args[1]);
var isVerbose = args[2];


var workers = [];
var pending_works = [];

var zmq      = require('zmq')
  , frontend = zmq.socket('router')
  , backend  = zmq.socket('router');

var auxfunctions = require('./auxfunctions');

var path = 'tcp://*:' + port_client;

frontend.bindSync('tcp://*:' + port_client);
backend.bindSync('tcp://*:' + port_server);

frontend.on('message', function() {
    // Note that separate message parts come as function arguments.
    var args = Array.apply(null, arguments);

    var request_id = args[args.length-1]; // The request is the last item...
    var client_id = args[0];

    logVerbose('received request: ' + request_id + ' from client (' + client_id + ')');
    if(isVerbose) auxfunctions.showArguments(args);

    var worker_id = selectWorker();

    if (worker_id) {
        sendJobToWorker(worker_id, args);
    } else {
        sendJobToQueue(args);
        console.log(pending_works);
    }


    // Pass array of strings/buffers to send multipart messages.
    backend.send(args);
});

backend.on('message', function() {
    var args = Array.apply(null, arguments);


    // I know this is a class exercise and shit. But holly crap how bad the specification is. Sorry Uncle Bob:
    var request_id = args[args.length-1].toString(); // The request is the last item...

    switch(request_id) {
        case 'Ready':
            var worker_id = args[0];

            logVerbose('received request: ' + request_id + ' from worker (' + worker_id + ')', false);
            if(isVerbose) auxfunctions.showArguments(args);

            // Set the worker ready for jobs.
            workers[worker_id] = {};
            workers[worker_id].status = 'Ready';
            workers[worker_id].jobsCount = 0;

            break;

        case 'DONE':
            var client_id = args[2];
            var worker_id = args[0];

            // I could have done this part outside the switch, but I don't trust the specifcation anymore.
            logVerbose('received request: ' + request_id + ' from worker (' + worker_id + ')', false);
            if(isVerbose) auxfunctions.showArguments(args);

            response = args.slice(2);
            logVerbose('sending worker (' + worker_id + ') rep to client ( ' + client_id + ' ) through frontend', false);
            if(isVerbose) auxfunctions.showArguments(response);
            workers[worker_id].jobsCount++;
            frontend.send(response);

            break;            
    }

    if(pending_works.length > 0) {
        var args = pending_works.shift();
        sendJobToWorker(worker_id, args);
    } else {
        workers[worker_id].status = 'Ready';
    }
});

function logVerbose(text, showHeader = true) {
    var header = "broker: ";
    if (isVerbose) {
            if (showHeader) {
                console.log(header, text)
            } else {
                console.log(text)
            }
    }
}

function selectWorker() {
    min = Infinity;
    var worker_id = undefined;
    for (worker in workers) {
        console.log(workers)
        if(workers[worker].status == 'Ready' && workers[worker].jobsCount < min) {
            worker_id = worker;
            min = workers[worker].jobsCount;
        }
    }

    return worker_id;
}

function sendJobToWorker(worker_id, args) { 
    workers[worker_id].status = 'Busy';
    response = [worker_id, ""].concat(args);

    var client_id = args[2];

    logVerbose('sending client (' + client_id + ') req to worker (' + worker_id + ') through backend');
    if(isVerbose) auxfunctions.showArguments(response);

    backend.send(response);
}

function sendJobToQueue(args) {
    pending_works.push(args);
}