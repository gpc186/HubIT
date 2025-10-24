const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

const portfolioPath = path.join(__dirname, '..', 'data', 'portfolios.json');
const usersPath = path.join(__dirname, '..', 'data', 'users.json');

const { criarIDPortfolio } = require('./utils/geradorID');

router.post('/', async (req, res) => {

	const userID = Number(req.headers['user-id']);
	// Verificação de usuario logado
	if (!userID) {
		return res.status(401).json({ error: "Por favor logue antes!" });
	};

	try {

		const userData = await fs.readFile(usersPath, 'utf8')
		const users = JSON.parse(userData);

		const userLogado = users.find(u => Number(u.userID) === userID);

		if (!userLogado) {
			return res.status(404).json({ error: "usuário não encontrado!" });
		};

		if (userLogado.tipoConta !== "usuario") {
			return res.status(403).json({ error: "Você não pode postar portfólios!" });
		};
		// Aqui ele pega todas as informações do body
		const {
			titulo,
			descricao,
			tecnologias,
			categoria,
			linkDemo,
			linkGithub,
			linkOutros
		} = req.body;
		// Verificação simples dos dados
		if (!titulo || titulo.trim() === '') {
			return res.status(400).json({ error: "Faltando titulo!" });
		};
		if (!descricao || descricao.trim() === '') {
			return res.status(400).json({ error: "Faltando Descrição!" });
		};
		if (!tecnologias) {
			return res.status(400).json({ error: "Faltando tecnologias!" });
		};
		if (!categoria) {
			return res.status(400).json({ error: "Faltando Categoria!" });
		};
		if (!linkGithub) {
			return res.status(400).json({ error: "Faltando link para o github!" });
		};
		if (!linkGithub.includes('github.com')) {
			return res.status(400).json({ error: "Link precisa ser do GitHub!" });
		};

		const data = await fs.readFile(portfolioPath, 'utf8');
		const portfolios = JSON.parse(data);

		const portfolioID = criarIDPortfolio();

		const novoPortfolio = {
			portfolioID,
			userID: userID,
			usuarioNome: userLogado.dados.nome,
			titulo: titulo.trim(),
			descricao: descricao.trim(),
			tecnologias,
			categoria: categoria.trim(),
			linkGithub: linkGithub.trim(),
			linkDemo: linkDemo ? linkDemo.trim() : null,
			linkOutros: linkOutros || [],
			dataCriacao: new Date().toISOString(),
			curtidas: 0
		};

		portfolios.push(novoPortfolio);

		await fs.writeFile(portfolioPath, JSON.stringify(portfolios, null, 2));

		res.status(200).json({ ok: true, portfolio: novoPortfolio });

	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: error.message });
	};
});

router.get('/', async (req, res) => {

	const userID = Number(req.headers['user-id']);

	if (!userID) {
		return res.status(401).json({ error: "Você precisa estar logado primeiro" });
	};

	try {
		const data = await fs.readFile(portfolioPath, 'utf8');
		const portfolios = JSON.parse(data);

		portfolios.sort((b, a) =>
			new Date(a.dataCriacao) - new Date(b.dataCriacao)
		);

		res.status(200).json({
			ok: true,
			total: portfolios.length,
			portfolios: portfolios
		});

	} catch (error) {
		return res.status(500).json({ error: error.message })
	}
})

router.delete('/:id', async (req, res) => {
	const userID = Number(req.headers['user-id']);
	const portfolioID = req.params.id

	if (!userID) {
		return res.status(401).json({ error: "Por favor logue antes!" })
	}
	try {
		const data = await fs.readFile(portfolioPath, 'utf8')
		const portfolios = JSON.parse(data)

		const portfolioIndex = portfolios.findIndex(p => Number(p.portfolioID) === Number(portfolioID))

		if (portfolioIndex === -1) {
			return res.status(404).json({ error: "Portfolio não encontrado!" })
		}

		const portfolio = portfolios[portfolioIndex];

		if (Number(portfolio.userID) !== userID) {
			return res.status(403).json({ error: "Você não pode deletar esse portfolio!" })
		}

		portfolios.splice(portfolioIndex, 1);

		await fs.writeFile(portfolioPath, JSON.stringify(portfolios, null, 2))

		res.status(200).json({ ok: true, mensagem: `Portfolio com id: ${portfolio.portfolioID} deletado com sucesso!` })

	} catch (error) {
		return res.status(500).json({ error: error.message })
	}
})

router.post('/:id/curtir', async (req, res) => {
	const userID = req.headers['user-id'];
	const portfolioPost = Number(req.params.id);

	if (!userID) {
		return res.status(401).json({ error: "Por favor logue antes!" })
	}

	try {
		const data = await fs.readFile(portfolioPath, 'utf8')
		const portfolios = JSON.parse(data);

		const portfolioIndex = portfolios.findIndex(p => Number(p.portfolioID) === portfolioPost)

		if (portfolioIndex === -1) {
			return res.status(404).json({ error: "Portfólio não encontrado!" })
		}

		portfolios[portfolioIndex].curtidas += 1;

		await fs.writeFile(portfolioPath, JSON.stringify(portfolios, null, 2))

		res.status(200).json({ ok: true, portfolio: { portfolioID: portfolios[portfolioIndex].portfolioID, curtidas: portfolios[portfolioIndex].curtidas } });

	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: error.message })
	}
})

router.delete('/:id/descurtir', async (req, res) => {
	const userID = req.headers['user-id'];
	const portfolioPost = Number(req.params.id);

	if (!userID) {
		return res.status(401).json({ error: "Por favor logue antes!" })
	}

	try {
		const data = await fs.readFile(portfolioPath, 'utf8')
		const portfolios = JSON.parse(data);

		const portfolioIndex = portfolios.findIndex(p => Number(p.portfolioID) === portfolioPost)

		if (portfolioIndex === -1) {
			return res.status(404).json({ error: "Portfólio não encontrado!" })
		}

		// Diminuir curtidas (não pode ser negativo)
		if (portfolios[portfolioIndex].curtidas > 0) {
			portfolios[portfolioIndex].curtidas -= 1;
		}

		await fs.writeFile(portfolioPath, JSON.stringify(portfolios, null, 2))

		res.status(200).json({ 
			ok: true, 
			portfolio: { 
				portfolioID: portfolios[portfolioIndex].portfolioID, 
				curtidas: portfolios[portfolioIndex].curtidas 
			} 
		});

	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: error.message })
	}
})

module.exports = router