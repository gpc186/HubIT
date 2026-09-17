import { json, erro, lerCorpo, erroInterno } from '@/lib/api';
import { criarIDUsuario } from '@/lib/geradorID';
import { buscarUsuarioPorEmail, criarUsuario } from '@/lib/db/models';

export async function POST(request) {
	try {
		// Constante que recebe 3 valores que são requisitados no body
		const { email, passwd, tipoConta } = await lerCorpo(request);

		// Verifica se está vazio o parametro enviado
		if (!email || !passwd || !tipoConta) {
			return erro('Campos obrigatórios faltando!', 400);
		}

		// Verifica se já existe o email
		if (buscarUsuarioPorEmail(email)) {
			return erro('Email já cadastrado!', 400);
		}

		criarUsuario({
			userID: criarIDUsuario(),
			email,
			passwd,
			tipoConta,
			dados: {},
		});

		return json({ success: true }, 201);
	} catch (error) {
		return erroInterno('Erro ao registrar usuário:', error);
	}
}
