import { json, erro, idNumericoDoHeader, erroInterno } from '@/lib/api';
import { buscarEmprego, deletarEmprego } from '@/lib/db/models';

// DELETE /api/emprego/:id
export async function DELETE(request, { params }) {
	const { id } = await params;
	const empregoID = Number(id);
	const empresaID = idNumericoDoHeader(request);

	if (!empresaID) {
		return erro('Faça login primeiro!', 401);
	}

	try {
		const emprego = buscarEmprego(empregoID);

		if (!emprego) {
			return erro('Emprego não encontrado', 404);
		}

		if (Number(emprego.empresaID) !== empresaID) {
			return erro('Você não pode deletar esta vaga!', 403);
		}

		deletarEmprego(empregoID);

		return json({ ok: true, mensagem: `Vaga ${empregoID} deletada com sucesso!` });
	} catch (error) {
		return erroInterno('Erro no DELETE emprego:', error);
	}
}
