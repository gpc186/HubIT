// {
// "empregoID": 1729000000000,
// "empresaID": 1759968679341,
// "empresaNome": "Tech Solutions",
// "titulo": "Desenvolvedor Backend Pleno",
// "descricao": "Buscamos desenvolvedor...",
// "area": "Backend",
// "tipoContrato": "CLT",
// "tipoTrabalho": "Remoto",
// "mediaSalário": 6000,
// "ocultarSalario": false,
// "localizacao": "São Paulo, SP",
// "requisitos": [
// "3+ anos de experiência",
// "Node.js",
// "MySQL/PostgreSQL",
// "Docker"
// ],
// "beneficios": [
// "Vale Refeição",
// "Vale Transporte",
// "Plano de Saúde",
// "Home Office"
// ],
// "dataCriacao": "2025-10-14T18:30:00Z"
//}
const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

const empregosPath = path.join(__dirname, '..', 'data', 'empregos.json');
const usersPath = path.join(__dirname, '..', 'data', 'users.json');

const { criarIDEmprego } = require('./utils/geradorID');

router.post('/', async (req, res) => {
	
	const empresaID = req.headers['user-id'];

	if (!empresaID) {
		return res.status(401).json({error: "Por favor logue antes!"})
	};
	
	try {
		const userData = await fs.readFile(usersPath, 'utf8');
		
		const users = JSON.parse(userData);
		
		
		const empresa = users.find(u => Number(u.userID) === Number(empresaID));
		
		if (!empresa) {
			return res.status(401).json({error: "Você não pode postar empregos!"});
		};
		
		const {
		titulo,
		descricao,
		area,
		tipoContrato,
		tipoTrabalho,
		mediaSalario,
		localizacao,
		requisitos,
		beneficios
	} = req.body;
		
		// Validações básicas
        if (!titulo || titulo.trim() === '') {
            return res.status(400).json({ error: "Título é obrigatório!" });
        }
        if (!descricao || descricao.trim() === '') {
            return res.status(400).json({ error: "Descrição é obrigatória!" });
        }
        if (!area || area.trim() === '') {
            return res.status(400).json({ error: "Área é obrigatória!" });
        }
        if (!tipoContrato) {
            return res.status(400).json({ error: "Tipo de contrato é obrigatório!" });
        }
        if (!localizacao || localizacao.trim() === '') {
            return res.status(400).json({ error: "Localização é obrigatória!" });
        }

		const empregosData = await fs.readFile(empregosPath, 'utf8')
		
		const empregos = JSON.parse(empregosData);		

		let empregoID = criarIDEmprego()
		
		const novoEmprego = {
            empregoID: empregoID,
            empresaID: empresaID,
            empresaNome: empresa.dados.nomeEmpresa,
            titulo: titulo.trim(),
            descricao: descricao.trim(),
            area: area.trim(),
            tipoContrato: tipoContrato,
            tipoTrabalho: tipoTrabalho,
            mediaSalario: mediaSalario,
            localizacao: localizacao.trim(),
            requisitos: requisitos,
            beneficios: beneficios,
            dataCriacao: new Date().toISOString(),
            status: 'ativo'
        };

		empregos.push(novoEmprego)

		await fs.writeFile(empregosPath, JSON.stringify(empregos, null, 2))

		res.status(200).json({ok: true, mensagem: "Emprego criado com sucesso!", emprego: novoEmprego})

	} catch (error) {
		console.error(error);
		return res.status(500).json({error: error.message});
	};
});

router.get('/', async (req, res)=>{
	const userID = req.headers['user-id'];

	if (!userID) {
		alert('Por favor logue primeiro!');
		window.location.href = '/';
		return;
	};

	try {
		const data = await fs.readFile(empregosPath, 'utf8')
		const empregos = JSON.parse(data);

		const empregosAtivos = empregos.filter(e => e.status === 'ativo');

		empregosAtivos.sort((a, b) => 
            new Date(b.dataCriacao) - new Date(a.dataCriacao)
        );

		res.status(200).json({ok: true, empregos: empregosAtivos});

	} catch (error) {
		return res.status(500).json({error: error.messsage});
	};

});

module.exports = router;