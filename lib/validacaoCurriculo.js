// Validações compartilhadas entre o POST e o PUT de currículo.
// Cada função devolve a mensagem de erro, ou null quando está tudo certo —
// exatamente as mesmas mensagens que o middleware do Express retornava.

export function validarExperiencias(experiencias) {
	for (const exp of experiencias) {
		if (!exp.cargo || !exp.empresa || !exp.dataInicio) {
			return 'Cada experiência precisa ter: cargo, empresa e dataInicio';
		}
	}
	return null;
}

export function validarEducacao(educacao) {
	for (const edu of educacao) {
		if (!edu.curso || !edu.instituicao || !edu.dataInicio) {
			return 'Cada educação precisa ter: curso, instituição e dataInicio';
		}
	}
	return null;
}

export function validarCertificados(certificados) {
	for (const cert of certificados) {
		if (!cert.nome || !cert.instituicao || !cert.dataEmissao) {
			return 'Cada certificado precisa ter: nome, instituição e dataEmissao';
		}
	}
	return null;
}

export function validarIdiomas(idiomas) {
	for (const idioma of idiomas) {
		if (!idioma.idioma || !idioma.nivel) {
			return 'Cada idioma precisa ter: idioma e nível';
		}
	}
	return null;
}
