// ============================================
// NAVEGAÇÃO E INDICADORES
// ============================================
window.addEventListener('DOMContentLoaded', () => {
    const activeItem = document.querySelector('.nav-item.active');
    if (activeItem) {
        moveIndicator(activeItem);
    }
});

function navigateTo(element, pageUrl) {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    element.classList.add('active');
    moveIndicator(element);
    setTimeout(() => {
        window.location.href = pageUrl;
    }, 400);
}

function moveIndicator(element) {
    const indicator = document.getElementById('indicator');
    if (!indicator || !element) return;
    const elementRect = element.getBoundingClientRect();
    const navbarRect = document.querySelector('.navbar-nav').getBoundingClientRect();
    const leftPosition = elementRect.left - navbarRect.left + (elementRect.width / 2) - (indicator.offsetWidth / 2);
    indicator.style.left = leftPosition + 'px';
}

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

// ============================================
// CARREGAR DADOS DO PERFIL
// ============================================
async function carregarPagina() {
    const userID = localStorage.getItem('userID');
    
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

        if (!usuarioAtual.dados) {
            alert('Por favor, complete seu cadastro');
            return;
        }

        // Pega os containers
        const containerCurriculos = document.getElementById('container-curriculos');
        const containerAnalise = document.getElementById('container-Analise');
        const containerEmpregos = document.getElementById('container-empregos');
        const containerCandidatos = document.getElementById('container-candidatos');

        if (usuarioAtual.tipoConta === 'usuario') {
            // Mostrar containers de usuário
            if (containerCurriculos) containerCurriculos.style.display = 'block';
            if (containerAnalise) containerAnalise.style.display = 'block';
            
            // Esconder containers de empresa
            if (containerEmpregos) containerEmpregos.style.display = 'none';
            if (containerCandidatos) containerCandidatos.style.display = 'none';
            
            // Carregar dados de usuário
            preencherDadosUsuario(usuarioAtual);
            await carregarCandidaturas();
            await carregarCurriculos();
            
        } else if (usuarioAtual.tipoConta === 'empresa') {
            // Mostrar containers de empresa
            if (containerEmpregos) containerEmpregos.style.display = 'block';
            if (containerCandidatos) containerCandidatos.style.display = 'block';
            
            // Esconder containers de usuário
            if (containerCurriculos) containerCurriculos.style.display = 'none';
            if (containerAnalise) containerAnalise.style.display = 'none';
            
            // Carregar dados de empresa
            preencherDadosEmpresa(usuarioAtual);
            await carregarEmpregosEmpresa();
        }

    } catch (error) {
        console.error('Erro ao carregar perfil:', error);
        alert('Erro ao carregar os dados do perfil. Tente novamente.');
    }
}

// Função para preencher dados de usuário
function preencherDadosUsuario(usuario) {
    const nomePrincipal = document.getElementById('nomePrincipal');
    const localizacao = document.getElementById('localizacao');
    const trabalho = document.getElementById('trabalho');
    const bio = document.querySelector('.bio');
    
    if (nomePrincipal) {
        nomePrincipal.innerText = usuario.dados.nome || 'Nome não informado';
    }
    if (localizacao) {
        localizacao.innerText = usuario.dados.localizacao || 'Localização não informada';
    }
    if (trabalho) {
        trabalho.innerText = usuario.dados.areaAtuacao || 'Área não informada';
    }
    if (bio && usuario.dados.biografia) {
        bio.innerText = usuario.dados.biografia;
    }
    
    // Links
    const linkedin = document.getElementById('lkdn');
    const github = document.getElementById('gthb');
    
    if (linkedin && usuario.dados.linkedin) {
        linkedin.href = usuario.dados.linkedin;
        linkedin.textContent = 'LinkedIn';
        linkedin.style.display = 'inline-block';
    }
    if (github && usuario.dados.github) {
        github.href = usuario.dados.github;
        github.textContent = 'GitHub';
        github.style.display = 'inline-block';
    }
}

