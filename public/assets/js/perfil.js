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
        if (resposta.ok) {
            alert(JSON.stringify(dados.usuario));
        } else {
            alert('Erro: ' + dados.error);            
        }
        
    //Tratamento de erro de carregar o perfil
    } catch (error) {
        console.error(error);
        alert('Erro ao carregar perfil');
    }
}

function sair() {
    // Faz logout
    localStorage.clear();
    alert('Você saiu da conta');

    // Volta para página inicial (root)
    window.location.href = '/';
}