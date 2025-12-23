// ===== CONFIGURAÇÕES =====
const dataNow = new Date();
const dataHours = dataNow.getHours();

// Armazena os portfólios já curtidos pelo usuário
const portfoliosCurtidos = new Set();

function mostrarSkeletonsPortfolios(quantidade = 4) {
    const container = document.getElementById('portfoliosContainer');
    if (!container) return;
    
    let html = '';
    for (let i = 0; i < quantidade; i++) {
        html += `
            <div class="card skeleton-card placeholder-glow">
                <div class="d-flex gap-3 mb-3">
                    <div class="placeholder rounded-circle bg-secondary" style="width: 50px; height: 50px;"></div>
                    <div class="flex-grow-1">
                        <div class="placeholder col-7 mb-2"></div>
                        <div class="placeholder col-5"></div>
                    </div>
                </div>
                <div class="mb-2">
                    <div class="placeholder col-8 mb-2 fs-5"></div>
                    <div class="placeholder col-12 mb-2"></div>
                    <div class="placeholder col-11 mb-2"></div>
                    <div class="placeholder col-9"></div>
                </div>
                <div class="d-flex gap-2 mb-3 flex-wrap">
                    <span class="placeholder col-2 rounded-pill"></span>
                    <span class="placeholder col-3 rounded-pill"></span>
                    <span class="placeholder col-2 rounded-pill"></span>
                    <span class="placeholder col-3 rounded-pill"></span>
                </div>
                <div class="d-flex justify-content-between align-items-center border-top pt-3">
                    <div class="placeholder col-4"></div>
                    <div class="placeholder col-2 rounded"></div>
                </div>
            </div>
        `;
    }
    container.innerHTML = html;
}

// ===== INICIALIZAÇÃO =====
window.onload = async function () {
    await carregarPagina();
};

// ===== FUNÇÃO PRINCIPAL DE CARREGAMENTO =====
async function carregarPagina() {
    const userID = localStorage.getItem('userID');

    if (!userID) {
        alert('Você precisa fazer login!');
        window.location.href = '/';
        return;
    }

    try {
        // Buscar dados do usuário
        const resposta = await fetch(`/api/usuario/${userID}`, {
            method: 'GET',
            headers: { 'user-id': userID }
        });

        const dados = await resposta.json();
        console.log('Dados do usuário:', dados);
        
        const usuarioAtual = dados.usuario;

        if (!usuarioAtual.dados) {
            alert('Por favor cadastre seus dados');
            return;
        }

        const createpostx = document.getElementById('create-postx')

        if (usuarioAtual.tipoConta === 'empresa') {
            if (createpostx) createpostx.style.display = 'none';
        }

        // Atualizar informações do perfil
        atualizarPerfil(usuarioAtual);

        // Carregar portfólios
        await carregarPortfolios();

    } catch (error) {
        console.error('Erro ao carregar página:', error);
    }
}

