const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

const portfolioPath = path.join(__dirname, '..', 'data', 'portfolio.json');
const usersPath = path.join(__dirname, '..', 'data', 'users.json');

const { criarIDPortfolio } = require('./utils/geradorID');

router.post('/', async (req, res)=>{

	const userID = req.headers['user-id'];
	// Verificação de usuario logado
	if (!userID){
		return res.status(401).json({error: "Por favor logue antes!"});
	};

	try {
		// Aqui ele pega todas as informações do body
		const {
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
		// Verificação simples dos dados
		if(!portfolioID){
			res.status(400).json({error: "Faltando informações"})
		}
		if(!usuarioID){
			res.status(400).json({error: "Faltando informações"})
		}
		if(!usuarioNome){
			res.status(400).json({error: "Faltando informações"})
		}
		if(!titulo || titulo.trim() === ''){
			res.status(400).json({error: "Faltando informações"})
		}
		if(!descricao || descricao.trim() === ''){
			res.status(400).json({error: "Faltando informações"})
		}
		if(!tecnologias || tecnologias.trim() === ''){
			res.status(400).json({error: "Faltando informações"})
		}
		if(!categoria  || categoria.trim() === ''){
			res.status(400).json({error: "Faltando informações"})
		}
		if(!linkDemo || linkDemo.trim() === ''){
			res.status(400).json({error: "Faltando informações"})
		}
		if(!linkGithub || linkGithub.trim() === ''){
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