function registrarNovoUsuario() {
	const email = document.getElementById('emailNewUser').value;
	const passwd = document.getElementById('passwdNewUser').value;
	const usuario = document.getElementById('usuario').checked;
	const empresa = document.getElementById('empresa').checked;
	let tipoConta = false
    
	if (usuario) {
		tipoConta = 'usuario'
	}
	if (empresa) {
		tipoConta = 'empresa'
	}

	if (!email || !passwd || !tipoConta) {
		alert('Por favor preencha todos os campos!');
		return;
	};

	fetch('/api/registrar', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ email, passwd, tipoConta })
	})
	.then(res => res.json())
	.then(data => {
		if (data.success) {
			alert('Usuário registrado com sucesso!');
		} else {
			alert('Erro ao registrar usuário: ' + (data.error || 'erro desconhecido'));
		}
	})
	.catch(err => {
		console.error(err);
		alert('Erro de comunicação com o servidor');
	});
}