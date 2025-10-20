
window.onload = async function () {
    await loginAuto();
};

function loginAuto(){
	const userID = localStorage.getItem('userID');

	if (userID){
		location.href = "/home"
	}
}

function registrarNovoUsuario() {
	// Criação de constantes de input e radio
	const email = document.getElementById('emailNewUser').value;
	const passwd = document.getElementById('passwdNewUser').value;
	const usuario = document.getElementById('usuario').checked;
	const empresa = document.getElementById('empresa').checked;

	// radio de tipo da conta inativo, esperando ser selecionado
	let tipoConta = false
    
	// Verificador de condição para o tipo da conta
	if (usuario) {
		tipoConta = 'usuario'
	}
	if (empresa) {
		tipoConta = 'empresa'
	}

	// Tratamento de erro caso nada seja inserido
	if (!email || !passwd || !tipoConta) {
		alert('Por favor preencha todos os campos!');
		return;
	};

	// Verifica regras de senha
	const senhaForte = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

	if (!senhaForte.test(passwd)) {
		alert('[Senha fraca] Sua senha precisa ter pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas, números e caracteres especiais.');
		return;
	}

	// 'fetch' é uma forma de fazer 'curl' direto no código
	fetch('/api/registrar', {
		// Parametros que seriam inseridos no 'curl' já são inseridos aqui
		method: 'POST', // -X POST
		headers: { // -H "Content-type: application/json"
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ email, passwd, tipoConta }) // -d (Aqui é pego os dados inseridos nos inputs e transformados em um body para requisição)
	})
	.then(res => res.json())
	.then(data => {

		// Constante para pegar valor informado no Modal do Bootstrap
		const modal = bootstrap.Modal.getInstance(
                document.getElementById('exampleModal')
            );

        modal.hide();
            
        document.getElementById('emailNewUser').value = '';
        document.getElementById('passwdNewUser').value = '';

		if (data.success) {
			alert('Usuário registrado com sucesso!');
		} 
		//Tratamento de erro em registrar o usuário
		else {
			alert('Erro ao registrar usuário: ' + (data.error || 'erro desconhecido'));
		}
	})
	// Tratamento de erro
	.catch(err => {
		console.error(err);
		alert('Erro de comunicação com o servidor');
	});
}

// Fazer login
function fazerLogin() {
	// Constantes de inputs do Login de usuário
	const email = document.getElementById('email').value;
	const passwd = document.getElementById('passwd').value;
	
	// Verifica se foi inserido dados
	if (!email || !passwd) {
		alert('Preencha todos os campos!');
		return;
	};

	// fetch de conteudos para o login
	fetch('/api/login', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({email, passwd})
	})
	.then(res => res.json())
	.then(data =>{
		if(data.success){
			// Constante que recebe o userID do user.json
			const userID = data.usuario.userID;

			// Aqui é armazenado "variáveis" com valores para serem vistos no JSON
			localStorage.setItem('userID', userID);
			localStorage.setItem('userEmail', data.usuario.email);
			localStorage.setItem('userTipo', data.usuario.tipoConta);

			// Redireciona o usuário logado para página dele
			window.location.href = `/perfil/${userID}`;
			alert('Usuario logado com sucesso!');

		} 
		
		// Tratamento de erros ao logar
		else {
			alert('Erro ao logar o usuário: ' + (data.error || 'erro desconhecido'));
		}
	})
	// Tratamento de erros
	.catch(error =>{
		console.error(error);
        alert('Erro ao carregar perfil');
	})
};



