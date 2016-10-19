var fs = require('fs');
var total_votos = []
var votos = []

fs.readdir('.', function (err, files) {
	if(err){
		return console.error(err)
	}

	var count = files.length
	for (var i = 0; i < files.length; i++) {
		// A COMPLETAR
		(function(index) {
			if(files[index] != 'app.js'){
				fs.readFile(files[index], function(err, data){
					var votosProvincia = JSON.parse(data);
					var provincia = files[index].slice(0, -4); // quitamos '.txt'

					votos[provincia] = votosProvincia;

					for(partido in votosProvincia){
						if(total_votos[partido] == undefined) {
							total_votos[partido] = votosProvincia[partido];
						} else {
							total_votos[partido] += votosProvincia[partido];
						}
					}

					if(index == files.length-1){
						// Se han leído todos los ficheros, se puede empezar la app
						startApp();
					}
				});
			}
		})(i); // Se encapsula en una función al ser una llamada asíncrona

	}
})

function startApp() {
	console.log("Resultados globales:");
	console.log(total_votos)

	process.stdin.resume();
  	process.stdin.setEncoding('utf8');

  	console.log("\nProvincia:")
  	process.stdin.on('data', function (data) {
  		var provincia = String(data.slice(0, -2)); // delete '\n'

  		if(votos[provincia] == undefined) {
  			console.log("La provincia " + provincia + " no existe.");
  		} else {
  			console.log(votos[provincia])
  		}

  		console.log("\nProvincia:")
  	});
}