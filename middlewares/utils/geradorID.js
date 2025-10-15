function criarIDUsuario(){
	return Date.now();
};

function criarIDEmprego(){
	return parseInt('2' + Date.now());
};

function criarIDPortfolio(){
	return parseInt('3' + Date.now());
};

function verficarTipoID(ID) {
	const idString = ID.toString();

	if(idString.startsWith('21')) return 'emprego';
	if(idString.startsWith('31')) return 'portfolio'
}

module.exports = {
    criarIDUsuario,
    criarIDEmprego,
    criarIDPortfolio,
    verficarTipoID
};