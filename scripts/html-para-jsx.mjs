// Conversor de uma vez só: pega as páginas estáticas de public/*.html e gera os
// componentes .jsx equivalentes em app/.
//
// O objetivo é fidelidade, não elegância: a marcação sai igual, os estilos
// continuam vindo dos mesmos arquivos .css e os scripts antigos seguem sendo
// carregados de /public/assets/js. Rodar de novo sobrescreve o que foi gerado.
//
//   node scripts/html-para-jsx.mjs
//
// Depois da migração este script serve só como registro de como as páginas
// foram convertidas — pode ser apagado com segurança.

import fs from 'node:fs';
import path from 'node:path';
import * as parse5 from 'parse5';

// --- Configuração das páginas ---------------------------------------------

const paginas = [
	{ arquivo: 'login.html', destino: 'app/page.jsx', componente: 'LandingPage' },
	{ arquivo: 'principal.html', destino: 'app/home/page.jsx', componente: 'HomePage' },
	{ arquivo: 'portfolio.html', destino: 'app/portfolio/page.jsx', componente: 'PortfolioPage' },
	{
		arquivo: 'pagina-de-perfil.html',
		destino: 'app/perfil/[id]/page.jsx',
		componente: 'PerfilPage',
	},
	{ arquivo: 'contactLogin.html', destino: 'app/contato/page.jsx', componente: 'ContatoPage' },
	{ arquivo: '404.html', destino: 'app/not-found.jsx', componente: 'NaoEncontrada' },
];

// --- Tabelas de conversão de atributos -------------------------------------

const ATRIBUTOS = {
	class: 'className',
	for: 'htmlFor',
	tabindex: 'tabIndex',
	colspan: 'colSpan',
	rowspan: 'rowSpan',
	maxlength: 'maxLength',
	minlength: 'minLength',
	readonly: 'readOnly',
	autocomplete: 'autoComplete',
	autofocus: 'autoFocus',
	autoplay: 'autoPlay',
	novalidate: 'noValidate',
	contenteditable: 'contentEditable',
	spellcheck: 'spellCheck',
	srcset: 'srcSet',
	crossorigin: 'crossOrigin',
	datetime: 'dateTime',
	enctype: 'encType',
	formaction: 'formAction',
	accesskey: 'accessKey',
	usemap: 'useMap',
	frameborder: 'frameBorder',
	allowfullscreen: 'allowFullScreen',
	playsinline: 'playsInline',
	inputmode: 'inputMode',
	'stroke-width': 'strokeWidth',
	'stroke-linecap': 'strokeLinecap',
	'stroke-linejoin': 'strokeLinejoin',
	'stroke-dasharray': 'strokeDasharray',
	'fill-rule': 'fillRule',
	'clip-rule': 'clipRule',
	'clip-path': 'clipPath',
	'stop-color': 'stopColor',
	'stop-opacity': 'stopOpacity',
	'fill-opacity': 'fillOpacity',
	'stroke-opacity': 'strokeOpacity',
	'text-anchor': 'textAnchor',
	'font-family': 'fontFamily',
	'font-size': 'fontSize',
	'font-weight': 'fontWeight',
	viewbox: 'viewBox',
	preserveaspectratio: 'preserveAspectRatio',
	'xlink:href': 'xlinkHref',
};

// Atributos booleanos: em HTML basta estarem presentes.
const BOOLEANOS = new Set([
	'disabled',
	'required',
	'checked',
	'selected',
	'readonly',
	'multiple',
	'novalidate',
	'autofocus',
	'autoplay',
	'controls',
	'loop',
	'muted',
	'open',
	'hidden',
	'defer',
	'async',
	'allowfullscreen',
	'playsinline',
	'nomodule',
	'inert',
]);

const VAZIOS = new Set([
	'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
	'link', 'meta', 'param', 'source', 'track', 'wbr',
]);

// Elementos de nível inline: o espaço em branco entre dois deles é visível no
// HTML, então precisa virar um {' '} explícito para o JSX não engolir.
const INLINE = new Set([
	'a', 'abbr', 'b', 'bdi', 'bdo', 'br', 'button', 'cite', 'code', 'data',
	'em', 'i', 'img', 'input', 'kbd', 'label', 'mark', 'q', 's', 'samp',
	'select', 'small', 'span', 'strong', 'sub', 'sup', 'textarea', 'time',
	'u', 'var', 'ion-icon',
]);

