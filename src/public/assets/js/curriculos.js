// ===== SISTEMA DE CURRÍCULOS =====

// Armazena os currículos localmente
let curriculosDoUsuario = {
    1: null,
    2: null,
    3: null
};

// Contadores para IDs únicos
let contadorExperiencias = { 1: 1, 2: 1, 3: 1 };
let contadorFormacoes = { 1: 1, 2: 1, 3: 1 };
let contadorIdiomas = { 1: 1, 2: 1, 3: 1 };

// Carregar currículos ao carregar a página
async function carregarCurriculos() {
    const userID = localStorage.getItem('userID');
    
    if (!userID) return;

    try {
        const resposta = await fetch(`/api/curriculo`, {
            method: 'GET',
            headers: {
                'user-id': userID
            }
        });

        if (resposta.ok) {
            const dados = await resposta.json();
            
            if (dados.ok && dados.curriculos) {
                dados.curriculos.forEach(curriculo => {
                    const slot = curriculo.slot || identificarSlot(curriculo.curriculoID);
                    if (slot >= 1 && slot <= 3) {
                        curriculosDoUsuario[slot] = curriculo;
                        atualizarPreviewCurriculo(slot, curriculo);
                    }
                });
            }
        }
    } catch (error) {
        console.error('Erro ao carregar currículos:', error);
    }
}

function identificarSlot(curriculoID) {
    const curriculos = Object.values(curriculosDoUsuario).filter(c => c !== null);
    return curriculos.length + 1;
}

// Abrir modal do currículo
function abrirModalCurriculo(numero) {
    const modal = new bootstrap.Modal(document.getElementById(`modalCurriculo${numero}`));
    
    // Se já existe currículo, preencher o formulário
    if (curriculosDoUsuario[numero]) {
        preencherFormularioCurriculo(numero, curriculosDoUsuario[numero]);
    } else {
        limparFormularioCurriculo(numero);
    }
    
    modal.show();
}

// Preencher formulário com dados existentes
function preencherFormularioCurriculo(numero, curriculo) {
    document.getElementById(`titulo-${numero}`).value = curriculo.titulo || '';
    document.getElementById(`objetivo-${numero}`).value = curriculo.resumoProfissional || '';
    document.getElementById(`habilidades-${numero}`).value = curriculo.habilidades ? curriculo.habilidades.join(', ') : '';
    
    // Preencher experiências
    const expContainer = document.getElementById(`experiencias-container-${numero}`);
    expContainer.innerHTML = '';
    if (curriculo.experiencias && curriculo.experiencias.length > 0) {
        curriculo.experiencias.forEach((exp, index) => {
            adicionarExperiencia(numero);
            const items = expContainer.querySelectorAll('.experiencia-item');
            const item = items[items.length - 1];
            const inputs = item.querySelectorAll('input, textarea');
            inputs[0].value = exp.cargo || '';
            inputs[1].value = exp.empresa || '';
            inputs[2].value = exp.dataInicio || '';
            inputs[3].value = exp.dataFim || '';
            inputs[4].checked = exp.atual || false;
            item.querySelector('textarea').value = exp.descricao || '';
        });
    } else {
        adicionarExperiencia(numero);
    }
    
    // Preencher formações
    const formContainer = document.getElementById(`formacao-container-${numero}`);
    formContainer.innerHTML = '';
    if (curriculo.formacaoAcademica && curriculo.formacaoAcademica.length > 0) {
        curriculo.formacaoAcademica.forEach((form) => {
            adicionarFormacao(numero);
            const items = formContainer.querySelectorAll('.formacao-item');
            const item = items[items.length - 1];
            const inputs = item.querySelectorAll('input');
            inputs[0].value = form.curso || '';
            inputs[1].value = form.instituicao || '';
            inputs[2].value = form.dataInicio || '';
            inputs[3].value = form.dataConclusao || '';
        });
    } else {
        adicionarFormacao(numero);
    }
    
    // Preencher idiomas
    const idiomaContainer = document.getElementById(`idiomas-container-${numero}`);
    idiomaContainer.innerHTML = '';
    if (curriculo.idiomas && curriculo.idiomas.length > 0) {
        curriculo.idiomas.forEach((idioma) => {
            adicionarIdioma(numero);
            const items = idiomaContainer.querySelectorAll('.idioma-item');
            const item = items[items.length - 1];
            const inputs = item.querySelectorAll('input, select');
            inputs[0].value = idioma.idioma || '';
            inputs[1].value = idioma.nivel || '';
        });
    } else {
        adicionarIdioma(numero);
    }
}