// ===== ATUALIZAR PERFIL DO USUÁRIO =====
function atualizarPerfil(usuarioAtual) {
    
    const mensagemGreeting = document.getElementById('mensagemGreeting');
    const nomePrincipal = document.getElementById('nomePrincipal');
    const nomeGreeting = document.getElementById('nomeSaudacao');
    const nomeLocal = document.getElementById('nomeLocal');
    const areaAtuacao = document.getElementById('areaAtuacao');
    const nivelExperiencia = document.getElementById('nivelExperiencia');
    const weatherIconImg = document.getElementById('weatherIconImg');
    const empregosButton = document.getElementById('empregosButton');
    const searchButton = document.getElementById('searchButton')

    // Atualizar nome e informações
    if (usuarioAtual.tipoConta === 'usuario') {
        if (nomePrincipal) {
            nomePrincipal.innerText = usuarioAtual.dados.nome || 'Seu Nome';
            console.log('Nome principal atualizado');
        }
        if (nomeGreeting) nomeGreeting.innerText = usuarioAtual.dados.nome || 'Seu Nome';
        if (nomeLocal) nomeLocal.innerText = usuarioAtual.dados.localizacao || 'Localização';
        if (areaAtuacao) areaAtuacao.innerText = usuarioAtual.dados.areaAtuacao || 'Área';
        if (nivelExperiencia) nivelExperiencia.innerText = usuarioAtual.dados.nivelExperiencia || 'Nível';
    
        // Atualizar mensagem de greeting com base na hora
        if (mensagemGreeting && weatherIconImg) {
            const nome = usuarioAtual.dados.nome || 'Usuário';
            
            if (dataHours < 13) {
                weatherIconImg.src = "assets/img/svg/sun-svgrepo-com.svg";
                mensagemGreeting.innerHTML = `Bom dia, <span style="color:#106083; font-family: Codec;">${nome}!</span> <br> Explore os <span style="color: #2F6D88; font-family: Codec;">portfólios</span> de hoje!`;
            } else if (dataHours < 18) {
                weatherIconImg.src = "assets/img/svg/partly-cloudy-svgrepo-com.svg";
                mensagemGreeting.innerHTML = `Boa tarde, <span style="color:#106083; font-family: Codec;">${nome}!</span> <br> Explore os <span style="color: #2F6D88; font-family: Codec;">portfólios</span> de hoje!`;
            } else {
                weatherIconImg.src = "assets/img/svg/moon-svgrepo-com.svg";
                mensagemGreeting.innerHTML = `Boa noite, <span style="color:#106083; font-family: Codec;">${nome}!</span> <br> Explore os <span style="color: #2F6D88; font-family: Codec;">portfólios</span> de hoje!`;
            }
        }
    }

    if (usuarioAtual.tipoConta === 'empresa') {
        empregosButton.style.display = 'none'
        searchButton.style.display = 'none'
        if (nomePrincipal) {
            nomePrincipal.innerText = usuarioAtual.dados.nomeEmpresa || 'Seu Nome';
        }
        if (nomeGreeting) nomeGreeting.innerText = usuarioAtual.dados.nomeEmpresa || 'Seu Nome';
        if (nomeLocal) nomeLocal.innerText = usuarioAtual.dados.localizacao || 'Localização';
        if (areaAtuacao) areaAtuacao.innerText = usuarioAtual.dados.setor || 'Setor';
        if (nivelExperiencia) nivelExperiencia.innerText = usuarioAtual.dados.descricao || 'descrição';
    
        // Atualizar mensagem de greeting com base na hora
        if (mensagemGreeting && weatherIconImg) {
            const nome = usuarioAtual.dados.nome || 'Usuário';
            
            if (dataHours < 13) {
                weatherIconImg.src = "assets/img/svg/sun-svgrepo-com.svg";
                mensagemGreeting.innerHTML = `Bom dia, <span style="color:#106083; font-family: Codec;">${nome}!</span> <br> Explore os <span style="color: #2F6D88; font-family: Codec;">portfólios</span> de hoje!`;
            } else if (dataHours < 18) {
                weatherIconImg.src = "assets/img/svg/partly-cloudy-svgrepo-com.svg";
                mensagemGreeting.innerHTML = `Boa tarde, <span style="color:#106083; font-family: Codec;">${nome}!</span> <br> Explore os <span style="color: #2F6D88; font-family: Codec;">portfólios</span> de hoje!`;
            } else {
                weatherIconImg.src = "assets/img/svg/moon-svgrepo-com.svg";
                mensagemGreeting.innerHTML = `Boa noite, <span style="color:#106083; font-family: Codec;">${nome}!</span> <br> Explore os <span style="color: #2F6D88; font-family: Codec;">portfólios</span> de hoje!`;
            }
        }
    }

}

