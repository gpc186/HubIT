// === CONFIGURAÇÕES ===
const API_URL = 'http://localhost:3000/api/emprego';
const dataNow = new Date();
const dataHours = dataNow.getHours();

// Variável global para armazenar currículos
let curriculosUsuario = [];

// === INICIALIZAÇÃO ===
window.onload = async function () {
    await carregarPagina();
    inicializarFiltros();
};

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
        if (filtros.nivel) params.append('nivel', filtros.nivel);

        const url = params.toString() ? `${API_URL}?${params.toString()}` : API_URL;

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
                nivel: emprego.nivel || ""
            }));

            console.log(dadosEmprego)

            renderizarPropostas(propostas);
            console.log(`${propostas.length} vagas carregadas`);
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
                        <h1 class="modal-title fs-5">${proposta.empresa}</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-4">
                            <div class="d-flex align-items-center gap-3 mb-3">
                                <div class="modal-icon bg-secondary bg-opacity-25 rounded d-flex align-items-center justify-content-center" style="width: 56px; height: 56px;">
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
                                <span class="text-muted small"><span class="me-1">📊</span>${proposta.nivel}</span>
                                <span class="text-muted small"><span class="me-1">📍</span>${proposta.tipoTrabalho}</span>
                                <span class="text-muted small"><span class="me-1">📝</span>${proposta.tipoContrato}</span>
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
                        <button type="button" style="background-color: #2F6D88;" class="btn btn-primary" onclick="enviarCandidatura(${proposta.id})">Enviar Candidatura</button>
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