const dataNow = new Date();
const dataHours = dataNow.getHours();

const mensagemGreeting = document.getElementById('mensagemGreeting');

window.onload = async function () {
    await carregarPagina();
};

// Função para renderizar as propostas
function renderizarPropostas(propostas) {
    const container = document.getElementById('empregosContainer');
    
    if (!container) {
        console.error('Container empregosContainer não encontrado!');
        return;
    }
    
    container.innerHTML = ''; // Limpa o container

    propostas.forEach((proposta) => {
        const postCard = document.createElement('div');
        postCard.className = 'post-card';
        console.log(proposta)
        
        postCard.innerHTML = `
            <div class="post-header">
                <div class="post-avatar"></div>
                <div class="post-user-info">
                    <div class="post-user-name">${proposta.empresa}</div>
                    <div class="post-user-headline">${proposta.vaga}</div>
                    <div class="post-time">${proposta.tempo}</div>
                </div>
            </div>
            <div class="post-content">
                ${proposta.descricao}
            </div>
            <div class="post-engagement">
                <span>👍 ${proposta.curtidas} pessoas</span>
                <span>${proposta.comentarios} comentários</span>
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
                        <!-- Informações da Empresa -->
                        <div class="mb-4">
                            <div class="d-flex align-items-center gap-3 mb-3">
                                <div class="bg-secondary bg-opacity-25 rounded d-flex align-items-center justify-content-center" style="width: 56px; height: 56px; font-size: 24px;">
                                    🏢
                                </div>
                                <div>
                                    <h6 class="mb-1 fw-semibold">${proposta.empresa}</h6>
                                    <p class="mb-0 text-muted small">${proposta.localizacao} • 500+ funcionários</p>
                                    <p class="mb-0 text-muted small">${proposta.area} </p>
                                </div>
                            </div>
                        </div>

                        <hr>

                        <!-- Especificações da Vaga -->
                        <div class="mb-4">
                            <h6 class="fw-semibold mb-3">Sobre a Vaga</h6>
                            
                            <h5 class="mb-3">${proposta.vaga}</h5>
                            
                            <div class="d-flex flex-wrap gap-3 mb-3">
                                <span class="text-muted small">
                                    <span class="me-1">💼</span>Tempo Integral
                                </span>
                                <span class="text-muted small">
                                    <span class="me-1">📍</span>${proposta.tipoTrabalho}
                                </span>
                                <span class="text-muted small">
                                    <span class="me-1">📝</span>${proposta.tipoContrato}
                                </span>
                                <span class="text-muted small">
                                    <span class="me-1">⏰</span>Publicada há ${proposta.tempo}
                                </span>
                                
                            </div>

                            <div class="d-flex flex-wrap gap-3 mb-3">
                            <h6 class="fw-semibold mb-3">Pretensão salarial: ${proposta.salario}</h6>
                            </div>

                            <h6>Descrição: </h6>
                            <p class="mb-3">
                                ${proposta.descricao}
                            </p>

                            <h6 class="fw-semibold mb-2" style="font-size: 14px;">Requisitos:</h6>
                            <ul class="list-unstyled">
                                <li class="mb-2">
                                    <span class="text-primary fw-bold me-2">•</span>
                                    ${proposta.requisitos}  
                                </li>
                            </ul>

                            <h6 class="fw-semibold mb-2" style="font-size: 14px;">Beneficios:</h6>
                            <ul class="list-unstyled">
                                <li class="mb-2">
                                    <span class="text-primary fw-bold me-2">•</span>
                                    ${proposta.beneficios}  
                                </li>
                            </ul>
                        </div>

                        <hr>

                        <!-- Seleção de Currículo -->
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

    const respostaEmprego = await fetch(`/api/emprego`, {
        method: 'GET',
        headers: {
            'user-id': userID
        }
    });

    const dadosEmprego = await respostaEmprego.json();
    const dados = await resposta.json();
    const usuarioAtual = dados.usuario;

    if (!usuarioAtual.dados) {
        alert('Por favor cadastre seus dados');
    }

    // Atualizar informações do perfil
    const nomePrincipal = document.getElementById('nomePrincipal');
    const nomeGreeting = document.getElementById('nomeSaudacao');
    const nomeLocal = document.getElementById('nomeLocal');
    const areaAtuacao = document.getElementById('areaAtuacao');
    const nivelExperiencia = document.getElementById('nivelExperiencia');

    nomePrincipal.innerText = usuarioAtual.dados.nome;
    nomeGreeting.innerText = usuarioAtual.dados.nome;
    nomeLocal.innerText = usuarioAtual.dados.localizacao;
    areaAtuacao.innerText = usuarioAtual.dados.areaAtuacao;
    nivelExperiencia.innerText = usuarioAtual.dados.nivelExperiencia;

    // Atualizar mensagem de greeting
    if (dataHours < 13) {
        mensagemGreeting.innerHTML = `Bom dia, <span style="color:#106083">${usuarioAtual.dados.nome}!</span> <br> Aqui está suas oportunidades de hoje`;
    } else if (dataHours < 18) {
        mensagemGreeting.innerHTML = `Boa tarde, <span style="color:#106083">${usuarioAtual.dados.nome}!</span> <br> Aqui está suas oportunidades de hoje`;
    } else {
        mensagemGreeting.innerHTML = `Boa noite, <span style="color:#106083">${usuarioAtual.dados.nome}!</span> <br> Aqui está suas oportunidades de hoje`;
    }

    // Processar e renderizar propostas
    if (dadosEmprego.ok && dadosEmprego.empregos) {
        const empregos = dadosEmprego.empregos;
        console.log(`Total de empregos: ${empregos.length}`);

        // Mapear dados da API para o formato esperado
        const propostas = empregos.map((emprego, index) => ({
            id: emprego.id || index + 1,
            empresa: emprego.empresaNome || "Empresa",
            vaga: `Proposta: ${emprego.titulo}` || "Vaga",
            tempo: emprego.tempo || "Recente",
            descricao: emprego.descricao || "Descrição não disponível",
            requisitos: emprego.requisitos || "Sem requisitos",
            salario: `R$${emprego.mediaSalario}/Mês` || "Sem proposta de salário",
            localizacao: emprego.localizacao || "Sem localização",
            beneficios: emprego.beneficios || "Sem beneficios",
            tipoTrabalho: emprego.tipoTrabalho || "O contratador não definiu o tipo de trabalho",
            tipoContrato: emprego.tipoContrato || "O contratador não definiu o tipo de contrato",
            area: emprego.area || ""
        }));

        // Renderizar as propostas
        renderizarPropostas(propostas);
    } else {
        console.log('Nenhum emprego encontrado ou erro na resposta da API');
        renderizarPropostas([]); // Renderizar vazio se não houver empregos
    }

    console.log(usuarioAtual.userID);
    console.log(usuarioAtual.email);
    console.log(usuarioAtual.tipoConta);
}