// Aqui geramos IDs como Date.now() e para haver ao menos uma pequena diferenciação
// Pegamos os IDs gerados e colocamos um prefixo para o emprego e portfolio

export function criarIDUsuario() {
	return Date.now();
}

export function criarIDEmprego() {
	return parseInt('2' + Date.now());
}

export function criarIDPortfolio() {
	return parseInt('3' + Date.now());
}

export function criarIDCurriculo() {
	return parseInt('4' + Date.now());
}

export function criarIDCandidaturas() {
	return parseInt('5' + Date.now());
}

export function verficarTipoID(ID) {
	const idString = ID.toString();

	if (idString.startsWith('21')) return 'emprego';
	if (idString.startsWith('31')) return 'portfolio';
	if (idString.startsWith('41')) return 'curriculo';
	if (idString.startsWith('51')) return 'candidatura';
}
