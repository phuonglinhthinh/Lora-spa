/**
 * LORA SPA - Main JavaScript with GSAP Animations
 * GSAP is loaded via CDN in index.html - no imports needed
 */

// Register GSAP plugins (gsap and ScrollTrigger are global from CDN)
// eslint-disable-next-line no-undef
gsap.registerPlugin(ScrollTrigger);

const performanceConfig = {
    isMobile: window.matchMedia('(max-width: 767px)').matches,
    prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
};

function optimizeImageLoading() {
    const images = document.querySelectorAll('img');

    images.forEach((img, index) => {
        if (!img.hasAttribute('loading')) {
            img.loading = index < 2 ? 'eager' : 'lazy';
        }
        if (!img.hasAttribute('decoding')) {
        }
    });
}

// ==========================================
// Preloader
// ==========================================
const preloader = {
    element: document.getElementById('preloader'),
    progress: document.querySelector('.preloader-progress'),

    init() {
        const minDuration = 700;
        const start = performance.now();
                const bookingButtons = document.querySelectorAll('.booknow-btn, .js-book-appointy');
        gsap.to(this.progress, {
            width: '100%',
            duration: minDuration / 1000,
            ease: 'power1.out'
        });

        const finish = () => {
            const elapsed = performance.now() - start;
            const wait = Math.max(0, minDuration - elapsed);
            window.setTimeout(() => this.hide(), wait);
        };

        if (document.readyState === 'complete') {
            finish();
            return;
        }

        window.addEventListener('load', finish, { once: true });
    },

    hide() {
        gsap.to(this.element, {
            opacity: 0,
            duration: 0.5,
            ease: 'power2.inOut',
            onComplete: () => {
                this.element.style.display = 'none';
                document.body.classList.remove('no-scroll');
                heroAnimations.init();
            }
        });
    }
};

// ==========================================
// Navigation & Menu
// ==========================================
const navigation = {
    menuToggle: document.getElementById('menuToggle'),
    fullscreenMenu: document.getElementById('fullscreenMenu'),
    menuLinks: document.querySelectorAll('.menu-links a'),
    isOpen: false,

    init() {
        this.menuToggle.addEventListener('click', () => this.toggleMenu());

        this.menuLinks.forEach((link, index) => {
            link.style.transitionDelay = `${index * 0.1}s`;
            link.addEventListener('click', () => this.closeMenu());
        });
    },

    toggleMenu() {
        this.isOpen = !this.isOpen;
        this.menuToggle.classList.toggle('active');
        this.fullscreenMenu.classList.toggle('active');
        document.body.classList.toggle('no-scroll');

        if (this.isOpen) {
            this.animateMenuOpen();
        }
    },

    closeMenu() {
        this.isOpen = false;
        this.menuToggle.classList.remove('active');
        this.fullscreenMenu.classList.remove('active');
        document.body.classList.remove('no-scroll');
    },

    animateMenuOpen() {
        gsap.fromTo('.menu-links a',
            { y: 100, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.1,
                ease: 'power3.out'
            }
        );
    }
};

// ==========================================
// Hero Animations
// ==========================================
const heroAnimations = {
    init() {
        const reduced = performanceConfig.isMobile || performanceConfig.prefersReducedMotion;

        gsap.from('.hero-subtitle', {
            opacity: 0,
            y: reduced ? 10 : 24,
            duration: reduced ? 0.5 : 0.9,
            delay: 0.15,
            ease: 'power3.out'
        });

        gsap.from('.big-number', {
            opacity: 0,
            y: reduced ? 10 : 20,
            duration: reduced ? 0.6 : 1,
            delay: 0.25,
            ease: 'power3.out'
        });

        gsap.from('.hero-hours, .hero-cta, .scroll-indicator', {
            opacity: 0,
            y: 20,
            duration: reduced ? 0.5 : 0.8,
            stagger: reduced ? 0.1 : 0.2,
            delay: 0.4,
            ease: 'power3.out'
        });
    }
};

