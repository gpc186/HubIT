window.onload = async function () {
    await carregarPortfolio();
};

async function carregarPortfolio(){
    const userID = localStorage.getItem('userID');

    if (!userID) {
        alert('Você precisa fazer login!');
        window.location.href = '/';
        return;
    }

    try {
        // Buscar dados de portfólio do usuário
        const resposta = await fetch(`/api/usuario/${userID}`, {
            method: 'GET',
            headers: { 'user-id': userID }
        });

        const dados = await resposta.json();
        const usuarioAtual = dados.usuario;

        if (!usuarioAtual.dados) {
            alert('Por favor cadastre seus dados');
            return;
        }

        atualizarPerfil(usuarioAtual)

        const respostaPortfolio = await fetch(`/api/portfolio`, {
            method: 'GET',
            headers: { 'user-id': userID }
        });

        const dadosPortfolio = await respostaPortfolio.json();
        console.log(dadosPortfolio.portfolios)
        
        if (dadosPortfolio.ok && dadosPortfolio.portfolios && dadosPortfolio.portfolios.length > 0) {
            const portfolios = dadosPortfolio.portfolios.map((portfolio, index) => ({
                id: portfolio.portfolioID || index + 1,
                userID: portfolio.userID || "",
                usuarioNome: portfolio.usuarioNome || "Usuário não encontrado",
                titulo: portfolio.titulo || '',
                descricao: portfolio.descricao || '',
                tecnologias: Array.isArray(portfolio.tecnologias) ? portfolio.tecnologias.join(', ') : portfolio.tecnologias || '',
                categoria: portfolio.categoria || '',
                linkGithub: portfolio.linkGithub || '',
                linkDemo: portfolio.linkDemo || '',
                linkOutros: portfolio.linkOutros || '',
                dataCriacao: portfolio.dataCriacao || '',
                curtidas: portfolio.curtidas
            }));

            renderizarPortfolios(portfolios);
            console.log(`${portfolios.length} vagas carregadas`);
        } else {
            container.innerHTML = '<div class="loading">:( Nenhum portfólio disponível.</div>';
        }
        atualizarFiltrosAtivos(filtros);

        console.log(dadosPortfolio)

    } catch (error) {
        console.error(' Erro ao carregar página:', error);
    }
}

/*============= INTEGRAR DADOS DE USUARIO =============== */

function atualizarPerfil(usuarioAtual) {
    const mensagemGreeting = document.getElementById('mensagemGreeting');
    const nomePrincipal = document.getElementById('nomePrincipal');
    const nomeGreeting = document.getElementById('nomeSaudacao');
    const nomeLocal = document.getElementById('nomeLocal');
    const areaAtuacao = document.getElementById('areaAtuacao');
    const nivelExperiencia = document.getElementById('nivelExperiencia');

    if (nomePrincipal) nomePrincipal.innerText = usuarioAtual.dados.nome;
    if (nomeGreeting) nomeGreeting.innerText = usuarioAtual.dados.nome;
    if (nomeLocal) nomeLocal.innerText = usuarioAtual.dados.localizacao;
    if (areaAtuacao) areaAtuacao.innerText = usuarioAtual.dados.areaAtuacao;
    if (nivelExperiencia) nivelExperiencia.innerText = usuarioAtual.dados.nivelExperiencia;

    const weatherIconImg = document.getElementById('weatherIconImg');
    // Atualizar mensagem de greeting
    if (mensagemGreeting) {
        const nome = usuarioAtual.dados.nome;
        if (dataHours < 13) {
            weatherIconImg.src = ("assets/img/svg/sun-svgrepo-com.svg")
            mensagemGreeting.innerHTML = `Bom dia, <span style="color:#106083; font-family: Codec;">${nome}!</span> <br> Aqui estão suas oportunidades de hoje`;
        } else if (dataHours < 18) {
            weatherIconImg.src = ("assets/img/svg/partly-cloudy-svgrepo-com.svg") 
            mensagemGreeting.innerHTML = `Boa tarde, <span style="color:#106083; font-family: Codec;">${nome}!</span> <br> Aqui estão suas oportunidades de hoje`;
        } else {
            weatherIconImg.src = ("assets/img/svg/moon-svgrepo-com.svg") 
            mensagemGreeting.innerHTML = `Boa noite, <span style="color:#106083; font-family: Codec;">${nome}!</span> <br> Aqui estão suas oportunidades de hoje`;
        }
    }

    console.log('Perfil carregado com sucesso!');
}

/* ======= CARREGAR INTEGRAÇÃO DE PORTFOLIOS ======== */

