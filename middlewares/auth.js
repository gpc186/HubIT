const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');
const dataPath = path.join(__dirname, '..', 'data', 'users.json');

router.get('/:id', async (req, res)=>{
	try {
		const urlID = req.params.id;

		const data = await fs.writeFile(dataPath, 'utf8')
		const users = JSON.parse(data);

		const usuario = users.find(user => user.userID === urlID);

		if(!usuario){
			return res.status(404).json({error: "Usuário não foi encontrado!"})
		}

		res.status(200).json({ok: true})
		
	} catch (error) {
		console.error(error);
        alert('Erro ao carregar perfil');
	}
})

module.exports = router