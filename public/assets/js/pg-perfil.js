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
            await carregarCandidatosRecentes();
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
    window.location.href = ``;
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

async function carregarCandidatosRecentes() {
    const userID = localStorage.getItem('userID');
    
    try {
        // Primeiro, buscar os empregos da empresa
        const respostaEmpregos = await fetch(`/api/emprego/meus`, {
            method: 'GET',
            headers: {
                'user-id': userID
            }
        });

        const dadosEmpregos = await respostaEmpregos.json();
        
        if (!dadosEmpregos.ok || !dadosEmpregos.empregos || dadosEmpregos.empregos.length === 0) {
            const container = document.getElementById('candidatosRecentes');
            container.innerHTML = '<p class="text-muted text-center">Nenhuma vaga publicada ainda</p>';
            return;
        }

        // Buscar candidaturas para cada emprego
        let todasCandidaturas = [];
        
        for (const emprego of dadosEmpregos.empregos) {
            try {
                const respostaCandidatos = await fetch(`/api/candidatura/vaga/${emprego.empregoID}`, {
                    method: 'GET',
                    headers: {
                        'user-id': userID
                    }
                });
                
                const dadosCandidatos = await respostaCandidatos.json();
                
                if (dadosCandidatos.ok && dadosCandidatos.candidaturas) {
                    todasCandidaturas.push(...dadosCandidatos.candidaturas);
                }
            } catch (error) {
                console.error(`Erro ao buscar candidatos para vaga ${emprego.empregoID}:`, error);
            }
        }

        // Ordenar por data e pegar apenas as 5 mais recentes
        todasCandidaturas.sort((a, b) => 
            new Date(b.dataCandidatura) - new Date(a.dataCandidatura)
        );
        
        const candidatosRecentes = todasCandidaturas.slice(0, 5);
        
        renderizarCandidatosRecentes(candidatosRecentes);

    } catch (error) {
        console.error('Erro ao carregar candidatos recentes:', error);
        const container = document.getElementById('candidatosRecentes');
        container.innerHTML = '<p class="text-danger text-center">Erro ao carregar candidatos</p>';
    }
}