// ===== CARREGAR PORTFÓLIOS =====
async function carregarPortfolios() {
    const container = document.getElementById('portfoliosContainer');
    const userID = localStorage.getItem('userID');
    
    if (!container) {
        console.error('Container portfoliosContainer não encontrado!');
        return;
    }
    
    if (!userID) {
        container.innerHTML = '<div class="loading">Por favor, faça login primeiro.</div>';
        return;
    }

    mostrarSkeletonsPortfolios(4);

    try {
        const response = await fetch('/api/portfolio', {
            method: 'GET',
            headers: { 'user-id': userID }
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Erro na resposta:', errorText);
            throw new Error(`Erro ${response.status}: ${errorText}`);
        }

        const dados = await response.json();
        
        if (dados.ok && dados.portfolios && dados.portfolios.length > 0) {
            renderizarPortfolios(dados.portfolios);
            console.log(`${dados.portfolios.length} portfólios carregados`);
        } else {
            console.log('Nenhum portfólio encontrado');
            container.innerHTML = '<div class="loading"> Nenhum portfólio encontrado.</div>';
        }

    } catch (error) {
        console.error('Erro ao carregar portfólios:', error);
        console.error('Stack:', error.stack);
        container.innerHTML = `<div class="loading">Erro ao carregar portfólios: ${error.message}</div>`;
    }
}

// ===== RENDERIZAR PORTFÓLIOS =====
function renderizarPortfolios(portfolios) {
    const container = document.getElementById('portfoliosContainer');
    
    if (!container) {
        console.error('Container portfoliosContainer não encontrado!');
        return;
    }
    
    container.innerHTML = '';

    if (!portfolios || portfolios.length === 0) {
        console.log('Array de portfólios vazio');
        container.innerHTML = '<div class="loading">🔍 Nenhum portfólio encontrado.</div>';
        return;
    }

    portfolios.forEach((portfolio, index) => {
        
        const postCard = document.createElement('div');
        postCard.className = 'post-card fade-in-content';
        
        // Formatar array de tecnologias para exibição
        const tecnologiasTexto = Array.isArray(portfolio.tecnologias) 
            ? portfolio.tecnologias.join(' • ') 
            : portfolio.tecnologias;
        
        // Formatar data de criação
        const dataCriacao = portfolio.dataCriacao 
            ? new Date(portfolio.dataCriacao).toLocaleDateString('pt-BR') 
            : 'Data não disponível';
        
        // Verificar se já curtiu este portfólio
        const jaCurtiuEste = jaCurtiu(portfolio.portfolioID);
        const botaoCurtirClass = jaCurtiuEste ? 'btn-secondary' : 'btn-outline-danger';
        const botaoCurtirTexto = jaCurtiuEste ? 'Curtido' : 'Curtir';
        
        postCard.innerHTML = `
            <div class="post-header">
                <div class="post-avatar">
                    <img src="assets/img/svg/Hubit_icon_profile.svg" onerror="this.src='https://via.placeholder.com/60'">
                </div>
                <div class="post-user-info">
                    <div class="post-user-name">${portfolio.usuarioNome || 'Usuário'}</div>
                    <div class="post-user-headline">${portfolio.categoria || 'Categoria não definida'}</div>
                    <div class="post-time">${dataCriacao}</div>
                </div>
            </div>
            <div class="post-content">
                <h5 class="mb-2">${portfolio.titulo}</h5>
                <p class="mb-2">${portfolio.descricao}</p>
                <div class="tecnologias-tags mt-2">
                    ${tecnologiasTexto}
                </div>
            </div>
            <div class="post-engagement">
                <span><img src="/assets/img/svg/thumbup-svgrepo-com.svg"> <span id="curtidas-${portfolio.portfolioID}">${portfolio.curtidas || 0}</span> curtidas</span>
                <span><img src="/assets/img/svg/file-horizontal-svgrepo-com.svg"> ${portfolio.categoria}</span>
            </div>
            <div class="post-actions">
                <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modalPortfolio${portfolio.portfolioID}">
                    Ver Detalhes
                </button>
                <button id="btnCurtir-${portfolio.portfolioID}" type="button" class="btn ${botaoCurtirClass}" onclick="curtirPortfolio(${portfolio.portfolioID})">
                    <img src="/assets/img/svg/thumbup-svgrepo-com.svg"> ${botaoCurtirTexto}
                </button>
            </div>
        `;
        
        container.appendChild(postCard);

        // Criar Modal para cada portfólio
        criarModalPortfolio(portfolio, dataCriacao, jaCurtiuEste, botaoCurtirClass, botaoCurtirTexto);
    });
}

// ===== CRIAR MODAL DO PORTFÓLIO =====
function criarModalPortfolio(portfolio, dataCriacao, jaCurtiuEste, botaoCurtirClass, botaoCurtirTexto) {
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.id = `modalPortfolio${portfolio.portfolioID}`;
    modal.setAttribute('tabindex', '-1');
    modal.setAttribute('aria-hidden', 'true');
    
    // Processar tecnologias para lista
    const tecnologiasLista = Array.isArray(portfolio.tecnologias)
        ? portfolio.tecnologias.map(tec => `<li class="mb-2"><span class="text-primary fw-bold me-2">•</span>${tec}</li>`).join('')
        : `<li class="mb-2"><span class="text-primary fw-bold me-2">•</span>${portfolio.tecnologias}</li>`;
    
    // Processar links adicionais
    const linksOutros = Array.isArray(portfolio.linkOutros) && portfolio.linkOutros.length > 0
        ? portfolio.linkOutros.map(link => `
            <a href="${link}" target="_blank" class="btn btn-sm btn-outline-secondary mb-2">
                🔗 Link Adicional
            </a>
        `).join('')
        : '';
    
    modal.innerHTML = `
        <div class="modal-dialog modal-dialog-scrollable modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5">${portfolio.titulo}</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="mb-4">
                        <div class="d-flex align-items-center gap-3 mb-3">
                            <div class="modal-icon bg-secondary bg-opacity-25 rounded d-flex align-items-center justify-content-center" style="width: 56px; height: 56px;">
                                <img src="assets/img/svg/Hubit_icon_profile.svg" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">
                            </div>
                            <div>
                                <h6 class="mb-1 fw-semibold">${portfolio.usuarioNome || 'Usuário'}</h6>
                                <p class="mb-0 text-muted small">Desenvolvedor</p>
                                <p class="mb-0 text-muted small">Postado em ${dataCriacao}</p>
                            </div>
                        </div>
                    </div>
                    
                    <hr>
                    
                    <div class="mb-4">
                        <h6 class="fw-semibold mb-3">Sobre o Projeto</h6>
                        
                        <div class="d-flex flex-wrap gap-3 mb-3">
                            <span id="modalTxtSvg" class="text-muted small"><span class="me-1"><img src="/assets/img/svg/file-horizontal-svgrepo-com.svg"></span>${portfolio.categoria || 'Sem categoria'}</span>
                            <span id="modalTxtSvg" class="text-muted small"><span class="me-1"><img src="/assets/img/svg/heart-svgrepo-com.svg"></span><span id="curtidas-modal-${portfolio.portfolioID}">${portfolio.curtidas || 0}</span> curtidas</span>
                            <span id="modalTxtSvg" class="text-muted small"><span class="me-1"><img src="/assets/img/svg/calendar-alt-svgrepo-com.svg"></span>${dataCriacao}</span>
                        </div>
                        
                        <h6 class="fw-semibold mb-2">Descrição:</h6>
                        <p class="mb-3">${portfolio.descricao || 'Sem descrição disponível'}</p>
                        
                        <h6 class="fw-semibold mb-2">Tecnologias Utilizadas:</h6>
                        <ul class="list-unstyled mb-3">
                            ${tecnologiasLista}
                        </ul>
                    </div>
                    
                    <hr>
                    
                    <div class="mb-3">
                        <h6 class="fw-semibold mb-3">Links do Projeto</h6>
                        
                        <div class="d-flex flex-wrap gap-2">
                            ${portfolio.linkGithub ? `
                                <a href="${portfolio.linkGithub}" target="_blank" class="btn btn-dark">
                                    <svg width="16" height="16" fill="currentColor" class="me-1" viewBox="0 0 16 16">
                                        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
                                    </svg>
                                    GitHub
                                </a>
                            ` : ''}
                            
                            ${portfolio.linkDemo ? `
                                <a href="${portfolio.linkDemo}" target="_blank" class="btn btn-primary">
                                    🚀 Ver Demo
                                </a>
                            ` : ''}
                            
                            ${linksOutros}
                        </div>
                        
                        ${!portfolio.linkGithub && !portfolio.linkDemo && (!portfolio.linkOutros || portfolio.linkOutros.length === 0) ? `
                            <p class="text-muted small mb-0">Nenhum link disponível</p>
                        ` : ''}
                    </div>
                </div>
                
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                    <button id="btnCurtirModal-${portfolio.portfolioID}" type="button" class="btn ${botaoCurtirClass}" onclick="curtirPortfolio(${portfolio.portfolioID})">
                        <img src="/assets/img/svg/thumbup-svgrepo-com.svg"> ${jaCurtiuEste ? 'Curtido' : 'Curtir Projeto'}
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// ===== SISTEMA DE CURTIDAS =====
function jaCurtiu(portfolioID) {
    const userID = localStorage.getItem('userID');
    const key = `curtiu_${userID}_${portfolioID}`;
    return localStorage.getItem(key) === 'true' || portfoliosCurtidos.has(portfolioID);
}

function marcarComoCurtido(portfolioID) {
    const userID = localStorage.getItem('userID');
    const key = `curtiu_${userID}_${portfolioID}`;
    localStorage.setItem(key, 'true');
    portfoliosCurtidos.add(portfolioID);
}

function removerCurtida(portfolioID) {
    const userID = localStorage.getItem('userID');
    const key = `curtiu_${userID}_${portfolioID}`;
    localStorage.removeItem(key);
    portfoliosCurtidos.delete(portfolioID);
}

async function curtirPortfolio(portfolioID) {
    const userID = localStorage.getItem('userID');
    
    if (!userID) {
        alert('Você precisa fazer login primeiro!');
        return;
    }

    const jaCurtiuEste = jaCurtiu(portfolioID);

    try {
        if (jaCurtiuEste) {
            // Descurtir
            const response = await fetch(`/api/portfolio/${portfolioID}/descurtir`, {
                method: 'DELETE',
                headers: { 'user-id': userID }
            });

            const dados = await response.json();

            if (dados.ok) {
                removerCurtida(portfolioID);
                atualizarUIAposDescurtir(portfolioID);
            } else {
                alert('Erro: ' + dados.error);
            }
        } else {
            // Curtir
            const response = await fetch(`/api/portfolio/${portfolioID}/curtir`, {
                method: 'POST',
                headers: { 'user-id': userID }
            });

            const dados = await response.json();

            if (dados.ok) {
                marcarComoCurtido(portfolioID);
                atualizarUIAposCurtir(portfolioID);
            } else {
                alert('Erro: ' + dados.error);
            }
        }
    } catch (error) {
        console.error('Erro ao processar curtida:', error);
        alert('Erro ao processar curtida. Tente novamente.');
    }
}

function atualizarUIAposCurtir(portfolioID) {
    // Atualizar contador no card
    const contadorCard = document.getElementById(`curtidas-${portfolioID}`);
    if (contadorCard) {
        const currentLikes = parseInt(contadorCard.textContent);
        contadorCard.textContent = currentLikes + 1;
    }
    
    // Atualizar contador no modal
    const contadorModal = document.getElementById(`curtidas-modal-${portfolioID}`);
    if (contadorModal) {
        const currentLikes = parseInt(contadorModal.textContent);
        contadorModal.textContent = currentLikes + 1;
    }
    
    // Atualizar botão no card
    const btnCard = document.getElementById(`btnCurtir-${portfolioID}`);
    if (btnCard) {
        btnCard.classList.remove('btn-outline-danger');
        btnCard.classList.add('btn-secondary');
        btnCard.innerHTML = '<img src="/assets/img/svg/thumbup-svgrepo-com.svg"> Curtido';
    }
    
    // Atualizar botão no modal
    const btnModal = document.getElementById(`btnCurtirModal-${portfolioID}`);
    if (btnModal) {
        btnModal.classList.remove('btn-outline-danger');
        btnModal.classList.add('btn-secondary');
        btnModal.innerHTML = '<img src="/assets/img/svg/thumbup-svgrepo-com.svg"> Curtido';
    }
}

function atualizarUIAposDescurtir(portfolioID) {
    // Atualizar contador no card
    const contadorCard = document.getElementById(`curtidas-${portfolioID}`);
    if (contadorCard) {
        const currentLikes = parseInt(contadorCard.textContent);
        contadorCard.textContent = Math.max(0, currentLikes - 1);
    }
    
    // Atualizar contador no modal
    const contadorModal = document.getElementById(`curtidas-modal-${portfolioID}`);
    if (contadorModal) {
        const currentLikes = parseInt(contadorModal.textContent);
        contadorModal.textContent = Math.max(0, currentLikes - 1);
    }
    
    // Atualizar botão no card
    const btnCard = document.getElementById(`btnCurtir-${portfolioID}`);
    if (btnCard) {
        btnCard.classList.remove('btn-secondary');
        btnCard.classList.add('btn-outline-danger');
        btnCard.innerHTML = '<img src="/assets/img/svg/thumbup-svgrepo-com.svg"> Curtir';
    }
    
    // Atualizar botão no modal
    const btnModal = document.getElementById(`btnCurtirModal-${portfolioID}`);
    if (btnModal) {
        btnModal.classList.remove('btn-secondary');
        btnModal.classList.add('btn-outline-danger');
        btnModal.innerHTML = '<img src="/assets/img/svg/thumbup-svgrepo-com.svg"> Curtir Projeto';
    }
}

// ===== PUBLICAR NOVO PORTFÓLIO =====
async function publicarPortfolio() {
    const userID = localStorage.getItem('userID');
    
    if (!userID) {
        alert('Você precisa estar logado!');
        return;
    }

    // Coletar dados do formulário
    const titulo = document.getElementById('portfolioTitulo').value.trim();
    const descricao = document.getElementById('portfolioDescricao').value.trim();
    const categoria = document.getElementById('portfolioCategoria').value;
    const tecnologiasText = document.getElementById('portfolioTecnologias').value.trim();
    const linkGithub = document.getElementById('portfolioGithub').value.trim();
    const linkDemo = document.getElementById('portfolioDemo').value.trim();
    const linkOutrosText = document.getElementById('portfolioOutros').value.trim();

    // Validações
    if (!titulo) {
        alert('Por favor, preencha o título do projeto!');
        return;
    }

    if (!descricao) {
        alert('Por favor, descreva seu projeto!');
        return;
    }

    if (!categoria) {
        alert('Por favor, selecione uma categoria!');
        return;
    }

    if (!tecnologiasText) {
        alert('Por favor, informe as tecnologias utilizadas!');
        return;
    }

    if (!linkGithub) {
        alert('Por favor, informe o link do GitHub!');
        return;
    }

    if (!linkGithub.includes('github.com')) {
        alert('O link precisa ser do GitHub!');
        return;
    }

    // Processar tecnologias (separar por vírgula)
    const tecnologias = tecnologiasText.split(',').map(t => t.trim()).filter(t => t);

    // Processar links adicionais (separar por vírgula)
    const linkOutros = linkOutrosText 
        ? linkOutrosText.split(',').map(l => l.trim()).filter(l => l)
        : [];

    // Montar objeto do portfólio
    const novoPortfolio = {
        titulo,
        descricao,
        categoria,
        tecnologias,
        linkGithub,
        linkDemo: linkDemo || null,
        linkOutros
    };

    try {
        const response = await fetch('/api/portfolio', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'user-id': userID
            },
            body: JSON.stringify(novoPortfolio)
        });

        const dados = await response.json();

        if (dados.ok) {
            // Fechar o modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('modalNovoPortfolio'));
            if (modal) modal.hide();

            // Limpar o formulário
            document.getElementById('formNovoPortfolio').reset();

            // Mostrar mensagem de sucesso
            alert('🎉 Portfólio publicado com sucesso!');

            // Recarregar os portfólios
            await carregarPortfolios();
        } else {
            alert('Erro ao publicar portfólio: ' + dados.error);
        }
    } catch (error) {
        console.error('Erro ao publicar portfólio:', error);
        alert('Erro ao publicar portfólio. Tente novamente.');
    }
}

function redirecionarPerfil() {
    const userID = localStorage.getItem('userID');
    window.location.href = `/perfil/${userID}`;
    return;
}

// ===== FUNÇÃO DE SAIR =====
function sair() {
    localStorage.clear();
    alert('Você saiu da conta');
    window.location.href = '/';
}