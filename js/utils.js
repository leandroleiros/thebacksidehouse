/* exported throttle, handleImageError */

// ======================
// THROTTLE
// ======================
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

// ======================
// IMAGE ERROR HANDLING
// ======================
function handleImageError(img) {
    if (!img || !img.parentElement) return;

    // Prevenir loop infinito
    if (img.dataset.fallbackAttempted) {
        img.style.display = 'none';
        const placeholder = document.createElement('div');
        placeholder.className = 'image-placeholder';
        placeholder.textContent = 'Image not available';
        img.parentElement.appendChild(placeholder);
        return;
    }

    img.dataset.fallbackAttempted = 'true';
    img.src = 'https://placehold.co/600x400/4A7C85/white?text=The+Backside+House';
}
