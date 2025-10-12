let perfilEraIncompleto = false;
let tipoContaAtual = null;
let usuarioAtual = null; 

// Quando a página carregar: Rodar função carregarPerfil()
window.onload = async function() {
    await carregarPerfil();
};

async function carregarPerfil() {
    
    const pathParts = window.location.pathname.split('/');
    const perfilID = pathParts[pathParts.length - 1];
    const idLogado = localStorage.getItem('userID');
    
    // Verifica se o usuário já está logado
    if (!idLogado) {
        alert('Você precisa fazer login!');
        window.location.href = '/';
        return;
    }
    
    const userID = perfilID || idLogado;
    
    try {
        
        // Armazena o ID inserido em uma constante 
        const resposta = await fetch(`/api/usuario/${userID}`, {
            method: 'GET',
            headers: {
                'user-id': idLogado
            }
        });
        
        const dados = await resposta.json();
        
        // Verifica condição de sucesso e tratamento de erro
        if (dados.ok) {
            usuarioAtual = dados.usuario; // 👈 guarda os dados globalmente
            tipoContaAtual = usuarioAtual.tipoConta;
            perfilEraIncompleto = !usuarioAtual.perfilCompleto;

            if(!usuarioAtual.perfilCompleto){
                const mensagem = document.getElementById('mensagemBoasVindas');
                
                if(mensagem) mensagem.style.display = 'block';

                if(usuario.tipoConta === 'usuario') {
                    document.getElementById('formUsuario').style.display = 'block';
                    document.getElementById('formEmpresa').style.display = 'none';
                } else if(usuario.tipoConta === 'empresa') {
                    document.getElementById('formUsuario').style.display = 'none';
                    document.getElementById('formEmpresa').style.display = 'block';
                }
                
                const modal = new bootstrap.Modal(document.getElementById('modalCompletarPerfil'));
                modal.show();
            }

        } else {
            alert('Erro: ' + dados.error);            
        }
        
    //Tratamento de erro de carregar o perfil
    } catch (error) {
        console.error(error);
        alert('Erro ao carregar perfil');
    }
};

