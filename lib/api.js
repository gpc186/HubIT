import { NextResponse } from 'next/server';

// Pequenos ajudantes para os route handlers, no lugar do que o Express dava de
// graça (req.headers, res.status().json(), req.query).

export function json(dados, status = 200) {
	return NextResponse.json(dados, { status });
}

export function erro(mensagem, status) {
	return NextResponse.json({ error: mensagem }, { status });
}

// O front manda o id do usuário logado no header 'user-id'. Devolve o valor cru
// (string) para quem precisa dele como veio, e Number() para as comparações.
export function idDoHeader(request) {
	return request.headers.get('user-id');
}

export function idNumericoDoHeader(request) {
	return Number(request.headers.get('user-id'));
}

// Lê o corpo JSON sem estourar quando ele vem vazio ou malformado.
export async function lerCorpo(request) {
	try {
		return (await request.json()) ?? {};
	} catch {
		return {};
	}
}

// Espelha o `catch (error) => 500` que todas as rotas do Express tinham.
export function erroInterno(contexto, error) {
	console.error(contexto, error);
	return erro(error.message, 500);
}
