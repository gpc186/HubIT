// === CONFIGURAÇÕES ===
const dataNow = new Date();
const dataHours = dataNow.getHours();

// Variável global para armazenar currículos
let curriculosUsuario = [];

// === SISTEMA DE PESQUISA ===
let empregosCacheados = []; // Cache dos empregos para pesquisa
let filtrosAtuais = {}; // Armazena os filtros aplicados

function mostrarSkeletonsVagas(quantidade = 5) {
    const container = document.getElementById('empregosContainer');
    if (!container) return;

    let html = '';
    for (let i = 0; i < quantidade; i++) {
        html += `
            <div class="card skeleton-card placeholder-glow">
                <div class="d-flex gap-3 mb-3">
                    <div class="placeholder rounded-circle bg-secondary" style="width: 50px; height: 50px;"></div>
                    <div class="flex-grow-1">
                        <div class="placeholder col-6 mb-2"></div>
                        <div class="placeholder col-4"></div>
                    </div>
                </div>
                <div class="placeholder col-12 mb-2"></div>
                <div class="placeholder col-10 mb-2"></div>
                <div class="placeholder col-8 mb-3"></div>
                <div class="d-flex gap-2 mb-3">
                    <span class="placeholder col-2 rounded-pill"></span>
                    <span class="placeholder col-2 rounded-pill"></span>
                    <span class="placeholder col-2 rounded-pill"></span>
                </div>
                <div class="d-flex justify-content-between align-items-center border-top pt-3">
                    <div class="placeholder col-3"></div>
                    <div class="placeholder col-3 rounded"></div>
                </div>
            </div>
        `;
    }
    container.innerHTML = html;
}

/**
 * Inicializa o sistema de pesquisa
 */
function inicializarPesquisa() {
    const searchInput = document.querySelector('.search input[type="search"]');
    const searchButton = document.querySelector('.search img');

    if (!searchInput) {
        console.warn('Campo de pesquisa não encontrado');
        return;
    }

    // Evento ao pressionar Enter
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            realizarPesquisa();
        }
    });

    // Evento ao clicar no ícone de pesquisa
    if (searchButton) {
        searchButton.style.cursor = 'pointer';
        searchButton.addEventListener('click', realizarPesquisa);
    }

    // Pesquisa em tempo real (opcional)
    searchInput.addEventListener('input', debounce(realizarPesquisa, 500));
}

/**
 * Função debounce para evitar muitas chamadas
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Realiza a pesquisa nos empregos
 */
async function realizarPesquisa() {
    const searchInput = document.querySelector('.search input[type="search"]');
    const termoPesquisa = searchInput ? searchInput.value.trim().toLowerCase() : '';

    console.log('🔍 Pesquisando por:', termoPesquisa);

    if (!termoPesquisa) {
        // Se não há termo de pesquisa, recarrega todos os empregos
        await carregarEmpregos(filtrosAtuais);
        return;
    }

    // Se o cache está vazio, carrega os empregos primeiro
    if (empregosCacheados.length === 0) {
        await carregarEmpregos(filtrosAtuais);
    }

    // Filtra os empregos baseado no termo de pesquisa
    const resultadosFiltrados = empregosCacheados.filter(emprego => {
        const titulo = (emprego.titulo || '').toLowerCase();
        const empresa = (emprego.empresaNome || '').toLowerCase();
        const descricao = (emprego.descricao || '').toLowerCase();
        const localizacao = (emprego.localizacao || '').toLowerCase();
        const area = (emprego.area || '').toLowerCase();
        const requisitos = Array.isArray(emprego.requisitos)
            ? emprego.requisitos.join(' ').toLowerCase()
            : (emprego.requisitos || '').toLowerCase();

        return (
            titulo.includes(termoPesquisa) ||
            empresa.includes(termoPesquisa) ||
            descricao.includes(termoPesquisa) ||
            localizacao.includes(termoPesquisa) ||
            area.includes(termoPesquisa) ||
            requisitos.includes(termoPesquisa)
        );
    });

    console.log(`✅ Encontrados ${resultadosFiltrados.length} empregos`);

    // Renderiza os resultados
    const container = document.getElementById('empregosContainer');
    if (resultadosFiltrados.length === 0) {
        container.innerHTML = `
            <div class="loading" style="text-align: center; padding: 40px;">
                <h3>🔍 Nenhum resultado encontrado para "${termoPesquisa}"</h3>
                <p style="color: #666; margin-top: 10px;">Tente usar palavras-chave diferentes ou filtros mais amplos.</p>
            </div>
        `;
    } else {
        renderizarPropostas(resultadosFiltrados);
    }
}

