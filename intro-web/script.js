// =============================================
// TOUTAKUN04 — Portfolio Script v2.0
// =============================================

(function () {
    'use strict';

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // =============================================
    // TYPING ANIMATION
    // =============================================

    const words = ["Android Developer", "Edge Systems Builder", "Robotics Tinkerer", "Solo Shipper"];
    const typingEl = document.getElementById('typingText');
    let wi = 0, ci = 0, deleting = false;

    function typeLoop() {
        if (reduceMotion) { typingEl.textContent = words[0]; return; }
        const word = words[wi];
        typingEl.textContent = deleting ? word.slice(0, ci--) : word.slice(0, ci++);
        let delay = deleting ? 40 : 70;
        if (!deleting && ci === word.length + 1) { delay = 1500; deleting = true; }
        else if (deleting && ci === 0) { deleting = false; wi = (wi + 1) % words.length; delay = 300; }
        setTimeout(typeLoop, delay);
    }
    typeLoop();

    // =============================================
    // SCROLL REVEAL (IntersectionObserver)
    // =============================================

    const io = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('is-visible');
                io.unobserve(e.target);
            }
        });
    }, { threshold: 0.12 });

    document.querySelectorAll('[data-animate]').forEach(el => io.observe(el));

    // =============================================
    // ACTIVE NAV LINK on scroll
    // =============================================

    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const navIo = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(l => l.classList.remove('active'));
                const active = document.querySelector('.nav-link[href="#' + entry.target.id + '"]');
                if (active) active.classList.add('active');
            }
        });
    }, { rootMargin: '-50% 0px -45% 0px' });

    sections.forEach(s => navIo.observe(s));

    // =============================================
    // NAVBAR SCROLL SHADOW
    // =============================================

    const navbar = document.getElementById('navbar');
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                if (window.scrollY > 80) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
                ticking = false;
            });
            ticking = true;
        }
    });

    // =============================================
    // MOBILE NAV
    // =============================================

    const hamburger = document.getElementById('hamburger');
    const navLinksEl = document.getElementById('navLinks');

    hamburger.addEventListener('click', () => {
        const open = navLinksEl.classList.toggle('open');
        hamburger.classList.toggle('active', open);
        hamburger.setAttribute('aria-expanded', open);
    });

    navLinksEl.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
        navLinksEl.classList.remove('open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', false);
    }));

    // =============================================
    // PRINT-MODE TOGGLE
    // =============================================

    const modeToggle = document.getElementById('modeToggle');
    const modeLabel = document.getElementById('modeLabel');
    const htmlEl = document.documentElement;
    const prefersLight = window.matchMedia('(prefers-color-scheme: light)');

    function setMode(isLight) {
        htmlEl.setAttribute('data-mode', isLight ? 'diazo' : 'cyanotype');
        modeLabel.textContent = isLight ? 'CYANOTYPE' : 'DIAZO';
    }

    // Initial check
    setMode(prefersLight.matches);

    // Auto-follow system changes
    prefersLight.addEventListener('change', (e) => {
        setMode(e.matches);
    });

    // Manual toggle
    modeToggle.addEventListener('click', () => {
        const isDiazo = htmlEl.getAttribute('data-mode') === 'diazo';
        setMode(!isDiazo);
    });

    // =============================================
    // MAGNETIC CARD EFFECT (cursor-following glow)
    // =============================================

    if (!reduceMotion && window.innerWidth > 768) {
        const magneticCards = document.querySelectorAll('.magnetic-card');

        magneticCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                // Move glow elements to follow cursor
                const glow = card.querySelector('[class$="-glow"]');
                if (glow) {
                    glow.style.background = `radial-gradient(ellipse at ${x}px ${y}px, var(--signal-glow), transparent 60%)`;
                }

                // Subtle tilt
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = ((y - centerY) / centerY) * -2;
                const rotateY = ((x - centerX) / centerX) * 2;
                card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
                const glow = card.querySelector('[class$="-glow"]');
                if (glow) glow.style.background = '';
            });
        });
    }

    // =============================================
    // SMOOTH SCROLL for anchor links
    // =============================================

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (!href || href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const offset = 80;
                const targetPosition = target.offsetTop - offset;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        });
    });

    // =============================================
    // COUNTER ANIMATION for spec values (optional enhancement)
    // =============================================

    // Fade in orbs after page load for a cinematic entrance
    setTimeout(() => {
        document.querySelectorAll('.orb').forEach(orb => {
            orb.style.transition = 'opacity 2s ease';
            orb.style.opacity = '0.08';
        });
    }, 300);

    // =============================================
    // PERFORMANCE: pause animations when tab hidden
    // =============================================

    document.addEventListener('visibilitychange', () => {
        const scanLine = document.querySelector('.scan-line');
        if (scanLine) {
            scanLine.style.animationPlayState = document.hidden ? 'paused' : 'running';
        }
    });

})();
