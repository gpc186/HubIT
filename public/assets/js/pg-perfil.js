// Colocar o indicador no item ativo quando carregar a página
window.addEventListener('DOMContentLoaded', () => {
    const activeItem = document.querySelector('.nav-item.active');
    if (activeItem) {
        moveIndicator(activeItem);
    }
});

function navigateTo(element, pageUrl) {
    // Remove a classe active de todos os itens
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });

    // Adiciona a classe active no item clicado
    element.classList.add('active');
    
    // Move o indicador
    moveIndicator(element);

    // Espera a animação terminar antes de redirecionar
    setTimeout(() => {
        window.location.href = pageUrl;
    }, 400);
}

function moveIndicator(element) {
    const indicator = document.getElementById('indicator');
    if (!indicator || !element) return;

    const elementRect = element.getBoundingClientRect();
    const navbarRect = document.querySelector('.navbar-nav').getBoundingClientRect();
    
    // Calcula a posição relativa
    const leftPosition = elementRect.left - navbarRect.left + (elementRect.width / 2) - (indicator.offsetWidth / 2);
    
    indicator.style.left = leftPosition + 'px';
}

// Reposiciona o indicador ao redimensionar a janela
window.addEventListener('resize', () => {
    const activeItem = document.querySelector('.nav-item.active');
    if (activeItem) {
        moveIndicator(activeItem);
    }
});