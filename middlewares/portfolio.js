const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

const portfolioPath = path.join(__dirname, '..', 'data', 'portfolio.json');
const usersPath = path.join(__dirname, '..', 'data', 'users.json');

const { criarIDPortfolio } = require('./utils/geradorID');

router.post('/', async (req, res)=>{

	const userID = req.headers['user-id'];
	
	if (!userID){
		return res.status(401).json({error: "Por favor logue antes!"});
	};

	try {
		const {
			portfolioID,
			usuarioID,
			usuarioNome,
			titulo,
			descricao,
			tecnologias,
			categoria,
			linkDemo,
			linkGithub,
			linkOutros,
			dataCriacao,
			curtidas
		} = req.body;

		if(!portfolioID){
			res.status(400).json({error: "Faltando informações"})
		}
		if(!usuarioID){
			res.status(400).json({error: "Faltando informações"})
		}
		if(!usuarioNome){
			res.status(400).json({error: "Faltando informações"})
		}
		if(!titulo){
			res.status(400).json({error: "Faltando informações"})
		}
		if(!descricao){
			res.status(400).json({error: "Faltando informações"})
		}
		if(!tecnologias){
			res.status(400).json({error: "Faltando informações"})
		}
		if(!categoria){
			res.status(400).json({error: "Faltando informações"})
		}
		if(!linkDemo){
			res.status(400).json({error: "Faltando informações"})
		}
		if(!linkGithub){
			res.status(400).json({error: "Faltando informações"})
		}
		if(!dataCriacao){
			res.status(400).json({error: "Faltando informações"})
		}
		if(!curtidas){
			res.status(400).json({error: "Faltando informações"})
		}
		
		


	} catch (error) {
		
	}
})