// === CONFIGURAÇÕES ===
const API_URL = 'http://localhost:3000/api/emprego';
const dataNow = new Date();
const dataHours = dataNow.getHours();

// === INICIALIZAÇÃO ===
window.onload = async function () {
    await carregarPagina();
    inicializarFiltros();
};

// === FUNÇÕES DE PERFIL ===

/**
 * Carrega a página completa (perfil + empregos)
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
            return;
        }

        // Atualizar informações do perfil
        atualizarPerfil(usuarioAtual);

        // Carregar empregos
        await carregarEmpregos();

    } catch (error) {
        console.error('❌ Erro ao carregar página:', error);
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

    // Atualizar mensagem de greeting
    if (mensagemGreeting) {
        const nome = usuarioAtual.dados.nome;
        if (dataHours < 13) {
            mensagemGreeting.innerHTML = `Bom dia, <span style="color:#106083">${nome}!</span> <br> Aqui estão suas oportunidades de hoje`;
        } else if (dataHours < 18) {
            mensagemGreeting.innerHTML = `Boa tarde, <span style="color:#106083">${nome}!</span> <br> Aqui estão suas oportunidades de hoje`;
        } else {
            mensagemGreeting.innerHTML = `Boa noite, <span style="color:#106083">${nome}!</span> <br> Aqui estão suas oportunidades de hoje`;
        }
    }

    console.log('✅ Perfil carregado com sucesso!');
}

// === FUNÇÕES DE FILTROS ===

/**
 * Inicializa os event listeners dos filtros
 */
