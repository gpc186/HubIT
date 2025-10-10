window.onload = async function() {
    await carregarPerfil();
};

async function carregarPerfil() {
    
    const pathParts = window.location.pathname.split('/');
    const perfilID = pathParts[pathParts.length - 1];
    
    const idLogado = localStorage.getItem('userID');
    
    if (!idLogado) {
        alert('Você precisa fazer login!');
        window.location.href = '/';
        return;
    }
    
    const userID = perfilID || idLogado;
    
    try {
        
        const resposta = await fetch(`/api/usuario/${userID}`, {
            method: 'GET',
            headers: {
                'user-id': idLogado
            }
        });
        
        const dados = await resposta.json();
        
        if (resposta.ok) {
            alert(JSON.stringify(dados.usuario));
        } else {
            alert('Erro: ' + dados.error);            
        }
        
    } catch (error) {
        console.error(error);
        alert('Erro ao carregar perfil');
    }
}

function sair() {
    localStorage.clear();
    alert('Você saiu da conta');
    window.location.href = '/';
}