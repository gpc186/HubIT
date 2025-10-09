const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

const dataPath = path.join(__dirname, '..', 'data', 'users.json');

router.post('/', async (req, res) => {
  try {
	const { email, passwd, tipoConta } = req.body;

	if (!email || !passwd || !tipoConta){
		return res.status(400).json({error: "Campos obrigatórios faltando!"});
	};

	const data = await fs.readFile(dataPath, 'utf8');
    const users = JSON.parse(data);

	const emailExistente = users.find(user => user.email === email);
	
	if (emailExistente) {
		return res.status(400).json({error: "Email já cadastrado!"})
	}

	const userID = Date.now();

    const novoUsuario = { 
		email: email, 
		passwd: passwd, 
		tipoConta: tipoConta,
		userID: userID
	 };

    users.push(novoUsuario);

    await fs.writeFile(dataPath, JSON.stringify(users, null, 2));

	res.status(201).json({success: true})

  } catch (error) {
		res.status(500).json({error})
  }
});

module.exports = router