/**
 * Função para ordenar empregos por data (mais recente primeiro)
 */
function ordenarEmpregoPorData(empregos) {
    return empregos.sort((a, b) => {
        // Converte as datas para timestamp
        const dataA = converterDataParaTimestamp(a.dataCriacao);
        const dataB = converterDataParaTimestamp(b.dataCriacao);

        // Ordem decrescente (mais recente primeiro)
        return dataB - dataA;
    });
}

// === FUNÇÕES DE PERFIL ===

/**
 * Carrega a página completa (perfil + empregos + currículos)
 */
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
        const usuarioAtual = dados.usuario;

        if (!usuarioAtual.dados) {
            alert('Por favor cadastre seus dados');
            window.location.href = '/'
            return;
        }

        if (usuarioAtual.tipoConta === "empresa") {
            alert("Você não pode ver empregos! XD")
            window.location.href = '/'
            return;
        }

        // Atualizar informações do perfil
        atualizarPerfil(usuarioAtual);

        // Carregar currículos do usuário
        await carregarCurriculosUsuario();

        // Carregar empregos
        await carregarEmpregos();

    } catch (error) {
        console.error(' Erro ao carregar página:', error);
    }
}

/**
 * Atualiza as informações do perfil na interface
 */
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

// === FUNÇÕES DE CURRÍCULOS ===

/**
 * Carrega os currículos do usuário
 */
async function carregarCurriculosUsuario() {
    const userID = localStorage.getItem('userID');

    if (!userID) return;

    try {
        const resposta = await fetch('/api/curriculo', {
            method: 'GET',
            headers: { 'user-id': userID }
        });

        if (resposta.ok) {
            const dados = await resposta.json();

            if (dados.ok && dados.curriculos) {
                curriculosUsuario = dados.curriculos;
                console.log(`${curriculosUsuario.length} currículos carregados`);
            } else {
                curriculosUsuario = [];
                console.log('Nenhum currículo encontrado');
            }
        } else {
            curriculosUsuario = [];
            console.log('Erro ao carregar currículos');
        }
    } catch (error) {
        console.error('Erro ao carregar currículos:', error);
        curriculosUsuario = [];
    }
}

/**
 * Preenche o select de currículos no modal
 */
function preencherSelectCurriculos(empregoID) {
    const select = document.getElementById(`curriculoSelect${empregoID}`);

    if (!select) {
        console.error('Select não encontrado para emprego:', empregoID);
        return;
    }

    // Limpa opções existentes, deixando apenas a opção padrão 
    select.innerHTML = '<option value="" selected>Escolha um currículo</option>';

    // Verifica se há currículos
    if (!curriculosUsuario || curriculosUsuario.length === 0) {
        select.innerHTML = '<option value="" selected disabled>Você não possui currículos cadastrados</option>';

        // Adiciona mensagem informativa no modal
        const selectContainer = select.parentElement;
        let avisoDiv = selectContainer.querySelector('.aviso-sem-curriculo');

        if (!avisoDiv) {
            avisoDiv = document.createElement('div');
            avisoDiv.className = 'aviso-sem-curriculo alert alert-warning mt-2';
            avisoDiv.innerHTML = `
                <small>
                    <strong>Você precisa criar um currículo primeiro!</strong><br>
                    Vá para <a href="/configuracoes-perfil.html" class="alert-link">Configurações de Perfil</a> 
                    para criar seu currículo.
                </small>
            `;
            selectContainer.appendChild(avisoDiv);
        }

        return;
    }

    // Adiciona os currículos como opções
    curriculosUsuario.forEach(curriculo => {
        const option = document.createElement('option');
        option.value = curriculo.curriculoID;

        // Monta descrição da opção
        let descricao = curriculo.titulo;

        if (curriculo.experiencias && curriculo.experiencias.length > 0) {
            descricao += ` (${curriculo.experiencias.length} exp.)`;
        }

        option.textContent = descricao;
        select.appendChild(option);
    });

    console.log(`Select preenchido com ${curriculosUsuario.length} currículos`);
}