// Limpar formulário
function limparFormularioCurriculo(numero) {
    document.getElementById(`titulo-${numero}`).value = '';
    document.getElementById(`objetivo-${numero}`).value = '';
    document.getElementById(`habilidades-${numero}`).value = '';
    
    // Reset containers
    document.getElementById(`experiencias-container-${numero}`).innerHTML = '';
    document.getElementById(`formacao-container-${numero}`).innerHTML = '';
    document.getElementById(`idiomas-container-${numero}`).innerHTML = '';
    
    // Adicionar um item inicial em cada
    adicionarExperiencia(numero);
    adicionarFormacao(numero);
    adicionarIdioma(numero);
}

// Adicionar experiência
function adicionarExperiencia(numero) {
    const container = document.getElementById(`experiencias-container-${numero}`);
    const contador = contadorExperiencias[numero]++;
    
    const div = document.createElement('div');
    div.className = 'experiencia-item mb-3';
    div.innerHTML = `
        <button type="button" class="btn-remover-item" onclick="removerItem(this)">×</button>
        <div class="row">
            <div class="col-md-6 mb-2">
                <input type="text" class="form-control" placeholder="Cargo">
            </div>
            <div class="col-md-6 mb-2">
                <input type="text" class="form-control" placeholder="Empresa">
            </div>
            <div class="col-md-4 mb-2">
                <input type="month" class="form-control" placeholder="Data Início">
            </div>
            <div class="col-md-4 mb-2">
                <input type="month" class="form-control" placeholder="Data Fim">
            </div>
            <div class="col-md-4 mb-2">
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="atual-${numero}-${contador}">
                    <label class="form-check-label" for="atual-${numero}-${contador}">Trabalho atual</label>
                </div>
            </div>
            <div class="col-md-12 mb-2">
                <textarea class="form-control" rows="2" placeholder="Descrição das atividades"></textarea>
            </div>
        </div>
    `;
    
    container.appendChild(div);
}

// Adicionar formação
function adicionarFormacao(numero) {
    const container = document.getElementById(`formacao-container-${numero}`);
    
    const div = document.createElement('div');
    div.className = 'formacao-item mb-3';
    div.innerHTML = `
        <button type="button" class="btn-remover-item" onclick="removerItem(this)">×</button>
        <div class="row">
            <div class="col-md-6 mb-2">
                <input type="text" class="form-control" placeholder="Curso">
            </div>
            <div class="col-md-6 mb-2">
                <input type="text" class="form-control" placeholder="Instituição">
            </div>
            <div class="col-md-6 mb-2">
                <input type="month" class="form-control" placeholder="Data Início">
            </div>
            <div class="col-md-6 mb-2">
                <input type="month" class="form-control" placeholder="Data Conclusão">
            </div>
        </div>
    `;
    
    container.appendChild(div);
}

// Adicionar idioma
function adicionarIdioma(numero) {
    const container = document.getElementById(`idiomas-container-${numero}`);
    
    const div = document.createElement('div');
    div.className = 'idioma-item mb-2 row';
    div.innerHTML = `
        <button type="button" class="btn-remover-item" onclick="removerItem(this)">×</button>
        <div class="col-md-6">
            <input type="text" class="form-control" placeholder="Idioma">
        </div>
        <div class="col-md-6">
            <select class="form-select">
                <option value="">Nível</option>
                <option value="Básico">Básico</option>
                <option value="Intermediário">Intermediário</option>
                <option value="Avançado">Avançado</option>
                <option value="Fluente">Fluente</option>
                <option value="Nativo">Nativo</option>
            </select>
        </div>
    `;
    
    container.appendChild(div);
}

// Remover item
function removerItem(btn) {
    btn.parentElement.remove();
}

