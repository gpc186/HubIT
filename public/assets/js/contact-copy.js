(() => {
    const status = document.getElementById('contact-status');
    if (!status) return;

    document.querySelectorAll('#contact [data-copy]').forEach(button => {
        button.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(button.dataset.copy);
                status.textContent = `${button.dataset.copy} copiado!`;
            } catch {
                status.textContent = `Não foi possível copiar. Selecione o contato manualmente: ${button.dataset.copy}`;
            }
        });
    });
})();
