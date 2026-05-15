const performanceConfig = {
    isMobile: window.matchMedia('(max-width: 767px)').matches,
    prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
};

const scheduleIdleTask = (callback, timeout = 250) => {
    if ('requestIdleCallback' in window) {
        window.requestIdleCallback(callback, { timeout });
        return;
    }

    window.setTimeout(callback, 120);
};

const preloader = {
    element: null,
    progress: null,
    rafId: null,
    fallbackTimerId: null,
    startTime: 0,
    hasCompleted: false,
    minVisibleDuration: 400,
    progressValue: 0,
    targetProgress: 0,
    lastTargetUpdate: 0,

    init() {
        this.element = document.getElementById('preloader');
        this.progress = document.querySelector('.preloader-progress');

        if (!this.element || !this.progress) {
            return;
        }

        this.startTime = performance.now();
        document.body.classList.add('no-scroll');

        this.progressValue = 0;
        this.targetProgress = 0;
        this.lastTargetUpdate = this.startTime;
        this.rafId = window.requestAnimationFrame((timestamp) => this.animateProgress(timestamp));

        const finish = () => this.complete();
        window.addEventListener('load', finish, { once: true });
        this.fallbackTimerId = window.setTimeout(finish, 2200);
    },

    animateProgress(timestamp) {
        if (this.hasCompleted || !this.progress) {
            return;
        }

        if (timestamp - this.lastTargetUpdate >= 160) {
            this.targetProgress = Math.min(this.targetProgress + 8 + Math.random() * 12, 92);
            this.lastTargetUpdate = timestamp;
        }

        this.progressValue += (this.targetProgress - this.progressValue) * 0.16;
        this.progress.style.width = `${this.progressValue.toFixed(1)}%`;
        this.rafId = window.requestAnimationFrame((nextTimestamp) => this.animateProgress(nextTimestamp));
    },

    complete() {
        if (this.hasCompleted || !this.element || !this.progress) {
            return;
        }

        this.hasCompleted = true;

        if (this.rafId) {
            window.cancelAnimationFrame(this.rafId);
            this.rafId = null;
        }

        if (this.fallbackTimerId) {
            window.clearTimeout(this.fallbackTimerId);
            this.fallbackTimerId = null;
        }

        this.progress.style.width = '100%';

        const elapsed = performance.now() - this.startTime;
        const minWait = Math.max(0, this.minVisibleDuration - elapsed);

        window.setTimeout(() => this.hide(), minWait + 120);
    },

    hide() {
        if (!this.element) {
            return;
        }

        this.element.classList.add('is-hidden');
        document.body.classList.remove('no-scroll');

        window.setTimeout(() => {
            this.element?.remove();
            this.element = null;
        }, 420);
    }
};

preloader.init();

function optimizeImageLoading() {
    const priorityImages = new Set([
        ...document.querySelectorAll('.navbar img, .hero-title img, .detail-partner img')
    ]);

    document.querySelectorAll('img').forEach((img, index) => {
        const isPriorityImage = priorityImages.has(img) || index < 2;

        if (!img.hasAttribute('loading')) {
            img.loading = isPriorityImage ? 'eager' : 'lazy';
        }

        if (!img.hasAttribute('decoding')) {
            img.decoding = 'async';
        }

        if (!img.hasAttribute('fetchpriority')) {
            img.fetchPriority = isPriorityImage ? 'high' : 'low';
        }
    });
}

const deferredBackgrounds = {
    init() {
        const backgroundTargets = document.querySelectorAll('.hero, .detail-wrapper');

        backgroundTargets.forEach((element) => {
            scheduleIdleTask(() => {
                element.classList.add('bg-loaded');
            });
        });
    }
};

const navigation = {
    menuToggle: document.getElementById('menuToggle'),
    fullscreenMenu: document.getElementById('fullscreenMenu'),
    menuLinks: document.querySelectorAll('.menu-links a'),
    isOpen: false,

    init() {
        if (!this.menuToggle || !this.fullscreenMenu) {
            return;
        }

        this.menuToggle.addEventListener('click', () => this.toggleMenu());

        this.menuLinks.forEach((link) => {
            link.addEventListener('click', () => this.closeMenu());
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                this.closeMenu();
            }
        });
    },

    toggleMenu() {
        this.isOpen ? this.closeMenu() : this.openMenu();
    },

    openMenu() {
        this.isOpen = true;
        this.menuToggle.classList.add('active');
        this.fullscreenMenu.classList.add('active');
        document.body.classList.add('no-scroll');
    },

    closeMenu() {
        this.isOpen = false;
        this.menuToggle.classList.remove('active');
        this.fullscreenMenu.classList.remove('active');
        document.body.classList.remove('no-scroll');
    }
};

const revealAnimations = {
    init() {
        const targets = document.querySelectorAll(
            '.menu-section, .gift-section, .about-section, .services-section, .products-section, .club-section, .footer, .detail-content, .pricing-table-container, .product-slide, .treatment-card, .gift-image, .service-nav-item, .club-card'
        );

        if (!targets.length) {
            return;
        }

        targets.forEach((target) => target.classList.add('perf-reveal'));

        if (performanceConfig.prefersReducedMotion) {
            targets.forEach((target) => target.classList.add('is-visible'));
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            });
        }, {
            threshold: performanceConfig.isMobile ? 0.05 : 0.15,
            rootMargin: '0px 0px -8% 0px'
        });

        targets.forEach((target, index) => {
            if (index < 2) {
                target.classList.add('is-visible');
                return;
            }

            observer.observe(target);
        });
    }
};

