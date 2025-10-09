const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

const dataPath = path.join(__dirname, '..', 'data', 'users.json');


router.post('/', async (req, res)=>{
	try {
		const { email, passwd } = req.body;

		if(!email || !passwd){
			return res.status(400).json({error: "Todos os campos são obrigatórios!"});
		}

		const data = await fs.readFile(dataPath, 'utf8');
		console.log(data)
		
		const users = JSON.parse(data);
		console.log(users);
		const usuario = users.find(user => user.email === email && user.passwd === passwd);
		console.log(usuario);
		
		if(!usuario){
			return res.status(401).json({error: "Usuario ou senha incorretos"});
		}

		res.status(200).json({success: true, mensagem: "Usuario logado com sucesso!", usuario: { id: usuario.userID, email: usuario.email, tipoConta: usuario.tipoConta }});

	} catch (error) {
		return res.status(500).json({error})
	}
})

module.exports = router;