/**
 * Envia candidatura para a vaga
 */
async function enviarCandidatura(empregoID) {
    const userID = localStorage.getItem('userID');
    const select = document.getElementById(`curriculoSelect${empregoID}`);
    const curriculoID = select ? select.value : null;

    if (!curriculoID) {
        alert('Por favor, selecione um currículo!');
        return;
    }

    try {
        const resposta = await fetch('/api/candidatura', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'user-id': userID
            },
            body: JSON.stringify({
                empregoID: empregoID,
                curriculoID: curriculoID
            })
        });

        const dados = await resposta.json();

        if (dados.ok) {
            // Fecha o modal
            const modal = bootstrap.Modal.getInstance(document.getElementById(`modalVagaEmprego${empregoID}`));
            if (modal) modal.hide();

            // Mostra mensagem de sucesso
            alert('Candidatura enviada com sucesso!');

            // Confete de celebração após enviar curriculo
            if (typeof confetti !== 'undefined') {
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 }
                });
            }
        } else {
            alert('Erro: ' + dados.error);
        }
    } catch (error) {
        console.error('Erro ao enviar candidatura:', error);
        alert('Erro ao enviar candidatura. Tente novamente.');
    }
}

// === FUNÇÕES DE FILTROS ===

/**
 * Inicializa os event listeners dos filtros
 */
function inicializarFiltros() {
    const filtroInputs = document.querySelectorAll('#filtroArea, #filtroLocalizacao, #filtroContrato, #filtroTrabalho, #salarioMin, #salarioMax, #filtroNivelEx');

    filtroInputs.forEach(element => {
        if (element) {
            element.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    aplicarFiltros();
                }
            });
        }
    });
}



/**
 * Carrega os empregos da API com ou sem filtros
 */
