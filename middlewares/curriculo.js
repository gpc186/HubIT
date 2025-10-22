const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

const curriculosPath = path.join(__dirname, '..', 'data', 'curriculos.json');
const usersPath = path.join(__dirname, '..', 'data', 'users.json');

const { criarIDCurriculo } = require('./utils/geradorID');

router.post('/', async (req, res)=>{
	const userID = Number(req.headers['user-id']);

	if(!userID){
		return res.status(401).json({error: "Você deve logar antes!"})
	}

	try {
		const userData = await fs.readFile(usersPath, 'utf8')
		const users = JSON.parse(userData);

		const user = users.find(u => Number(u.userID) === userID);

		if(!user){
			return res.status(404).json({error: "Usuário não encontrado!"})
		}

		if(user.tipoConta !== "usuario"){
			return res.status(403).json({error: "Você não pode postar currículos!"})
		}

		if (!user.dados || !user.dados.nome) {
            return res.status(400).json({error: "Complete seu perfil antes de criar um currículo!"});
        }

        const {
            titulo,
            resumoProfissional,
            experiencias,
            educacao,
            habilidades,
            softSkills,
            certificados,
            idiomas,
            links
        } = req.body;
        
        if (!titulo || titulo.trim() === '') {
            return res.status(400).json({error: "Título é obrigatório!"});
        }
        
        if (!resumoProfissional || resumoProfissional.trim() === '') {
            return res.status(400).json({error: "Resumo profissional é obrigatório!"});
        }
        
        if (!habilidades || !Array.isArray(habilidades) || habilidades.length === 0) {
            return res.status(400).json({error: "Adicione pelo menos 1 habilidade!"});
        }
        
        if (experiencias && !Array.isArray(experiencias)) {
            return res.status(400).json({error: "Experiências deve ser um array!"});
        }
        
        if (experiencias && experiencias.length > 0) {
            for (let exp of experiencias) {
                if (!exp.cargo || !exp.empresa || !exp.dataInicio) {
                    return res.status(400).json({error: "Cada experiência precisa ter: cargo, empresa e dataInicio"});
                }
            }
        }
        
        if (educacao && !Array.isArray(educacao)) {
            return res.status(400).json({error: "Educação deve ser um array!"});
        }
        
        if (educacao && educacao.length > 0) {
            for (let edu of educacao) {
                if (!edu.curso || !edu.instituicao || !edu.dataInicio) {
                    return res.status(400).json({error: "Cada educação precisa ter: curso, instituição e dataInicio"});
                }
            }
        }
        
        if (softSkills && !Array.isArray(softSkills)) {
            return res.status(400).json({error: "Soft skills deve ser um array!"});
        }
        
        if (certificados && !Array.isArray(certificados)) {
            return res.status(400).json({error: "Certificados deve ser um array!"});
        }
        
        if (certificados && certificados.length > 0) {
            for (let cert of certificados) {
                if (!cert.nome || !cert.instituicao || !cert.dataEmissao) {
                    return res.status(400).json({error: "Cada certificado precisa ter: nome, instituição e dataEmissao"});
                }
            }
        }
        
        if (idiomas && !Array.isArray(idiomas)) {
            return res.status(400).json({error: "Idiomas deve ser um array!"});
        }
        
        if (idiomas && idiomas.length > 0) {
            for (let idioma of idiomas) {
                if (!idioma.idioma || !idioma.nivel) {
                    return res.status(400).json({error: "Cada idioma precisa ter: idioma e nível"});
                }
            }
        }
        
        if (links && typeof links !== 'object') {
            return res.status(400).json({error: "Links deve ser um objeto!"});
        }

		const curriculosData = await fs.readFile(curriculosPath, 'utf8');
        const curriculos = JSON.parse(curriculosData);
        
        const novoCurriculo = {
            curriculoID: criarIDCurriculo(),
            userID: userID,
            nome: user.dados.nome,
            email: user.email,
            telefone: user.dados.telefone || null,
            localizacao: user.dados.localizacao || null,
            titulo: titulo.trim(),
            resumoProfissional: resumoProfissional.trim(),
            habilidades: habilidades,
            experiencias: experiencias || [],
            educacao: educacao || [],
            softSkills: softSkills || [],
            certificados: certificados || [],
            idiomas: idiomas || [],
            links: links || {
                linkedin: null,
                github: null,
                portfolio: null,
                outros: []
            },
            dataCriacao: new Date().toISOString(),
            dataAtualizacao: new Date().toISOString()
        };
        
        curriculos.push(novoCurriculo);
		
        await fs.writeFile(curriculosPath, JSON.stringify(curriculos, null, 2));
        
        res.status(201).json({ok: true, mensagem: "Currículo criado com sucesso!", curriculo: novoCurriculo});

	} catch (error) {
		console.error(error);
		return res.status(500).json({error: error.message})
	}
})

