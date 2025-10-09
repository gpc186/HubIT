window.onload = async function() {
    await carregarPerfil();
};

async function carregarPerfil() {
    
    const urlParams = new URLSearchParams(window.location.search);
    const urlId = urlParams.get('id');
    
    const idLogado = localStorage.getItem('userId');
    
    if (!idLogado) {
        alert('Você precisa fazer login!');
        window.location.href = '/';
        return;
    }
    
    const userId = urlId || idLogado;
    
    try {
        
        const resposta = await fetch(`/api/usuario/${userId}`, {
            method: 'GET',
            headers: {
                'user-id': idLogado
            }
        });
        
        const dados = await resposta.json();
        
        if (resposta.ok) {
            alert('Deu certo!');
        } else {
            alert('Erro: ' + dados.error);            
            window.location.href = '/login.html';
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