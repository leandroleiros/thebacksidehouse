/* exported openLightbox, closeLightbox */

// ======================
// LIGHTBOX
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
        if (lightbox && !lightbox.classList.contains('hidden')) {
            closeLightbox(null, true);
        }
        const bookingModal = document.getElementById('booking-modal');
        const bookingIframe = document.getElementById('booking-iframe');
        if (bookingModal && !bookingModal.classList.contains('hidden')) {
            bookingModal.classList.add('hidden');
            bookingModal.classList.remove('flex');
            document.body.style.overflow = '';
            if (bookingIframe) bookingIframe.src = 'about:blank';
        }
    }
});
