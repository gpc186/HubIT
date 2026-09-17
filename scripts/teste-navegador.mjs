// Teste de fumaça num navegador de verdade (Edge headless via CDP).
//
// O build e as requisições da API dão para conferir no terminal, mas a ponte de
// scripts legados (components/ScriptsLegados.jsx) só dá para validar rodando a
// página: é preciso ver os arquivos de /assets/js executando e mexendo no DOM
// depois que o React monta.
//
//   node scripts/teste-navegador.mjs [baseUrl]

import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const base = process.argv[2] ?? 'http://localhost:3100';
const porta = 9222;

const CAMINHOS_EDGE = [
	'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
	'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
	'C:/Program Files/Google/Chrome/Application/chrome.exe',
];

const executavel = CAMINHOS_EDGE.find((p) => fs.existsSync(p));
if (!executavel) {
	console.error('Nenhum navegador baseado em Chromium encontrado.');
	process.exit(1);
}

const perfil = fs.mkdtempSync(path.join(os.tmpdir(), 'hubit-cdp-'));

const navegador = spawn(executavel, [
	'--headless=new',
	'--disable-gpu',
	'--no-first-run',
	'--no-default-browser-check',
	`--remote-debugging-port=${porta}`,
	`--user-data-dir=${perfil}`,
	'about:blank',
]);

