const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

const dataPath = path.join(__dirname, '..', 'data', 'users.json');

router.post('/', async (req, asw) => {
  try {
	const { email, passwd, tipoConta } = req.body;

	if (!email || !passwd || !tipoConta){
		return asw.status(400).json({error: "Campos obrigatórios faltando!"});
	};

	const data = await fs.readFile(dataPath, 'utf8');
    const users = JSON.parse(data);

    const novoUsuario = { email, passwd, tipoConta };
    users.push(novoUsuario);

    await fs.writeFile(dataPath, JSON.stringify(users, null, 2));

	asw.status(200).json({success: true})

  } catch (error) {
	asw.status(500).json({error})
  }
});

module.exports = router