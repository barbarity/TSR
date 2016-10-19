var net = require('net');
var fs = require('fs');
var votos = []

var server = net.createServer(
	function(c) {
		c.on('data', function(data) {
			// A COMPLETAR
			var votosColegio = JSON.parse(data);

			if (!(votosColegio.provincia in votos))
				votos[votosColegio.provincia] = {};
			
			for (propiedad in votosColegio) {
				if(propiedad != 'colegio' && propiedad != 'provincia'){
					if(votos[votosColegio.provincia][propiedad] == undefined){
						votos[votosColegio.provincia][propiedad] = votosColegio[propiedad]
					} else {
						votos[votosColegio.provincia][propiedad] += votosColegio[propiedad]
					}
				}
			};
		});

	}); // End of net.createServer()

server.listen(9000,
function() { //'listening' listener
	console.log('server bound');
});

function guardar(){
	// A COMPLETAR
	for (provincia in votos){
		fs.writeFileSync(provincia + '.txt', JSON.stringify(votos[provincia]));
	}

	console.log('datos volcados a disco');
}

// A COMPLETAR
setInterval(guardar, 20000)