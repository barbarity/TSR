// Client
var zmq = require('zmq');
var rq = zmq.socket('req');

var count = 0;

rq.connect('tcp://127.0.0.1:8888');

rq.on('message', function(msg) {
 console.log('Response: ' + msg);
});

function sendMessage() {
    rq.send(['Hello',count]);
    count++
}

setInterval(sendMessage, 2000)

// Apartado 3.c - Cuando server.js acaba, el cliente se queda colgado porque sigue esperando una respuesta. No importa que reiniciemos el servidor, porque el servidor reiniciado no sabe que tiene una petición pendiente.