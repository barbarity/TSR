var net = require('net');

if(process.argv.length != 6) {
    console.error('Usage: node Controlador.js PROXY_IP PROXY_PORT, REMOTE_IP REMOTE_PORT');
    process.exit();
}

var PROXY_IP = process.argv[2];
var PROXY_PORT = parseInt(process.argv[3]);
var REMOTE_IP = process.argv[4];
var REMOTE_PORT = parseInt(process.argv[5]);
var CONTROL_PORT = 8000

var client = net.connect(CONTROL_PORT, PROXY_IP, function () {
    var msg = JSON.stringify({
        op: "set",
        inPort: PROXY_PORT,
        remote: {
            ip: REMOTE_IP,
            port: REMOTE_PORT
        }
    });

    client.write(msg);
    client.end()
});