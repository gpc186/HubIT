// Importa express e path
const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

const dataPath = path.join(__dirname, '..', 'data', 'users.json');

router.get('/:id', async (req, res) => {

	const userIDHeader = Number(req.headers['user-id']);
	const userIDParam = Number(req.params.id);

	if(!userIDHeader){
		return res.status(401).json({error: "Você precisa logar antes!"})
	}

	try {
		// Constante que recebe a leitura do arquivo e transforma em constante users em formato de object {}
		const data = await fs.readFile(dataPath, 'utf8');
		const users = JSON.parse(data);

		// Procura o Usuário requisitado e armazena na Constante userData
		const userData = users.find(u => Number(u.userID) === userIDParam);

		// Variável podeEditar que pode ser alterada
		let podeEditar = false

		// Verifica se Usuário está logado
		if (!userData) {
			return res.status(404).json({ error: "Usuário não encontrado" });
		};
		if (!userIDHeader) {
			return res.status(401).json({ error: "Por favor logue antes!" });
		};

		// Se Usuário da requisição for igual ao do Header já existente -> Pode editar
		if (userIDParam === userIDHeader) {
			podeEditar = true
		};

		const perfilCompleto = userData.dados && Object.keys(userData.dados).length > 0

		// Envia os dados 
		res.status(200).json({ ok: true, mensagem: "Dados foram carregados com sucesso!", usuario: { userID: userData.userID, email: userData.email, tipoConta: userData.tipoConta, dados: userData.dados || {}, podeEditar: podeEditar, perfilCompleto: perfilCompleto } });

		// Tratamento de erros
	} catch (error) {
		return res.status(500).json({ error: error.message })
	}


});

router.put('/:id', async (req, res) => {
	// Aqui pegamos o id do login e também do URL
	const userIDHeader = Number(req.headers['user-id']);
	const userIDParam = Number(req.params.id);
	// Aqui pegamos os dados que foram enviados no req.body
	const dados = req.body

	try {
		// Constante que recebe a leitura do arquivo e transforma em constante users em formato de object {}
		const data = await fs.readFile(dataPath, 'utf8');
		const users = JSON.parse(data);

		// Variável podeEditar que pode ser alterada
		let podeEditar = false

		// Procuramos o usuário baseado no URL
		const userIndex = users.findIndex(u => Number(u.userID) === userIDParam);
		const usuario = users[userIndex]
		// Verifica para encontrar usuário
		if (userIndex === -1) {
			return res.status(404).json({ error: "Usuário não encontrado" });
		};
		// Verifica para ver se o usuário está logado
		if (!userIDHeader) {
			return res.status(401).json({ error: "Por favor logue antes!" });
		};
		// Verifica se o usuário da URL é o mesmo do que o logado
		if (userIDParam === userIDHeader) {
			podeEditar = true
		};
		// Verificação para saber se ele pode editar ou não, mesmo não aparecendo o botão
		if (!podeEditar) {
			return res.status(401).json({ error: "Você não pode editar esse perfil, nem sei como que você foi parar aqui" })
		}
		// Preparamos um object para ter os dados novos
		let dadosNovos = {};
		// Aqui seria um "foreach" dos dados, para verificar quais foram preenchidos ou não
		for (let campo in dados) {
			let valor = dados[campo]

			if (valor !== undefined && valor !== null && valor !== '') {
				dadosNovos[campo] = valor;
			};
		};
		// Pegamos os dados novos e colocamos dentro do usuario
		usuario.dados = {
			...usuario.dados,
			...dadosNovos
		};
		// Aqui pegamos os dados novos juntos com os antigos e escrevemos no JSON
		await fs.writeFile(dataPath, JSON.stringify(users, null, 2))
		// Aqui mandamos umas informações para o front
		res.status(200).json({ ok: true, usuario: { userID: usuario.userID, email: usuario.email, tipoConta: usuario.tipoConta, dados: usuario.dados } })

	} catch (error) {
		console.error(error + error.message);
		return res.status(500).json({ error: error.message });
	}
});

// Exporta o router
module.exports = router