// ==========================================
// Scroll Animations
// ==========================================
const scrollAnimations = {
    enableMobileReveal() {
        const sections = document.querySelectorAll(
            '.menu-section, .gift-section, .about-section, .services-section, .team-section, .brand-marquee, .club-section, .footer'
        );

        sections.forEach(section => section.classList.add('perf-section'));

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -8% 0px'
        });

        sections.forEach(section => observer.observe(section));
    },

    init() {
        if (performanceConfig.isMobile || performanceConfig.prefersReducedMotion) {
            this.enableMobileReveal();
            return;
        }

        // Menu Section
        gsap.from('.section-header', {
            scrollTrigger: {
                trigger: '.menu-section',
                start: 'top 80%',
            },
            opacity: 0,
            y: 50,
            duration: 1,
            ease: 'power3.out'
        });

        gsap.from('.menu-intro', {
            scrollTrigger: {
                trigger: '.menu-intro',
                start: 'top 80%',
            },
            opacity: 0,
            y: 50,
            duration: 1,
            delay: 0.2,
            ease: 'power3.out'
        });

        // Treatment Cards
        gsap.from('.treatment-card', {
            scrollTrigger: {
                trigger: '.treatment-cards',
                start: 'top 80%',
            },
            opacity: 0,
            y: 80,
            duration: 1,
            stagger: 0.2,
            ease: 'power3.out'
        });

        // Gift Section
        gsap.from('.gift-image-1', {
            scrollTrigger: {
                trigger: '.gift-section',
                start: 'top 70%',
            },
            opacity: 0,
            x: -100,
            rotation: -5,
            duration: 1.2,
            ease: 'power3.out'
        });

        gsap.from('.gift-image-2', {
            scrollTrigger: {
                trigger: '.gift-section',
                start: 'top 70%',
            },
            opacity: 0,
            x: 100,
            rotation: 5,
            duration: 1.2,
            delay: 0.3,
            ease: 'power3.out'
        });

        gsap.from('.gift-content', {
            scrollTrigger: {
                trigger: '.gift-section',
                start: 'top 60%',
            },
            opacity: 0,
            y: 50,
            duration: 1,
            delay: 0.5,
            ease: 'power3.out'
        });

        // About Section
        gsap.from('.about-header', {
            scrollTrigger: {
                trigger: '.about-section',
                start: 'top 70%',
            },
            opacity: 0,
            x: -50,
            duration: 1,
            ease: 'power3.out'
        });

        gsap.from('.about-content', {
            scrollTrigger: {
                trigger: '.about-section',
                start: 'top 70%',
            },
            opacity: 0,
            x: 50,
            duration: 1,
            delay: 0.3,
            ease: 'power3.out'
        });

        // Services Section
        gsap.from('.services-slider', {
            scrollTrigger: {
                trigger: '.services-section',
                start: 'top 70%',
            },
            opacity: 0,
            y: 50,
            duration: 1,
            ease: 'power3.out'
        });

        gsap.from('.service-nav-item', {
            scrollTrigger: {
                trigger: '.services-nav',
                start: 'top 80%',
            },
            opacity: 0,
            y: 30,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power3.out'
        });

        // Team Section
        gsap.from('.team-member', {
            scrollTrigger: {
                trigger: '.team-section',
                start: 'top 70%',
            },
            opacity: 0,
            y: 50,
            scale: 0.9,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power3.out'
        });

        // Club Section
        gsap.from('.club-header', {
            scrollTrigger: {
                trigger: '.club-section',
                start: 'top 70%',
            },
            opacity: 0,
            y: 50,
            duration: 1,
            ease: 'power3.out'
        });

        gsap.from('.club-card', {
            scrollTrigger: {
                trigger: '.club-cards',
                start: 'top 80%',
            },
            opacity: 0,
            y: 50,
            rotation: -5,
            duration: 1,
            stagger: 0.2,
            ease: 'power3.out'
        });

        // Footer
        gsap.from('.footer-cta', {
            scrollTrigger: {
                trigger: '.footer',
                start: 'top 80%',
            },
            opacity: 0,
            scale: 0.8,
            duration: 1,
            ease: 'power3.out'
        });

        gsap.from('.footer-image', {
            scrollTrigger: {
                trigger: '.footer-image',
                start: 'top 80%',
            },
            opacity: 0,
            y: 50,
            duration: 0.5,
            ease: 'power3.out'
        });

    }
};

