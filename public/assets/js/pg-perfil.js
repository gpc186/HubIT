//colocar o indicador no item ativo quando carregar a pg
window.addEventListener('DOMContentLoaded', ()=> {
    const activeItem = document.querySelector('.nav-item.active')
    moveIndicator(activeItem)
})

function navigateTo(element, pageUrl){
    //remove a classe active de todos os itens
    document.querySelectorAll('.nav-item').forEach(item =>{
        item.classList.remove('active')
    })

    //adiciona a classe active no item clicado
    element.classList.add('active')
    //vai move o indicador
    moveIndicator(element)

    //vai espera a anima terminar
    setTimeout(() => {
       window.location.href = pageUrl 
    }, 400);
}
 function moveIndicator(element) {
            const indicator = document.getElementById('indicator');
            const elementRect = element.getBoundingClientRect();
            const containerRect = element.parentElement.getBoundingClientRect();
            
            // Calcula a posição do container
            const leftPosition = elementRect.left - containerRect.left + (elementRect.width / 2) - (indicator.offsetWidth / 2);
            
            indicator.style.left = leftPosition + 'px';
        }
        //reposiciona o indicador ao redimensionar a janela
        window.addEventListener('resize', () =>{
            const activeItem = document.querySelector('.nav-item.active')
            if(activeItem){
                moveIndicator(activeItem)
            }
        })


        // Adicione isso no seu JavaScript
function navigateTo(element, pageUrl) {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    element.classList.add('active');
    moveIndicator(element);
    
    setTimeout(() => {
        window.location.href = pageUrl;
    }, 400);
}

function moveIndicator(element) {
    const indicator = document.getElementById('indicator');
    const elementRect = element.getBoundingClientRect();
    const containerRect = element.parentElement.getBoundingClientRect();
    const leftPosition = elementRect.left - containerRect.left + (elementRect.width / 2) - (indicator.offsetWidth / 2);
    indicator.style.left = leftPosition + 'px';
}