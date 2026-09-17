import { json, erro, lerCorpo, idNumericoDoHeader, erroInterno } from '@/lib/api';
import { buscarCurriculo, atualizarCurriculo, deletarCurriculo } from '@/lib/db/models';
import {
	validarExperiencias,
	validarEducacao,
	validarCertificados,
	validarIdiomas,
} from '@/lib/validacaoCurriculo';

// Rota para alterar currículo já existente
export async function PUT(request, { params }) {
	const userID = idNumericoDoHeader(request);
	const { id } = await params;
	const curriculoIDUrl = Number(id);

	if (!userID) {
		return erro('Você deve logar antes!', 401);
	}

	try {
		const curriculoAtual = buscarCurriculo(curriculoIDUrl);

		// Verificações básicas antes da requisição
		if (!curriculoAtual) {
			return erro('Currículo não encontrado!', 404);
		}

		if (Number(curriculoAtual.userID) !== userID) {
			return erro('Você não pode editar esse currículo!', 403);
		}

		// Pegamos os dados da requisição
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

		// Mesmas verificações de antes, mas agora para saber qual dessas informações veio ou não
		if (titulo !== undefined) {
			if (!titulo || titulo.trim() === '') {
				return erro('Título não pode estar vazio!', 400);
			}
		}

		if (resumoProfissional !== undefined) {
			if (!resumoProfissional || resumoProfissional.trim() === '') {
				return erro('Resumo profissional não pode estar vazio!', 400);
			}
		}

		if (habilidades !== undefined) {
			if (!Array.isArray(habilidades) || habilidades.length === 0) {
				return erro('Adicione pelo menos 1 habilidade!', 400);
			}
		}

		if (experiencias !== undefined && experiencias.length > 0) {
			const problema = validarExperiencias(experiencias);
			if (problema) return erro(problema, 400);
		}

		if (educacao !== undefined && educacao.length > 0) {
			const problema = validarEducacao(educacao);
			if (problema) return erro(problema, 400);
		}

		if (softSkills !== undefined && !Array.isArray(softSkills)) {
			return erro('Soft skills deve ser um array!', 400);
		}

		if (certificados !== undefined && certificados.length > 0) {
			const problema = validarCertificados(certificados);
			if (problema) return erro(problema, 400);
		}

		if (idiomas !== undefined && idiomas.length > 0) {
			const problema = validarIdiomas(idiomas);
			if (problema) return erro(problema, 400);
		}

		if (titulo !== undefined) curriculoAtual.titulo = titulo.trim();
		if (resumoProfissional !== undefined) {
			curriculoAtual.resumoProfissional = resumoProfissional.trim();
		}
		if (habilidades !== undefined) curriculoAtual.habilidades = habilidades;
		if (experiencias !== undefined) curriculoAtual.experiencias = experiencias;
		if (educacao !== undefined) curriculoAtual.educacao = educacao;
		if (softSkills !== undefined) curriculoAtual.softSkills = softSkills;
		if (certificados !== undefined) curriculoAtual.certificados = certificados;
		if (idiomas !== undefined) curriculoAtual.idiomas = idiomas;
		if (links !== undefined) curriculoAtual.links = links;

		curriculoAtual.dataAtualizacao = new Date().toISOString();

		const curriculo = atualizarCurriculo(curriculoAtual);

		return json({ ok: true, mensagem: 'Currículo atualizado com sucesso!', curriculo });
	} catch (error) {
		return erroInterno('Erro ao atualizar currículo:', error);
	}
}

// Rota para deletar
export async function DELETE(request, { params }) {
	const userID = idNumericoDoHeader(request);
	const { id } = await params;
	const curriculoIDUrl = Number(id);

	if (!userID) {
		return erro('Você deve logar antes!', 401);
	}

	try {
		const curriculo = buscarCurriculo(curriculoIDUrl);

		if (!curriculo) {
			return erro('Currículo não encontrado!', 404);
		}

		// Verificação de credenciais
		if (Number(curriculo.userID) !== userID) {
			return erro('Você não pode deletar este currículo!', 403);
		}

		deletarCurriculo(curriculoIDUrl);

		return json({
			ok: true,
			mensagem: 'Currículo deletado com sucesso!',
			curriculo: curriculoIDUrl,
		});
	} catch (error) {
		return erroInterno('Erro ao deletar currículo:', error);
	}
}
