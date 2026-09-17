import { json, erro, lerCorpo, idDoHeader, erroInterno } from '@/lib/api';
import { criarIDEmprego } from '@/lib/geradorID';
import { buscarUsuarioPorID, criarEmprego, listarEmpregos } from '@/lib/db/models';
import { maisRecentePrimeiro } from '@/lib/datas';

// POST - Criar novo emprego
export async function POST(request) {
	// Verificação de usuário logado
	const empresaID = idDoHeader(request);

	if (!empresaID) {
		return erro('Por favor logue antes!', 401);
	}

	try {
		// Processamento de usuário para encontrar a empresa que está postando
		const empresa = buscarUsuarioPorID(empresaID);

		// Verificação do tipoConta do user, se tiver lá como empresa, pode postar
		if (!empresa) {
			return erro('Empresa não encontrada!', 404);
		}

		if (empresa.tipoConta !== 'empresa') {
			return erro('Você não pode postar empregos!', 403);
		}

		// Pegamos a requisição e colocamos como variável
		const {
			titulo,
			descricao,
			area,
			tipoContrato,
			tipoTrabalho,
			mediaSalario,
			localizacao,
			requisitos,
			beneficios,
			corDestaque,
		} = await lerCorpo(request);

		// Validações básicas
		if (!titulo || titulo.trim() === '') {
			return erro('Título é obrigatório!', 400);
		}
		if (!descricao || descricao.trim() === '') {
			return erro('Descrição é obrigatória!', 400);
		}
		if (!area || area.trim() === '') {
			return erro('Área é obrigatória!', 400);
		}
		if (!tipoContrato) {
			return erro('Tipo de contrato é obrigatório!', 400);
		}
		if (!localizacao || localizacao.trim() === '') {
			return erro('Localização é obrigatória!', 400);
		}

		// Aqui criamos um objeto com todas as informações
		const novoEmprego = criarEmprego({
			empregoID: criarIDEmprego(),
			empresaID,
			empresaNome: empresa.dados.nomeEmpresa,
			titulo: titulo.trim(),
			descricao: descricao.trim(),
			area: area.trim(),
			tipoContrato,
			tipoTrabalho,
			mediaSalario,
			localizacao: localizacao.trim(),
			requisitos,
			beneficios,
			corDestaque: corDestaque || '#000000ff', // Cor padrão se não for fornecida
			dataCriacao: new Date().toISOString(),
			status: 'ativo',
		});

		return json({ ok: true, mensagem: 'Emprego criado com sucesso!', emprego: novoEmprego });
	} catch (error) {
		return erroInterno('Erro no POST emprego:', error);
	}
}

// GET - Listar empregos com filtros
export async function GET(request) {
	// Verificação de login
	const userID = idDoHeader(request);
	const { searchParams } = new URL(request.url);

	const area = searchParams.get('area');
	const localizacao = searchParams.get('localizacao');
	const tipoContrato = searchParams.get('tipoContrato');
	const tipoTrabalho = searchParams.get('tipoTrabalho');
	const salarioMin = searchParams.get('salarioMin');
	const salarioMax = searchParams.get('salarioMax');
	const nivel = searchParams.get('nivel');

	if (!userID) {
		return erro('Você precisa logar primeiro!', 401);
	}

	try {
		// Filtramos por empregos ativos
		let resultado = listarEmpregos().filter((e) => e.status === 'ativo');

		// Aplicar filtros
		if (area) {
			resultado = resultado.filter((e) => e.area === area);
		}
		if (localizacao) {
			resultado = resultado.filter(
				(e) => e.localizacao && e.localizacao.toLowerCase().includes(localizacao.toLowerCase()),
			);
		}
		if (tipoContrato) {
			resultado = resultado.filter((e) => e.tipoContrato === tipoContrato);
		}
		if (tipoTrabalho) {
			resultado = resultado.filter((e) => e.tipoTrabalho === tipoTrabalho);
		}
		if (salarioMin) {
			resultado = resultado.filter((e) => e.mediaSalario >= Number(salarioMin));
		}
		if (salarioMax) {
			resultado = resultado.filter((e) => e.mediaSalario <= Number(salarioMax));
		}
		if (nivel) {
			resultado = resultado.filter((e) => e.nivel && e.nivel.toLowerCase() === nivel.toLowerCase());
		}

		// Ordenar por data de criação (mais recente primeiro)
		resultado.sort(maisRecentePrimeiro('dataCriacao'));

		return json({ ok: true, empregos: resultado });
	} catch (error) {
		return erroInterno('Erro no GET emprego:', error);
	}
}
