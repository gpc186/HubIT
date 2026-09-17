import { json, erro, idNumericoDoHeader, erroInterno } from '@/lib/api';
import { listarCandidaturasDoUsuario } from '@/lib/db/models';

// Rota para ver próprias candidaturas
export async function GET(request) {
	const userID = idNumericoDoHeader(request);

	if (!userID) {
		return erro('Por favor logue antes!', 401);
	}

	try {
		// Aqui que identificamos as candidaturas do usuário
		const minhasCandidaturas = listarCandidaturasDoUsuario(userID);

		if (minhasCandidaturas.length === 0) {
			return erro('Você não tem candidaturas ainda!', 404);
		}

		// Depois da verificação, apenas colocamos em ordem com base na data
		minhasCandidaturas.sort((a, b) => new Date(b.dataCandidatura) - new Date(a.dataCandidatura));

		return json({
			ok: true,
			mensagem: 'Candidaturas carregadas com sucesso!',
			candidaturas: minhasCandidaturas,
		});
	} catch (error) {
		return erroInterno('Erro ao listar candidaturas:', error);
	}
}
