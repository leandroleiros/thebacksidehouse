/**
 * Motion One — scroll-triggered animations & microinteractions
 * Elements with [data-motion] are pre-hidden via CSS (custom.css).
 * This script animates them once on viewport entry.
 * If CDN fails, CSS fallback reveals them after 3s.
 */

/* ── Respetar prefers-reduced-motion ── */
const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;

if (!prefersReduced) {
    import("https://cdn.jsdelivr.net/npm/motion@11.13.5/+esm")
        .then(({ animate, inView, stagger }) => {
            /* Signal to CSS: Motion loaded, cancel fallback reveal */
            document.documentElement.classList.add("motion-ready");
            initMotion(animate, inView, stagger);
        })
        .catch(() => {
            /* CDN down: CSS fallback animation will reveal elements after 3s */
        });
}

function initMotion(animate, inView, stagger) {
    /* ────────────────────────────────────────────────
       1. SCROLL-TRIGGERED REVEALS (data-motion)
       ──────────────────────────────────────────────── */

    const animationConfig = {
        "fade-up": {
            keyframes: { opacity: [0, 1], transform: ["translateY(30px)", "translateY(0)"] },
            options: { duration: 0.6, easing: [0.25, 0.1, 0.25, 1] },
        },
        "fade-in": {
            keyframes: { opacity: [0, 1] },
            options: { duration: 0.5, easing: "ease-out" },
        },
        "scale-in": {
            keyframes: { opacity: [0, 1], transform: ["scale(0.95)", "scale(1)"] },
            options: { duration: 0.5, easing: [0.25, 0.1, 0.25, 1] },
        },
    };

    /* Individual element animations — animate ONCE only */
    Object.entries(animationConfig).forEach(([type, config]) => {
        const selector = `[data-motion='${type}']`;

        document.querySelectorAll(selector).forEach((el) => {
            el.style.willChange = "opacity, transform";
        });

        inView(selector, (info) => {
            const el = info.target;
            if (el.dataset.motionDone) return;
            el.dataset.motionDone = "true";

            animate(el, config.keyframes, config.options).then(() => {
                el.style.willChange = "auto";
                el.style.opacity = "1";
            });
        }, { amount: 0.15 });
    });

    /* stagger: animate children ONCE only */
    document.querySelectorAll("[data-motion='stagger']").forEach((container) => {
        Array.from(container.children).forEach((child) => {
            child.style.willChange = "opacity, transform";
        });
    });

    inView("[data-motion='stagger']", (info) => {
        const container = info.target;
        if (container.dataset.motionDone) return;
        container.dataset.motionDone = "true";

        const children = Array.from(container.children);
        animate(
            children,
            { opacity: [0, 1], transform: ["translateY(20px)", "translateY(0)"] },
            { duration: 0.5, delay: stagger(0.15), easing: [0.25, 0.1, 0.25, 1] }
        ).then(() => {
            children.forEach((child) => {
                child.style.willChange = "auto";
                child.style.opacity = "1";
            });
        });
    }, { amount: 0.1 });

    /* Safety net: reveal any element still hidden after 2s */
    setTimeout(() => {
        document.querySelectorAll("[data-motion]").forEach((el) => {
            if (!el.dataset.motionDone) {
                el.style.opacity = "1";
                el.dataset.motionDone = "true";
            }
            Array.from(el.children).forEach((child) => {
                if (getComputedStyle(child).opacity === "0") {
                    child.style.opacity = "1";
                }
            });
        });
    }, 2000);

    /* ────────────────────────────────────────────────
       2. MICROINTERACCIONES EN CARDS (hover lift)
       ──────────────────────────────────────────────── */
    if (window.matchMedia("(hover: hover)").matches) {
        document.querySelectorAll(".vibe-card, .review-card").forEach((card) => {
            card.addEventListener("mouseenter", () => {
                animate(card, { transform: "translateY(-4px)" }, { duration: 0.25, easing: "ease-out" });
            });
            card.addEventListener("mouseleave", () => {
                animate(card, { transform: "translateY(0)" }, { duration: 0.2, easing: "ease-in" });
            });
        });
    }

    /* ────────────────────────────────────────────────
       3. HERO PARALLAX SUTIL (solo desktop, RAF-throttled)
       ──────────────────────────────────────────────── */
    const heroContent = document.querySelector("[data-motion-hero]");
    if (heroContent && window.innerWidth >= 768) {
        const heroSection = heroContent.closest("section");
        const heroHeight = heroSection ? heroSection.offsetHeight : 800;
        let parallaxTicking = false;

        window.addEventListener("scroll", () => {
            if (!parallaxTicking) {
                parallaxTicking = true;
                requestAnimationFrame(() => {
                    const scrollY = window.scrollY;
                    if (scrollY < heroHeight) {
                        const progress = scrollY / heroHeight;
                        heroContent.style.transform = `translateY(${progress * 40}px)`;
                        heroContent.style.opacity = `${1 - progress * 0.4}`;
                    }
                    parallaxTicking = false;
                });
            }
        }, { passive: true });
    }
}
