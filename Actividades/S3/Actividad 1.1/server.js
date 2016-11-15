// Server
var zmq = require('zmq');
var rp = zmq.socket('rep');

rp.bind('tcp://127.0.0.1:8888',function(err) {
 if (err) throw err;
});

rp.on('message', function(msg, count) {
 console.log('Request: ' + msg + " " + count);
 if(count == 10)
    rp.close()
    process.exit(0)
 rp.send('World');
});
