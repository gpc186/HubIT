const dataNow = new Date();
const dataHours = dataNow.getHours();

const mensagemGreeting = document.getElementById('mensagemGreeting');

window.onload = async function () {
    await carregarPagina();
};

async function carregarPagina() {
    const userID = localStorage.getItem('userID');

    const resposta = await fetch(`/api/usuario/${userID}`, {
        method: 'GET',
        headers: {
            'user-id': userID
        }
    });

    const dados = await resposta.json()
	const usuarioAtual = dados.usuario;

    const nomePrincipal = document.getElementById('nomePrincipal')
    const nomeGreeting = document.getElementById('nomeSaudacao')
    const nomeLocal = document.getElementById('nomeLocal')
    const areaAtuacao = document.getElementById('areaAtuacao')
    const nivelExperiencia = document.getElementById('nivelExperiencia')

    nomePrincipal.innerText = usuarioAtual.dados.nome
    nomeGreeting.innerText = usuarioAtual.dados.nome
    nomeLocal.innerText = usuarioAtual.dados.localizacao
    areaAtuacao.innerText = usuarioAtual.dados.areaAtuacao
    nivelExperiencia.innerText = usuarioAtual.dados.nivelExperiencia

    console.log(usuarioAtual.userID);           // Ex: 1759967977156
            console.log(usuarioAtual.email);            // Ex: "guguinha@gmail.com"
            console.log(usuarioAtual.tipoConta);        // Ex: "usuario"
            console.log(usuarioAtual.perfilCompleto);   // Ex: true/false
            console.log(usuarioAtual.podeEditar);       // Ex: true/false
            console.log(usuarioAtual.dados);            // Ex: { nome: "...", telefone: "..." }

            // Acessar dados específicos dentro de "dados":
            console.log(usuarioAtual.dados.nome);       // Ex: "Gustavo"
            console.log(usuarioAtual.dados.telefone);   // Ex: "1140028922"
            console.log(usuarioAtual.dados.dataNasc);   // Ex: "2000-01-01"

    if (dataHours < 13) {
        mensagemGreeting.textContent = `Bom dia, ${usuarioAtual.dados.nome}! `
    }
    else if (dataHours < 18) {
        mensagemGreeting.textContent = `Boa tarde, ${usuarioAtual.dados.nome}! `
    }
    else {
        mensagemGreeting.textContent = `Boa noite, ${usuarioAtual.dados.nome}! `
    }
};