function renderizarCandidatosRecentes(candidatos) {
    const container = document.getElementById('candidatosRecentes');
    
    if (candidatos.length === 0) {
        container.innerHTML = '<p class="text-muted text-center">Nenhuma candidatura recente</p>';
        return;
    }
    
    container.innerHTML = candidatos.map(candidato => {
        const data = new Date(candidato.dataCandidatura);
        const dataFormatada = data.toLocaleDateString('pt-BR');
        
        return `
            <div class="candidato-card mb-3">
                <div class="d-flex justify-content-between align-items-start">
                    <div>
                        <h6 class="mb-1">${candidato.candidato.nome}</h6>
                        <p class="text-muted mb-1 small">${candidato.vaga.titulo}</p>
                        <p class="text-muted mb-0 small">
                            <ion-icon name="mail-outline"></ion-icon> ${candidato.candidato.email}
                        </p>
                    </div>
                    <div class="text-end">
                        <small class="text-muted">${dataFormatada}</small>
                        <br>
                        <button class="btn btn-sm btn-outline-primary mt-2" 
                                onclick="verDetalhesCandidato(${candidato.candidaturaID})">
                            Ver Detalhes
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}


async function verDetalhesCandidato(candidaturaID) {
    const userID = localStorage.getItem('userID');
    
    try {
        // Buscar todos os empregos da empresa
        const respostaEmpregos = await fetch(`/api/emprego/meus`, {
            method: 'GET',
            headers: {
                'user-id': userID
            }
        });

        const dadosEmpregos = await respostaEmpregos.json();
        
        if (!dadosEmpregos.ok) {
            alert('Erro ao carregar dados');
            return;
        }

        // Buscar em todas as vagas até encontrar a candidatura
        let candidaturaEncontrada = null;
        
        for (const emprego of dadosEmpregos.empregos) {
            const respostaCandidatos = await fetch(`/api/candidatura/vaga/${emprego.empregoID}`, {
                method: 'GET',
                headers: {
                    'user-id': userID
                }
            });
            
            const dadosCandidatos = await respostaCandidatos.json();
            
            if (dadosCandidatos.ok && dadosCandidatos.candidaturas) {
                candidaturaEncontrada = dadosCandidatos.candidaturas.find(
                    c => Number(c.candidaturaID) === Number(candidaturaID)
                );
                
                if (candidaturaEncontrada) break;
            }
        }

        if (!candidaturaEncontrada) {
            alert('Candidatura não encontrada');
            return;
        }

        // Mostrar modal com detalhes
        mostrarModalCandidato(candidaturaEncontrada);

    } catch (error) {
        console.error('Erro ao buscar detalhes do candidato:', error);
        alert('Erro ao carregar detalhes');
    }
}

function mostrarModalCandidato(candidatura) {
    const modalHTML = `
        <div class="modal fade" id="modalDetalhesCandidato" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Detalhes da Candidatura</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <h6 class="mb-3">Informações do Candidato</h6>
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <strong>Nome:</strong><br>
                                ${candidatura.candidato.nome}
                            </div>
                            <div class="col-md-6">
                                <strong>Email:</strong><br>
                                ${candidatura.candidato.email}
                            </div>
                        </div>
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <strong>Telefone:</strong><br>
                                ${candidatura.candidato.telefone || 'Não informado'}
                            </div>
                            <div class="col-md-6">
                                <strong>Localização:</strong><br>
                                ${candidatura.candidato.localizacao || 'Não informado'}
                            </div>
                        </div>
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <strong>Área de Atuação:</strong><br>
                                ${candidatura.candidato.areaAtuacao || 'Não informado'}
                            </div>
                            <div class="col-md-6">
                                <strong>Nível de Experiência:</strong><br>
                                ${candidatura.candidato.nivelExperiencia || 'Não informado'}
                            </div>
                        </div>
                        
                        ${candidatura.candidato.linkedin ? `
                        <div class="mb-3">
                            <strong>LinkedIn:</strong><br>
                            <a href="${candidatura.candidato.linkedin}" target="_blank">${candidatura.candidato.linkedin}</a>
                        </div>
                        ` : ''}
                        
                        ${candidatura.candidato.github ? `
                        <div class="mb-3">
                            <strong>GitHub:</strong><br>
                            <a href="${candidatura.candidato.github}" target="_blank">${candidatura.candidato.github}</a>
                        </div>
                        ` : ''}
                        
                        <hr>
                        
                        <h6 class="mb-3">Informações da Vaga</h6>
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <strong>Vaga:</strong><br>
                                ${candidatura.vaga.titulo}
                            </div>
                            <div class="col-md-6">
                                <strong>Data da Candidatura:</strong><br>
                                ${new Date(candidatura.dataCandidatura).toLocaleDateString('pt-BR')}
                            </div>
                        </div>
                        <div class="mb-3">
                            <strong>Currículo ID:</strong> #${candidatura.curriculoID}
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                        <a href="mailto:${candidatura.candidato.email}" class="btn btn-primary">
                            Entrar em Contato
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remove modal anterior se existir
    const modalExistente = document.getElementById('modalDetalhesCandidato');
    if (modalExistente) {
        modalExistente.remove();
    }
    
    // Adiciona novo modal
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Abre o modal
    const modal = new bootstrap.Modal(document.getElementById('modalDetalhesCandidato'));
    modal.show();
}

async function verCandidatos(empregoID) {
    const userID = localStorage.getItem('userID');
    
    try {
        const resposta = await fetch(`/api/candidatura/vaga/${empregoID}`, {
            method: 'GET',
            headers: {
                'user-id': userID
            }
        });

        const dados = await resposta.json();
        
        if (!dados.ok) {
            alert(dados.error || 'Erro ao carregar candidatos');
            return;
        }

        mostrarModalCandidatos(dados);

    } catch (error) {
        console.error('Erro ao buscar candidatos:', error);
        alert('Erro ao carregar candidatos da vaga');
    }
}

function mostrarModalCandidatos(dados) {
    const { vaga, candidaturas, total } = dados;
    
    // Preencher título e informações da vaga
    document.getElementById('tituloVagaModal').textContent = vaga.titulo;
    document.getElementById('empresaNomeModal').textContent = vaga.empresaNome;
    document.getElementById('totalCandidatos').textContent = `${total} candidato${total !== 1 ? 's' : ''}`;
    
    // Renderizar lista de candidatos
    const listaCandidatos = document.getElementById('listaCandidatos');
    
    if (candidaturas.length === 0) {
        listaCandidatos.innerHTML = `
            <div class="text-center py-5">
                <ion-icon name="people-outline" style="font-size: 64px; color: #ccc;"></ion-icon>
                <p class="text-muted mt-3">Nenhum candidato ainda</p>
            </div>
        `;
    } else {
        listaCandidatos.innerHTML = candidaturas.map(candidato => {
            const data = new Date(candidato.dataCandidatura);
            const dataFormatada = data.toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            });
            
            return `
                <div class="candidato-item">
                    <div class="candidato-avatar">
                        <ion-icon name="person-circle-outline"></ion-icon>
                    </div>
                    <div class="candidato-info">
                        <h6>${candidato.candidato.nome}</h6>
                        <p class="mb-1">
                            <ion-icon name="briefcase-outline"></ion-icon>
                            ${candidato.candidato.areaAtuacao || 'Área não informada'} - 
                            ${candidato.candidato.nivelExperiencia || 'Nível não informado'}
                        </p>
                        <p class="mb-1">
                            <ion-icon name="location-outline"></ion-icon>
                            ${candidato.candidato.localizacao || 'Não informado'}
                        </p>
                        <p class="mb-0 small text-muted">
                            Candidatura em ${dataFormatada}
                        </p>
                    </div>
                    <div class="candidato-actions">
                        <button class="btn btn-sm btn-outline-primary mb-2" 
                                onclick="verDetalhesCandidato(${candidato.candidaturaID}, ${candidato.empregoID})">
                            <ion-icon name="eye-outline"></ion-icon>
                            Ver Detalhes
                        </button>
                        <a href="mailto:${candidato.candidato.email}" 
                           class="btn btn-sm btn-primary">
                            <ion-icon name="mail-outline"></ion-icon>
                            Contatar
                        </a>
                    </div>
                </div>
            `;
        }).join('');
    }
    
    // Abrir modal
    const modal = new bootstrap.Modal(document.getElementById('modalCandidatos'));
    modal.show();
}


