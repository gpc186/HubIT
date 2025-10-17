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
window.addEventListener('resize', () => {
    const activeItem = document.querySelector('.nav-item.active');
    if (activeItem) {
        moveIndicator(activeItem);
    }
});

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

    try {
        const resposta = await fetch(`/api/usuario/${userID}`, {
            method: 'GET',
            headers: {
                'user-id': userID
            }
        });

        if (!resposta.ok) {
            throw new Error('Erro ao carregar dados do usuário');
        }

        const dados = await resposta.json();
        const usuarioAtual = dados.usuario;

        // Verifica se o usuário tem dados cadastrados
        if (!usuarioAtual.dados) {
            alert('Por favor, complete seu cadastro');
            return;
        }

        // Seleciona os elementos do DOM
        const nomePrincipal = document.getElementById('nomePrincipal');
        const localizacao = document.getElementById('localizacao');
        const trabalho = document.getElementById('trabalho');
        const bio = document.querySelector('.bio');
        
        // Links
        const linkedin = document.getElementById('lkdn');
        const github = document.getElementById('gthb');

        // Preenche os dados principais
        if (nomePrincipal) {
            nomePrincipal.innerText = usuarioAtual.dados.nome || 'Nome não informado';
        }

        if (localizacao) {
            localizacao.innerText = usuarioAtual.dados.localizacao || 'Localização não informada';
        }

        if (trabalho) {
            trabalho.innerText = usuarioAtual.dados.areaAtuacao || 'Área não informada';
        }

        // Preenche biografia se existir
        if (bio && usuarioAtual.dados.biografia) {
            bio.innerText = usuarioAtual.dados.biografia;
        }

        // Configura links do LinkedIn
        if (linkedin) {
            if (usuarioAtual.dados.linkedin) {
                linkedin.href = usuarioAtual.dados.linkedin;
                linkedin.textContent = 'LinkedIn';
                linkedin.target = '_blank';
                linkedin.style.display = 'inline-block';
                linkedin.parentElement.style.display = 'list-item';
            } else {
                linkedin.parentElement.style.display = 'none';
            }
        }

        // Configura links do GitHub (CORRIGIDO: era 'gitLink' e deveria ser 'github')
        if (github) {
            if (usuarioAtual.dados.github) {
                github.href = usuarioAtual.dados.github;
                github.textContent = 'GitHub';
                github.target = '_blank';
                github.style.display = 'inline-block';
                github.parentElement.style.display = 'list-item';
            } else {
                github.parentElement.style.display = 'none';
            }
        }

        // Log para debug (pode remover em produção)
        console.log('Dados do usuário carregados:', {
            userID: usuarioAtual.userID,
            email: usuarioAtual.email,
            tipoConta: usuarioAtual.tipoConta,
            perfilCompleto: usuarioAtual.perfilCompleto,
            podeEditar: usuarioAtual.podeEditar,
            dados: usuarioAtual.dados
        });

    } catch (error) {
        console.error('Erro ao carregar perfil:', error);
        alert('Erro ao carregar os dados do perfil. Tente novamente.');
    }
}

// Função para abrir modal de edição (se necessário)
function abrirModalEdicao() {
    const modal = document.getElementById('modalCompletarPerfil');
    if (modal) {
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();
    }
}