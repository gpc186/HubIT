import { json, erro, lerCorpo, idNumericoDoHeader, erroInterno } from '@/lib/api';
import { buscarUsuarioPorID, atualizarDadosUsuario } from '@/lib/db/models';

export async function GET(request, { params }) {
	const userIDHeader = idNumericoDoHeader(request);
	const { id } = await params;
	const userIDParam = Number(id);

	if (!userIDHeader) {
		return erro('Você precisa logar antes!', 401);
	}

	try {
		// Procura o Usuário requisitado
		const userData = buscarUsuarioPorID(userIDParam);

		if (!userData) {
			return erro('Usuário não encontrado', 404);
		}

		// Se Usuário da requisição for igual ao do Header já existente -> Pode editar
		const podeEditar = userIDParam === userIDHeader;
		const perfilCompleto = Boolean(userData.dados && Object.keys(userData.dados).length > 0);

		// Envia os dados
		return json({
			ok: true,
			mensagem: 'Dados foram carregados com sucesso!',
			usuario: {
				userID: userData.userID,
				email: userData.email,
				tipoConta: userData.tipoConta,
				dados: userData.dados || {},
				podeEditar,
				perfilCompleto,
			},
		});
	} catch (error) {
		return erroInterno('Erro ao carregar usuário:', error);
	}
}

export async function PUT(request, { params }) {
	// Aqui pegamos o id do login e também do URL
	const userIDHeader = idNumericoDoHeader(request);
	const { id } = await params;
	const userIDParam = Number(id);
	// Aqui pegamos os dados que foram enviados no corpo
	const dados = await lerCorpo(request);

	try {
		// Procuramos o usuário baseado no URL
		const usuario = buscarUsuarioPorID(userIDParam);

		if (!usuario) {
			return erro('Usuário não encontrado', 404);
		}
		// Verifica para ver se o usuário está logado
		if (!userIDHeader) {
			return erro('Por favor logue antes!', 401);
		}
		// Verificação para saber se ele pode editar ou não, mesmo não aparecendo o botão
		if (userIDParam !== userIDHeader) {
			return erro('Você não pode editar esse perfil, nem sei como que você foi parar aqui', 401);
		}

		// Aqui seria um "foreach" dos dados, para verificar quais foram preenchidos ou não
		const dadosNovos = {};
		for (const campo in dados) {
			const valor = dados[campo];

			if (valor !== undefined && valor !== null && valor !== '') {
				dadosNovos[campo] = valor;
			}
		}

		// Pegamos os dados novos e colocamos dentro do usuario
		const atualizado = atualizarDadosUsuario(userIDParam, {
			...usuario.dados,
			...dadosNovos,
		});

		// Aqui mandamos umas informações para o front
		return json({
			ok: true,
			usuario: {
				userID: atualizado.userID,
				email: atualizado.email,
				tipoConta: atualizado.tipoConta,
				dados: atualizado.dados,
			},
		});
	} catch (error) {
		return erroInterno('Erro ao atualizar usuário:', error);
	}
}
