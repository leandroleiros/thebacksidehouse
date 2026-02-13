/* exported toggleLanguage, toggleMenu */
/* global surfclassTranslations, lucide, Lenis */

// ======================
// LUCIDE ICONS
// ======================
if (typeof lucide !== 'undefined') {
    lucide.createIcons();
}

// ======================
// LENIS SMOOTH SCROLL
// ======================
document.addEventListener('DOMContentLoaded', function () {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (typeof Lenis !== 'undefined' && !prefersReducedMotion) {
        const lenis = new Lenis({
            duration: 1.2,
            easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
            orientation: 'vertical',
            smoothWheel: true,
        });
        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
    }
});

// ======================
// LANGUAGE TOGGLE
// ======================
let currentLang = localStorage.getItem('lang') || 'en';

function updateContent() {
    if (typeof surfclassTranslations === 'undefined') return;

    const root = document.getElementById('html-root') || document.documentElement;
    root.setAttribute('lang', currentLang);

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
        const key = el.getAttribute('data-i18n');
        if (surfclassTranslations[currentLang] && surfclassTranslations[currentLang][key]) {
            const content = surfclassTranslations[currentLang][key];
            if (content.indexOf('<') !== -1) {
                el.innerHTML = content;
            } else {
                el.textContent = content;
            }
        }
    });

    document.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
        const key = el.getAttribute('data-i18n-aria');
        if (surfclassTranslations[currentLang] && surfclassTranslations[currentLang][key]) {
            el.setAttribute('aria-label', surfclassTranslations[currentLang][key]);
        }
    });

    const flagUrl = currentLang === 'en'
        ? 'https://flagcdn.com/24x18/gb.png'
        : 'https://flagcdn.com/24x18/es.png';
    const langCode = currentLang === 'en' ? 'EN' : 'ES';

    ['lang-display', 'lang-display-mobile'].forEach(function (id) {
        const img = document.getElementById(id);
        if (img) {
            img.src = flagUrl;
            img.alt = currentLang === 'en' ? 'English' : 'Español';
        }
    });

    const t1 = document.getElementById('lang-display-text');
    if (t1) t1.textContent = langCode;
    const t2 = document.getElementById('lang-display-mobile-text');
    if (t2) t2.textContent = langCode;

    localStorage.setItem('lang', currentLang);
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
    if (menu) menu.classList.toggle('hidden');
    if (btn && menu) {
        const isHidden = menu.classList.contains('hidden');
        btn.setAttribute('aria-expanded', isHidden ? 'false' : 'true');
        btn.setAttribute('aria-label', isHidden ? 'Open Menu' : 'Close Menu');
    }
}

// ======================
// EVENT DELEGATION
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
    }
});

// ======================
// NAVBAR SCROLL EFFECT
// ======================
window.addEventListener('scroll', function () {
    const nav = document.querySelector('nav');
    if (!nav) return;
    if (window.scrollY > 50) {
        nav.classList.add('shadow-md');
    } else {
        nav.classList.remove('shadow-md');
    }
}, { passive: true });

// ======================
// IMAGE FALLBACK (evita onerror inline bloqueado por CSP)
// ======================
document.querySelectorAll('.js-logo-fallback').forEach(function (img) {
    img.addEventListener('error', function () {
        this.style.display = 'none';
    });
});

// ======================
// INIT
// ======================
updateContent();
