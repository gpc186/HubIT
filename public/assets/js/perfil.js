let perfilEraIncompleto = false;
let tipoContaAtual = null;
let usuarioAtual = null;


function verificarTelefone(telefone) {
    const numeros = telefone.replace(/\D/g, '');
    return numeros.length >= 10 && numeros.length <= 11;
}

function verificarDataNasc(dataNasc) {
    const nascimento = new Date(dataNasc);
    const hoje = new Date();
    const idade = hoje.getFullYear() - nascimento.getFullYear();
    return idade >= 14 && idade <= 120
}

// Quando a página carregar: Rodar função carregarPerfil()
window.onload = async function () {
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

    const userID = idLogado;

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
            // Aqui é para verificar e preencher dados
            usuarioAtual = dados.usuario;
            console.log(usuarioAtual)
            tipoContaAtual = usuarioAtual.tipoConta;
            console.log(tipoContaAtual);

            perfilEraIncompleto = !usuarioAtual.perfilCompleto;
            console.log(perfilEraIncompleto);


            if (perfilEraIncompleto) {
                console.log('Usuario verificado')
                const mensagem = document.getElementById('mensagemBoasVindas');

                if (mensagem) mensagem.style.display = 'block';
                console.log("Mensagem criada");


                if (usuarioAtual.tipoConta === 'usuario') {
                    document.getElementById('formUsuario').style.display = 'block';
                    document.getElementById('formEmpresa').style.display = 'none';
                    console.log("usuario tipo usuario");

                } else if (usuarioAtual.tipoConta === 'empresa') {
                    document.getElementById('formUsuario').style.display = 'none';
                    document.getElementById('formEmpresa').style.display = 'block';
                    console.log("usuario tipo empresa")
                }

                const modal = new bootstrap.Modal(document.getElementById('modalCompletarPerfil'));
                modal.show();
                console.log("Modal mostrado")
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
    // Aqui, ao invés de ser um object dados para todos os usuários, ele será feito de acordo com o seu tipo de conta
    let dados = {};

    // Monta dados baseado no tipo de conta
    if (tipoContaAtual === 'usuario') {
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
        if (!dados.nome || dados.nome.length < 3) {
            alert('Nome deve ter pelo menos 3 caracteres!');
            return;
        }
        if (!dados.telefone) {
            alert('Telefone é obrigatório!');
            return;
        }
        if (!verificarTelefone(dados.telefone)) {
            alert('Telefone inválido!');
            return;
        };
        if (!dados.dataNasc) {
            alert('Data de nascimento é obrigatória!');
            return;
        }
        if (!verificarDataNasc(dados.dataNasc)) {
            alert('Data de nascimento Inválida')
        }
        if (!dados.localizacao) {
            alert('Localização é obrigatória!');
            return;
        }
        if (!dados.areaAtuacao) {
            alert('Área de atuação é obrigatória!');
            return;
        }
        if (!dados.nivelExperiencia) {
            alert('Nível de experiência é obrigatório!');
            return;
        }

    } else if (tipoContaAtual === 'empresa') {
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
        if (!dados.nomeEmpresa || dados.nomeEmpresa.length < 3) {
            alert('Nome da empresa deve ter pelo menos 3 caracteres!');
            return;
        };
        if (!dados.cnpj) {
            alert('CNPJ é obrigatório!');
            return;
        };
        if (!dados.telefone) {
            alert('Telefone é obrigatório!');
            return;
        };
        if (!dados.localizacao) {
            alert('Localização é obrigatória!');
            return;
        };
        if (!dados.setor) {
            alert('Setor de atuação é obrigatório!');
            return;
        };
        if (!dados.numeroFuncionarios) {
            alert('Número de funcionários é obrigatório!');
            return;
        };
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

        if (resultado.ok) { //Caso de certo
            alert(JSON.stringify(resultado.usuario, null, 2));
            // Aqui fechamos o modal para que demonstre que os dados foram processados
            const modal = bootstrap.Modal.getInstance(document.getElementById('modalCompletarPerfil'));
            modal.hide();

            if (typeof confetti !== 'undefined') {
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 }
                });
            }

            setTimeout(() => {
                location.reload();
            }, 1000); //Reiniciamos o site
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

document.addEventListener('DOMContentLoaded', () => {
    const colorInput = document.getElementById('empregoCorDestaque');
    const previewNome = document.getElementById('previewNomeEmpresa');

    if (colorInput && previewNome) {
        colorInput.addEventListener('input', (e) => {
            previewNome.style.color = e.target.value;
        });
    }
});

// Função para publicar emprego
async function publicarEmprego() {
    const userID = localStorage.getItem('userID');

    if (!userID) {
        alert('Você precisa estar logado!');
        return;
    }

    // Coletar dados do formulário
    const titulo = document.getElementById('empregoTitulo').value.trim();
    const descricao = document.getElementById('empregoDescricao').value.trim();
    const area = document.getElementById('empregoArea').value;
    const tipoContrato = document.getElementById('empregoContrato').value;
    const tipoTrabalho = document.getElementById('empregoTrabalho').value;
    const mediaSalario = document.getElementById('empregoSalario').value;
    const localizacao = document.getElementById('empregoLocalizacao').value.trim();
    const requisitos = document.getElementById('empregoRequisitos').value.trim();
    const beneficios = document.getElementById('empregoBeneficios').value.trim();
    const corDestaque = document.getElementById('empregoCorDestaque').value; // NOVA LINHA

    // Validações
    if (!titulo) {
        alert('Por favor, preencha o título da vaga!');
        return;
    }

    if (!descricao) {
        alert('Por favor, descreva a vaga!');
        return;
    }

    if (!area) {
        alert('Por favor, selecione uma área!');
        return;
    }

    if (!tipoContrato) {
        alert('Por favor, selecione o tipo de contrato!');
        return;
    }

    if (!tipoTrabalho) {
        alert('Por favor, selecione o tipo de trabalho!');
        return;
    }

    if (!localizacao) {
        alert('Por favor, informe a localização!');
        return;
    }

    // Montar objeto do emprego
    const novoEmprego = {
        titulo,
        descricao,
        area,
        tipoContrato,
        tipoTrabalho,
        mediaSalario: mediaSalario ? parseInt(mediaSalario) : null,
        localizacao,
        requisitos: requisitos || null,
        beneficios: beneficios || null,
        corDestaque
    };

    try {
        const response = await fetch('/api/emprego', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'user-id': userID
            },
            body: JSON.stringify(novoEmprego)
        });

        const dados = await response.json();

        if (dados.ok) {

            const modal = bootstrap.Modal.getInstance(document.getElementById('modalNovoEmprego'));
            if (modal) modal.hide();

            document.getElementById('formNovoEmprego').reset();
            document.getElementById('empregoCorDestaque').value = '#2F6D88';
            document.getElementById('previewNomeEmpresa').style.color = '#2F6D88';

            if (typeof confetti !== 'undefined') {
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 }
                });
            }

            // Recarregar os empregos (se houver função de carregamento)
            if (typeof carregarEmpregos === 'function') {
                await carregarEmpregos();
            }
        } else {
            alert('Erro ao publicar vaga: ' + dados.error);
        }
    } catch (error) {
        console.error('❌ Erro ao publicar vaga:', error);
        alert('Erro ao publicar vaga. Tente novamente.');
    }
}

function sair() {
    // Faz logout
    localStorage.clear();
    alert('Você saiu da conta');

    // Volta para página inicial (root)
    window.location.href = '/';
}