// Função para preencher dados de empresa
function preencherDadosEmpresa(empresa) {
    const nomePrincipal = document.getElementById('nomePrincipal');
    const localizacao = document.getElementById('localizacao');
    const trabalho = document.getElementById('trabalho');
    const bio = document.querySelector('.bio');
    
    if (nomePrincipal) {
        nomePrincipal.innerText = empresa.dados.nomeEmpresa || 'Nome não informado';
    }
    if (localizacao) {
        localizacao.innerText = empresa.dados.localizacao || 'Localização não informada';
    }
    if (trabalho) {
        trabalho.innerText = empresa.dados.setor || 'Setor não informado';
    }
    if (bio && empresa.dados.descricao) {
        bio.innerText = empresa.dados.descricao;
    }
    
    // Links
    const linkedin = document.getElementById('lkdn');
    const github = document.getElementById('gthb');
    
    if (linkedin && empresa.dados.linkedin) {
        linkedin.href = empresa.dados.linkedin;
        linkedin.textContent = 'LinkedIn';
        linkedin.style.display = 'inline-block';
    }
    if (github) {
        github.parentElement.style.display = 'none'; // Empresa não tem GitHub
    }
}

function abrirModalEdicao() {
    const modal = document.getElementById('modalCompletarPerfil');
    if (modal) {
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();
    }
}

// ============================================
// CARROSSEL DE CANDIDATURAS
// ============================================
let candidaturasAtual = 0;
let totalCandidaturas = 0;
let cardsVisiveis = 1;

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
        const loadingElement = document.getElementById('loadingCandidaturas');
        if (loadingElement) {
            loadingElement.style.display = 'none';
        }

        if (!dados.ok || !dados.candidaturas || dados.candidaturas.length === 0) {
            const semCandidaturas = document.getElementById('semCandidaturas');
            if (semCandidaturas) {
                semCandidaturas.style.display = 'flex';
            }
            return;
        }

        totalCandidaturas = dados.candidaturas.length;
        renderizarCandidaturas(dados.candidaturas);
        
        // Mostra o carrossel
        const wrapper = document.getElementById('candidaturasWrapper');
        if (wrapper) {
            wrapper.style.display = 'block';
        }
        
        // Aguarda um frame para garantir que o DOM foi atualizado
        requestAnimationFrame(() => {
            atualizarCardsVisiveis();
            atualizarBotoes();
            criarIndicadores();
        });

    } catch (error) {
        console.error('Erro ao carregar candidaturas:', error);
        const loadingElement = document.getElementById('loadingCandidaturas');
        const semCandidaturas = document.getElementById('semCandidaturas');
        
        if (loadingElement) loadingElement.style.display = 'none';
        if (semCandidaturas) semCandidaturas.style.display = 'flex';
    }
}

function renderizarCandidaturas(candidaturas) {
    const track = document.getElementById('candidaturasTrack');
    if (!track) return;
    
    track.innerHTML = '';

    candidaturas.forEach((candidatura) => {
        const card = document.createElement('div');
        card.className = 'candidatura-card';
        
        const data = new Date(candidatura.dataCandidatura);
        const dataFormatada = data.toLocaleDateString('pt-BR');
        
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
    if (totalCandidaturas === 0) return;
    
    const maxIndex = Math.ceil(totalCandidaturas / cardsVisiveis) - 1;
    
    candidaturasAtual += direcao;
    
    if (candidaturasAtual < 0) {
        candidaturasAtual = 0;
    } else if (candidaturasAtual > maxIndex) {
        candidaturasAtual = maxIndex;
    }
    
    const track = document.getElementById('candidaturasTrack');
    if (!track || !track.firstElementChild) return;
    
    const deslocamento = -(candidaturasAtual * 100);
    track.style.transform = `translateX(${deslocamento}%)`;
    
    atualizarBotoes();
    atualizarIndicadores();
}

function atualizarBotoes() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (!prevBtn || !nextBtn) return;
    
    const maxIndex = Math.ceil(totalCandidaturas / cardsVisiveis) - 1;
    
    prevBtn.disabled = candidaturasAtual === 0;
    nextBtn.disabled = candidaturasAtual >= maxIndex;
    
    prevBtn.style.opacity = candidaturasAtual === 0 ? '0.5' : '1';
    nextBtn.style.opacity = candidaturasAtual >= maxIndex ? '0.5' : '1';
}

function criarIndicadores() {
    const container = document.getElementById('carouselIndicators');
    if (!container) return;
    
    container.innerHTML = '';
    
    const totalPaginas = Math.ceil(totalCandidaturas / cardsVisiveis);
    
    if (totalPaginas <= 1) {
        container.style.display = 'none';
        return;
    }
    
    container.style.display = 'flex';
    
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
    const maxIndex = Math.ceil(totalCandidaturas / cardsVisiveis) - 1;
    candidaturasAtual = Math.min(Math.max(0, index), maxIndex);
    moverCarrossel(0);
}

// ============================================
// EVENT LISTENERS
// ============================================
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        const antigoCardsVisiveis = cardsVisiveis;
        atualizarCardsVisiveis();
        
        if (antigoCardsVisiveis !== cardsVisiveis && totalCandidaturas > 0) {
            candidaturasAtual = 0;
            moverCarrossel(0);
            criarIndicadores();
        }
    }, 250);
});

