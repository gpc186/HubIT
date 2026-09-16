(() => {
    const status = document.getElementById('contact-status');
    document.querySelectorAll('[data-copy]').forEach(button => {
        button.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(button.dataset.copy);
                status.textContent = `${button.dataset.copy} copiado!`;
            } catch {
                status.textContent = `Não foi possível copiar. Selecione o contato manualmente: ${button.dataset.copy}`;
            }
        });
    });
    const menu = document.querySelector('.mobile-menu');
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && menu.open) {
            menu.open = false;
            menu.querySelector('summary').focus();
        }
    });
    document.addEventListener('click', event => {
        if (!menu.contains(event.target)) menu.open = false;
    });
    if (!window.gsap) return;
    gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('.hero-copy, .contact-card', {
            y: 18, opacity: 0, duration: 0.8, stagger: 0.12,
            ease: 'power3.out', clearProps: 'transform,opacity'
        });
    });
})();
