'use client';

// Ponte para os handlers inline do HTML original.
//
// No HTML as páginas usavam `onclick="abrirModal('x')"`, onde `abrirModal` é uma
// função global definida nos scripts de /public/assets/js. Em JSX o atributo
// vira um handler de verdade, mas a expressão continua precisando ser avaliada
// no escopo global — é isso que esta função faz.
//
// A expressão vem sempre do nosso próprio HTML convertido, nunca de dados do
// usuário. É a mesma avaliação que o navegador já fazia com o atributo inline.

const cache = new Map();

export function legado(expressao) {
	if (!cache.has(expressao)) {
		// `this` é o elemento, como num atributo onclick; `event` também fica
		// disponível, igual ao comportamento antigo.
		const fn = new Function('event', expressao);
		cache.set(expressao, function (event) {
			return fn.call(event.currentTarget, event);
		});
	}

	return cache.get(expressao);
}