async function carregarPortfolios() {
    const container = document.getElementById('empregosContainer');
    
    if (!container) {
        console.error('Container empregosContainer não encontrado!');
        return;
    }

    container.innerHTML = '<div class="loading">Carregando vagas...</div>';

    try {
        const userID = localStorage.getItem('userID');
        
        if (!userID) {
            container.innerHTML = '<div class="loading">Por favor, faça login primeiro.</div>';
            window.location.href = "/"
            return;
        }

        const dadosPortfolio = await response.json();
        console.log(dadosPortfolio.portfolios)
        
        if (dadosPortfolio.ok && dadosPortfolio.portfolios && dadosPortfolio.portfolios.length > 0) {
            const portfolios = dadosPortfolio.portfolios.map((portfolio, index) => ({
                id: portfolio.portfolioID || index + 1,
                titulo: portfolio.titulo || '',
                descricao: portfolio.descricao || '',
                tecnologias: Array.isArray(portfolio.tecnologias) ? portfolio.tecnologias.join(', ') : portfolio.tecnologias || '',
                categoria: portfolio.categoria || '',
                linkGithub: portfolio.linkGithub || '',
                linkDemo: portfolio.linkDemo || '',
                linkOutros: portfolio.linkOutros || '',
                dataCriacao: portfolio.dataCriacao || '',
                curtidas: portfolio.curtidas
            }));

            renderizarPortfolios(portfolios);
            console.log(`${portfolios.length} vagas carregadas`);
        } else {
            container.innerHTML = '<div class="loading">:( Nenhum portfólio disponível.</div>';
        }
        atualizarFiltrosAtivos(filtros);

    } catch (error) {
        console.error(' Erro completo ao carregar portfólios:', error);
        container.innerHTML = `<div class="loading"> Erro ao carregar portfólios: ${error.message}</div>`;
    }
}

/**
 * Armazena os portfólios já curtidos pelo usuário
 */
const portfoliosCurtidos = new Set();

/**
 * Verifica se o usuário já curtiu um portfólio
 */
function jaCurtiu(portfolioID) {
    const userID = localStorage.getItem('userID');
    const key = `curtiu_${userID}_${portfolioID}`;
    return localStorage.getItem(key) === 'true' || portfoliosCurtidos.has(portfolioID);
}

/**
 * Marca um portfólio como curtido
 */
function marcarComoCurtido(portfolioID) {
    const userID = localStorage.getItem('userID');
    const key = `curtiu_${userID}_${portfolioID}`;
    localStorage.setItem(key, 'true');
    portfoliosCurtidos.add(portfolioID);
}

/**
 * Remove a curtida de um portfólio
 */
function removerCurtida(portfolioID) {
    const userID = localStorage.getItem('userID');
    const key = `curtiu_${userID}_${portfolioID}`;
    localStorage.removeItem(key);
    portfoliosCurtidos.delete(portfolioID);
}

/**
 * Renderiza os cards de portfólios na página
 */
