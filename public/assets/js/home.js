const dataNow = new Date();
const dataHours = dataNow.getHours();

const mensagemGreeting = document.getElementById('mensagemGreeting');

// if (!titulo || titulo.trim() === '') {
// return;
// };
// if (!descricao || descricao.trim() === '') {
// alert('Descrição é obrigatório!')
// return;
// };
// if (!area || area.trim() === '') {
// alert('Area é obrigatório!')
// return;
// };
// if (!tipoContrato) {
// alert('tipo de contrato é obrigatório!')
// return;
// };
// if (!tipoTrabalho) {
// alert('Tipo de contrato é obrigatório!')
// return;
// };
// if (!mediaSalario) {
// alert('Salário é obrigatório!')
// return;
// };
// if (!localizacao || localizacao.trim() === '') {
// alert('localização é obrigatório!')
// return;
// };
// if (!requisitos) {
// alert('Requisitos são obrigatórios!')
// return;
// };
// if (!beneficios) {
// alert('Beneficios são obrigatórios!')
// return;
// };

window.onload = async function () {
    await carregarPagina();
};

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

    const dadosEmprego = await respostaEmprego.json()

    if(dadosEmprego.ok) {
            
        const empregos = dadosEmprego.empregos;
        
        console.log(`Total de empregos: ${empregos.length}`);
        
        // Exemplo: Criar cards para cada emprego
        const container = document.getElementById('empregosContainer');
        
        empregos.forEach(emprego => {
            const card = document.createElement('div');
            card.className = 'emprego-card';
            card.innerHTML = `
                <h3>${emprego.titulo}</h3>
                <p><strong>Empresa:</strong> ${emprego.empresaNome}</p>
                <p><strong>Área:</strong> ${emprego.area}</p>
                <p><strong>Tipo:</strong> ${emprego.tipoContrato} - ${emprego.tipoTrabalho}</p>
                <p><strong>Salário:</strong> R$ ${emprego.mediaSalario}</p>
                <p><strong>Localização:</strong> ${emprego.localizacao}</p>
            `;
            container.appendChild(card);
        });
    }

    const dados = await resposta.json()
    const usuarioAtual = dados.usuario;

    if (!usuarioAtual.dados) {
        alert('Por favor cadastre')
    }

    const nomePrincipal = document.getElementById('nomePrincipal')
    const nomeGreeting = document.getElementById('nomeSaudacao')
    const nomeLocal = document.getElementById('nomeLocal')
    const areaAtuacao = document.getElementById('areaAtuacao')
    const nivelExperiencia = document.getElementById('nivelExperiencia')

    nomePrincipal.innerText = usuarioAtual.dados.nome
    nomeGreeting.innerText = usuarioAtual.dados.nome
    nomeLocal.innerText = usuarioAtual.dados.localizacao
    areaAtuacao.innerText = usuarioAtual.dados.areaAtuacao
    nivelExperiencia.innerText = usuarioAtual.dados.nivelExperiencia

    console.log(usuarioAtual.userID);           // Ex: 1759967977156
    console.log(usuarioAtual.email);            // Ex: "guguinha@gmail.com"
    console.log(usuarioAtual.tipoConta);        // Ex: "usuario"
    console.log(usuarioAtual.perfilCompleto);   // Ex: true/false
    console.log(usuarioAtual.podeEditar);       // Ex: true/false
    console.log(usuarioAtual.dados);            // Ex: { nome: "...", telefone: "..." }

    // Acessar dados específicos dentro de "dados":
    console.log(usuarioAtual.dados.nome);       // Ex: "Gustavo"
    console.log(usuarioAtual.dados.telefone);   // Ex: "1140028922"
    console.log(usuarioAtual.dados.dataNasc);   // Ex: "2000-01-01"

    if (dataHours < 13) {
        mensagemGreeting.innerHTML = `Bom dia, <span style="color:#106083">${usuarioAtual.dados.nome}!</span> <br> Aqui está suas oportunidades de hoje `
        nomeGreeting.innerHTML = `${usuarioAtual.dados.nome}`

    }
    else if (dataHours < 18) {
        mensagemGreeting.innerHTML = `Boa tarde, <span style="color:#106083">${usuarioAtual.dados.nome}!</span> <br> Aqui está suas oportunidades de hoje `

    }
    else {
        mensagemGreeting.innerHTML = `Boa noite, <span style="color:#106083">${usuarioAtual.dados.nome}!</span> <br> Aqui está suas oportunidades de hoje  `
        nomeGreeting.innerHTML = `${usuarioAtual.dados.nome}`
    }
};

