const fs = require('fs').promises;

function registrarNovoUsuario() {
	const email = document.getElementById('email').value;
	const passwd = document.getElementById('passwd').value;
	const usuario = document.getElementById('usuario');
	let tipoConta = '';

	fs.readFile('../data/users.json', 'utf8')
		.then((data) => {
			console.log(data);
			alert(data)
			const dataN = JSON.parse(data)
			if (usuario.checked){
				tipoConta = 'usuario'
			} else {
				tipoConta = 'empresa'
			}

			let novoUsuario = {
				email: email,
				passwd: passwd,
				tipoConta: tipoConta
			}

			dataN.push(novoUsuario)
			alert(dataN)
			console.log(dataN)

		}).catch((err) => {
			console.error(err);
		});
}

