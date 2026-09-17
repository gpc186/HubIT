import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';

const dbPath = path.join(process.cwd(), 'data', 'hubit.db');
const schemaPath = path.join(process.cwd(), 'lib', 'db', 'schema.sql');

// Em desenvolvimento o Next recarrega os módulos a cada alteração; guardar a
// conexão no globalThis evita abrir um handle novo do SQLite a cada hot reload.
const globalForDb = globalThis;

function abrirConexao() {
	fs.mkdirSync(path.dirname(dbPath), { recursive: true });

	const conexao = new DatabaseSync(dbPath);
	conexao.exec('PRAGMA journal_mode = WAL;');
	conexao.exec('PRAGMA foreign_keys = ON;');
	conexao.exec(fs.readFileSync(schemaPath, 'utf8'));

	return conexao;
}

export const db = globalForDb.__hubitDb ?? (globalForDb.__hubitDb = abrirConexao());

// --- Ajudantes de JSON -----------------------------------------------------
// As colunas de array/objeto são guardadas como texto JSON; estes dois ajudantes
// fazem a ponte entre a linha do banco e o formato que a API sempre devolveu.

export function lerJSON(valor, padrao = null) {
	if (valor === null || valor === undefined) return padrao;
	try {
		return JSON.parse(valor);
	} catch {
		return padrao;
	}
}

export function gravarJSON(valor) {
	if (valor === null || valor === undefined) return null;
	return JSON.stringify(valor);
}