async function carregarEmpregos(filtros = {}) {
    const container = document.getElementById('empregosContainer');

    if (!container) {
        console.error('Container empregosContainer não encontrado!');
        return;
    }

    mostrarSkeletonsVagas(5);

    try {
        const userID = localStorage.getItem('userID');

        if (!userID) {
            container.innerHTML = '<div class="loading">Por favor, faça login primeiro.</div>';
            return;
        }

        // Construir query string com os filtros
        const params = new URLSearchParams();
        if (filtros.area) params.append('area', filtros.area);
        if (filtros.localizacao) params.append('localizacao', filtros.localizacao);
        if (filtros.tipoContrato) params.append('tipoContrato', filtros.tipoContrato);
        if (filtros.tipoTrabalho) params.append('tipoTrabalho', filtros.tipoTrabalho);
        if (filtros.salarioMin) params.append('salarioMin', filtros.salarioMin);
        if (filtros.salarioMax) params.append('salarioMax', filtros.salarioMax);
        if (filtros.nivel) params.append('nivel', filtros.nivel);

        const url = params.toString() ? `/api/emprego?${params.toString()}` : '/api/emprego';

        const response = await fetch(url, {
            headers: { 'user-id': userID }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Erro ${response.status}: ${errorText}`);
        }

        const dadosEmprego = await response.json();

        if (dadosEmprego.ok && dadosEmprego.empregos && dadosEmprego.empregos.length > 0) {
            const propostas = dadosEmprego.empregos.map((emprego, index) => ({
                id: emprego.empregoID || index + 1,
                empresa: emprego.empresaNome || "Empresa",
                vaga: emprego.titulo || "Vaga",
                tempo: emprego.tempo || "Recente",
                descricao: emprego.descricao || "Descrição não disponível",
                requisitos: Array.isArray(emprego.requisitos) ? emprego.requisitos.join(', ') : emprego.requisitos || "Sem requisitos",
                salario: emprego.mediaSalario ? `R$ ${emprego.mediaSalario}/Mês` : "Sem proposta de salário",
                localizacao: emprego.localizacao || "Sem localização",
                beneficios: Array.isArray(emprego.beneficios) ? emprego.beneficios.join(', ') : emprego.beneficios || "Sem beneficios",
                tipoTrabalho: emprego.tipoTrabalho || "O contratador não definiu o tipo de trabalho",
                tipoContrato: emprego.tipoContrato || "O contratador não definiu o tipo de contrato",
                area: emprego.area || "",
                diferenciais: Array.isArray(emprego.diferenciais) ? emprego.diferenciais.join(', ') : emprego.diferenciais || "",
                qtdFuncionario: emprego.qtdFuncionario ? `${emprego.qtdFuncionario}+` : "Nenhum funcionário",
                imgEmpresa: emprego.imgEmpresa || "https://via.placeholder.com/60",
                dataCriacao: emprego.dataCriacao || "",
                status: emprego.status || "",
                candidatos: emprego.candidatos || "0",
                nivel: emprego.nivel || "",
                corDestaque: emprego.corDestaque || "#000000ff"
            }));

            console.log(dadosEmprego)

            renderizarPropostas(propostas);
            console.log(`${propostas.length} vagas carregadas`);
            empregosCacheados = propostas; // Atualiza o cache global com os empregos carregados
        } else {
            container.innerHTML = '<div class="loading">:( Nenhuma vaga encontrada.</div>';
        }

        atualizarFiltrosAtivos(filtros);

    } catch (error) {
        console.error(' Erro completo ao carregar empregos:', error);
        container.innerHTML = `<div class="loading"> Erro ao carregar vagas: ${error.message}</div>`;
    }
}

/**
 * Renderiza as propostas de emprego
 */
function renderizarPropostas(propostas) {
    const container = document.getElementById('empregosContainer');

    if (!container) {
        console.error('Container empregosContainer não encontrado!');
        return;
    }

    container.innerHTML = '';

    if (!propostas || propostas.length === 0) {
        container.innerHTML = '<div class="loading">🔍 Nenhuma vaga encontrada com esses filtros.</div>';
        return;
    }

    propostas.forEach((proposta) => {
        const postCard = document.createElement('div');
        postCard.className = 'post-card fade-in-content';

        postCard.innerHTML = `
            <div class="post-header">
                <div class="post-avatar"><img src="${proposta.imgEmpresa}" onerror="this.src='https://via.placeholder.com/60'"></div>
                <div class="post-user-info">
                    <div class="post-user-name" style="color: ${proposta.corDestaque};">${proposta.empresa}</div>
                    <div class="post-user-headline">${proposta.vaga} | ${proposta.nivel}</div>
                    <div class="post-time">${proposta.candidatos} Candidatos</div>
                </div>
            </div>
            <div class="post-content">
                ${proposta.descricao}
            </div>
            <div class="post-engagement">
                <span>Criado em ${formatarDataBR(proposta.dataCriacao)}</span>
                <span>Status: ${proposta.status}</span>
            </div>
            <div class="post-actions">
            ${(() => {
                const ts = converterDataParaTimestamp(proposta.dataCriacao);
                const diffDias = (Date.now() - ts) / (1000 * 60 * 60 * 24);
                return (ts && diffDias <= 2) ? '<div class="new-button">Oportunidade nova!</div>' : '';
            })()}
                <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modalVagaEmprego${proposta.id}" onclick="preencherSelectCurriculos(${proposta.id})">Saber mais</button>
            </div>
        `;

        container.appendChild(postCard);

        // Criar Modal para cada proposta
        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.id = `modalVagaEmprego${proposta.id}`;
        modal.setAttribute('tabindex', '-1');
        modal.setAttribute('aria-hidden', 'true');

        modal.innerHTML = `
            <div class="modal-dialog modal-dialog-scrollable">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" style="color: ${proposta.corDestaque};">${proposta.empresa}</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-4">
                            <div class="d-flex align-items-center gap-3 mb-3">
                                <div class="modal-icon bg-secondary bg-opacity-25 rounded d-flex align-items-center justify-content-center" style="width: 56px; height: 56px;">
                                    <img src="${proposta.imgEmpresa}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;" onerror="this.src='https://via.placeholder.com/56'">
                                </div>
                                <div>
                                    <h6 class="mb-1 fw-semibold" style="color: ${proposta.corDestaque};">${proposta.empresa}</h6>
                                    <p class="mb-0 text-muted small">${proposta.localizacao} • ${proposta.qtdFuncionario} funcionários</p>
                                    <p class="mb-0 text-muted small">${proposta.area}</p>
                                </div>
                            </div>
                        </div>
                        <hr>
                        <div class="mb-4">
                            <h6 class="fw-semibold mb-3">Sobre a Vaga</h6>
                            <h5 class="mb-3">${proposta.vaga}</h5>
                            <div class="d-flex flex-wrap gap-3 mb-3">
                                <span id="modalTxtSvg" class="text-muted small"><span class="me-1"><img src="/assets/img/svg/hourglass-svgrepo-com.svg"></span>Tempo Integral</span>
                                <span id="modalTxtSvg" class="text-muted small"><span class="me-1"><img src="/assets/img/svg/id-card-svgrepo-com.svg"></span>${proposta.nivel}</span>
                                <span id="modalTxtSvg" class="text-muted small"><span class="me-1"><img src="/assets/img/svg/location-pin-svgrepo-com.svg"></span>${proposta.tipoTrabalho}</span>
                                <span id="modalTxtSvg" class="text-muted small"><span class="me-1"><img src="/assets/img/svg/file-contract-svgrepo-com.svg"></span>${proposta.tipoContrato}</span>
                            </div>
                            <div class="d-flex flex-wrap gap-3 mb-3">
                                <h6 class="fw-semibold mb-3">Pretensão salarial: ${proposta.salario}</h6>
                            </div>
                            <h6>Descrição:</h6>
                            <p class="mb-3">${proposta.descricao}</p>
                            <h6 class="fw-semibold mb-2">Requisitos:</h6>
                            <ul class="list-unstyled">
                                <li class="mb-2"><span class="text-primary fw-bold me-2">•</span>${proposta.requisitos}</li>
                            </ul>
                            <h6 class="fw-semibold mb-2">Diferenciais:</h6>
                            <ul class="list-unstyled">
                                <li class="mb-2"><span class="text-primary fw-bold me-2">•</span>${proposta.diferenciais}</li>
                            </ul>
                            <h6 class="fw-semibold mb-2">Benefícios:</h6>
                            <ul class="list-unstyled">
                                <li class="mb-2"><span class="text-primary fw-bold me-2">•</span>${proposta.beneficios}</li>
                            </ul>
                        </div>
                        <hr>
                        <div>
                            <h6 class="fw-semibold mb-3">Candidatura</h6>
                            <div class="mb-3">
                                <label for="curriculoSelect${proposta.id}" class="form-label fw-semibold">
                                    Selecione o currículo para esta vaga <span class="text-danger">*</span>
                                </label>
                                <select class="form-select" id="curriculoSelect${proposta.id}" required>
                                    <option value="" selected>Carregando currículos...</option>
                                </select>
                                <div class="form-text">Você pode gerenciar seus currículos em Configurações de Perfil</div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                        <button type="button" style="background-color: ${proposta.corDestaque}; border-color: ${proposta.corDestaque};" class="btn btn-primary" onclick="enviarCandidatura(${proposta.id})">Enviar Candidatura</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    });
}

/**
 * Coleta os valores dos filtros e aplica
 */
function aplicarFiltros() {
    const filtros = {};

    const area = document.getElementById('filtroArea');
    const localizacao = document.getElementById('filtroLocalizacao');
    const contrato = document.getElementById('filtroContrato');
    const trabalho = document.getElementById('filtroTrabalho');
    const salMin = document.getElementById('salarioMin');
    const salMax = document.getElementById('salarioMax');
    const nivel = document.getElementById('filtroNivelEx');

    if (area && area.value) filtros.area = area.value;
    if (localizacao && localizacao.value.trim()) filtros.localizacao = localizacao.value.trim();
    if (contrato && contrato.value) filtros.tipoContrato = contrato.value;
    if (trabalho && trabalho.value) filtros.tipoTrabalho = trabalho.value;
    if (salMin && salMin.value) filtros.salarioMin = salMin.value;
    if (salMax && salMax.value) filtros.salarioMax = salMax.value;
    if (nivel && nivel.value) filtros.nivel = nivel.value;

    console.log('Filtros aplicados:', filtros);
    carregarEmpregos(filtros);
}

/**
 * Limpa todos os filtros e recarrega os empregos
 */
function limparFiltros() {
    const area = document.getElementById('filtroArea');
    const localizacao = document.getElementById('filtroLocalizacao');
    const contrato = document.getElementById('filtroContrato');
    const trabalho = document.getElementById('filtroTrabalho');
    const salMin = document.getElementById('salarioMin');
    const salMax = document.getElementById('salarioMax');
    const nivel = document.getElementById('filtroNivelEx');

    if (area) area.value = '';
    if (localizacao) localizacao.value = '';
    if (contrato) contrato.value = '';
    if (trabalho) trabalho.value = '';
    if (salMin) salMin.value = '';
    if (salMax) salMax.value = '';
    if (nivel) nivel.value = '';

    carregarEmpregos();
}

/**
 * Atualiza a exibição dos filtros ativos
 */
function atualizarFiltrosAtivos(filtros) {
    const container = document.getElementById('activeFiltros');

    if (!container) return;

    if (Object.keys(filtros).length === 0) {
        container.innerHTML = '';
        return;
    }

    const labels = {
        area: 'Área',
        localizacao: 'Localização',
        nivel: 'Nível',
        tipoContrato: 'Contrato',
        tipoTrabalho: 'Trabalho',
        salarioMin: 'Salário mín',
        salarioMax: 'Salário máx'
    };

    container.innerHTML = Object.entries(filtros).map(([key, value]) => `
        <div class="filter-tag">
            ${labels[key]}: ${key.includes('salario') ? 'R$ ' + parseInt(value).toLocaleString('pt-BR') : value}
            <button onclick="removerFiltro('${key}')">×</button>
        </div>
    `).join('');
}

/**
 * Remove um filtro específico
 */
function removerFiltro(key) {
    const inputs = {
        area: 'filtroArea',
        localizacao: 'filtroLocalizacao',
        nivel: 'filtroNivelEx',
        tipoContrato: 'filtroContrato',
        tipoTrabalho: 'filtroTrabalho',
        salarioMin: 'salarioMin',
        salarioMax: 'salarioMax'
    };

    const elemento = document.getElementById(inputs[key]);
    if (elemento) {
        elemento.value = '';
    }

    aplicarFiltros();
}

function redirecionarPerfil() {
    const userID = localStorage.getItem('userID');
    window.location.href = `/perfil/${userID}`;
    return;
}

/**
 * Função de sair
 */
function sair() {
    localStorage.clear();
    alert('Você saiu da conta');
    window.location.href = '/';
}

// === INICIALIZAÇÃO ===
window.onload = async function () {
    await carregarPagina();
    inicializarFiltros();
    inicializarPesquisa();
};