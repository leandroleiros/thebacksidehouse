/* global updateContent, toggleLanguage, toggleMenu, closeLightbox,
          openLightbox, trackBooking, trackWhatsApp, trackSocialClick, trackMapClick,
          trackScrollDepth, updateNavbarOnScroll, handleImageError, Lenis */

// ======================
// INTERSECTION OBSERVER (Animaciones al scroll)
// ======================
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-on-scroll');
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1
});

// ======================
// SCROLL HANDLER (RAF batched)
// ======================
let navbarScrollTicking = false;
const backToTopBtn = document.getElementById('back-to-top');
function handleScroll() {
    if (!navbarScrollTicking) {
        navbarScrollTicking = true;
        requestAnimationFrame(function () {
            updateNavbarOnScroll();
            // Show/hide back-to-top button
            if (backToTopBtn) {
                if (window.scrollY > 300) {
                    backToTopBtn.classList.add('visible');
                } else {
                    backToTopBtn.classList.remove('visible');
                }
            }
            navbarScrollTicking = false;
        });
    }
    trackScrollDepth();
}

window.addEventListener('scroll', handleScroll, { passive: true });

// ======================
// EVENT DELEGATION (evita onclick inline para CSP sin 'unsafe-inline')
// ======================
document.body.addEventListener('click', function (e) {
    const el = e.target.closest('[data-action]');
    if (!el) return;
    const action = el.getAttribute('data-action');
    switch (action) {
        case 'toggle-menu':
            toggleMenu();
            break;
        case 'toggle-language':
            e.preventDefault();
            toggleLanguage();
            break;
        case 'close-lightbox':
            e.preventDefault();
            closeLightbox(e, el.getAttribute('data-force') === 'true');
            break;
        case 'scroll-top':
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'
            });
            break;
        case 'track-booking':
            if (el.getAttribute('data-close-menu') === 'true') {
                toggleMenu();
            }
            if (typeof trackBooking === 'function') {
                trackBooking(el.getAttribute('data-track-label') || '');
            }
            break;
        case 'track-social':
            if (typeof trackSocialClick === 'function') {
                trackSocialClick(el.getAttribute('data-social-platform') || '', el.getAttribute('data-social-location') || '');
            }
            break;
        case 'track-map-click':
            e.preventDefault();
            if (typeof trackMapClick === 'function') trackMapClick();
            break;
        case 'track-whatsapp':
            if (typeof trackWhatsApp === 'function') {
                trackWhatsApp(el.getAttribute('data-whatsapp-section') || '');
            }
            break;
        case 'open-lightbox':
            e.preventDefault();
            if (typeof openLightbox === 'function') {
                openLightbox(el.getAttribute('data-lightbox-src') || '');
            }
            break;
        case 'carousel-prev':
        case 'carousel-next': {
            const carouselId = el.getAttribute('data-carousel-id');
            if (carouselId) {
                const carousel = document.getElementById(carouselId);
                const direction = action === 'carousel-prev' ? -300 : 300;
                if (carousel) carousel.scrollBy({ left: direction, behavior: 'smooth' });
            }
            break;
        }
        case 'close-wa-bubble': {
            const wa = document.getElementById('wa-bubble');
            if (wa) wa.style.display = 'none';
            break;
        }
    }
});

// ======================
// DOM CONTENT LOADED
// ======================
document.addEventListener('DOMContentLoaded', () => {
    // Lenis smooth scroll
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (typeof Lenis !== 'undefined' && !prefersReducedMotion) {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            smoothWheel: true
        });
        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
    }

    // Detectar idioma inicial
    const savedLang = localStorage.getItem('lang');
    if (savedLang) {
        currentLang = savedLang;
    } else {
        const userLang = navigator.language || navigator.userLanguage;
        if (userLang.startsWith('es')) {
            currentLang = 'es';
        }
    }

    updateContent();

    // Animar elementos
    document.querySelectorAll('.vibe-card').forEach(card => {
        observer.observe(card);
    });

    // Globo WhatsApp
    const waBubble = document.getElementById('wa-bubble');
    if (waBubble) waBubble.style.display = 'block';

    // Fallback de imagen (evita onerror inline bloqueado por CSP)
    document.querySelectorAll('img').forEach(function (img) {
        img.addEventListener('error', function () { handleImageError(this); });
    });
});
