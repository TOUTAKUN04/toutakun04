// ===================================
// PARTICLE ANIMATION SYSTEM
// ===================================

class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particles');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.particleCount = window.innerWidth < 480 ? 18 : window.innerWidth < 768 ? 28 : 80;
        this.connectDistance = window.innerWidth < 480 ? 70 : window.innerWidth < 768 ? 90 : 120;
        this.mouse = { x: null, y: null, radius: window.innerWidth < 768 ? 110 : 150 };

        this.init();
    }

    init() {
        this.resizeCanvas();
        this.createParticles();
        this.animate();

        window.addEventListener('resize', () => this.resizeCanvas());
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.x;
            this.mouse.y = e.y;
        });
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        const targetCount = window.innerWidth < 480 ? 18 : window.innerWidth < 768 ? 28 : 80;
        this.connectDistance = window.innerWidth < 480 ? 70 : window.innerWidth < 768 ? 90 : 120;
        this.mouse.radius = window.innerWidth < 768 ? 110 : 150;

        if (this.particleCount !== targetCount) {
            this.particleCount = targetCount;
            this.createParticles();
        }
    }

    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 3 + 1
            });
        }
    }

    drawParticles() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Get accent color from CSS variable
        const accentColor = getComputedStyle(document.documentElement)
            .getPropertyValue('--accent-primary').trim();

        this.particles.forEach((particle, i) => {
            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = accentColor;
            this.ctx.fill();

            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Bounce off edges
            if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;

            // Mouse interaction
            const dx = this.mouse.x - particle.x;
            const dy = this.mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.mouse.radius) {
                const force = (this.mouse.radius - distance) / this.mouse.radius;
                particle.x -= dx * force * 0.02;
                particle.y -= dy * force * 0.02;
            }

            // Connect nearby particles
            for (let j = i + 1; j < this.particles.length; j++) {
                const other = this.particles[j];
                const dx = particle.x - other.x;
                const dy = particle.y - other.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.connectDistance) {
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = accentColor;
                    this.ctx.globalAlpha = 1 - distance / this.connectDistance;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(other.x, other.y);
                    this.ctx.stroke();
                    this.ctx.globalAlpha = 1;
                }
            }
        });
    }

    animate() {
        this.drawParticles();
        requestAnimationFrame(() => this.animate());
    }
}

// ===================================
// TYPING ANIMATION
// ===================================

class TypingAnimation {
    constructor(element, texts, typingSpeed = 100, deletingSpeed = 50, pauseTime = 2000) {
        this.element = element;
        this.texts = texts;
        this.typingSpeed = typingSpeed;
        this.deletingSpeed = deletingSpeed;
        this.pauseTime = pauseTime;
        this.textIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;

        this.type();
    }

    type() {
        const currentText = this.texts[this.textIndex];

        if (this.isDeleting) {
            this.element.textContent = currentText.substring(0, this.charIndex - 1);
            this.charIndex--;
        } else {
            this.element.textContent = currentText.substring(0, this.charIndex + 1);
            this.charIndex++;
        }

        let timeout = this.isDeleting ? this.deletingSpeed : this.typingSpeed;

        if (!this.isDeleting && this.charIndex === currentText.length) {
            timeout = this.pauseTime;
            this.isDeleting = true;
        } else if (this.isDeleting && this.charIndex === 0) {
            this.isDeleting = false;
            this.textIndex = (this.textIndex + 1) % this.texts.length;
        }

        setTimeout(() => this.type(), timeout);
    }
}

// ===================================
// SCROLL ANIMATIONS
// ===================================

class ScrollAnimations {
    constructor() {
        this.elements = document.querySelectorAll('[data-animate]');
        this.init();
    }

    init() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                }
            });
        }, observerOptions);

        this.elements.forEach(element => observer.observe(element));
    }
}

// ===================================
// SMOOTH SCROLLING
// ===================================

function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (!href || href === '#') {
                e.preventDefault();
                return;
            }

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const offset = 80; // Account for fixed navbar
                const targetPosition = target.offsetTop - offset;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                const navLinks = document.getElementById('navLinks');
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    const hamburger = document.getElementById('hamburger');
                    if (hamburger) {
                        hamburger.classList.remove('active');
                        hamburger.setAttribute('aria-expanded', 'false');
                    }
                }
            }
        });
    });
}

// ===================================
// THEME TOGGLE
// ===================================

class ThemeToggle {
    constructor() {
        this.toggleBtn = document.getElementById('themeToggle');
        this.body = document.body;
        this.icon = this.toggleBtn.querySelector('i');
        this.prefersLight = window.matchMedia('(prefers-color-scheme: light)');

        // Always start from system preference
        this.applySystemTheme();

        this.toggleBtn.addEventListener('click', () => this.toggle());

        this.prefersLight.addEventListener('change', () => {
            this.applySystemTheme();
        });
    }

    toggle() {
        if (this.body.classList.contains('light-mode')) {
            this.enableDarkMode();
        } else {
            this.enableLightMode();
        }
    }

    applySystemTheme() {
        if (this.prefersLight.matches) {
            this.enableLightMode();
        } else {
            this.enableDarkMode();
        }
    }

    enableLightMode() {
        this.body.classList.add('light-mode');
        this.icon.classList.remove('fa-moon');
        this.icon.classList.add('fa-sun');
    }

    enableDarkMode() {
        this.body.classList.remove('light-mode');
        this.icon.classList.remove('fa-sun');
        this.icon.classList.add('fa-moon');
    }
}

// ===================================
// MOBILE MENU
// ===================================

function setupMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    const setMenuState = (isOpen) => {
        navLinks.classList.toggle('active', isOpen);
        hamburger.classList.toggle('active', isOpen);
        hamburger.setAttribute('aria-expanded', String(isOpen));
    };

    hamburger.addEventListener('click', () => {
        const isOpen = !navLinks.classList.contains('active');
        setMenuState(isOpen);
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
            setMenuState(false);
        }
    });
}

// ===================================
// NAVBAR SCROLL EFFECT
// ===================================

function setupNavbarScroll() {
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
        } else {
            navbar.style.boxShadow = 'none';
        }

        lastScroll = currentScroll;
    });
}

// ===================================
// INITIALIZE ON PAGE LOAD
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize particle system
    new ParticleSystem();

    // Initialize typing animation
    const typingText = document.getElementById('typingText');
    const texts = [
        'Frontend Developer',
        'Automation Learner',
        'Community Strategist',
        'Problem Solver'
    ];
    new TypingAnimation(typingText, texts);

    // Initialize scroll animations
    new ScrollAnimations();

    // Setup smooth scrolling
    setupSmoothScrolling();

    // Initialize theme toggle
    new ThemeToggle();

    // Setup mobile menu
    setupMobileMenu();

    // Setup navbar scroll effect
    setupNavbarScroll();

    // Animate skill bars on scroll
    const skillBars = document.querySelectorAll('.skill-progress');
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const width = entry.target.style.width;
                entry.target.style.width = '0';
                setTimeout(() => {
                    entry.target.style.width = width;
                }, 100);
                skillObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    skillBars.forEach(bar => skillObserver.observe(bar));
});

// ===================================
// PERFORMANCE OPTIMIZATION
// ===================================

// Pause animations when tab is not visible
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause expensive animations if needed
    }
});
