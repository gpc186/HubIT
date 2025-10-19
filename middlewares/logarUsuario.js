// Importa express e path
const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

const dataPath = path.join(__dirname, '..', 'data', 'users.json');


router.post('/', async (req, res) => {
	try {
		// Constante que recebe 2 parametros inseridos no body para tentar logar
		const { email, passwd } = req.body;

		// Verifica se os parametros tem algo inserido
		if (!email || !passwd) {
			return res.status(400).json({ error: "Todos os campos são obrigatórios!" });
		}

		// Constante que recebe data de um arquivo
		const data = await fs.readFile(dataPath, 'utf8');

		// Constante que recebe data acima e transforma em object
		const users = JSON.parse(data);

		// Verifica se as informações de login estão todas certas
		const usuario = users.find(user => user.email === email && user.passwd === passwd);

		// Se a verificação de login dar False 
		if (!usuario) {
			return res.status(401).json({ error: "Usuario ou senha incorretos" });
		}

		// Se a verificação de login dar True
		res.status(200).json({ success: true, mensagem: "Usuario logado com sucesso!", usuario: { userID: usuario.userID, email: usuario.email, tipoConta: usuario.tipoConta } });

		// Tratamento de erros
	} catch (error) {
		return res.status(500).json({ error })
	}
})

// Exporta o router
module.exports = router;