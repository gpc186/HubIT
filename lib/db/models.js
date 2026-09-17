import { db, lerJSON, gravarJSON } from './index.js';

// Cada `mapear*` devolve exatamente o mesmo objeto que a API entregava quando
// os dados viviam nos arquivos JSON — o front não precisou mudar nada.

// --- Usuários --------------------------------------------------------------

function mapearUsuario(linha) {
	if (!linha) return null;
	return {
		email: linha.email,
		passwd: linha.passwd,
		tipoConta: linha.tipoConta,
		userID: linha.userID,
		dados: lerJSON(linha.dados, {}) ?? {},
	};
}

export function buscarUsuarioPorEmail(email) {
	return mapearUsuario(db.prepare('SELECT * FROM users WHERE email = ?').get(email));
}

export function buscarUsuarioPorID(userID) {
	return mapearUsuario(db.prepare('SELECT * FROM users WHERE userID = ?').get(Number(userID)));
}

export function criarUsuario({ userID, email, passwd, tipoConta, dados = {} }) {
	db.prepare(
		'INSERT INTO users (userID, email, passwd, tipoConta, dados) VALUES (?, ?, ?, ?, ?)',
	).run(Number(userID), email, passwd, tipoConta, gravarJSON(dados));

	return buscarUsuarioPorID(userID);
}

export function atualizarDadosUsuario(userID, dados) {
	db.prepare('UPDATE users SET dados = ? WHERE userID = ?').run(gravarJSON(dados), Number(userID));
	return buscarUsuarioPorID(userID);
}

// --- Empregos --------------------------------------------------------------

function mapearEmprego(linha) {
	if (!linha) return null;
	return {
		empregoID: linha.empregoID,
		empresaID: linha.empresaID,
		imgEmpresa: linha.imgEmpresa,
		empresaNome: linha.empresaNome,
		qtdFuncionario: linha.qtdFuncionario,
		titulo: linha.titulo,
		descricao: linha.descricao,
		area: linha.area,
		nivel: linha.nivel,
		tipoContrato: linha.tipoContrato,
		tipoTrabalho: linha.tipoTrabalho,
		cargaHoraria: linha.cargaHoraria,
		mediaSalario: linha.mediaSalario,
		localizacao: linha.localizacao,
		requisitos: lerJSON(linha.requisitos),
		diferenciais: lerJSON(linha.diferenciais),
		beneficios: lerJSON(linha.beneficios),
		corDestaque: linha.corDestaque,
		dataCriacao: linha.dataCriacao,
		candidatos: linha.candidatos,
		status: linha.status,
	};
}

export function listarEmpregos() {
	return db.prepare('SELECT * FROM empregos').all().map(mapearEmprego);
}

export function buscarEmprego(empregoID) {
	return mapearEmprego(
		db.prepare('SELECT * FROM empregos WHERE empregoID = ?').get(Number(empregoID)),
	);
}

export function listarEmpregosDaEmpresa(empresaID) {
	return db
		.prepare('SELECT * FROM empregos WHERE CAST(empresaID AS INTEGER) = ?')
		.all(Number(empresaID))
		.map(mapearEmprego);
}

