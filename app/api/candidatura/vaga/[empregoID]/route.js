import { json, erro, idNumericoDoHeader, erroInterno } from '@/lib/api';
import { buscarEmprego, listarCandidaturasDaVaga } from '@/lib/db/models';

// Aqui é a rota para ver as candidaturas de um certo emprego
export async function GET(request, { params }) {
	const empresaID = idNumericoDoHeader(request);
	const { empregoID: empregoIDParam } = await params;
	const empregoID = Number(empregoIDParam);

	if (!empresaID) {
		return erro('Faça login primeiro!', 401);
	}

	try {
		const emprego = buscarEmprego(empregoID);

		if (!emprego) {
			return erro('Vaga não encontrada!', 404);
		}

		// Verificar se a empresa é dona da vaga
		if (Number(emprego.empresaID) !== empresaID) {
			return erro('Você não tem permissão para ver estes candidatos', 403);
		}

		const candidatosDaVaga = listarCandidaturasDaVaga(empregoID);

		candidatosDaVaga.sort((a, b) => new Date(b.dataCandidatura) - new Date(a.dataCandidatura));

		return json({
			ok: true,
			mensagem: 'Candidaturas carregadas com sucesso!',
			total: candidatosDaVaga.length,
			vaga: {
				titulo: emprego.titulo,
				empresaNome: emprego.empresaNome,
			},
			candidaturas: candidatosDaVaga,
		});
	} catch (error) {
		return erroInterno('Erro ao listar candidaturas da vaga:', error);
	}
}
