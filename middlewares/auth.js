// Importando express e path
const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');
const dataPath = path.join(__dirname, '..', 'data', 'users.json');

router.get('/:id', async (req, res)=>{
	try {
		// Constante que recebe parametro inserido na url
		const urlID = req.params.id;

		// Constanta armazenar dados lidos de arquivo e transformar em object {}
		const data = await fs.readFileFile(dataPath, 'utf8')
		const users = JSON.parse(data);

		// Procura o usuário pelo urlID para achar o usuário pelo userID
		const usuario = users.find(user => user.userID === urlID);

		// Verifica se o usúario digitado no URL existe 
		if(!usuario){
			return res.status(404).json({error: "Usuário não foi encontrado!"})
		}
		// Se encontrar usúario retorna com JSON ok 
		res.status(200).json({ok: true})
		
	// Tratamento de erros para carregar perfil
	} catch (error) {
		console.error(error);
        res.status(500).json({error: "Erro ao carregar o perfil"});
	}
})

// Exporta a router criada
module.exports = router