/* exported toggleLanguage, updateContent, initHeroTyped, currentLang */
/* global translations, Typed */

// ======================
// LANGUAGE / i18n
// ======================
let currentLang = 'en';

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
    if (typeof translations === 'undefined') {
        console.warn('Translations file not loaded yet.');
        return;
    }

    const htmlRoot = document.getElementById('html-root') || document.documentElement;
    htmlRoot.setAttribute('lang', currentLang);

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[currentLang] && translations[currentLang][key]) {
            const content = translations[currentLang][key];
            if (content.includes('<br') || content.includes('<span') || content.includes('<b>')) {
                el.innerHTML = content;
            } else {
                el.textContent = content;
            }
        }
    });

    document.querySelectorAll('[data-i18n-alt]').forEach(img => {
        const key = img.getAttribute('data-i18n-alt');
        if (translations[currentLang] && translations[currentLang][key]) {
            img.alt = translations[currentLang][key];
        }
    });

    const imgDesktop = document.getElementById('lang-display');
    const imgMobile = document.getElementById('lang-display-mobile');
    const textDesktop = document.getElementById('lang-display-text');
    const textMobile = document.getElementById('lang-display-mobile-text');

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

    initHeroTyped();
}

function toggleLanguage() {
    currentLang = currentLang === 'en' ? 'es' : 'en';
    updateContent();
}