// --- Ajudantes --------------------------------------------------------------

function paraCamel(nome) {
	return nome.replace(/-([a-z])/g, (_, letra) => letra.toUpperCase());
}

// "color: red; font-weight: bold" -> {{ color: 'red', fontWeight: 'bold' }}
function converterStyle(valor) {
	const props = valor
		.split(';')
		.map((parte) => parte.trim())
		.filter(Boolean)
		.map((parte) => {
			const separador = parte.indexOf(':');
			if (separador === -1) return null;

			const chave = parte.slice(0, separador).trim();
			const conteudo = parte.slice(separador + 1).trim();
			// Custom properties (--foo) precisam manter o nome literal.
			const nome = chave.startsWith('--') ? `'${chave}'` : paraCamel(chave);

			return `${nome}: ${JSON.stringify(conteudo)}`;
		})
		.filter(Boolean);

	return `{{ ${props.join(', ')} }}`;
}

function nomeDoAtributo(nome) {
	if (ATRIBUTOS[nome]) return ATRIBUTOS[nome];
	// data-* e aria-* ficam como estão; o resto vira camelCase.
	if (nome.startsWith('data-') || nome.startsWith('aria-')) return nome;
	if (nome.includes('-')) return nome;
	return nome;
}

function serializarAtributos(node) {
	const partes = [];

	for (const attr of node.attrs ?? []) {
		const nome = attr.name;
		const valor = attr.value;

		// Handlers inline (onclick="foo()") passam pela ponte do legado.
		if (/^on[a-z]+$/.test(nome)) {
			const evento = 'on' + nome.slice(2, 3).toUpperCase() + nome.slice(3);
			partes.push(`${evento}={legado(${JSON.stringify(valor)})}`);
			continue;
		}

		if (nome === 'style') {
			partes.push(`style=${converterStyle(valor)}`);
			continue;
		}

		if (BOOLEANOS.has(nome) && (valor === '' || valor === nome)) {
			partes.push(`${nomeDoAtributo(nome)}={true}`);
			continue;
		}

		// Os scripts antigos escrevem direto no DOM, então os campos precisam ser
		// não controlados: value inicial vira defaultValue.
		let nomeFinal = nomeDoAtributo(nome);
		if (nome === 'value' && (node.nodeName === 'input' || node.nodeName === 'textarea')) {
			nomeFinal = 'defaultValue';
		}
		if (nome === 'checked') nomeFinal = 'defaultChecked';

		const valorFinal = ATRIBUTOS_DE_URL.has(nome) ? normalizarUrl(valor) : valor;

		partes.push(`${nomeFinal}=${JSON.stringify(valorFinal)}`);
	}

	return partes.length ? ' ' + partes.join(' ') : '';
}

function escaparTexto(texto) {
	// Chaves e < > têm significado em JSX. E o JSX descarta espaço no começo/fim
	// de linha, o que sumiria com o espaço entre "<span>x</span> texto" — nos
	// dois casos o jeito seguro é emitir o texto como string literal.
	if (/[{}<>]/.test(texto) || /^\s|\s$/.test(texto)) return `{${JSON.stringify(texto)}}`;
	return texto;
}

// As rotas do Next substituem os arquivos .html soltos.
const ROTAS = {
	'login.html': '/',
	'principal.html': '/home',
	'portfolio.html': '/portfolio',
	'pagina-de-perfil.html': '/perfil',
	'contactLogin.html': '/contato',
	'contact.html': '/contato',
	'404.html': '/404',
};