// Salvar currículo
async function salvarCurriculo(numero) {
    const userID = localStorage.getItem('userID');
    
    if (!userID) {
        alert('Você precisa estar logado!');
        return;
    }
    
    // Coletar dados do formulário
    const titulo = document.getElementById(`titulo-${numero}`).value;
    const objetivo = document.getElementById(`objetivo-${numero}`).value;
    const habilidadesText = document.getElementById(`habilidades-${numero}`).value;
    
    if (!titulo || !objetivo) {
        alert('Preencha o título e o objetivo profissional!');
        return;
    }
    
    // Coletar experiências
    const experiencias = [];
    const expItems = document.querySelectorAll(`#experiencias-container-${numero} .experiencia-item`);
    expItems.forEach(item => {
        const inputs = item.querySelectorAll('input, textarea');
        if (inputs[0].value) { // Se tem cargo preenchido
            experiencias.push({
                cargo: inputs[0].value,
                empresa: inputs[1].value,
                dataInicio: inputs[2].value,
                dataFim: inputs[3].value,
                atual: inputs[4].checked,
                descricao: item.querySelector('textarea').value
            });
        }
    });
    
    // Coletar formações
    const formacoes = [];
    const formItems = document.querySelectorAll(`#formacao-container-${numero} .formacao-item`);
    formItems.forEach(item => {
        const inputs = item.querySelectorAll('input');
        if (inputs[0].value) { // Se tem curso preenchido
            formacoes.push({
                curso: inputs[0].value,
                instituicao: inputs[1].value,
                dataInicio: inputs[2].value,
                dataConclusao: inputs[3].value
            });
        }
    });
    
    // Coletar idiomas
    const idiomas = [];
    const idiomaItems = document.querySelectorAll(`#idiomas-container-${numero} .idioma-item`);
    idiomaItems.forEach(item => {
        const inputs = item.querySelectorAll('input, select');
        if (inputs[0].value) { // Se tem idioma preenchido
            idiomas.push({
                idioma: inputs[0].value,
                nivel: inputs[1].value
            });
        }
    });
    
    // Montar objeto do currículo
    const curriculo = {
        titulo: titulo,
        resumoProfissional: objetivo,
        experiencias: experiencias,
        formacaoAcademica: formacoes,
        habilidades: habilidadesText.split(',').map(h => h.trim()).filter(h => h),
        idiomas: idiomas,
        slot: numero
    };
    
    try {
        let resposta;
        
        // Se já existe currículo, atualizar. Senão, criar novo
        if (curriculosDoUsuario[numero]) {
            resposta = await fetch(`/api/curriculo/${curriculosDoUsuario[numero].curriculoID}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'user-id': userID
                },
                body: JSON.stringify(curriculo)
            });
        } else {
            resposta = await fetch('/api/curriculo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'user-id': userID
                },
                body: JSON.stringify(curriculo)
            });
        }
        
        const dados = await resposta.json();
        
        if (dados.ok) {
            alert('Currículo salvo com sucesso!');
            curriculosDoUsuario[numero] = dados.curriculo;
            atualizarPreviewCurriculo(numero, dados.curriculo);
            
            // Fechar modal
            const modal = bootstrap.Modal.getInstance(document.getElementById(`modalCurriculo${numero}`));
            modal.hide();
        } else {
            alert('Erro ao salvar currículo: ' + dados.error);
        }
    } catch (error) {
        console.error('Erro ao salvar currículo:', error);
        alert('Erro ao salvar currículo. Tente novamente.');
    }
}

// Atualizar preview do currículo
function atualizarPreviewCurriculo(numero, curriculo) {
    const preview = document.getElementById(`preview-curriculo-${numero}`);
    const status = document.getElementById(`status-curriculo-${numero}`);
    const botao = document.querySelector(`#curriculo-${numero} .btn-criar-curriculo`);
    
    if (curriculo) {
        status.textContent = 'Criado';
        status.classList.add('criado');
        
        preview.classList.add('preenchido');
        preview.innerHTML = `
            <div class="curriculo-info-item">
                <strong>Título:</strong> ${curriculo.titulo}
            </div>
            <div class="curriculo-info-item">
                <strong>Experiências:</strong> ${curriculo.experiencias ? curriculo.experiencias.length : 0}
            </div>
            <div class="curriculo-info-item">
                <strong>Formações:</strong> ${curriculo.formacaoAcademica ? curriculo.formacaoAcademica.length : 0}
            </div>
            <div class="curriculo-info-item">
                <strong>Habilidades:</strong> ${curriculo.habilidades ? curriculo.habilidades.length : 0}
            </div>
        `;
        
        botao.innerHTML = '<ion-icon name="create-outline"></ion-icon> Editar Currículo';
        botao.classList.add('editar');
    } else {
        status.textContent = 'Não criado';
        status.classList.remove('criado');
        
        preview.classList.remove('preenchido');
        preview.innerHTML = '<p class="sem-curriculo">Nenhum currículo criado ainda</p>';
        
        botao.innerHTML = '<ion-icon name="add-circle-outline"></ion-icon> Criar Currículo';
        botao.classList.remove('editar');
    }
}