async function verDetalhesCandidato(candidaturaID, empregoID) {
    const userID = localStorage.getItem('userID');
    
    try {
        const resposta = await fetch(`/api/candidatura/vaga/${empregoID}`, {
            method: 'GET',
            headers: {
                'user-id': userID
            }
        });

        const dados = await resposta.json();
        
        if (!dados.ok) {
            alert('Erro ao carregar dados');
            return;
        }

        const candidatura = dados.candidaturas.find(
            c => Number(c.candidaturaID) === Number(candidaturaID)
        );

        if (!candidatura) {
            alert('Candidatura não encontrada');
            return;
        }

        mostrarModalDetalhesCandidato(candidatura);

    } catch (error) {
        console.error('Erro ao buscar detalhes:', error);
        alert('Erro ao carregar detalhes do candidato');
    }
}

function mostrarModalDetalhesCandidato(candidatura) {
    // Preencher dados no modal
    document.getElementById('detalhesNome').textContent = candidatura.candidato.nome;
    document.getElementById('detalhesEmail').textContent = candidatura.candidato.email;
    document.getElementById('detalhesTelefone').textContent = candidatura.candidato.telefone || 'Não informado';
    document.getElementById('detalhesLocalizacao').textContent = candidatura.candidato.localizacao || 'Não informado';
    document.getElementById('detalhesArea').textContent = candidatura.candidato.areaAtuacao || 'Não informado';
    document.getElementById('detalhesNivel').textContent = candidatura.candidato.nivelExperiencia || 'Não informado';
    
    // Links sociais
    const linkedinLink = document.getElementById('detalhesLinkedin');
    const githubLink = document.getElementById('detalhesGithub');
    const linksContainer = document.getElementById('detalhesLinks');
    
    if (candidatura.candidato.linkedin || candidatura.candidato.github) {
        linksContainer.style.display = 'block';
        
        if (candidatura.candidato.linkedin) {
            linkedinLink.href = candidatura.candidato.linkedin;
            linkedinLink.parentElement.style.display = 'block';
        } else {
            linkedinLink.parentElement.style.display = 'none';
        }
        
        if (candidatura.candidato.github) {
            githubLink.href = candidatura.candidato.github;
            githubLink.parentElement.style.display = 'block';
        } else {
            githubLink.parentElement.style.display = 'none';
        }
    } else {
        linksContainer.style.display = 'none';
    }
    
    // Informações da vaga
    document.getElementById('detalhesVagaTitulo').textContent = candidatura.vaga.titulo;
    document.getElementById('detalhesDataCandidatura').textContent = 
        new Date(candidatura.dataCandidatura).toLocaleDateString('pt-BR');
    document.getElementById('detalhesCurriculoID').textContent = candidatura.curriculoID;
    
    // Botão de contato
    const btnContato = document.getElementById('btnContatarCandidato');
    btnContato.href = `mailto:${candidatura.candidato.email}`;
    
    // Abrir modal de detalhes
    const modalDetalhes = new bootstrap.Modal(document.getElementById('modalDetalhesCandidato'));
    modalDetalhes.show();
}