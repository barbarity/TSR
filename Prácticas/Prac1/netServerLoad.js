"use strict";
// Server
var net = require('net');
var fs = require('fs');

function getLoad(){
    data = fs.readFileSync("/proc/loadavg"); //requiere fs
    var tokens = data.toString().split(' ');
    var min1 = parseFloat(tokens[0])+0.01;
    var min5 = parseFloat(tokens[1])+0.01;
    var min15 = parseFloat(tokens[2])+0.01;
    return min1*10+min5*2+min15;
}

var myipaddress = '127.0.0.1';
var port = 5000;

var server = net.createServer(function(socket) {
    console.log('Server created');

    socket.on('data', function(data) {
        console.log('Client connected');
        var response = JSON.stringify({
            server: {
                ip: myipaddress,
                load: getLoad()
            },
            client: {
                ip: data.toString(),
                data: data
            }
        });
        socket.write(response);
        socket.end();
    });

    socket.on('end', function() {
        console.log('Server ended');
        process.exit();
    });
}).listen(port);