// Um href/src do HTML antigo era sempre relativo ao arquivo, que ficava na raiz
// de public/. Como as rotas do Next têm profundidades diferentes (/perfil/123),
// todo caminho relativo precisa virar absoluto — e os .html viram rotas.
function normalizarUrl(url) {
	if (!url) return url;
	if (/^(https?:|mailto:|tel:|data:|#|\/\/)/.test(url) || url.startsWith('/')) return url;

	const limpo = url.replace(/^\.?\//, '');

	for (const [arquivo, rota] of Object.entries(ROTAS)) {
		if (limpo === arquivo) return rota;
		if (limpo.startsWith(arquivo + '#')) return rota + limpo.slice(arquivo.length);
	}

	return '/' + limpo;
}

const ATRIBUTOS_DE_URL = new Set(['href', 'src', 'action', 'poster', 'data']);

function ehElemento(node) {
	return node && node.nodeName !== '#text' && node.nodeName !== '#comment' && node.tagName;
}

// --- Serialização para JSX --------------------------------------------------

function serializarFilhos(filhos, indent, contexto) {
	const linhas = [];
	const relevantes = filhos ?? [];

	for (let i = 0; i < relevantes.length; i += 1) {
		const node = relevantes[i];

		if (node.nodeName === '#text') {
			const bruto = node.value;

			if (bruto.trim() === '') {
				// Espaço entre dois elementos inline é visível: preserva como {' '}.
				const anterior = relevantes[i - 1];
				const proximo = relevantes[i + 1];
				const entreInline =
					ehElemento(anterior) &&
					ehElemento(proximo) &&
					INLINE.has(anterior.tagName) &&
					INLINE.has(proximo.tagName);

				if (entreInline) linhas.push(`${indent}{' '}`);
				continue;
			}

			// Colapsa o espaço em branco como o HTML faz, mantendo as bordas.
			const texto = bruto.replace(/\s+/g, ' ');
			linhas.push(indent + escaparTexto(texto));
			continue;
		}

		if (node.nodeName === '#comment') {
			const comentario = node.data.trim().replace(/\*\//g, '* /');
			linhas.push(`${indent}{/* ${comentario} */}`);
			continue;
		}

		const serializado = serializarNode(node, indent, contexto);
		if (serializado !== null) linhas.push(serializado);
	}

	return linhas;
}

function serializarNode(node, indent, contexto) {
	const tag = node.tagName;

	// <script> vira <Script> no topo da página; <link> de css vira <link> no head.
	if (tag === 'script') {
		const src = node.attrs?.find((a) => a.name === 'src')?.value;
		const tipo = node.attrs?.find((a) => a.name === 'type')?.value;
		const noModule = node.attrs?.some((a) => a.name === 'nomodule');
		const conteudo = node.childNodes?.[0]?.value ?? '';

		if (src) {
			contexto.scripts.push({ src, tipo, noModule });
		} else if (conteudo.trim()) {
			contexto.inline.push(conteudo);
		}
		return null;
	}

	const atributos = serializarAtributos(node);

	if (VAZIOS.has(tag)) {
		return `${indent}<${tag}${atributos} />`;
	}

	const filhos = serializarFilhos(node.childNodes, indent + '\t', contexto);

	if (filhos.length === 0) {
		return `${indent}<${tag}${atributos}></${tag}>`;
	}

	// Elemento curto com um único filho de texto cabe numa linha só.
	if (filhos.length === 1 && !filhos[0].includes('\n') && filhos[0].trim().length < 60) {
		return `${indent}<${tag}${atributos}>${filhos[0].trim()}</${tag}>`;
	}

	return [`${indent}<${tag}${atributos}>`, ...filhos, `${indent}</${tag}>`].join('\n');
}

// --- Leitura do <head> ------------------------------------------------------

function extrairHead(head) {
	const titulo = head.childNodes.find((n) => n.tagName === 'title');
	const estilos = [];
	const icones = [];

	for (const node of head.childNodes) {
		if (node.tagName !== 'link') continue;
		const attrs = Object.fromEntries((node.attrs ?? []).map((a) => [a.name, a.value]));

		if (attrs.rel === 'stylesheet') {
			estilos.push(attrs);
		} else if (attrs.rel && attrs.rel.includes('icon')) {
			icones.push(attrs);
		}
	}

	return {
		titulo: titulo?.childNodes?.[0]?.value?.trim() ?? 'Hubit',
		estilos,
		icones,
	};
}

// --- Geração do componente --------------------------------------------------

function gerarPagina({ arquivo, destino, componente }) {
	const html = fs.readFileSync(path.join('public', arquivo), 'utf8');
	const documento = parse5.parse(html);

	const htmlNode = documento.childNodes.find((n) => n.tagName === 'html');
	const head = htmlNode.childNodes.find((n) => n.tagName === 'head');
	const body = htmlNode.childNodes.find((n) => n.tagName === 'body');

	const { titulo, estilos } = extrairHead(head);
	const contexto = { scripts: [], inline: [] };

	// Os <script src> do <head> também precisam ser recolhidos.
	serializarFilhos(head.childNodes, '', contexto);
	const scriptsDoHead = contexto.scripts.splice(0);
	const inlineDoHead = contexto.inline.splice(0);

	const corpo = serializarFilhos(body.childNodes, '\t\t\t', contexto);
	const scripts = [...scriptsDoHead, ...contexto.scripts];
	const inline = [...inlineDoHead, ...contexto.inline];

	const usaLegado = corpo.some((linha) => linha.includes('legado('));

	// Scripts inline viram um arquivo próprio em public/assets/js/inline/.
	let scriptInline = null;
	if (inline.length > 0) {
		const nomeInline = arquivo.replace(/\.html$/, '') + '-inline.js';
		const caminhoInline = path.join('public', 'assets', 'js', 'inline', nomeInline);
		fs.mkdirSync(path.dirname(caminhoInline), { recursive: true });
		fs.writeFileSync(
			caminhoInline,
			`// Extraído do <script> inline de public/${arquivo} durante a migração para Next.js.\n` +
				inline.join('\n\n'),
			'utf8',
		);
		scriptInline = '/assets/js/inline/' + nomeInline;
	}

	const linhasEstilo = estilos.map((attrs) => {
		const extras = [];
		if (attrs.integrity) extras.push(`integrity=${JSON.stringify(attrs.integrity)}`);
		if (attrs.crossorigin) extras.push(`crossOrigin=${JSON.stringify(attrs.crossorigin)}`);
		return `\t\t\t<link rel="stylesheet" href=${JSON.stringify(normalizarUrl(attrs.href))}${
			extras.length ? ' ' + extras.join(' ') : ''
		} />`;
	});

	const todosScripts = [...scripts];
	if (scriptInline) todosScripts.push({ src: scriptInline });

	// Os scripts são carregados em ordem pelo <ScriptsLegados>, que também
	// redispara DOMContentLoaded/load para os handlers antigos.
	const listaScripts = todosScripts.map(({ src, tipo, noModule }) => {
		const campos = [`src: ${JSON.stringify(normalizarUrl(src))}`];
		if (tipo) campos.push(`tipo: ${JSON.stringify(tipo)}`);
		if (noModule) campos.push('noModule: true');
		return `\t\t\t\t{ ${campos.join(', ')} },`;
	});

	const linhasScript = listaScripts.length
		? ['\t\t\t<ScriptsLegados', '\t\t\t\tscripts={[', ...listaScripts, '\t\t\t\t]}', '\t\t\t/>']
		: [];

	const imports = ["import ScriptsLegados from '@/components/ScriptsLegados';"];
	if (usaLegado) imports.push("import { legado } from '@/lib/legado';");

	const conteudo = [
		"'use client';",
		'',
		'// Gerado a partir de public/' + arquivo + ' por scripts/html-para-jsx.mjs.',
		'// A marcação é a mesma do HTML original; o comportamento continua vindo',
		'// dos scripts em /public/assets/js, carregados abaixo.',
		'',
		...imports,
		'',
		`export default function ${componente}() {`,
		'\treturn (',
		'\t\t<>',
		...linhasEstilo,
		...corpo,
		...linhasScript,
		'\t\t</>',
		'\t);',
		'}',
		'',
	].join('\n');

	fs.mkdirSync(path.dirname(destino), { recursive: true });
	fs.writeFileSync(destino, conteudo, 'utf8');

	console.log(
		`  · ${arquivo} -> ${destino} (título: "${titulo}", ${estilos.length} css, ${todosScripts.length} js)`,
	);

	return { titulo, destino };
}

console.log('Convertendo as páginas HTML para JSX...');
for (const pagina of paginas) {
	gerarPagina(pagina);
}
console.log('Pronto.');