router.put('/:id', async (req, res)=>{
    const userID = Number(req.headers['user-id']);
    const curriculoIDUrl = Number(req.params.id);

	if(!userID){
		return res.status(401).json({error: "Você deve logar antes!"})
	}
    try {
        const data = await fs.readFile(curriculosPath, 'utf8')
        const curriculos = JSON.parse(data)

        const curriculoIndex = curriculos.findIndex(c => Number(c.curriculoID) === curriculoIDUrl)

        if (curriculoIndex === -1){
            return res.status(404).json({error: "Currículo não encontrado!"})
        }

        const curriculoAtual = curriculos[curriculoIndex]

        if (Number(curriculoAtual.userID) !== userID){
            return res.status(403).json({error: "Você não pode editar esse currículo!"})
        }

        const {
            titulo,
            resumoProfissional,
            experiencias,
            educacao,
            habilidades,
            softSkills,
            certificados,
            idiomas,
            links
        } = req.body;
        
        if (titulo !== undefined) {
            if (!titulo || titulo.trim() === '') {
                return res.status(400).json({error: "Título não pode estar vazio!"});
            }
        }
        
        if (resumoProfissional !== undefined) {
            if (!resumoProfissional || resumoProfissional.trim() === '') {
                return res.status(400).json({error: "Resumo profissional não pode estar vazio!"});
            }
        }
        
        if (habilidades !== undefined) {
            if (!Array.isArray(habilidades) || habilidades.length === 0) {
                return res.status(400).json({error: "Adicione pelo menos 1 habilidade!"});
            }
        }
        
        if (experiencias !== undefined) {
            if (experiencias.length > 0) {
                for (let exp of experiencias) {
                    if (!exp.cargo || !exp.empresa || !exp.dataInicio) {
                        return res.status(400).json({error: "Cada experiência precisa ter: cargo, empresa e dataInicio"});
                    }
                }
            }
        }
        
        if (educacao !== undefined) {
            if (educacao.length > 0) {
                for (let edu of educacao) {
                    if (!edu.curso || !edu.instituicao || !edu.dataInicio) {
                        return res.status(400).json({error: "Cada educação precisa ter: curso, instituição e dataInicio"});
                    }
                }
            }
        }
        
        if (softSkills !== undefined && !Array.isArray(softSkills)) {
            return res.status(400).json({error: "Soft skills deve ser um array!"});
        }
        
        if (certificados !== undefined) {
            if (certificados.length > 0) {
                for (let cert of certificados) {
                    if (!cert.nome || !cert.instituicao || !cert.dataEmissao) {
                        return res.status(400).json({error: "Cada certificado precisa ter: nome, instituição e dataEmissao"});
                    }
                }
            }
        }
        
        if (idiomas !== undefined) {
            if (idiomas.length > 0) {
                for (let idioma of idiomas) {
                    if (!idioma.idioma || !idioma.nivel) {
                        return res.status(400).json({error: "Cada idioma precisa ter: idioma e nível"});
                    }
                }
            }
        }
        
        if (titulo !== undefined) curriculoAtual.titulo = titulo.trim();
        if (resumoProfissional !== undefined) curriculoAtual.resumoProfissional = resumoProfissional.trim();
        if (habilidades !== undefined) curriculoAtual.habilidades = habilidades;
        if (experiencias !== undefined) curriculoAtual.experiencias = experiencias;
        if (educacao !== undefined) curriculoAtual.educacao = educacao;
        if (softSkills !== undefined) curriculoAtual.softSkills = softSkills;
        if (certificados !== undefined) curriculoAtual.certificados = certificados;
        if (idiomas !== undefined) curriculoAtual.idiomas = idiomas;
        if (links !== undefined) curriculoAtual.links = links;

        curriculoAtual.dataAtualizacao = new Date().toISOString();

        await fs.writeFile(curriculosPath, JSON.stringify(curriculos, null, 2))

        res.status(200).json({ok: true, mensagem: "Currículo atualizado com sucesso!", curriculo: curriculoAtual})

    } catch (error) {
        console.error(error);
        return res.status(500).json({error: error.message})
    }
})

router.get('/', async (req, res)=>{
    const userID = Number(req.headers['user-id']);

    if(!userID){
        return res.status(401).json({error: "Você deve logar antes!"})
    }

    try {
        const data = await fs.readFile(curriculosPath, 'utf8')
        const curriculos = JSON.parse(data)
        const curriculosMeus = curriculos.filter(c => Number(c.userID) === userID);
        
        if(curriculosMeus.length === 0){
            return res.status(404).json({error: "Você não pode visualizar esses currículos!"})
        }

        curriculosMeus.sort((a, b) => new Date(b.dataAtualizacao) - new Date(a.dataAtualizacao))

        res.status(200).json({ok: true, mensagem: "Currículo carregado com sucesso!", curriculos: curriculosMeus})
    } catch (error) {
        console.error(error);
        return res.status(500).json({error: error.message})
    }
})

router.delete('/:id', async (req, res)=>{
    const userID = Number(req.headers['user-id']);
    const curriculoIDUrl = Number(req.params.id);

	if(!userID){
		return res.status(401).json({error: "Você deve logar antes!"})
	}
    try {
        const data = await fs.readFile(curriculosPath, 'utf8');
        const curriculos = JSON.parse(data)

        const curriculoIndex = curriculos.findIndex(c => Number(c.curriculoID) === curriculoIDUrl);

        if (curriculoIndex === -1){
            return res.status(404).json({error: "Currículo não encontrado!"})
        }

        const curriculo = curriculos[curriculoIndex];
        
        if (Number(curriculo.userID) !== userID) {
            return res.status(403).json({error: "Você não pode deletar este currículo!"});
        }

        curriculos.splice(curriculoIndex, 1)

        await fs.writeFile(curriculosPath, JSON.stringify(curriculos, null, 2))

        res.status(200).json({ok: true, mensagem: "Currículo deletado com sucesso!", curriculo: curriculoIDUrl})
    } catch (error) {
        console.error('Erro ao deletar currículo:', error);
        return res.status(500).json({error: error.message});
    }
})

module.exports = router