// ==========================================
// Services Slider
// ==========================================
const servicesSlider = {
    slides: document.querySelectorAll('.service-slide'),
    navItems: document.querySelectorAll('.service-nav-item'),
    currentSlide: 0,
    timerId: null,

    init() {
        if (!this.slides.length) {
            return;
        }

        // Ensure nav cards are visible before slider state updates.
        gsap.set(this.navItems, { clearProps: 'opacity,transform' });

        const activeSlideIndex = Array.from(this.slides).findIndex(slide => slide.classList.contains('active'));
        this.currentSlide = activeSlideIndex >= 0 ? activeSlideIndex : 0;

        if (this.slides.length !== this.navItems.length) {
            console.warn('[servicesSlider] slide/nav count mismatch:', this.slides.length, this.navItems.length);
        }

        this.navItems.forEach((item, index) => {
            const targetIndex = Number(item.dataset.slide);
            const safeIndex = Number.isInteger(targetIndex) ? targetIndex : index;
            item.addEventListener('click', () => this.goToSlide(safeIndex));
        });

        // Auto-advance slides
        this.timerId = window.setInterval(() => this.nextSlide(), 5000);
    },

    goToSlide(index) {
        if (!this.slides.length) {
            return;
        }

        const normalizedIndex = ((index % this.slides.length) + this.slides.length) % this.slides.length;

        // Remove active class from current
        if (this.slides[this.currentSlide]) {
            this.slides[this.currentSlide].classList.remove('active');
        }
        gsap.set(this.navItems, { clearProps: 'opacity,transform' });
        this.navItems.forEach(item => item.classList.remove('active'));

        // Update current
        this.currentSlide = normalizedIndex;

        // Add active class to new
        this.slides[this.currentSlide].classList.add('active');
        if (this.navItems[this.currentSlide]) {
            this.navItems[this.currentSlide].classList.add('active');
        }

        // Animate slide content
        gsap.fromTo(this.slides[this.currentSlide].querySelector('.slide-content'),
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
        );
    },

    nextSlide() {
        const next = (this.currentSlide + 1) % this.slides.length;
        this.goToSlide(next);
    }
};

// ==========================================
// Smooth Scroll
// ==========================================
const smoothScroll = {
    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
};

// ==========================================
// Cursor Effects (Optional - Desktop Only)
// ==========================================
const cursorEffects = {
    cursor: null,

    init() {
        if (window.matchMedia('(pointer: fine)').matches) {
            this.createCursor();
            this.addEventListeners();
        }
    },

    createCursor() {
        this.cursor = document.createElement('div');
        this.cursor.className = 'custom-cursor';
        this.cursor.innerHTML = '<div class="cursor-dot"></div><div class="cursor-ring"></div>';
        document.body.appendChild(this.cursor);

        // Add cursor styles
        const style = document.createElement('style');
        style.textContent = `
            .custom-cursor {
                position: fixed;
                top: 0;
                left: 0;
                pointer-events: none;
                z-index: 99999;
                mix-blend-mode: difference;
            }
            .cursor-dot {
                position: absolute;
                width: 8px;
                height: 8px;
                background: #fff;
                border-radius: 50%;
                transform: translate(-50%, -50%);
            }
            .cursor-ring {
                position: absolute;
                width: 40px;
                height: 40px;
                border: 1px solid rgba(255,255,255,0.5);
                border-radius: 50%;
                transform: translate(-50%, -50%);
                transition: transform 0.1s ease, opacity 0.1s ease;
            }
            .custom-cursor.hovering .cursor-ring {
                transform: translate(-50%, -50%) scale(0.5);
                opacity: 0.5;
            }
        `;
        document.head.appendChild(style);
    },

    addEventListeners() {
        document.addEventListener('mousemove', (e) => {
            gsap.to(this.cursor.querySelector('.cursor-dot'), {
                x: e.clientX,
                y: e.clientY,
                duration: 0.1
            });
            gsap.to(this.cursor.querySelector('.cursor-ring'), {
                x: e.clientX,
                y: e.clientY,
                duration: 0.3
            });
        });

        // Add hover effect to interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .treatment-card, .service-nav-item');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => this.cursor.classList.add('hovering'));
            el.addEventListener('mouseleave', () => this.cursor.classList.remove('hovering'));
        });
    }
};

// ==========================================
// Text Reveal Animation
// ==========================================
const textReveal = {
    init() {
        // Split text for character animation
        const splitTexts = document.querySelectorAll('[data-split]');
        splitTexts.forEach(text => {
            const chars = text.textContent.split('');
            text.innerHTML = chars.map(char =>
                `<span class="char">${char === ' ' ? '&nbsp;' : char}</span>`
            ).join('');
        });
    }
};

