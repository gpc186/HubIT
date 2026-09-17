import { json, erro, idDoHeader, erroInterno } from '@/lib/api';
import { buscarPortfolio, ajustarCurtidas } from '@/lib/db/models';

// Rota para tirar curtida de portfolio
export async function DELETE(request, { params }) {
	const userID = idDoHeader(request);
	const { id } = await params;
	const portfolioPost = Number(id);

	if (!userID) {
		return erro('Por favor logue antes!', 401);
	}

	try {
		if (!buscarPortfolio(portfolioPost)) {
			return erro('Portfólio não encontrado!', 404);
		}

		// Diminuir curtidas (não pode ser negativo)
		const portfolio = ajustarCurtidas(portfolioPost, -1);

		return json({
			ok: true,
			portfolio: { portfolioID: portfolio.portfolioID, curtidas: portfolio.curtidas },
		});
	} catch (error) {
		return erroInterno('Erro ao descurtir portfólio:', error);
	}
}
