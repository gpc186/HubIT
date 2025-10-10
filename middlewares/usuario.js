const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

const dataPath = path.join(__dirname, '..', 'data', 'users.json');

router.get('/:id', async (req, res)=>{

	const userIDHeader = Number(req.headers['user-id']);
  	const userIDParam = Number(req.params.id);

	try {
		const data = await fs.readFile(dataPath, 'utf8');
		
		const users = JSON.parse(data);
		
		const userData = users.find(u => Number(u.userID) === userIDParam);
		
		
		let podeEditar = false

		if(!userData) {
			return res.status(404).json({error: "Usuário não encontrado"})
		}

		if(!userIDHeader){
			return res.status(401).json({error: "Por favor logue antes!"});
		};

		if(userIDParam === userIDHeader){
			podeEditar = true
		};

		res.status(200).json({ok: true, mensagem: "Dados foram carregados com sucesso!", usuario:{ userID: userData.userID, email: userData.email, podeEditar: podeEditar }});
		
	} catch (error) {
		return res.status(500).json({error: error.message})
	}

	
})

module.exports = router