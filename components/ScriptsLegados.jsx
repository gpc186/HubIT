'use client';

import { useEffect } from 'react';

// Carrega os scripts originais de /public/assets/js dentro de uma página do Next.
//
// Dois detalhes que o <script defer> do HTML dava de graça e aqui precisam ser
// recriados à mão:
//
//  1. Ordem. `defer` garante execução na ordem em que as tags aparecem
//     (gsap antes de landing.js, por exemplo). Um <script> inserido via JS é
//     async por padrão, então os arquivos são carregados um de cada vez.
//
//  2. Os eventos de carregamento. Os scripts se inicializam em
//     `window.onload` e `DOMContentLoaded`, que já dispararam quando o React
//     monta a página — os handlers nunca rodariam. Depois que todos os
//     arquivos carregam, os dois eventos são disparados de novo.

// Um script carregado uma vez fica registrado: reexecutar redeclararia as
// constantes de topo do arquivo e quebraria tudo (isso acontece no StrictMode,
// que monta os efeitos duas vezes em desenvolvimento).
const jaCarregados = new Set();

const suportaModulos = typeof HTMLScriptElement !== 'undefined' && 'noModule' in HTMLScriptElement.prototype;

// Se algum arquivo não responder, os seguintes não podem ficar esperando.
const TEMPO_LIMITE = 10000;

function carregarScript({ src, tipo, noModule }) {
	return new Promise((resolve) => {
		// Um script `nomodule` é o plano B para navegadores sem ES modules: os que
		// têm suporte nem chegam a buscá-lo, então ele nunca dispararia `load` e
		// a fila travaria aqui.
		if (noModule && suportaModulos) {
			resolve();
			return;
		}

		if (jaCarregados.has(src)) {
			resolve();
			return;
		}
		jaCarregados.add(src);

		let terminou = false;
		const concluir = (aviso) => {
			if (terminou) return;
			terminou = true;
			if (aviso) console.error(`[legado] ${aviso}: ${src}`);
			resolve();
		};

		const script = document.createElement('script');
		script.src = src;
		script.async = false;
		if (tipo) script.type = tipo;
		if (noModule) script.noModule = true;

		script.addEventListener('load', () => concluir());
		script.addEventListener('error', () => concluir('falha ao carregar'));
		setTimeout(() => concluir('demorou demais, seguindo sem ele'), TEMPO_LIMITE);

		document.body.appendChild(script);
	});
}

// Marca se o `load` de verdade já passou. Precisa ser observado desde o início
// do efeito: se ele disparasse no meio do download dos scripts, olhar só o
// readyState no fim não distinguiria "ainda vai disparar" de "já disparou".
function observarLoad() {
	const estado = { jaDisparou: document.readyState === 'complete' };

	const aoCarregar = () => {
		estado.jaDisparou = true;
	};
	window.addEventListener('load', aoCarregar, { once: true });
	estado.parar = () => window.removeEventListener('load', aoCarregar);

	return estado;
}

function dispararEventosDeCarregamento(estadoDoLoad) {
	// Esse sempre já passou quando o React monta a página.
	document.dispatchEvent(new Event('DOMContentLoaded', { bubbles: true }));

	if (estadoDoLoad.jaDisparou) {
		// O `load` real já passou; os scripts acabaram de registrar os handlers.
		window.dispatchEvent(new Event('load'));
	}
	// Se ainda não passou, o `load` de verdade vem sozinho e chama os
	// handlers — disparar um aqui os executaria em dobro.
}

export default function ScriptsLegados({ scripts = [] }) {
	useEffect(() => {
		let cancelado = false;
		const estadoDoLoad = observarLoad();

		(async () => {
			for (const script of scripts) {
				if (cancelado) return;
				await carregarScript(script);
			}

			if (!cancelado) dispararEventosDeCarregamento(estadoDoLoad);
		})();

		return () => {
			cancelado = true;
			estadoDoLoad.parar();
		};
		// A lista vem fixa do componente da página e nunca muda entre renders.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return null;
}
