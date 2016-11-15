var net = require('net');

var proxy_servers = [];
var proxy_configs = [];

function createProxyServer(onPort, remote_ip, remote_port) {
    if(proxy_servers[onPort]){
        console.log("ERROR: Server already created.");
    }
	var server = net.createServer(function(socket) {
        proxy_servers[onPort] = server;
        proxy_configs[onPort] = {
            remote_ip: remote_ip,
            remote_port: remote_port
        }
                console.log(proxy_configs)
        socket.on('data', function (msg) {
            var serviceSocket = net.connect(parseInt(proxy_configs[onPort].remote_port), proxy_configs[onPort].remote_ip, function (){
                serviceSocket.write(msg);
            });

            serviceSocket.on('data', function (data) {
                socket.write(data);
            });
        });

	}).listen(onPort)
}

createProxyServer(8001, '158.42.184.5', 80);
createProxyServer(8002, '158.42.4.23', 80);
createProxyServer(8003, '216.58.210.163',443)
createProxyServer(8004, '158.42.156.2',80)
//createProxyServer(8005, '147.156.222.65',80)

var control_server = net.createServer(function (socket) {
    socket.on('data', function (data) {
        var obj = JSON.parse(data);
        console.log(obj)
        createProxyServer(obj.inPort, obj.remote.ip, parseInt(obj.remote.port))
    });
}).listen(8000)