export function criarEmprego(emprego) {
	db.prepare(
		`INSERT INTO empregos (
			empregoID, empresaID, imgEmpresa, empresaNome, qtdFuncionario, titulo,
			descricao, area, nivel, tipoContrato, tipoTrabalho, cargaHoraria,
			mediaSalario, localizacao, requisitos, diferenciais, beneficios,
			corDestaque, dataCriacao, candidatos, status
		) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
	).run(
		Number(emprego.empregoID),
		String(emprego.empresaID),
		emprego.imgEmpresa ?? null,
		emprego.empresaNome ?? null,
		emprego.qtdFuncionario ?? null,
		emprego.titulo,
		emprego.descricao,
		emprego.area,
		emprego.nivel ?? null,
		emprego.tipoContrato ?? null,
		emprego.tipoTrabalho ?? null,
		emprego.cargaHoraria ?? null,
		emprego.mediaSalario ?? null,
		emprego.localizacao ?? null,
		gravarJSON(emprego.requisitos),
		gravarJSON(emprego.diferenciais),
		gravarJSON(emprego.beneficios),
		emprego.corDestaque ?? null,
		emprego.dataCriacao ?? null,
		emprego.candidatos ?? 0,
		emprego.status ?? 'ativo',
	);

	return buscarEmprego(emprego.empregoID);
}

export function deletarEmprego(empregoID) {
	db.prepare('DELETE FROM empregos WHERE empregoID = ?').run(Number(empregoID));
}

// --- Portfólios ------------------------------------------------------------

function mapearPortfolio(linha) {
	if (!linha) return null;
	return {
		portfolioID: linha.portfolioID,
		userID: linha.userID,
		usuarioNome: linha.usuarioNome,
		titulo: linha.titulo,
		descricao: linha.descricao,
		tecnologias: lerJSON(linha.tecnologias),
		categoria: linha.categoria,
		linkGithub: linha.linkGithub,
		linkDemo: linha.linkDemo,
		linkOutros: lerJSON(linha.linkOutros, []),
		dataCriacao: linha.dataCriacao,
		curtidas: linha.curtidas,
	};
}

export function listarPortfolios() {
	return db.prepare('SELECT * FROM portfolios').all().map(mapearPortfolio);
}

export function buscarPortfolio(portfolioID) {
	return mapearPortfolio(
		db.prepare('SELECT * FROM portfolios WHERE portfolioID = ?').get(Number(portfolioID)),
	);
}

export function criarPortfolio(portfolio) {
	db.prepare(
		`INSERT INTO portfolios (
			portfolioID, userID, usuarioNome, titulo, descricao, tecnologias,
			categoria, linkGithub, linkDemo, linkOutros, dataCriacao, curtidas
		) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
	).run(
		Number(portfolio.portfolioID),
		Number(portfolio.userID),
		portfolio.usuarioNome ?? null,
		portfolio.titulo,
		portfolio.descricao,
		gravarJSON(portfolio.tecnologias),
		portfolio.categoria ?? null,
		portfolio.linkGithub ?? null,
		portfolio.linkDemo ?? null,
		gravarJSON(portfolio.linkOutros ?? []),
		portfolio.dataCriacao ?? null,
		portfolio.curtidas ?? 0,
	);

	return buscarPortfolio(portfolio.portfolioID);
}

export function deletarPortfolio(portfolioID) {
	db.prepare('DELETE FROM portfolios WHERE portfolioID = ?').run(Number(portfolioID));
}

// Soma `delta` nas curtidas sem deixar o total ficar negativo.
export function ajustarCurtidas(portfolioID, delta) {
	db.prepare('UPDATE portfolios SET curtidas = MAX(0, curtidas + ?) WHERE portfolioID = ?').run(
		delta,
		Number(portfolioID),
	);

	return buscarPortfolio(portfolioID);
}

// --- Currículos ------------------------------------------------------------

function mapearCurriculo(linha) {
	if (!linha) return null;
	return {
		curriculoID: linha.curriculoID,
		userID: linha.userID,
		nome: linha.nome,
		email: linha.email,
		telefone: linha.telefone,
		localizacao: linha.localizacao,
		titulo: linha.titulo,
		resumoProfissional: linha.resumoProfissional,
		habilidades: lerJSON(linha.habilidades, []),
		experiencias: lerJSON(linha.experiencias, []),
		educacao: lerJSON(linha.educacao, []),
		softSkills: lerJSON(linha.softSkills, []),
		certificados: lerJSON(linha.certificados, []),
		idiomas: lerJSON(linha.idiomas, []),
		links: lerJSON(linha.links, {}),
		dataCriacao: linha.dataCriacao,
		dataAtualizacao: linha.dataAtualizacao,
	};
}

export function listarCurriculosDoUsuario(userID) {
	return db
		.prepare('SELECT * FROM curriculos WHERE userID = ?')
		.all(Number(userID))
		.map(mapearCurriculo);
}

export function buscarCurriculo(curriculoID) {
	return mapearCurriculo(
		db.prepare('SELECT * FROM curriculos WHERE curriculoID = ?').get(Number(curriculoID)),
	);
}

