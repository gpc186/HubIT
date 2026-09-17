import { json, erro, lerCorpo, erroInterno } from '@/lib/api';
import { buscarUsuarioPorEmail } from '@/lib/db/models';

export async function POST(request) {
	try {
		// Constante que recebe 2 parametros inseridos no body para tentar logar
		const { email, passwd } = await lerCorpo(request);

		// Verifica se os parametros tem algo inserido
		if (!email || !passwd) {
			return erro('Todos os campos são obrigatórios!', 400);
		}

		// Verifica se as informações de login estão todas certas
		const usuario = buscarUsuarioPorEmail(email);

		if (!usuario || usuario.passwd !== passwd) {
			return erro('Usuario ou senha incorretos', 401);
		}

		return json({
			success: true,
			mensagem: 'Usuario logado com sucesso!',
			usuario: {
				userID: usuario.userID,
				email: usuario.email,
				tipoConta: usuario.tipoConta,
			},
		});
	} catch (error) {
		return erroInterno('Erro ao logar usuário:', error);
	}
}
