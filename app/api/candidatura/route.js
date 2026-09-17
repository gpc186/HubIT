import { json, erro, lerCorpo, idNumericoDoHeader, erroInterno } from '@/lib/api';
import { criarIDCandidaturas } from '@/lib/geradorID';
import {
	buscarUsuarioPorID,
	buscarEmprego,
	buscarCurriculo,
	buscarCandidaturaDoUsuarioNaVaga,
	criarCandidatura,
} from '@/lib/db/models';

// Rota para criar candidaturas
export async function POST(request) {
	const userID = idNumericoDoHeader(request);

	if (!userID) {
		return erro('Por favor logue antes!', 401);
	}

	try {
		const { empregoID, curriculoID } = await lerCorpo(request);

		// Verificações básicas
		if (!empregoID) {
			return erro('ID do emprego é obrigatório!', 400);
		}

		if (!curriculoID) {
			return erro('Selecione um currículo!', 400);
		}

		// Aqui pegamos os dados de usuário
		const usuario = buscarUsuarioPorID(userID);

		// Mais verificações
		if (!usuario) {
			return erro('Usuário não encontrado', 404);
		}

		if (usuario.tipoConta !== 'usuario') {
			return erro('Apenas usuários podem se candidatar!', 403);
		}

		if (!usuario.dados || !usuario.dados.nome) {
			return erro('Complete seu perfil antes de se candidatar!', 400);
		}

		// Aqui pegamos os dados da vaga
		const emprego = buscarEmprego(empregoID);

		if (!emprego) {
			return erro('Vaga não encontrada', 404);
		}

		if (emprego.status !== 'ativo') {
			return erro('Esta vaga não está mais ativa', 400);
		}

		// Aqui pegamos os dados do currículo
		const curriculo = buscarCurriculo(curriculoID);

		if (!curriculo) {
			return erro('Currículo não encontrado', 404);
		}

		if (Number(curriculo.userID) !== userID) {
			return erro('Este currículo não é seu!', 403);
		}

		if (buscarCandidaturaDoUsuarioNaVaga(userID, empregoID)) {
			return erro('Você já se candidatou para esta vaga!', 400);
		}

		const candidato = usuario.dados;

		// Aqui fazemos um object que tira um snapshot de varias informações do currículo, vaga de emprego, usuário, e também da candidatura
		const novaCandidatura = criarCandidatura({
			candidaturaID: criarIDCandidaturas(),
			empregoID: Number(empregoID),
			userID,
			curriculoID: Number(curriculoID),

			candidato: {
				nome: candidato.nome,
				email: usuario.email,
				telefone: candidato.telefone,
				localizacao: candidato.localizacao,
				areaAtuacao: candidato.areaAtuacao,
				nivelExperiencia: candidato.nivelExperiencia,
				linkedin: candidato.linkedin || null,
				github: candidato.github || null,
			},

			vaga: {
				titulo: emprego.titulo,
				empresaNome: emprego.empresaNome,
				localizacao: emprego.localizacao,
				area: emprego.area,
			},

			dataCandidatura: new Date().toISOString(),
			status: 'pendente',
		});

		return json({
			ok: true,
			mensagem: 'Candidatura enviada com sucesso!',
			candidatura: novaCandidatura,
		});
	} catch (error) {
		return erroInterno('Erro ao criar candidatura:', error);
	}
}
