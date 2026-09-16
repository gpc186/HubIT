(() => {
    document.querySelectorAll('.site-header .desktop-links').forEach(nav => {
        const links = [...nav.querySelectorAll('a')];
        if (!links.length) return;

        const indicator = document.createElement('span');
        indicator.className = 'nav-indicator';
        indicator.setAttribute('aria-hidden', 'true');
        nav.prepend(indicator);
        nav.classList.add('has-sliding-indicator');

        let hoveredLink = null;
        let focusedLink = null;
        let visibleLink = null;

        const update = () => {
            const link = hoveredLink || focusedLink;
            if (!link) {
                indicator.classList.remove('is-visible');
                visibleLink = null;
                return;
            }

            // O primeiro destaque aparece no lugar; ao trocar de link, ele desliza.
            if (!visibleLink) indicator.style.transition = 'opacity .18s ease';
            indicator.style.width = `${link.offsetWidth}px`;
            indicator.style.transform = `translateX(${link.offsetLeft}px)`;
            indicator.classList.add('is-visible');
            visibleLink = link;
            requestAnimationFrame(() => { indicator.style.transition = ''; });
        };

        links.forEach(link => {
            link.addEventListener('pointerenter', () => {
                hoveredLink = link;
                update();
            });
            link.addEventListener('focus', () => {
                focusedLink = link;
                update();
            });
            link.addEventListener('blur', event => {
                if (focusedLink === link) {
                    focusedLink = links.includes(event.relatedTarget) ? event.relatedTarget : null;
                }
                update();
            });
        });

        nav.addEventListener('pointerleave', () => {
            hoveredLink = null;
            update();
        });
        window.addEventListener('resize', update);
    });
})();
