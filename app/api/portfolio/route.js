import { json, erro, lerCorpo, idNumericoDoHeader, erroInterno } from '@/lib/api';
import { criarIDPortfolio } from '@/lib/geradorID';
import { buscarUsuarioPorID, criarPortfolio, listarPortfolios } from '@/lib/db/models';

// Rota para criar portfolio
export async function POST(request) {
	const userID = idNumericoDoHeader(request);

	// Verificação de usuario logado
	if (!userID) {
		return erro('Por favor logue antes!', 401);
	}

	try {
		const userLogado = buscarUsuarioPorID(userID);

		if (!userLogado) {
			return erro('usuário não encontrado!', 404);
		}

		if (userLogado.tipoConta !== 'usuario') {
			return erro('Você não pode postar portfólios!', 403);
		}

		// Aqui ele pega todas as informações do body
		const { titulo, descricao, tecnologias, categoria, linkDemo, linkGithub, linkOutros } =
			await lerCorpo(request);

		// Verificação simples dos dados
		if (!titulo || titulo.trim() === '') {
			return erro('Faltando titulo!', 400);
		}
		if (!descricao || descricao.trim() === '') {
			return erro('Faltando Descrição!', 400);
		}
		if (!tecnologias) {
			return erro('Faltando tecnologias!', 400);
		}
		if (!categoria) {
			return erro('Faltando Categoria!', 400);
		}
		if (!linkGithub) {
			return erro('Faltando link para o github!', 400);
		}
		if (!linkGithub.includes('github.com')) {
			return erro('Link precisa ser do GitHub!', 400);
		}

		const novoPortfolio = criarPortfolio({
			portfolioID: criarIDPortfolio(),
			userID,
			usuarioNome: userLogado.dados.nome,
			titulo: titulo.trim(),
			descricao: descricao.trim(),
			tecnologias,
			categoria: categoria.trim(),
			linkGithub: linkGithub.trim(),
			linkDemo: linkDemo ? linkDemo.trim() : null,
			linkOutros: linkOutros || [],
			dataCriacao: new Date().toISOString(),
			curtidas: 0,
		});

		return json({ ok: true, portfolio: novoPortfolio });
	} catch (error) {
		return erroInterno('Erro ao criar portfólio:', error);
	}
}

// Rota para exibir todos os portfolios
export async function GET(request) {
	const userID = idNumericoDoHeader(request);

	if (!userID) {
		return erro('Você precisa estar logado primeiro', 401);
	}

	try {
		const portfolios = listarPortfolios();

		portfolios.sort((b, a) => new Date(a.dataCriacao) - new Date(b.dataCriacao));

		return json({
			ok: true,
			total: portfolios.length,
			portfolios,
		});
	} catch (error) {
		return erroInterno('Erro ao listar portfólios:', error);
	}
}
