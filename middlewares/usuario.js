// Importa express e path
const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

const dataPath = path.join(__dirname, '..', 'data', 'users.json');

router.get('/:id', async (req, res)=>{

	const userIDHeader = Number(req.headers['user-id']);
  	const userIDParam = Number(req.params.id);

	try {
		// Constante que recebe a leitura do arquivo e transforma em constante users em formato de object {}
		const data = await fs.readFile(dataPath, 'utf8');
		const users = JSON.parse(data);
		
		// Procura o Usuário requisitado e armazena na Constante userData
		const userData = users.find(u => Number(u.userID) === userIDParam);
		
		// Variável podeEditar que pode ser alterada
		let podeEditar = false

		// Verifica se Usuário está logado
		if(!userData) {
			return res.status(404).json({error: "Usuário não encontrado"})
		}
		if(!userIDHeader){
			return res.status(401).json({error: "Por favor logue antes!"});
		};

		// Se Usuário da requisição for igual ao do Header já existente -> Pode editar
		if(userIDParam === userIDHeader){
			podeEditar = true
		};

		// Envia os dados 
		res.status(200).json({ok: true, mensagem: "Dados foram carregados com sucesso!", usuario:{ userID: userData.userID, email: userData.email, podeEditar: podeEditar }});
		
	// Tratamento de erros
	} catch (error) {
		return res.status(500).json({error: error.message})
	}

	
})

// Exporta o router
module.exports = router