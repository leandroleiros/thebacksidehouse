/* exported trackEvent, trackBooking, trackWhatsApp, trackSocialClick, trackMapClick, trackScrollDepth */
/* global gtag, throttle */

// ======================
// GOOGLE ANALYTICS
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
// SCROLL DEPTH TRACKING
// ======================
let maxScroll = 0;

const trackScrollDepth = throttle(function () {
    const scrollHeight = document.body.scrollHeight - window.innerHeight;
    if (scrollHeight <= 0) return;

    const scrollPercent = Math.round((window.scrollY / scrollHeight) * 100);
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
