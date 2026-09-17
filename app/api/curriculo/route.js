import { json, erro, lerCorpo, idNumericoDoHeader, erroInterno } from '@/lib/api';
import { criarIDCurriculo } from '@/lib/geradorID';
import { buscarUsuarioPorID, criarCurriculo, listarCurriculosDoUsuario } from '@/lib/db/models';
import {
	validarExperiencias,
	validarEducacao,
	validarCertificados,
	validarIdiomas,
} from '@/lib/validacaoCurriculo';

// Rota para criar currículos
export async function POST(request) {
	const userID = idNumericoDoHeader(request);

	if (!userID) {
		return erro('Você deve logar antes!', 401);
	}

	try {
		const user = buscarUsuarioPorID(userID);

		// Verificações básicas antes de processar a requisição
		if (!user) {
			return erro('Usuário não encontrado!', 404);
		}

		if (user.tipoConta !== 'usuario') {
			return erro('Você não pode postar currículos!', 403);
		}

		if (!user.dados || !user.dados.nome) {
			return erro('Complete seu perfil antes de criar um currículo!', 400);
		}

		// Aqui pegamos tudo que pode vir da requisição
		const {
			titulo,
			resumoProfissional,
			experiencias,
			educacao,
			habilidades,
			softSkills,
			certificados,
			idiomas,
			links,
		} = await lerCorpo(request);

		// Série de verificações
		if (!titulo || titulo.trim() === '') {
			return erro('Título é obrigatório!', 400);
		}

		if (!resumoProfissional || resumoProfissional.trim() === '') {
			return erro('Resumo profissional é obrigatório!', 400);
		}

		if (!habilidades || !Array.isArray(habilidades) || habilidades.length === 0) {
			return erro('Adicione pelo menos 1 habilidade!', 400);
		}

		if (experiencias && !Array.isArray(experiencias)) {
			return erro('Experiências deve ser um array!', 400);
		}

		// Aqui temos que fazer verificação de cada item, pois ele pode vir com diversos objetos dentro de uma array
		if (experiencias && experiencias.length > 0) {
			const problema = validarExperiencias(experiencias);
			if (problema) return erro(problema, 400);
		}

		// Verificação de array
		if (educacao && !Array.isArray(educacao)) {
			return erro('Educação deve ser um array!', 400);
		}

		if (educacao && educacao.length > 0) {
			const problema = validarEducacao(educacao);
			if (problema) return erro(problema, 400);
		}

		if (softSkills && !Array.isArray(softSkills)) {
			return erro('Soft skills deve ser um array!', 400);
		}

		if (certificados && !Array.isArray(certificados)) {
			return erro('Certificados deve ser um array!', 400);
		}

		if (certificados && certificados.length > 0) {
			const problema = validarCertificados(certificados);
			if (problema) return erro(problema, 400);
		}

		if (idiomas && !Array.isArray(idiomas)) {
			return erro('Idiomas deve ser um array!', 400);
		}

		if (idiomas && idiomas.length > 0) {
			const problema = validarIdiomas(idiomas);
			if (problema) return erro(problema, 400);
		}

		if (links && typeof links !== 'object') {
			return erro('Links deve ser um objeto!', 400);
		}

		const agora = new Date().toISOString();

		// Objeto criado a partir dos dados recebidos
		const novoCurriculo = criarCurriculo({
			curriculoID: criarIDCurriculo(),
			userID,
			nome: user.dados.nome,
			email: user.email,
			telefone: user.dados.telefone || null,
			localizacao: user.dados.localizacao || null,
			titulo: titulo.trim(),
			resumoProfissional: resumoProfissional.trim(),
			habilidades,
			experiencias: experiencias || [],
			educacao: educacao || [],
			softSkills: softSkills || [],
			certificados: certificados || [],
			idiomas: idiomas || [],
			links: links || {
				linkedin: null,
				github: null,
				portfolio: null,
				outros: [],
			},
			dataCriacao: agora,
			dataAtualizacao: agora,
		});

		return json(
			{ ok: true, mensagem: 'Currículo criado com sucesso!', curriculo: novoCurriculo },
			201,
		);
	} catch (error) {
		return erroInterno('Erro ao criar currículo:', error);
	}
}

// Rota para ver currículos, no caso, seria apenas do próprio usuário
export async function GET(request) {
	const userID = idNumericoDoHeader(request);

	if (!userID) {
		return erro('Você deve logar antes!', 401);
	}

	try {
		const curriculosMeus = listarCurriculosDoUsuario(userID);

		if (curriculosMeus.length === 0) {
			return erro('Currículos não encontrados!', 404);
		}

		curriculosMeus.sort((a, b) => new Date(b.dataAtualizacao) - new Date(a.dataAtualizacao));

		return json({
			ok: true,
			mensagem: 'Currículo carregado com sucesso!',
			curriculos: curriculosMeus,
		});
	} catch (error) {
		return erroInterno('Erro ao listar currículos:', error);
	}
}
