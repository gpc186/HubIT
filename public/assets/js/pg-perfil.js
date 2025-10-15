// Colocar o indicador no item ativo quando carregar a página
window.addEventListener('DOMContentLoaded', () => {
    const activeItem = document.querySelector('.nav-item.active');
    if (activeItem) {
        moveIndicator(activeItem);
    }
});

function navigateTo(element, pageUrl) {
    // Remove a classe active de todos os itens
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });

    // Adiciona a classe active no item clicado
    element.classList.add('active');
    
    // Move o indicador
    moveIndicator(element);

    // Espera a animação terminar antes de redirecionar
    setTimeout(() => {
        window.location.href = pageUrl;
    }, 400);
}

function moveIndicator(element) {
    const indicator = document.getElementById('indicator');
    if (!indicator || !element) return;

    const elementRect = element.getBoundingClientRect();
    const navbarRect = document.querySelector('.navbar-nav').getBoundingClientRect();
    
    // Calcula a posição relativa
    const leftPosition = elementRect.left - navbarRect.left + (elementRect.width / 2) - (indicator.offsetWidth / 2);
    
    indicator.style.left = leftPosition + 'px';
}

// Reposiciona o indicador ao redimensionar a janela
window.addEventListener('load', () => {
    const activeItem = document.querySelector('.nav-item.active');
    if (activeItem) {
        moveIndicator(activeItem);
    }
});
const dataNow = new Date();
const dataHours = dataNow.getHours();

const mensagemGreeting = document.getElementById('mensagemGreeting');

window.onload = async function () {
    await carregarPagina();
};

async function carregarPagina() {
    const userID = localStorage.getItem('userID');
    
    // Verifica se o usuário já está logado
    if (!userID) {
        alert('Você precisa fazer login!');
        window.location.href = '/';
        return;
    }

    const resposta = await fetch(`/api/usuario/${userID}`, {
        method: 'GET',
        headers: {
            'user-id': userID
        }
    });


    const dados = await resposta.json()
	const usuarioAtual = dados.usuario;

    if(!usuarioAtual.dados){
        alert('Por favor cadastre')
    }

    const nomePrincipal = document.getElementById('nomePrincipal')
    const localizacao = document.getElementById('localizacao')

    console.log(usuarioAtual)
    console.log(nomePrincipal)
    nomePrincipal.innerHTML = usuarioAtual.dados.nome
    localizacao.innerText = usuarioAtual.dados.localizacao

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
}