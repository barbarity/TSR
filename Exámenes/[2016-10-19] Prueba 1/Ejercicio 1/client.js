var net = require('net');

var timer = 500

// sleep time expects milliseconds
function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

var client = net.connect({port: 9000},
	function() { //'connect' listener
		var voto = {provincia: 'madrid', colegio: 'chamberi_14', pp: 3500, psoe: 2000, up: 3000, cs: 1500};
		client.write(JSON.stringify(voto));

});

sleep(timer).then(() => {
    var client = net.connect({port: 9000},
		function() { //'connect' listener
			var voto = {provincia: 'barcelona', colegio: 'sants_12', pp: 1000, psoe: 1500, up: 2000, cs: 2000, erc: 3000};
			client.write(JSON.stringify(voto));

	});
});

sleep(timer).then(() => {
    var client = net.connect({port: 9000},
		function() { //'connect' listener
			var voto = {provincia: 'madrid', colegio: 'castellana', pp: 2000, psoe: 3000, up: 1000, cs: 500};
			client.write(JSON.stringify(voto));

	});
});

sleep(timer).then(() => {
    var client = net.connect({port: 9000},
		function() { //'connect' listener
			var voto = {provincia: 'valencia', colegio: 'vera_sn', pp: 2500, psoe: 1500, up: 2000, cs: 2500};
		client.write(JSON.stringify(voto));

	});
});

sleep(timer).then(() => {
    var client = net.connect({port: 9000},
		function() { //'connect' listener
			var voto = {provincia: 'madrid', colegio: 'retiro_8', pp: 4000, psoe: 3000, up: 2000, cs: 2000};
		client.write(JSON.stringify(voto));

	});
});

sleep(timer).then(() => {
    var client = net.connect({port: 9000},
		function() { //'connect' listener
			var voto = {provincia: 'barcelona', colegio: 'provença_115', psoe: 500, up: 400, cs: 200, erc: 300};
		client.write(JSON.stringify(voto));

	});
});	