export function criarCurriculo(curriculo) {
	db.prepare(
		`INSERT INTO curriculos (
			curriculoID, userID, nome, email, telefone, localizacao, titulo,
			resumoProfissional, habilidades, experiencias, educacao, softSkills,
			certificados, idiomas, links, dataCriacao, dataAtualizacao
		) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
	).run(
		Number(curriculo.curriculoID),
		Number(curriculo.userID),
		curriculo.nome ?? null,
		curriculo.email ?? null,
		curriculo.telefone ?? null,
		curriculo.localizacao ?? null,
		curriculo.titulo,
		curriculo.resumoProfissional,
		gravarJSON(curriculo.habilidades ?? []),
		gravarJSON(curriculo.experiencias ?? []),
		gravarJSON(curriculo.educacao ?? []),
		gravarJSON(curriculo.softSkills ?? []),
		gravarJSON(curriculo.certificados ?? []),
		gravarJSON(curriculo.idiomas ?? []),
		gravarJSON(curriculo.links ?? {}),
		curriculo.dataCriacao ?? null,
		curriculo.dataAtualizacao ?? null,
	);

	return buscarCurriculo(curriculo.curriculoID);
}

export function atualizarCurriculo(curriculo) {
	db.prepare(
		`UPDATE curriculos SET
			titulo = ?, resumoProfissional = ?, habilidades = ?, experiencias = ?,
			educacao = ?, softSkills = ?, certificados = ?, idiomas = ?, links = ?,
			dataAtualizacao = ?
		WHERE curriculoID = ?`,
	).run(
		curriculo.titulo,
		curriculo.resumoProfissional,
		gravarJSON(curriculo.habilidades ?? []),
		gravarJSON(curriculo.experiencias ?? []),
		gravarJSON(curriculo.educacao ?? []),
		gravarJSON(curriculo.softSkills ?? []),
		gravarJSON(curriculo.certificados ?? []),
		gravarJSON(curriculo.idiomas ?? []),
		gravarJSON(curriculo.links ?? {}),
		curriculo.dataAtualizacao ?? null,
		Number(curriculo.curriculoID),
	);

	return buscarCurriculo(curriculo.curriculoID);
}

export function deletarCurriculo(curriculoID) {
	db.prepare('DELETE FROM curriculos WHERE curriculoID = ?').run(Number(curriculoID));
}

// --- Candidaturas ----------------------------------------------------------

function mapearCandidatura(linha) {
	if (!linha) return null;
	return {
		candidaturaID: linha.candidaturaID,
		empregoID: linha.empregoID,
		userID: linha.userID,
		curriculoID: linha.curriculoID,
		candidato: lerJSON(linha.candidato, {}),
		vaga: lerJSON(linha.vaga, {}),
		dataCandidatura: linha.dataCandidatura,
		status: linha.status,
	};
}

export function listarCandidaturasDoUsuario(userID) {
	return db
		.prepare('SELECT * FROM candidaturas WHERE userID = ?')
		.all(Number(userID))
		.map(mapearCandidatura);
}

export function listarCandidaturasDaVaga(empregoID) {
	return db
		.prepare('SELECT * FROM candidaturas WHERE empregoID = ?')
		.all(Number(empregoID))
		.map(mapearCandidatura);
}

export function buscarCandidaturaDoUsuarioNaVaga(userID, empregoID) {
	return mapearCandidatura(
		db
			.prepare('SELECT * FROM candidaturas WHERE userID = ? AND empregoID = ?')
			.get(Number(userID), Number(empregoID)),
	);
}

export function criarCandidatura(candidatura) {
	db.prepare(
		`INSERT INTO candidaturas (
			candidaturaID, empregoID, userID, curriculoID, candidato, vaga,
			dataCandidatura, status
		) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
	).run(
		Number(candidatura.candidaturaID),
		Number(candidatura.empregoID),
		Number(candidatura.userID),
		Number(candidatura.curriculoID),
		gravarJSON(candidatura.candidato ?? {}),
		gravarJSON(candidatura.vaga ?? {}),
		candidatura.dataCandidatura ?? null,
		candidatura.status ?? 'pendente',
	);

	return mapearCandidatura(
		db.prepare('SELECT * FROM candidaturas WHERE candidaturaID = ?').get(
			Number(candidatura.candidaturaID),
		),
	);
}