const servicesSlider = {
    slides: Array.from(document.querySelectorAll('.service-slide')),
    navItems: Array.from(document.querySelectorAll('.service-nav-item')),
    currentSlide: 0,
    timerId: null,

    init() {
        if (!this.slides.length) {
            return;
        }

        const activeSlideIndex = this.slides.findIndex((slide) => slide.classList.contains('active'));
        this.currentSlide = activeSlideIndex >= 0 ? activeSlideIndex : 0;

        this.navItems.forEach((item, index) => {
            const parsedIndex = Number(item.dataset.slide);
            const targetIndex = Number.isInteger(parsedIndex) ? parsedIndex : index;
            item.addEventListener('click', () => this.goToSlide(targetIndex));
        });

        if (this.slides.length > 1) {
            this.startAutoplay();

            const sliderRoot = document.querySelector('.services-section');
            if (sliderRoot) {
                sliderRoot.addEventListener('mouseenter', () => this.stopAutoplay());
                sliderRoot.addEventListener('mouseleave', () => this.startAutoplay());
            }

            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    this.stopAutoplay();
                    return;
                }

                this.startAutoplay();
            });
        }
    },

    startAutoplay() {
        if (this.timerId || this.slides.length < 2) {
            return;
        }

        this.timerId = window.setInterval(() => this.nextSlide(), 5000);
    },

    stopAutoplay() {
        if (!this.timerId) {
            return;
        }

        window.clearInterval(this.timerId);
        this.timerId = null;
    },

    goToSlide(index) {
        const normalizedIndex = ((index % this.slides.length) + this.slides.length) % this.slides.length;

        this.slides[this.currentSlide]?.classList.remove('active');
        this.navItems[this.currentSlide]?.classList.remove('active');

        this.currentSlide = normalizedIndex;

        this.slides[this.currentSlide]?.classList.add('active');
        this.navItems[this.currentSlide]?.classList.add('active');
    },

    nextSlide() {
        this.goToSlide(this.currentSlide + 1);
    }
};

const smoothScroll = {
    init() {
        document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
            anchor.addEventListener('click', (event) => {
                const targetSelector = anchor.getAttribute('href');

                if (!targetSelector || targetSelector === '#') {
                    return;
                }

                const target = document.querySelector(targetSelector);
                if (!target) {
                    return;
                }

                event.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            });
        });
    }
};

window.toggleContactIcons = () => {
    const icons = document.getElementById('contactIcons');
    if (!icons) {
        return;
    }

    icons.classList.toggle('is-open');
};

const bookingManager = {
    modal: document.getElementById('bookingModal'),
    iframe: null,
    closeBtn: null,
    backBtn: null,
    tidyCalLink: 'https://tidycal.com/loraspa',
    hasLoadedMainPage: false,

    init() {
        if (!this.modal) {
            return;
        }

        this.iframe = this.modal.querySelector('iframe');
        this.closeBtn = this.modal.querySelector('.modal-close, .close-button');
        this.backBtn = this.modal.querySelector('.back-button');

        document.querySelectorAll('.booknow-btn, .js-book-appointy').forEach((button) => {
            button.addEventListener('click', (event) => {
                event.preventDefault();
                this.open();
            });
        });

        this.closeBtn?.addEventListener('click', () => this.close());
        this.backBtn?.addEventListener('click', () => this.goToMainPage());

        this.modal.addEventListener('click', (event) => {
            if (event.target === this.modal) {
                this.close();
            }
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && this.modal.classList.contains('is-open')) {
                this.close();
            }
        });

        this.iframe?.addEventListener('load', () => {
            if (!this.modal.classList.contains('is-open')) {
                return;
            }

            if (!this.hasLoadedMainPage) {
                this.hasLoadedMainPage = true;
                this.hideNavigationActions();
                return;
            }

            this.showNavigationActions();
        });

        this.hideNavigationActions();
    },

    hideNavigationActions() {
        if (this.backBtn) {
            this.backBtn.style.display = 'none';
        }
    },

    showNavigationActions() {
        if (this.backBtn) {
            this.backBtn.style.display = 'block';
        }
    },

    goToMainPage() {
        if (!this.iframe) {
            return;
        }

        this.hasLoadedMainPage = false;
        this.hideNavigationActions();
        this.iframe.src = this.tidyCalLink;
    },

    open() {
        if (!this.modal) {
            return;
        }

        this.modal.classList.add('is-open');
        document.body.classList.add('no-scroll');
        this.hasLoadedMainPage = false;
        this.hideNavigationActions();

        if (this.iframe && this.iframe.src !== this.tidyCalLink) {
            this.iframe.src = this.tidyCalLink;
        }
    },

    close() {
        if (!this.modal) {
            return;
        }

        this.modal.classList.remove('is-open');
        document.body.classList.remove('no-scroll');
        this.hideNavigationActions();
    }
};

document.addEventListener('DOMContentLoaded', () => {
    preloader.complete();
    optimizeImageLoading();
    deferredBackgrounds.init();
    navigation.init();
    revealAnimations.init();
    servicesSlider.init();
    smoothScroll.init();
    bookingManager.init();
});
