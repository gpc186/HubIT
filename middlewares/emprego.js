const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

const empregosPath = path.join(__dirname, '..', 'data', 'empregos.json');
const usersPath = path.join(__dirname, '..', 'data', 'users.json');

const { criarIDEmprego } = require('./utils/geradorID');

// POST - Criar novo emprego
router.post('/', async (req, res) => {
	// Verificação de usuário logado
	const empresaID = req.headers['user-id'];

	if (!empresaID) {
		return res.status(401).json({ error: "Por favor logue antes!" })
	};

	try {
		// Processamento de usuário para encontrar a empresa que está postando
		const userData = await fs.readFile(usersPath, 'utf8');
		const users = JSON.parse(userData);

		const empresa = users.find(u => Number(u.userID) === Number(empresaID));
		// Verificação do tipoConta do user, se tiver lá como empresa, pode postar
		if (!empresa) {
			return res.status(404).json({ error: "Empresa não encontrada!" });
		};

		if (empresa.tipoConta !== "empresa") {
			return res.status(403).json({ error: "Você não pode postar empregos!" })
		}
		// Pegamos a requisição e colocamos como variável
		const {
			titulo,
			descricao,
			area,
			tipoContrato,
			tipoTrabalho,
			mediaSalario,
			localizacao,
			requisitos,
			beneficios,
			corDestaque // NOVA PROPRIEDADE
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
		// Pegamos os empregos para processamento
		const empregosData = await fs.readFile(empregosPath, 'utf8')
		const empregos = JSON.parse(empregosData);
		// Criamos um id pelo /utils
		let empregoID = criarIDEmprego()
		
		const data = new Date();
		const ano = data.getUTCFullYear()
		const dia = data.getUTCDate()
		const mes = data.getUTCMonth() + 1
		
		// Aqui criamos um objeto com todas as informações
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
			corDestaque: corDestaque || '#000000ff', // Cor padrão se não for fornecida
			dataCriacao: `${dia}/${mes}/${ano}`,
			status: 'ativo'
		};

		empregos.push(novoEmprego)
		// Colocamos dentro da array e sobescrevemos o arquivo JSON
		await fs.writeFile(empregosPath, JSON.stringify(empregos, null, 2))

		res.status(200).json({ ok: true, mensagem: "Emprego criado com sucesso!", emprego: novoEmprego })

	} catch (error) {
		console.error('Erro no POST emprego:', error);
		return res.status(500).json({ error: error.message });
	};
});

// GET - Listar empregos com filtros
router.get('/', async (req, res) => {
	// Verificação de login
	const userID = req.headers['user-id'];
	const { area, localizacao, tipoContrato, tipoTrabalho, salarioMin, salarioMax, nivel } = req.query;

	if (!userID) {
		return res.status(401).json({ error: "Você precisa logar primeiro!" });
	}

	try {
		// Pegando dados para processamento
		const data = await fs.readFile(empregosPath, 'utf8');
		const empregos = JSON.parse(data);

		// Filtramos por empregos ativos
		let resultado = empregos.filter(e => e.status === 'ativo');

		// Aplicar filtros
		if (area) {
			resultado = resultado.filter(e => e.area === area);
		}
		if (localizacao) {
			resultado = resultado.filter(e => 
				e.localizacao && e.localizacao.toLowerCase().includes(localizacao.toLowerCase())
			);
		}
		if (tipoContrato) {
			resultado = resultado.filter(e => e.tipoContrato === tipoContrato);
		}
		if (tipoTrabalho) {
			resultado = resultado.filter(e => e.tipoTrabalho === tipoTrabalho);
		}
		if (salarioMin) {
			resultado = resultado.filter(e => e.mediaSalario >= Number(salarioMin));
		}
		if (salarioMax) {
			resultado = resultado.filter(e => e.mediaSalario <= Number(salarioMax));
		}
		if (nivel) {
			resultado = resultado.filter(e => 
				e.nivel && e.nivel.toLowerCase() === nivel.toLowerCase()
			);
		}
		
		// Ordenar por data de criação (mais recente primeiro)
		resultado.sort((a, b) => new Date(b.dataCriacao) - new Date(a.dataCriacao));
		
		res.status(200).json({ ok: true, empregos: resultado });

	} catch (error) {
		console.error('Erro no GET emprego:', error);
		return res.status(500).json({ error: error.message });
	}
});

// GET /meus - Listar empregos da empresa
router.get('/meus', async (req, res) => {
	const empresaID = Number(req.headers['user-id']);

	if (!empresaID) {
		return res.status(401).json({ error: "Faça login primeiro!" });
	}

	try {
		const data = await fs.readFile(empregosPath, 'utf8');
		const empregos = JSON.parse(data);
		const empregosMeus = empregos.filter(e => Number(e.empresaID) === empresaID);

		if (empregosMeus.length === 0) {
			return res.status(404).json({ error: "Nenhum emprego encontrado!" })
		}

		empregosMeus.sort((a, b) => new Date(b.dataCriacao) - new Date(a.dataCriacao));

		res.status(200).json({ ok: true, mensagem: "Empregos carregados com sucesso!", empregos: empregosMeus })

	} catch (error) {
		console.error('Erro no GET /meus:', error);
		return res.status(500).json({ error: error.message });
	}
})

// DELETE /api/emprego/:id
router.delete('/:id', async (req, res) => {
	const empregoID = Number(req.params.id);
	const empresaID = Number(req.headers['user-id']);

	if (!empresaID) {
		return res.status(401).json({ error: "Faça login primeiro!" });
	}

	try {
		const data = await fs.readFile(empregosPath, 'utf8');
		const empregos = JSON.parse(data);

		const empregoIndex = empregos.findIndex(e => Number(e.empregoID) === Number(empregoID));

		if (empregoIndex === -1) {
			return res.status(404).json({ error: "Emprego não encontrado" });
		}

		const emprego = empregos[empregoIndex];

		if (Number(emprego.empresaID) !== empresaID) {
			return res.status(403).json({ error: "Você não pode deletar esta vaga!" });
		}

		empregos.splice(empregoIndex, 1);

		await fs.writeFile(empregosPath, JSON.stringify(empregos, null, 2));

		res.status(200).json({ ok: true, mensagem: `Vaga ${empregoID} deletada com sucesso!` });

	} catch (error) {
		console.error('Erro no DELETE emprego:', error);
		return res.status(500).json({ error: error.message });
	}
});

module.exports = router;