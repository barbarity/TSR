var net = require('net');

if(process.argv.length != 4) {
    console.error('Usage: node ProxyProg.js REMOTE_IP REMOTE_PORT');
    process.exit();
}

var LOCAL_PORT = 8000;
var LOCAL_IP = '127.0.0.1';
var REMOTE_PORT = process.argv[3];
var REMOTE_IP = process.argv[2]; // www.iti.es
var PROG_PORT = 8001;

var server = net.createServer(function (socket) {
    socket.on('data', function (msg) {
        var serviceSocket = new net.Socket();
        serviceSocket.connect(parseInt(REMOTE_PORT), REMOTE_IP, function (){
            serviceSocket.write(msg);
        });
        
        serviceSocket.on('data', function (data) {
            socket.write(data);
        });
    });
}).listen(LOCAL_PORT, LOCAL_IP);

var progServer = net.createServer(function (socket) {
    socket.on('data', function (data) {
        var obj = JSON.parse(data);

        if(obj.remote_ip && obj.remote_port) {
            REMOTE_IP = obj.remote_ip;
            REMOTE_PORT = obj.remote_port
        } else {
            console.error("No valid arguments");
        }
    });
}).listen(PROG_PORT, LOCAL_IP);

console.log("TCP server accepting connection on port: " + LOCAL_PORT);