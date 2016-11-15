// Client
var net = require('net');

if(process.argv.length != 4) {
    console.error('Usage: node netClientLoad.js IP_SERVER IP_LOCAL');
    process.exit();
}

var server_ip = process.argv[2]
var local_ip = process.argv[3];

var port = 8000;

var client = net.connect(port, server_ip, function () {
    console.log('Client connected');
    client.write(local_ip);
});

client.on('data', function(data) {
    console.log(data.toString());
    client.end();
});

client.on('end', function(){
    console.log('Client disconnected');
    process.exit(0)
})