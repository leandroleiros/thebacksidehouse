/* exported handleImageError, trackBooking, trackWhatsApp, trackSocialClick, trackMapClick, openLightbox, toggleLanguage */
// ======================
// IMAGE ERROR HANDLING
// ======================
function handleImageError(img) {
    if (!img || !img.parentElement) return;

    // Prevenir loop infinito
    if (img.dataset.fallbackAttempted) {
        // Ya intentó el fallback, mostrar placeholder CSS
        img.style.display = 'none';
        const placeholder = document.createElement('div');
        placeholder.className = 'image-placeholder';
        placeholder.textContent = 'Image not available';
        img.parentElement.appendChild(placeholder);
        return;
    }
    
    // Marcar que ya intentó
    img.dataset.fallbackAttempted = 'true';
    
    // Intentar fallback genérico
    img.src = 'https://placehold.co/600x400/4A7C85/white?text=The+Backside+House';
}

// ======================
// GOOGLE ANALYTICS (inicialización en index.html; aquí solo envío de eventos)
// ======================
function trackEvent(eventName, params) {
    try {
        if (typeof gtag !== 'undefined' && window.dataLayer) {
            gtag('event', eventName, params);
        }
    } catch (_e) {
        // Silently fail - analytics errors shouldn't break the site
    }
}

function trackBooking(location) {
    trackEvent('click_booking', {
        'event_category': 'Conversion',
        'event_label': location,
        'value': 1
    });
}

function trackWhatsApp(section) {
    trackEvent('click_whatsapp', {
        'event_category': 'Lead',
        'event_label': section
    });
}

function trackSocialClick(platform, location) {
    trackEvent('click_social', {
        'event_category': 'Engagement',
        'event_label': `${platform} - ${location}`
    });
}

function trackMapClick() {
    trackEvent('click_map', {
        'event_category': 'Engagement',
        'event_label': 'Google Maps'
    });
}

// ======================
// LIGHTBOX FUNCTIONS
// ======================
function openLightbox(imgSrc) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    if (!lightbox || !lightboxImg) return;

    lightboxImg.src = imgSrc;
    lightbox.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeLightbox(event, force = false) {
    if (force || (event && event.target && event.target.id === 'lightbox')) {
        const lightbox = document.getElementById('lightbox');
        if (lightbox) {
            lightbox.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }
    }
}

// Cerrar con tecla ESC
document.addEventListener('keydown', function(event) {
    if (event.key === "Escape") {
        const lightbox = document.getElementById('lightbox');
        if (!lightbox.classList.contains('hidden')) {
            closeLightbox(null, true);
        }
    }
});

// ======================
// LANGUAGE TOGGLE
// ======================
let currentLang = 'en'; // Default to English

// Frases para Typed.js en el hero (opción 2: rotación por idioma)
let heroTypedInstance = null;
const heroTypedStrings = {
    en: ['Find your flow.', 'Meet your tribe.', 'Find your home.'],
    es: ['Encuentra tu flow.', 'Conocé tu tribu.', 'Encuentra tu hogar.']
};

function initHeroTyped() {
    const el = document.getElementById('hero-typed');
    if (!el) return;
    const h1 = el.closest('h1');
    if (!h1) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || typeof translations === 'undefined') {
        if (translations && translations[currentLang] && translations[currentLang].hero_title) {
            h1.innerHTML = translations[currentLang].hero_title;
        }
        return;
    }

    if (heroTypedInstance) {
        heroTypedInstance.destroy();
        heroTypedInstance = null;
    }

    if (typeof Typed === 'undefined') {
        h1.innerHTML = translations[currentLang].hero_title;
        return;
    }

    const strings = heroTypedStrings[currentLang] || heroTypedStrings.en;
    heroTypedInstance = new Typed('#hero-typed', {
        strings: strings,
        typeSpeed: 60,
        backSpeed: 40,
        backDelay: 2000,
        loop: true,
        showCursor: true,
        cursorChar: '|'
    });
}

