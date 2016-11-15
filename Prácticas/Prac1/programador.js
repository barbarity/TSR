// Client
var net = require('net');

if(process.argv.length != 5) {
    console.error('Usage: node ProxyProg.js PROXY_IP REMOTE_IP REMOTE_PORT');
    process.exit();
}

var PROXY_IP = process.argv[2];
var REMOTE_IP = process.argv[3];
var REMOTE_PORT = process.argv[4];
var PROG_PORT = 8001;

var client = net.connect(PROG_PORT, PROXY_IP, function() {
    var msg = JSON.stringify({
        remote_ip: REMOTE_IP,
        remote_port: REMOTE_PORT
    })

    client.write(msg);
});