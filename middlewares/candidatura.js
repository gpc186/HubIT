const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');
// Aqui pegamos todos os caminhos de JSONs que iremos utilizar
const candidaturasPath = path.join(__dirname, '..', 'data', 'candidaturas.json');
const empregosPath = path.join(__dirname, '..', 'data', 'empregos.json');
const curriculosPath = path.join(__dirname, '..', 'data', 'curriculos.json');
const usersPath = path.join(__dirname, '..', 'data', 'users.json');
// Pegamos o gerador de candidaturas pelo /utils/
const { criarIDCandidaturas } = require('./utils/geradorID');
// Rota para criar candidaturas
router.post('/', async (req, res)=>{
	const userID = Number(req.headers['user-id']);

	if(!userID){
		return res.status(401).json({error: "Por favor logue antes!"})
	}
	try {
		const { empregoID, curriculoID } = req.body;
        // Verificações básicas
		if (!empregoID) {
            return res.status(400).json({error: "ID do emprego é obrigatório!"});
        }
        
        if (!curriculoID) {
            return res.status(400).json({error: "Selecione um currículo!"});
        }
        // Aqui pegamos os dados de usuário
		const userData = await fs.readFile(usersPath, 'utf8')
		const users = JSON.parse(userData)
		const usuario = users.find(u => Number(u.userID) === userID)
        // Mais verificações
		if (!usuario) {
            return res.status(404).json({error: "Usuário não encontrado"});
        }
        
        if (usuario.tipoConta !== 'usuario') {
            return res.status(403).json({error: "Apenas usuários podem se candidatar!"});
        }
        
        if (!usuario.dados || !usuario.dados.nome) {
            return res.status(400).json({error: "Complete seu perfil antes de se candidatar!"});
        }
        // Aqui pegamos os dados de empregos
		const empregoData = await fs.readFile(empregosPath, 'utf8')
		const empregos = JSON.parse(empregoData);
		const emprego = empregos.find(e => Number(e.empregoID) === empregoID)
        // Mais verificações
		if (!emprego) {
            return res.status(404).json({error: "Vaga não encontrada"});
        }
        
        if (emprego.status !== 'ativo') {
            return res.status(400).json({error: "Esta vaga não está mais ativa"});
        }
        // Aqui pegamos os dados de currículos
		const curriculosData = await fs.readFile(curriculosPath, 'utf8');
        const curriculos = JSON.parse(curriculosData);
        const curriculo = curriculos.find(c => Number(c.curriculoID) === Number(curriculoID));
        // Verificações
        if (!curriculo) {
            return res.status(404).json({error: "Currículo não encontrado"});
        }
        
        if (Number(curriculo.userID) !== userID) {
            return res.status(403).json({error: "Este currículo não é seu!"});
        }
        // Pegamos os dados de candidatura
		const candidaturasData = await fs.readFile(candidaturasPath, 'utf8');
        const candidaturas = JSON.parse(candidaturasData);
        // Verificações
        const jaCandidatou = candidaturas.find(c => 
            Number(c.userID) === userID && 
            Number(c.empregoID) === Number(empregoID)
        );
        
        if (jaCandidatou) {
            return res.status(400).json({error: "Você já se candidatou para esta vaga!"});
        }

		const candidato = usuario.dados
        // Aqui fazemos um object que tira um snapshot de varias informações do currículo, vaga de emprego, usuário, e também da candidatura
		const novaCandidatura = {
			candidaturaID: criarIDCandidaturas(),
			empregoID: Number(empregoID),
			userID: userID,
			curriculoID: Number(curriculoID),

			candidato: {
				nome: candidato.nome,
				email: usuario.email,
				telefone: candidato.telefone,
				localizacao: candidato.localizacao,
				areaAtuacao: candidato.areaAtuacao,
				nivelExperiencia: candidato.nivelExperiencia,
				linkedin: candidato.linkedin || null,
				github: candidato.github || null
			},

			vaga: {
				titulo: emprego.titulo,
				empresaNome: emprego.empresaNome,
				localizacao: emprego.localizacao,
				area: emprego.area
			},

			dataCandidatura: new Date().toISOString(),
			status: "pendente"
		}

		candidaturas.push(novaCandidatura)
        // Aqui só damos push dentro da array e escrevemos de novo o arquivo de candidaturas
		await fs.writeFile(candidaturasPath, JSON.stringify(candidaturas, null, 2))

		res.status(200).json({ok: true, mensagem: "Candidatura enviada com sucesso!", candidatura: novaCandidatura})
	} catch (error) {
		console.error('Erro ao criar candidatura:', error);
        return res.status(500).json({error: error.message});
	}
})
// Rota para ver próprias candidaturas
router.get('/minhas', async (req, res)=>{
	const userID = Number(req.headers['user-id']);

	if(!userID){
		return res.status(401).json({error: "Por favor logue antes!"})
	}

	try {
		const data = await fs.readFile(candidaturasPath, 'utf8')
		const candidaturas = JSON.parse(data)
        // Aqui que identificamos as candidaturas do usuário
		const minhasCandidaturas = candidaturas.filter(c => Number(c.userID) === userID)
		
		if (minhasCandidaturas.length === 0){
			return res.status(404).json({error: "Você não tem candidaturas ainda!"})
		}

		minhasCandidaturas.sort((a, b)=> new Date(b.dataCandidatura) - new Date(a.dataCandidatura))
        // Depois da verificação, apenas colocamos em ordem com base na data
		res.status(200).json({ok: true, mensagem: "Candidaturas carregadas com sucesso!", candidaturas: minhasCandidaturas})
	} catch (error) {
		return res.status(500).json({error: error.message});
	}
})
// Aqui é a rota parar ver as candidaturas de um certo emprego
router.get('/vaga/:empregoID', async (req, res) => {
    const empresaID = Number(req.headers['user-id']);
    const empregoID = Number(req.params.empregoID);
    
    if (!empresaID) {
        return res.status(401).json({error: "Faça login primeiro!"});
    }
    
    try {
        const empregosData = await fs.readFile(empregosPath, 'utf8');
        const empregos = JSON.parse(empregosData);
        
        // CORREÇÃO: Buscar emprego pelo empregoID, não pelo userID
        const emprego = empregos.find(e => Number(e.empregoID) === empregoID);

        if (!emprego) {
            return res.status(404).json({error: "Vaga não encontrada!"});
        }

        // Verificar se a empresa é dona da vaga
        if (Number(emprego.empresaID) !== empresaID) {
            return res.status(403).json({error: "Você não tem permissão para ver estes candidatos"});
        }

        const candidaturasData = await fs.readFile(candidaturasPath, 'utf8');
        const candidaturas = JSON.parse(candidaturasData);
        
        const candidatosDaVaga = candidaturas.filter(c => Number(c.empregoID) === empregoID);
        
        candidatosDaVaga.sort((a, b) => 
            new Date(b.dataCandidatura) - new Date(a.dataCandidatura)
        );

        res.status(200).json({
            ok: true, 
            mensagem: "Candidaturas carregadas com sucesso!", 
            total: candidatosDaVaga.length, 
            vaga: { 
                titulo: emprego.titulo, 
                empresaNome: emprego.empresaNome 
            }, 
            candidaturas: candidatosDaVaga
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({error: error.message});
    }
});

module.exports = router