function esperar(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

async function alvoWebSocket() {
	for (let tentativa = 0; tentativa < 40; tentativa += 1) {
		try {
			const res = await fetch(`http://127.0.0.1:${porta}/json/version`);
			const info = await res.json();
			if (info.webSocketDebuggerUrl) return info.webSocketDebuggerUrl;
		} catch {
			// navegador ainda subindo
		}
		await esperar(250);
	}
	throw new Error('O navegador não abriu a porta de depuração.');
}

// --- Cliente CDP mínimo -----------------------------------------------------

class CDP {
	constructor(ws) {
		this.ws = ws;
		this.id = 0;
		this.pendentes = new Map();
		ws.addEventListener('message', (evento) => {
			const msg = JSON.parse(evento.data);
			const pendente = this.pendentes.get(msg.id);
			if (pendente) {
				this.pendentes.delete(msg.id);
				msg.error ? pendente.reject(new Error(msg.error.message)) : pendente.resolve(msg.result);
			}
		});
	}

	enviar(method, params = {}, sessionId) {
		this.id += 1;
		const id = this.id;
		return new Promise((resolve, reject) => {
			this.pendentes.set(id, { resolve, reject });
			this.ws.send(JSON.stringify({ id, method, params, sessionId }));
		});
	}
}

async function conectar(url) {
	const ws = new WebSocket(url);
	await new Promise((resolve, reject) => {
		ws.addEventListener('open', resolve, { once: true });
		ws.addEventListener('error', reject, { once: true });
	});
	return new CDP(ws);
}

// --- Verificações por página ------------------------------------------------
//
// Cada expressão roda dentro da página e devolve true quando o script legado
// correspondente realmente executou.

const paginas = [
	{
		rota: '/',
		// Guarda um usuário no localStorage antes de navegar: as páginas internas
		// redirecionam para "/" quando não há login.
		checagens: {
			'site-nav.js rodou (indicador do menu)':
				"!!document.querySelector('.desktop-links.has-sliding-indicator')",
			'scripts legados foram injetados':
				"[...document.scripts].some(s => s.src.includes('/assets/js/landing.js'))",
			'gsap carregou': "typeof window.gsap !== 'undefined'",
			'bootstrap carregou': "typeof window.bootstrap !== 'undefined'",
			'script inline extraído rodou': "typeof window.focar === 'function'",
			'CSS da landing aplicado':
				"getComputedStyle(document.querySelector('.site-header')).display !== 'inline'",
		},
	},
	{
		rota: '/home',
		precisaLogin: true,
		checagens: {
			'home.js rodou (window.onload disparado)':
				"typeof window.carregarEmpregos === 'function' || document.querySelectorAll('#empregosContainer *').length > 0",
			'scripts legados foram injetados':
				"[...document.scripts].some(s => s.src.includes('/assets/js/home.js'))",
			'API respondeu e as vagas renderizaram':
				"document.querySelectorAll('#empregosContainer *').length > 0",
		},
	},
	{
		rota: '/portfolio',
		precisaLogin: true,
		checagens: {
			'portfolio.js foi injetado':
				"[...document.scripts].some(s => s.src.includes('/assets/js/portfolio.js'))",
			'o nomodule do ionicons não travou a fila':
				"[...document.scripts].some(s => s.src.includes('/assets/js/logoAnim.js'))",
			'portfólios renderizados pela API':
				"!document.body.innerText.includes('Carregando portfólios')",
		},
	},
	{
		rota: null, // preenchido em tempo de execução com o id do usuário
		perfil: true,
		precisaLogin: true,
		checagens: {
			'pg-perfil.js foi injetado':
				"[...document.scripts].some(s => s.src.includes('/assets/js/pg-perfil.js'))",
			'perfil.js foi injetado':
				"[...document.scripts].some(s => s.src.includes('/assets/js/perfil.js'))",
			'DOMContentLoaded chegou nos handlers antigos':
				"document.body.innerText.length > 400",
		},
	},
];

// --- Execução ---------------------------------------------------------------

const wsUrl = await alvoWebSocket();
const cdp = await conectar(wsUrl);

const { targetId } = await cdp.enviar('Target.createTarget', { url: 'about:blank' });
const { sessionId } = await cdp.enviar('Target.attachToTarget', { targetId, flatten: true });

await cdp.enviar('Page.enable', {}, sessionId);
await cdp.enviar('Runtime.enable', {}, sessionId);

// Um usuário real do banco, para as páginas que exigem login.
const usuario = JSON.parse(fs.readFileSync('data/users.json', 'utf8')).find(
	(u) => u.tipoConta === 'usuario' && u.dados?.nome,
);

async function avaliar(expressao) {
	const resultado = await cdp.enviar(
		'Runtime.evaluate',
		{ expression: expressao, returnByValue: true, awaitPromise: true },
		sessionId,
	);
	if (resultado.exceptionDetails) {
		return { erro: resultado.exceptionDetails.exception?.description ?? 'exceção' };
	}
	return { valor: resultado.result.value };
}

const erros = [];
await cdp.enviar('Runtime.addBinding', { name: '__erroDeConsole' }, sessionId).catch(() => {});

let falhas = 0;

for (const pagina of paginas) {
	if (pagina.perfil) pagina.rota = `/perfil/${usuario.userID}`;
	console.log(`\n${base}${pagina.rota}`);

	if (pagina.precisaLogin) {
		// O localStorage é por origem: basta gravar uma vez antes de navegar.
		await cdp.enviar('Page.navigate', { url: base + '/' }, sessionId);
		await esperar(1500);
		// As mesmas chaves que o login.js grava depois de um login bem-sucedido.
		await avaliar(
			`localStorage.setItem('userID', '${usuario.userID}');` +
				`localStorage.setItem('userEmail', ${JSON.stringify(usuario.email)});` +
				`localStorage.setItem('userTipo', ${JSON.stringify(usuario.tipoConta)});`,
		);
	}

	await cdp.enviar('Page.navigate', { url: base + pagina.rota }, sessionId);
	await esperar(5000); // dá tempo dos scripts baixarem e das chamadas da API voltarem

	const urlAtual = (await avaliar('location.pathname')).valor;
	if (urlAtual !== pagina.rota) {
		console.log(`  ! redirecionado para ${urlAtual}`);
	}

	for (const [nome, expressao] of Object.entries(pagina.checagens)) {
		const { valor, erro } = await avaliar(expressao);
		const ok = valor === true;
		if (!ok) falhas += 1;
		console.log(`  ${ok ? 'ok   ' : 'FALHA'} ${nome}${erro ? ' — ' + erro.split('\n')[0] : ''}`);
	}
}

console.log(falhas === 0 ? '\nTodas as checagens passaram.' : `\n${falhas} checagem(ns) falharam.`);

navegador.kill();
// No Windows o diretório de perfil às vezes continua preso ao processo que
// acabou de ser encerrado; não vale derrubar o teste por causa disso.
try {
	fs.rmSync(perfil, { recursive: true, force: true });
} catch {
	// o sistema limpa o %TEMP% depois
}
process.exit(falhas === 0 ? 0 : 1);
