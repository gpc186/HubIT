const logoImg = document.getElementById('logo-animation');
let animating = false;

logoImg.addEventListener('mouseover', function () {
    if (!animating) {
        animating = true;
        // Adiciona timestamp para forçar o navegador a recarregar o GIF do início
        logoImg.src = '/assets/img/video/hubit_animated2.gif?' + new Date().getTime();

        // Volta para SVG após a duração do GIF
        setTimeout(function () {
            // Primeiro esconde a imagem
            logoImg.style.opacity = '0';

            // Troca para SVG após um pequeno fade
            setTimeout(function () {
                logoImg.src = '/assets/img/hubit_png_default.png';
                logoImg.style.opacity = '1';
                animating = false;
            },0);

        }, 1700); // Ajuste esse tempo para corresponder exatamente à duração do seu GIF
    }
});