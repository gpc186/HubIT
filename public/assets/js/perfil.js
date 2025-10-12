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
            const usuario = dados.usuario;

            // if(!usuario.perfilCompleto){
                // const modal = new bootstrap.Modal(document.getElementById('modalCompletarPerfil'));
                // modal.show();
            // }

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
    // Aqui pegamos os dados e nomeamos ele dentro de um object
    const dados = {
        nome: document.getElementById('alterarNome').value,
        telefone: document.getElementById('alterarTelefone').value,
        dataNasc: document.getElementById('alterarDataNasc').value
    };

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
            // const modal = bootstrap.Modal.getInstance(document.getElementById('modalCompletarPerfil'));
            // modal.hide();
            location.reload(); //Reiniciamos o site
        } else {
            console.log(resultado.error);
            alert(resultado.error);
        };
    } catch (error) {
        alert(error.message + error);
    }
}

function sair() {
    // Faz logout
    localStorage.clear();
    alert('Você saiu da conta');

    // Volta para página inicial (root)
    window.location.href = '/';
}