function renderizarPortfolios(portfolios) {
    const container = document.getElementById('portfoliosContainer');
    
    if (!container) {
        console.error('Container portfoliosContainer não encontrado!');
        return;
    }
    
    container.innerHTML = '';

    if (!portfolios || portfolios.length === 0) {
        container.innerHTML = '<div class="loading">🔍 Nenhum portfólio encontrado.</div>';
        return;
    }

    portfolios.forEach((portfolio) => {
        const postCard = document.createElement('div');
        postCard.className = 'post-card';
        
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
        const botaoCurtirTexto = jaCurtiuEste ? '✓ Curtido' : '❤️';
        
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
                <span>❤️ ${portfolio.curtidas || 0} curtidas</span>
                <span>📁 ${portfolio.categoria}</span>
            </div>
            <div class="post-actions">
                <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modalPortfolio${portfolio.portfolioID}">
                    Ver Detalhes
                </button>
                <button type="button" class="btn ${botaoCurtirClass}" onclick="curtirPortfolio(${portfolio.portfolioID})">
                    ${botaoCurtirTexto}
                </button>
            </div>
        `;
        
        container.appendChild(postCard);

        // Criar Modal para cada portfólio
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
                        <!-- Informações do Autor -->
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
                        
                        <!-- Detalhes do Projeto -->
                        <div class="mb-4">
                            <h6 class="fw-semibold mb-3">Sobre o Projeto</h6>
                            
                            <div class="d-flex flex-wrap gap-3 mb-3">
                                <span class="text-muted small"><span class="me-1">📁</span>${portfolio.categoria || 'Sem categoria'}</span>
                                <span class="text-muted small"><span class="me-1">❤️</span>${portfolio.curtidas || 0} curtidas</span>
                                <span class="text-muted small"><span class="me-1">📅</span>${dataCriacao}</span>
                            </div>
                            
                            <h6 class="fw-semibold mb-2">Descrição:</h6>
                            <p class="mb-3">${portfolio.descricao || 'Sem descrição disponível'}</p>
                            
                            <h6 class="fw-semibold mb-2">Tecnologias Utilizadas:</h6>
                            <ul class="list-unstyled mb-3">
                                ${tecnologiasLista}
                            </ul>
                        </div>
                        
                        <hr>
                        
                        <!-- Links do Projeto -->
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
                        <button type="button" class="btn ${botaoCurtirClass}" onclick="curtirPortfolio(${portfolio.portfolioID})">
                            ${jaCurtiuEste ? '✓ Curtido' : '❤️ Projeto'}
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    });
}

/**
 * Alterna curtida de um portfólio (curtir/descurtir)
 */
async function curtirPortfolio(portfolioID) {
    const userID = localStorage.getItem('userID');
    
    if (!userID) {
        alert('Você precisa fazer login primeiro!');
        return;
    }

    const jaCurtiuEste = jaCurtiu(portfolioID);

    try {
        // Se já curtiu, remove a curtida
        if (jaCurtiuEste) {
            const response = await fetch(`/api/portfolio/${portfolioID}/descurtir`, {
                method: 'DELETE',
                headers: { 'user-id': userID }
            });

            const dados = await response.json();

            if (dados.ok) {
                // Remover da lista de curtidos
                removerCurtida(portfolioID);
                
                // Atualizar o contador de curtidas na interface
                const engagementSpans = document.querySelectorAll('.post-engagement span');
                engagementSpans.forEach(span => {
                    if (span.textContent.includes('curtidas')) {
                        const currentLikes = parseInt(span.textContent.match(/\d+/)[0]);
                        span.innerHTML = `❤️ ${Math.max(0, currentLikes - 1)} curtidas`;
                    }
                });
                
                // Reabilitar o botão de curtir
                const botoesCurtir = document.querySelectorAll(`button[onclick*="curtirPortfolio(${portfolioID})"]`);
                botoesCurtir.forEach(btn => {
                    btn.classList.remove('btn-secondary');
                    btn.classList.add('btn-outline-danger');
                    btn.innerHTML = btn.innerHTML.includes('Projeto') ? '❤️ Projeto' : '❤️';
                });
                
            } else {
                alert('Erro: ' + dados.error);
            }
        } 
        // Se não curtiu ainda, adiciona a curtida
        else {
            const response = await fetch(`/api/portfolio/${portfolioID}/curtir`, {
                method: 'POST',
                headers: { 'user-id': userID }
            });

            const dados = await response.json();

            if (dados.ok) {
                // Marcar como curtido
                marcarComoCurtido(portfolioID);
                
                // Atualizar o contador de curtidas na interface
                const engagementSpans = document.querySelectorAll('.post-engagement span');
                engagementSpans.forEach(span => {
                    if (span.textContent.includes('curtidas')) {
                        const currentLikes = parseInt(span.textContent.match(/\d+/)[0]);
                        span.innerHTML = `❤️ ${currentLikes + 1} curtidas`;
                    }
                });
                
                // Atualizar visual do botão de curtir
                const botoesCurtir = document.querySelectorAll(`button[onclick*="curtirPortfolio(${portfolioID})"]`);
                botoesCurtir.forEach(btn => {
                    btn.classList.remove('btn-outline-danger');
                    btn.classList.add('btn-secondary');
                    btn.innerHTML = btn.innerHTML.includes('Projeto') ? '✓ Curtido' : '✓ Curtido';
                });
                
            } else {
                alert('Erro: ' + dados.error);
            }
        }
    } catch (error) {
        console.error('Erro ao processar curtida:', error);
        alert('Erro ao processar curtida. Tente novamente.');
    }
}

/**
 * Carrega todos os portfólios da API
 */
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

    container.innerHTML = '<div class="loading">Carregando portfólios...</div>';

    try {
        const response = await fetch('/api/portfolio', {
            method: 'GET',
            headers: { 'user-id': userID }
        });

        if (!response.ok) {
            throw new Error(`Erro ${response.status}: ${await response.text()}`);
        }

        const dados = await response.json();
        
        if (dados.ok && dados.portfolios && dados.portfolios.length > 0) {
            renderizarPortfolios(dados.portfolios);
            console.log(`✅ ${dados.portfolios.length} portfólios carregados`);
        } else {
            container.innerHTML = '<div class="loading">🔍 Nenhum portfólio encontrado.</div>';
        }

    } catch (error) {
        console.error('❌ Erro ao carregar portfólios:', error);
        container.innerHTML = `<div class="loading">❌ Erro ao carregar portfólios: ${error.message}</div>`;
    }
}

// Carregar portfólios quando a página carregar
window.onload = function() {
    carregarPortfolios();
};