async function salvarDados(event) {
    // Previne ele reiniciar o site sozinho automaticamente
    event.preventDefault();
    // Pega o usuário que está no URL (Sendo o mesmo ID do usuário logado, já que esta opção só aparece para quem é proprietário do perfil)
    const userID = localStorage.getItem('userID');

    let dados = {};
    
    // Monta dados baseado no tipo de conta
    if(tipoContaAtual === 'usuario') {
        dados = {
            nome: document.getElementById('alterarNome').value,
            telefone: document.getElementById('alterarTelefone').value,
            dataNasc: document.getElementById('alterarDataNasc').value,
            localizacao: document.getElementById('alterarLocalizacao').value,
            areaAtuacao: document.getElementById('alterarArea').value,
            nivelExperiencia: document.getElementById('alterarNivel').value,
            linkedin: document.getElementById('alterarLinkedin').value,
            github: document.getElementById('alterarGithub').value,
            biografia: document.getElementById('alterarBiografia').value
        };
        
        // Validações básicas
        if(!dados.nome || dados.nome.length < 3) {
            alert('Nome deve ter pelo menos 3 caracteres!');
            return;
        }
        if(!dados.telefone) {
            alert('Telefone é obrigatório!');
            return;
        }
        if(!dados.dataNasc) {
            alert('Data de nascimento é obrigatória!');
            return;
        }
        if(!dados.localizacao) {
            alert('Localização é obrigatória!');
            return;
        }
        if(!dados.areaAtuacao) {
            alert('Área de atuação é obrigatória!');
            return;
        }
        if(!dados.nivelExperiencia) {
            alert('Nível de experiência é obrigatório!');
            return;
        }
        
    } else if(tipoContaAtual === 'empresa') {
        dados = {
            nomeEmpresa: document.getElementById('alterarNomeEmpresa').value,
            cnpj: document.getElementById('alterarCNPJ').value,
            telefone: document.getElementById('alterarTelefoneEmpresa').value,
            localizacao: document.getElementById('alterarLocalizacaoEmpresa').value,
            setor: document.getElementById('alterarSetor').value,
            numeroFuncionarios: document.getElementById('alterarNumFuncionarios').value,
            site: document.getElementById('alterarSite').value,
            linkedin: document.getElementById('alterarLinkedinEmpresa').value,
            descricao: document.getElementById('alterarDescricao').value
        };
        
        // Validações básicas
        if(!dados.nomeEmpresa || dados.nomeEmpresa.length < 3) {
            alert('Nome da empresa deve ter pelo menos 3 caracteres!');
            return;
        }
        if(!dados.cnpj) {
            alert('CNPJ é obrigatório!');
            return;
        }
        if(!dados.telefone) {
            alert('Telefone é obrigatório!');
            return;
        }
        if(!dados.localizacao) {
            alert('Localização é obrigatória!');
            return;
        }
        if(!dados.setor) {
            alert('Setor de atuação é obrigatório!');
            return;
        }
        if(!dados.numeroFuncionarios) {
            alert('Número de funcionários é obrigatório!');
            return;
        }
    }

    try {
        // fazemos o fetch com o user-id e com os dados a ser colocados
        const resposta = await fetch(`/api/usuario/${userID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'user-id': userID
            },
            body: JSON.stringify(dados)
        })
        // Resposta
        const resultado = await resposta.json()

        if(resultado.ok) { //Caso de certo
            alert(JSON.stringify(resultado.usuario, null, 2));
            const modal = bootstrap.Modal.getInstance(document.getElementById('modalCompletarPerfil'));
            modal.hide();
            location.reload(); //Reiniciamos o site
        } else {
            console.log(resultado.error);
            alert(resultado.error);
        };
    } catch (error) {
        alert(error.message + error);
    }
}

function abrirModalEdicao() {
    // Esconde a mensagem   
    const mensagem = document.getElementById('mensagemBoasVindas');
    if (mensagem) mensagem.style.display = 'none';
    
    // Garante que temos os dados carregados
    if (!usuarioAtual) {
        alert("Erro: dados do usuário não carregados.");
        return;
    }

    // Mostra o formulário correspondente
    if (usuarioAtual.tipoConta === 'usuario') {
        document.getElementById('formUsuario').style.display = 'block';
        document.getElementById('formEmpresa').style.display = 'none';

        // Preenche os campos com os dados do usuário
        document.getElementById('alterarNome').value = usuarioAtual.nome || '';
        document.getElementById('alterarTelefone').value = usuarioAtual.telefone || '';
        document.getElementById('alterarDataNasc').value = usuarioAtual.dataNasc || '';
        document.getElementById('alterarLocalizacao').value = usuarioAtual.localizacao || '';
        document.getElementById('alterarArea').value = usuarioAtual.areaAtuacao || '';
        document.getElementById('alterarNivel').value = usuarioAtual.nivelExperiencia || '';
        document.getElementById('alterarLinkedin').value = usuarioAtual.linkedin || '';
        document.getElementById('alterarGithub').value = usuarioAtual.github || '';
        document.getElementById('alterarBiografia').value = usuarioAtual.biografia || '';

    } else if (usuarioAtual.tipoConta === 'empresa') {
        document.getElementById('formUsuario').style.display = 'none';
        document.getElementById('formEmpresa').style.display = 'block';

        // Preenche os campos com os dados da empresa
        document.getElementById('alterarNomeEmpresa').value = usuarioAtual.nomeEmpresa || '';
        document.getElementById('alterarCNPJ').value = usuarioAtual.cnpj || '';
        document.getElementById('alterarTelefoneEmpresa').value = usuarioAtual.telefone || '';
        document.getElementById('alterarLocalizacaoEmpresa').value = usuarioAtual.localizacao || '';
        document.getElementById('alterarSetor').value = usuarioAtual.setor || '';
        document.getElementById('alterarNumFuncionarios').value = usuarioAtual.numeroFuncionarios || '';
        document.getElementById('alterarSite').value = usuarioAtual.site || '';
        document.getElementById('alterarLinkedinEmpresa').value = usuarioAtual.linkedin || '';
        document.getElementById('alterarDescricao').value = usuarioAtual.descricao || '';
    }
    // Abre o modal normalmente
    const modalElement = document.getElementById('modalCompletarPerfil');
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
}

function sair() {
    // Faz logout
    localStorage.clear();
    alert('Você saiu da conta');

    // Volta para página inicial (root)
    window.location.href = '/';
}