function inicializarFiltros() {
    const filtroInputs = document.querySelectorAll('#filtroArea, #filtroLocalizacao, #filtroContrato, #filtroTrabalho, #salarioMin, #salarioMax');
    
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

    container.innerHTML = '<div class="loading">Carregando vagas...</div>';

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

        const url = params.toString() ? `${API_URL}?${params.toString()}` : API_URL;

        const response = await fetch(url, {
            headers: { 'user-id': userID }
        });

        if (!response.ok) {
            throw new Error('Erro ao carregar empregos');
        }

        const dadosEmprego = await response.json();
        
        if (dadosEmprego.ok && dadosEmprego.empregos && dadosEmprego.empregos.length > 0) {
            // Mapear dados da API para o formato esperado
            const propostas = dadosEmprego.empregos.map((emprego, index) => ({
                id: emprego.empregoID || index + 1,
                empresa: emprego.empresaNome || "Empresa",
                vaga: emprego.titulo || "Vaga",
                tempo: emprego.tempo || "Recente",
                descricao: emprego.descricao || "Descrição não disponível",
                requisitos: Array.isArray(emprego.requisitos) ? emprego.requisitos.join(', ') : emprego.requisitos || "Sem requisitos",
                salario: emprego.mediaSalario ? `R$${emprego.mediaSalario}/Mês` : "Sem proposta de salário",
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
                nivel: emprego.nivel || ""
            }));

            renderizarPropostas(propostas);
            console.log(`✅ ${propostas.length} vagas carregadas`);
        } else {
            container.innerHTML = '<div class="loading">🔍 Nenhuma vaga encontrada.</div>';
        }
        
        atualizarFiltrosAtivos(filtros);

    } catch (error) {
        console.error('❌ Erro ao carregar empregos:', error);
        container.innerHTML = '<div class="loading">❌ Erro ao carregar vagas. Tente novamente.</div>';
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
    
    container.innerHTML = ''; // Limpa o container

    if (!propostas || propostas.length === 0) {
        container.innerHTML = '<div class="loading">🔍 Nenhuma vaga encontrada com esses filtros.</div>';
        return;
    }

    propostas.forEach((proposta) => {
        const postCard = document.createElement('div');
        postCard.className = 'post-card';
        
        postCard.innerHTML = `
            <div class="post-header">
                <div class="post-avatar"><img src="${proposta.imgEmpresa}" onerror="this.src='https://via.placeholder.com/60'"></div>
                <div class="post-user-info">
                    <div class="post-user-name">${proposta.empresa}</div>
                    <div class="post-user-headline">${proposta.vaga} | ${proposta.nivel}</div>
                    <div class="post-time">${proposta.candidatos} Candidatos</div>
                </div>
            </div>
            <div class="post-content">
                ${proposta.descricao}
            </div>
            <div class="post-engagement">
                <span>Criado em ${proposta.dataCriacao}</span>
                <span>Status: ${proposta.status}</span>
            </div>
            <div class="post-actions">
                <div class="new-button">Oportunidade nova!</div>
                <button type="button" id="jobBtn" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modalVagaEmprego${proposta.id}">Saber mais</button>
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
                        <h1 class="modal-title fs-5" id="modalVagaEmpregoLabel${proposta.id}">${proposta.empresa}</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-4">
                            <div class="d-flex align-items-center gap-3 mb-3">
                                <div class="modal-icon bg-secondary bg-opacity-25 rounded d-flex align-items-center justify-content-center" style="width: 56px; height: 56px; font-size: 24px;">
                                    <img src="${proposta.imgEmpresa}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;" onerror="this.src='https://via.placeholder.com/56'">
                                </div>
                                <div>
                                    <h6 class="mb-1 fw-semibold">${proposta.empresa}</h6>
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
                                <span class="text-muted small"><span class="me-1">💼</span>Tempo Integral</span>
                                <span class="text-muted small"><span class="me-1">📍</span>${proposta.tipoTrabalho}</span>
                                <span class="text-muted small"><span class="me-1">📝</span>${proposta.tipoContrato}</span>
                                <span class="text-muted small"><span class="me-1">⏰</span>Publicada há ${proposta.tempo}</span>
                            </div>
                            <div class="d-flex flex-wrap gap-3 mb-3">
                                <h6 class="fw-semibold mb-3">Pretensão salarial: ${proposta.salario}</h6>
                            </div>
                            <h6>Descrição:</h6>
                            <p class="mb-3">${proposta.descricao}</p>
                            <h6 class="fw-semibold mb-2" style="font-size: 14px;">Requisitos:</h6>
                            <ul class="list-unstyled">
                                <li class="mb-2"><span class="text-primary fw-bold me-2">•</span>${proposta.requisitos}</li>
                            </ul>
                            <h6 class="fw-semibold mb-2" style="font-size: 14px;">Diferenciais:</h6>
                            <ul class="list-unstyled">
                                <li class="mb-2"><span class="text-primary fw-bold me-2">•</span>${proposta.diferenciais}</li>
                            </ul>
                            <h6 class="fw-semibold mb-2" style="font-size: 14px;">Benefícios:</h6>
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
                                    <option value="" selected>Escolha um currículo</option>
                                    <option value="principal">Currículo Principal</option>
                                    <option value="tech">Currículo Tech</option>
                                    <option value="gerencial">Currículo Gerencial</option>
                                </select>
                                <div class="form-text">Você pode gerenciar seus currículos nas configurações do perfil</div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                        <button type="button" style="background-color: #2F6D88;" class="btn btn-primary">Enviar</button>
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

    if (area && area.value) filtros.area = area.value;
    if (localizacao && localizacao.value.trim()) filtros.localizacao = localizacao.value.trim();
    if (contrato && contrato.value) filtros.tipoContrato = contrato.value;
    if (trabalho && trabalho.value) filtros.tipoTrabalho = trabalho.value;
    if (salMin && salMin.value) filtros.salarioMin = salMin.value;
    if (salMax && salMax.value) filtros.salarioMax = salMax.value;

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

    if (area) area.value = '';
    if (localizacao) localizacao.value = '';
    if (contrato) contrato.value = '';
    if (trabalho) trabalho.value = '';
    if (salMin) salMin.value = '';
    if (salMax) salMax.value = '';
    
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

/**
 * Função de sair
 */
function sair() {
    localStorage.clear();
    alert('Você saiu da conta');
    window.location.href = '/';
}