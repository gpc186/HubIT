import { json, erro, idNumericoDoHeader, erroInterno } from '@/lib/api';
import { buscarPortfolio, deletarPortfolio } from '@/lib/db/models';

// Rota para deletar portfolio
export async function DELETE(request, { params }) {
	const userID = idNumericoDoHeader(request);
	const { id: portfolioID } = await params;

	if (!userID) {
		return erro('Por favor logue antes!', 401);
	}

	try {
		const portfolio = buscarPortfolio(portfolioID);

		if (!portfolio) {
			return erro('Portfolio não encontrado!', 404);
		}

		if (Number(portfolio.userID) !== userID) {
			return erro('Você não pode deletar esse portfolio!', 403);
		}

		deletarPortfolio(portfolioID);

		return json({
			ok: true,
			mensagem: `Portfolio com id: ${portfolio.portfolioID} deletado com sucesso!`,
		});
	} catch (error) {
		return erroInterno('Erro ao deletar portfólio:', error);
	}
}
