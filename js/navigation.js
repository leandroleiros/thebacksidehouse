/* exported toggleMenu, updateNavbarOnScroll */

// ======================
// MOBILE MENU
// ======================
function toggleMenu() {
    const menu = document.getElementById('mobile-menu');
    const btn = document.getElementById('mobile-menu-btn');
    const isHidden = menu.classList.contains('hidden');

    menu.classList.toggle('hidden');

    if (btn) {
        btn.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
        btn.setAttribute('aria-label', isHidden ? 'Close Menu' : 'Open Menu');
    }
}

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
