import { json, erro, idNumericoDoHeader, erroInterno } from '@/lib/api';
import { listarEmpregosDaEmpresa } from '@/lib/db/models';

// GET /meus - Listar empregos da empresa
export async function GET(request) {
	const empresaID = idNumericoDoHeader(request);

	if (!empresaID) {
		return erro('Faça login primeiro!', 401);
	}

	try {
		const empregosMeus = listarEmpregosDaEmpresa(empresaID);

		if (empregosMeus.length === 0) {
			return erro('Nenhum emprego encontrado!', 404);
		}

		empregosMeus.sort((a, b) => new Date(b.dataCriacao) - new Date(a.dataCriacao));

		return json({
			ok: true,
			mensagem: 'Empregos carregados com sucesso!',
			empregos: empregosMeus,
		});
	} catch (error) {
		return erroInterno('Erro no GET /meus:', error);
	}
}
