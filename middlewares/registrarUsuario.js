// Exporta express e path
const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

const dataPath = path.join(__dirname, '..', 'data', 'users.json');

router.post('/', async (req, res) => {
  try {
	// Constante que recebe 3 valores que são requisitados no body
	const { email, passwd, tipoConta } = req.body;

	// Verifica se está vazio o parametro enviado
	if (!email || !passwd || !tipoConta){
		return res.status(400).json({error: "Campos obrigatórios faltando!"});
	};

	// Constante lê arquivo e transforma data em object
	const data = await fs.readFile(dataPath, 'utf8');
    const users = JSON.parse(data);

	// Procura com find email já existente
	const emailExistente = users.find(user => user.email === email);
	
	// Verifica se já existe o email
	if (emailExistente) {
		return res.status(400).json({error: "Email já cadastrado!"})
	}

	// Constante que gera um id para o usuário com base no tempo
	const userID = Date.now();

	// Constante com valores para o novo Usuário
    const novoUsuario = { 
		email: email, 
		passwd: passwd, 
		tipoConta: tipoConta,
		userID: userID,
		dados: {}
	};

	// Envia os valores do novo Usuário para o object users
    users.push(novoUsuario);

	// Salva o arquivo com formatação
    await fs.writeFile(dataPath, JSON.stringify(users, null, 2));
	res.status(201).json({success: true}) // Envia mensagem de sucesso

	// Tratamento de erros
  	} catch (error) {
		res.status(500).json({error})
  	}
});

// Exporta o router
module.exports = router