function updateContent() {
    // Verificar si translations existe (por si falla la carga externa)
    if (typeof translations === 'undefined') {
        console.warn('Translations file not loaded yet.');
        return;
    }

    // Actualizar atributo lang del HTML
    const htmlRoot = document.getElementById('html-root') || document.documentElement;
    htmlRoot.setAttribute('lang', currentLang);

    // Translate Text
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[currentLang] && translations[currentLang][key]) {
            const content = translations[currentLang][key];
            // Usar textContent para texto plano, innerHTML solo si contiene HTML
            if (content.includes('<br') || content.includes('<span') || content.includes('<b>')) {
                el.innerHTML = content;
            } else {
                el.textContent = content;
            }
        }
    });

    // Translate Image ALTs
    const images = document.querySelectorAll('[data-i18n-alt]');
    images.forEach(img => {
        const key = img.getAttribute('data-i18n-alt');
        if (translations[currentLang] && translations[currentLang][key]) {
            img.alt = translations[currentLang][key];
        }
    });
    
    const imgDesktop = document.getElementById('lang-display');
    const imgMobile = document.getElementById('lang-display-mobile');
    const textDesktop = document.getElementById('lang-display-text');
    const textMobile = document.getElementById('lang-display-mobile-text');

    // Banderas vía flagcdn.com: gb = inglés (UK), es = español (España). Texto: EN / ES
    const flagUrl = currentLang === 'en' ? 'https://flagcdn.com/24x18/gb.png' : 'https://flagcdn.com/24x18/es.png';
    const flagAlt = currentLang === 'en' ? 'English' : 'Español';
    const langCode = currentLang === 'en' ? 'EN' : 'ES';
    if (imgDesktop) {
        imgDesktop.src = flagUrl;
        imgDesktop.alt = flagAlt;
    }
    if (imgMobile) {
        imgMobile.src = flagUrl;
        imgMobile.alt = flagAlt;
    }
    if (textDesktop) textDesktop.textContent = langCode;
    if (textMobile) textMobile.textContent = langCode;
    
    localStorage.setItem('lang', currentLang);

    // Hero Typed.js: reiniciar con frases del idioma actual
    initHeroTyped();
}

function toggleLanguage() {
    currentLang = currentLang === 'en' ? 'es' : 'en';
    updateContent();
}

// ======================
// MOBILE MENU
// ======================
function toggleMenu() {
    const menu = document.getElementById('mobile-menu');
    const btn = document.getElementById('mobile-menu-btn');
    const isHidden = menu.classList.contains('hidden');
    
    menu.classList.toggle('hidden');
    
    // Update ARIA attributes
    if (btn) {
        btn.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
        btn.setAttribute('aria-label', isHidden ? 'Close Menu' : 'Open Menu');
    }
}

function throttle(func, delay) {
    let lastCall = 0;
    return function (...args) {
        const now = Date.now();
        if (now - lastCall >= delay) {
            lastCall = now;
            func.apply(this, args);
        }
    };
}

// Delegación de eventos (evita onclick inline para CSP sin 'unsafe-inline')
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
            window.scrollTo(0, 0);
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
// NAVBAR SCROLL EFFECT
// ======================
function updateNavbarOnScroll() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    if (window.scrollY > 50) {
        navbar.classList.add('shadow-md', 'bg-white/95');
        navbar.classList.remove('bg-white/90');
    } else {
        navbar.classList.remove('shadow-md', 'bg-white/95');
        navbar.classList.add('bg-white/90');
    }
}

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
// SCROLL DEPTH TRACKING
// ======================
let maxScroll = 0;

const trackScrollDepth = throttle(function () {
    const scrollHeight = document.body.scrollHeight - window.innerHeight;
    if (scrollHeight <= 0) return;

    const scrollPercent = Math.round((window.scrollY / scrollHeight) * 100);
    
    // Track cada 25% de scroll
    const milestone = Math.floor(scrollPercent / 25) * 25;
    
    if (milestone > maxScroll && milestone > 0) {
        maxScroll = milestone;
        trackEvent('scroll_depth', {
            'event_category': 'Engagement',
            'event_label': milestone + '%',
            'value': milestone
        });
    }
}, 200);

let navbarScrollTicking = false;
function handleScroll() {
    if (!navbarScrollTicking) {
        navbarScrollTicking = true;
        requestAnimationFrame(function () {
            updateNavbarOnScroll();
            navbarScrollTicking = false;
        });
    }
    trackScrollDepth();
}

window.addEventListener('scroll', handleScroll, { passive: true });

// ======================
// DOM CONTENT LOADED
// ======================
document.addEventListener('DOMContentLoaded', () => {
    // Lenis smooth scroll (si el script cargó y el usuario no pide menos movimiento)
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
    
    // Intentar actualizar contenido una vez cargado
    updateContent();
    
    // Animar elementos
    document.querySelectorAll('.vibe-card').forEach(card => {
        observer.observe(card);
    });

    // Globo WhatsApp: mostrar siempre; cerrar con data-action="close-wa-bubble"
    const waBubble = document.getElementById('wa-bubble');
    if (waBubble) waBubble.style.display = 'block';

    // Fallback de imagen para todas las imágenes (evita onerror inline bloqueado por CSP)
    document.querySelectorAll('img').forEach(function (img) {
        img.addEventListener('error', function () { handleImageError(this); });
    });
});
