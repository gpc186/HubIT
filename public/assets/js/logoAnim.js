const logoImg = document.getElementById('logo-animation');
let animating = false;

logoImg.addEventListener('mouseover', function () {
    if (!animating) {
        animating = true;
        // Adiciona timestamp para forçar o navegador a recarregar o GIF do início
        logoImg.src = '/assets/img/video/hubit_animated.gif?' + new Date().getTime();

        // Volta para SVG após a duração do GIF
        setTimeout(function () {
            // Primeiro esconde a imagem
            logoImg.style.opacity = '0';

            // Troca para SVG após um pequeno fade
            setTimeout(function () {
                logoImg.src = '/assets/img/svg/Hubit_svg_logo.svg';
                logoImg.style.opacity = '1';
                animating = false;
            }, 100); // 100ms de delay para suavizar a transição

        }, 1700); // Ajuste esse tempo para corresponder exatamente à duração do seu GIF
    }
});