// ==========================================
// Image Hover Effects
// ==========================================
const imageHover = {
    init() {
        const cards = document.querySelectorAll('.treatment-card, .gift-image, .club-card');

        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                gsap.to(card, {
                    scale: 1.02,
                    duration: 0.4,
                    ease: 'power2.out'
                });
            });

            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    scale: 1,
                    duration: 0.4,
                    ease: 'power2.out'
                });
            });
        });
    }
};

// ==========================================
// Contact Widget Toggle
// ==========================================
const toggleContactIcons = () => {
    const icons = document.getElementById('contactIcons');
    if (!icons) return;
    icons.classList.toggle('is-open');
};

// ==========================================
// Booking Window
// ==========================================
const bookingManager = {
    modal: document.getElementById('bookingModal'),
    container: document.getElementById('tidycal-iframe-container'),
    iframe: null,
    closeBtn: null,
    backBtn: null,
    tidyCalLink: 'https://tidycal.com/loraspa',
    isModalOpen: false,
    hasLoadedMainPage: false,

    init() {
        if (!this.modal) return;

        this.iframe = this.modal.querySelector('iframe');
        this.closeBtn = this.modal.querySelector('.modal-close, .close-button');
        this.backBtn = this.modal.querySelector('.back-button');

        const bookingButtons = document.querySelectorAll('.booknow-btn, .js-book-appointy');

        bookingButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.open();
            });
        });

        if (this.closeBtn) {
            this.closeBtn.style.display = 'block';
            this.closeBtn.addEventListener('click', () => this.close());
        }

        if (this.backBtn) {
            this.backBtn.style.display = 'none';
            this.backBtn.addEventListener('click', () => this.goToMainPage());
        }

        if (this.iframe) {
            this.iframe.addEventListener('load', () => {
                if (!this.isModalOpen) return;

                if (!this.hasLoadedMainPage) {
                    this.hasLoadedMainPage = true;
                    this.hideNavigationActions();
                    return;
                }

                // A second iframe load while modal is open is treated as sublink navigation.
                this.showNavigationActions();
            });
        }

        // Đóng khi click vùng nền bên ngoài modal-content
        this.modal.addEventListener('click', (event) => {
            if (event.target === this.modal) {
                this.close();
            }
        });
    },

    hideNavigationActions() {
        if (this.backBtn) this.backBtn.style.display = 'none';
    },

    showNavigationActions() {
        if (this.backBtn) this.backBtn.style.display = 'block';
    },

    goToMainPage() {
        if (!this.iframe) return;

        this.hasLoadedMainPage = false;
        this.hideNavigationActions();
        this.iframe.src = this.tidyCalLink;
    },

    open() {
        if (!this.modal) return;

        this.modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        this.isModalOpen = true;
        this.hasLoadedMainPage = false;
        this.hideNavigationActions();

        if (this.iframe) {
            this.iframe.src = this.tidyCalLink;
        }

        gsap.fromTo('.modal',
            { scale: 0.8, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.1, ease: 'linear' }
        );
    },

    close() {
        if (!this.modal) return;

        this.isModalOpen = false;
        this.hideNavigationActions();

        gsap.to('.modal', {
            scale: 0.8,
            opacity: 0,
            duration: 0.1,
            ease: 'power3.in',
            onComplete: () => {
                this.modal.style.display = 'none';
                document.body.style.overflow = '';
            }
        });
    }
};


// ==========================================
// Initialize Everything
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Lock scroll during preloader
    document.body.classList.add('no-scroll');

    optimizeImageLoading();

    // Initialize preloader
    preloader.init();

    // Initialize navigation
    navigation.init();

    // Smooth anchor navigation
    smoothScroll.init();

    // Initialize scroll animations
    scrollAnimations.init();

    // Initialize services slider
    servicesSlider.init();

    // Initialize cursor effects
    cursorEffects.init();

    // Initialize image hover effects
    imageHover.init();

    // Initialize booking
    bookingManager.init();

});

// Refresh ScrollTrigger on window resize
window.addEventListener('resize', () => {
    ScrollTrigger.refresh();
});
