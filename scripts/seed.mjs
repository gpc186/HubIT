// Carrega os arquivos JSON originais (data/*.json) para dentro do SQLite.
// É idempotente: apaga as tabelas antes de inserir, então pode rodar de novo
// sempre que quiser voltar o banco ao estado inicial.
//
//   npm run db:seed

import fs from 'node:fs';
import path from 'node:path';

import { db } from '../lib/db/index.js';
import {
	criarUsuario,
	criarEmprego,
	criarPortfolio,
	criarCurriculo,
	criarCandidatura,
} from '../lib/db/models.js';

const dataDir = path.join(process.cwd(), 'data');

function lerArquivo(nome) {
	const arquivo = path.join(dataDir, nome);
	if (!fs.existsSync(arquivo)) {
		console.warn(`  · ${nome} não encontrado, pulando.`);
		return [];
	}
	return JSON.parse(fs.readFileSync(arquivo, 'utf8'));
}

function carregar(nome, tabela, inserir) {
	const registros = lerArquivo(nome);
	db.exec(`DELETE FROM ${tabela};`);

	let inseridos = 0;
	for (const registro of registros) {
		try {
			inserir(registro);
			inseridos += 1;
		} catch (error) {
			console.error(`  ! ${tabela}: registro ignorado — ${error.message}`);
		}
	}

	console.log(`  · ${tabela}: ${inseridos}/${registros.length}`);
}

console.log('Populando o banco a partir de data/*.json...');

carregar('users.json', 'users', criarUsuario);
carregar('empregos.json', 'empregos', criarEmprego);
carregar('portfolios.json', 'portfolios', criarPortfolio);
carregar('curriculos.json', 'curriculos', criarCurriculo);
carregar('candidaturas.json', 'candidaturas', criarCandidatura);

console.log('Pronto: data/hubit.db');
