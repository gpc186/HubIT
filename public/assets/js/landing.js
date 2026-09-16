/* GSAP 3.13: progressive enhancement; the page stays visible without animation. */
(() => {
    const menu = document.querySelector('.mobile-menu');
    if (menu) {
        document.addEventListener('keydown', event => {
            if (event.key === 'Escape' && menu.open) {
                menu.open = false;
                menu.querySelector('summary').focus();
            }
        });
        document.addEventListener('click', event => {
            if (!menu.contains(event.target)) menu.open = false;
        });
        menu.querySelectorAll('.mobile-links a').forEach(link => {
            link.addEventListener('click', () => { menu.open = false; });
        });
    }

    // Adapted from shadcn-space/shine-border-03 (mouse spotlight):
    // https://shadcnspace.com/r/shine-border-03.json
    const shineMedia = window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
    document.querySelectorAll('.shine-plan').forEach(card => {
        card.addEventListener('pointermove', event => {
            if (!shineMedia.matches) return;
            const bounds = card.getBoundingClientRect();
            card.style.setProperty('--shine-x', `${event.clientX - bounds.left}px`);
            card.style.setProperty('--shine-y', `${event.clientY - bounds.top}px`);
        });
    });

    if (!window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);

    // A fixed modal must not inherit transforms from the login card.
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', (context) => {
        const intro = gsap.timeline({ defaults: { duration: 0.85, ease: 'power3.out' } });
        intro.from('.text-login-block', { y: 22, opacity: 0, clearProps: 'transform,opacity' })
            .from('.main-block-1 > img', { y: 16, opacity: 0, clearProps: 'transform,opacity' }, 0.15)
            .from('.login-block', { opacity: 0, clearProps: 'opacity' }, 0.2);

        // Start each reveal only when it enters view, including direct anchor visits.
        document.querySelectorAll('main > section').forEach((section, index) => {
            const targets = section.querySelectorAll(
                '.about-steps-text, .about > h1, .about > h2, .section-block-1, ' +
                '.section-block-2, .about-content-steps, .plans-options, .plans-content'
            );
            ScrollTrigger.create({
                trigger: section,
                start: 'top 82%',
                once: true,
                onEnter: context.add(`revealSection${index}`, () => {
                    gsap.fromTo(targets, { y: 24, opacity: 0 }, {
                        y: 0, opacity: 1, duration: 0.75, stagger: 0.08,
                        ease: 'power3.out', clearProps: 'transform,opacity'
                    });
                })
            });
        });

        const animatePlans = context.add('animatePlans', () => {
            const cards = [...document.querySelectorAll('.plan1')]
                .filter(card => getComputedStyle(card).display !== 'none');
            gsap.fromTo(cards, { y: 12, opacity: 0.55 }, {
                y: 0, opacity: 1, duration: 0.4, stagger: 0.06,
                ease: 'power2.out', overwrite: true, clearProps: 'transform,opacity',
                onComplete: () => ScrollTrigger.refresh()
            });
        });
        const buttons = document.querySelectorAll('.plans-options button');
        buttons.forEach(button => button.addEventListener('click', animatePlans));
        return () => buttons.forEach(button => button.removeEventListener('click', animatePlans));
    });

    document.fonts.ready.then(() => ScrollTrigger.refresh());
    window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
})();