// Suporte a gestos touch
let touchStartX = 0;
let touchEndX = 0;

function handleGesture() {
    if (touchEndX < touchStartX - 50) {
        moverCarrossel(1);
    }
    if (touchEndX > touchStartX + 50) {
        moverCarrossel(-1);
    }
}

// Inicialização
document.addEventListener('DOMContentLoaded', async () => {
    // Adiciona listeners de touch
    const track = document.getElementById('candidaturasTrack');
    if (track) {
        track.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        });

        track.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            handleGesture();
        });
    }
    
    // Carrega a página
    await carregarPagina();
});
// Carregar empregos que a empresa postou
async function carregarEmpregosEmpresa() {
    const userID = localStorage.getItem('userID');
    
    try {
        const resposta = await fetch(`/api/emprego/meus`, {
            method: 'GET',
            headers: {
                'user-id': userID
            }
        });

        const dados = await resposta.json();
        
        if (!dados.ok || !dados.empregos || dados.empregos.length === 0) {
            document.getElementById('semEmpregos').style.display = 'flex';
            return;
        }

        renderizarEmpregos(dados.empregos);
        
    } catch (error) {
        console.error('Erro ao carregar empregos:', error);
        document.getElementById('semEmpregos').style.display = 'flex';
    }
}

function renderizarEmpregos(empregos) {
    const container = document.getElementById('empregosLista');
    container.innerHTML = '';

    empregos.forEach((emprego) => {
        const card = document.createElement('div');
        card.className = 'emprego-card';
        
        card.innerHTML = `
            <div class="emprego-header">
                <h3>${emprego.titulo}</h3>
                <span class="status-badge status-${emprego.status}">${emprego.status}</span>
            </div>
            
            <div class="emprego-info">
                <div class="info-item">
                    <ion-icon name="location-outline"></ion-icon>
                    <span>${emprego.localizacao}</span>
                </div>
                <div class="info-item">
                    <ion-icon name="code-outline"></ion-icon>
                    <span>${emprego.area}</span>
                </div>
                <div class="info-item">
                    <ion-icon name="calendar-outline"></ion-icon>
                    <span>${emprego.dataCriacao}</span>
                </div>
            </div>
            
            <div class="emprego-footer">
                <button class="btn btn-sm btn-primary" onclick="verCandidatos(${emprego.empregoID})">
                    Ver Candidatos
                </button>
                <button class="btn btn-sm btn-danger" onclick="deletarEmprego(${emprego.empregoID})">
                    Deletar
                </button>
            </div>
        `;
        
        container.appendChild(card);
    });
}

async function verCandidatos(empregoID) {
    // Redirecionar para página de candidatos ou abrir modal
    window.location.href = `/candidatos/${empregoID}`;
}

async function deletarEmprego(empregoID) {
    if (!confirm('Tem certeza que deseja deletar esta vaga?')) {
        return;
    }
    
    const userID = localStorage.getItem('userID');
    
    try {
        const resposta = await fetch(`/api/emprego/${empregoID}`, {
            method: 'DELETE',
            headers: {
                'user-id': userID
            }
        });
        
        const dados = await resposta.json();
        
        if (dados.ok) {
            alert('Vaga deletada com sucesso!');
            await carregarEmpregosEmpresa();
        } else {
            alert(dados.error);
        }
    } catch (error) {
        console.error('Erro ao deletar emprego:', error);
        alert('Erro ao deletar vaga');
    }
}