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

document.addEventListener('DOMContentLoaded', async () => {
    await carregarPagina();
});

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

//candidaturass
let candidaturasAtual = 0;
let totalCandidaturas = 0;
let cardsVisiveis = 1;

// Adicione esta função ao seu pg-perfil.js
async function carregarCandidaturas() {
    const userID = localStorage.getItem('userID');
    
    if (!userID) {
        return;
    }

    try {
        const resposta = await fetch(`/api/candidatura/minhas`, {
            method: 'GET',
            headers: {
                'user-id': userID
            }
        });

        const dados = await resposta.json();
        
        // Esconde loading
        document.getElementById('loadingCandidaturas').style.display = 'none';

        if (!dados.ok || !dados.candidaturas || dados.candidaturas.length === 0) {
            document.getElementById('semCandidaturas').style.display = 'flex';
            return;
        }

        totalCandidaturas = dados.candidaturas.length;
        renderizarCandidaturas(dados.candidaturas);
        
        // Mostra o carrossel
        document.getElementById('candidaturasWrapper').style.display = 'block';
        
        // Atualiza cards visíveis baseado no tamanho da tela
        atualizarCardsVisiveis();
        atualizarBotoes();
        criarIndicadores();

    } catch (error) {
        console.error('Erro ao carregar candidaturas:', error);
        document.getElementById('loadingCandidaturas').style.display = 'none';
        document.getElementById('semCandidaturas').style.display = 'flex';
    }
}

function renderizarCandidaturas(candidaturas) {
    const track = document.getElementById('candidaturasTrack');
    track.innerHTML = '';

    candidaturas.forEach((candidatura) => {
        const card = document.createElement('div');
        card.className = 'candidatura-card';
        
        // Formatar data
        const data = new Date(candidatura.dataCandidatura);
        const dataFormatada = data.toLocaleDateString('pt-BR');
        
        // Status traduzido
        const statusMap = {
            'pendente': { texto: 'Pendente', classe: 'status-pendente' },
            'aceito': { texto: 'Aceito', classe: 'status-aceito' },
            'rejeitado': { texto: 'Rejeitado', classe: 'status-rejeitado' }
        };
        
        const status = statusMap[candidatura.status] || statusMap['pendente'];
        
        card.innerHTML = `
            <div class="candidatura-header">
                <div class="candidatura-titulo">
                    <h3>${candidatura.vaga.titulo}</h3>
                    <p class="candidatura-empresa">${candidatura.vaga.empresaNome}</p>
                </div>
                <span class="status-badge ${status.classe}">${status.texto}</span>
            </div>
            
            <div class="candidatura-info">
                <div class="info-item">
                    <ion-icon name="location-outline"></ion-icon>
                    <span>${candidatura.vaga.localizacao}</span>
                </div>
                <div class="info-item">
                    <ion-icon name="code-outline"></ion-icon>
                    <span>${candidatura.vaga.area}</span>
                </div>
                <div class="info-item">
                    <ion-icon name="document-text-outline"></ion-icon>
                    <span>Currículo #${candidatura.curriculoID}</span>
                </div>
            </div>
            
            <div class="candidatura-footer">
                <span class="candidatura-data">Candidatura em ${dataFormatada}</span>
            </div>
        `;
        
        track.appendChild(card);
    });
}


function atualizarCardsVisiveis() {
    const width = window.innerWidth;
    if (width >= 1024) {
        cardsVisiveis = 3;
    } else if (width >= 768) {
        cardsVisiveis = 2;
    } else {
        cardsVisiveis = 1;
    }
}

function moverCarrossel(direcao) {
    candidaturasAtual += direcao;
    
    const maxIndex = Math.ceil(totalCandidaturas / cardsVisiveis) - 1;
    
    if (candidaturasAtual < 0) {
        candidaturasAtual = 0;
    } else if (candidaturasAtual > maxIndex) {
        candidaturasAtual = maxIndex;
    }
    
    const track = document.getElementById('candidaturasTrack');
    const cardWidth = track.firstElementChild.offsetWidth;
    const gap = 20;
    const deslocamento = -(candidaturasAtual * cardsVisiveis * (cardWidth + gap));
    
    track.style.transform = `translateX(${deslocamento}px)`;
    
    atualizarBotoes();
    atualizarIndicadores();
}

function atualizarBotoes() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const maxIndex = Math.ceil(totalCandidaturas / cardsVisiveis) - 1;
    
    prevBtn.disabled = candidaturasAtual === 0;
    nextBtn.disabled = candidaturasAtual >= maxIndex;
}

function criarIndicadores() {
    const container = document.getElementById('carouselIndicators');
    container.innerHTML = '';
    
    const totalPaginas = Math.ceil(totalCandidaturas / cardsVisiveis);
    
    for (let i = 0; i < totalPaginas; i++) {
        const dot = document.createElement('div');
        dot.className = 'indicator-dot';
        if (i === 0) dot.classList.add('active');
        dot.onclick = () => irParaPagina(i);
        container.appendChild(dot);
    }
}

function atualizarIndicadores() {
    const dots = document.querySelectorAll('.indicator-dot');
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === candidaturasAtual);
    });
}

function irParaPagina(index) {
    candidaturasAtual = index;
    moverCarrossel(0);
}

// Atualizar ao redimensionar a janela
window.addEventListener('resize', () => {
    atualizarCardsVisiveis();
    candidaturasAtual = 0;
    moverCarrossel(0);
    criarIndicadores();
});

// Chame esta função dentro do seu carregarDadosUsuario() existente
// Adicione no final da função carregarPagina() ou carregarDadosUsuario():
carregarCandidaturas();



