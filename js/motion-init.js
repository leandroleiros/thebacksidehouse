/**
 * Motion One — scroll-triggered animations & microinteractions
 * Carga como ES module dinámico desde CDN. Si el CDN falla, los elementos
 * se muestran normalmente (no se ocultan sin confirmación de carga).
 *
 * Uso: los elementos con [data-motion] se animan al entrar en viewport.
 *   data-motion="fade-up"     → fade + translateY
 *   data-motion="fade-in"     → solo opacity
 *   data-motion="scale-in"    → opacity + scale
 *   data-motion="stagger"     → hijos directos con stagger
 */

/* ── Respetar prefers-reduced-motion ── */
const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;

if (!prefersReduced) {
    import("https://cdn.jsdelivr.net/npm/motion@11.13.5/+esm")
        .then(({ animate, inView, stagger }) => {
            initMotion(animate, inView, stagger);
        })
        .catch(() => {
            /* CDN caído: no ocultar nada, los elementos quedan visibles */
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

    /* Ocultar elementos individuales y registrar inView */
    Object.entries(animationConfig).forEach(([type, config]) => {
        const selector = `[data-motion='${type}']`;

        /* Ocultar DESPUÉS de confirmar que Motion cargó */
        document.querySelectorAll(selector).forEach((el) => {
            el.style.opacity = "0";
            el.style.willChange = "opacity, transform";
        });

        /* inView dispara tanto para elementos ya visibles como al scrollear */
        inView(selector, (info) => {
            animate(info.target, config.keyframes, config.options).then(() => {
                info.target.style.willChange = "auto";
            });
        }, { amount: 0.15 });
    });

    /* stagger: ocultar HIJOS y animar con delay escalonado */
    document.querySelectorAll("[data-motion='stagger']").forEach((container) => {
        Array.from(container.children).forEach((child) => {
            child.style.opacity = "0";
            child.style.willChange = "opacity, transform";
        });
    });

    inView("[data-motion='stagger']", (info) => {
        const children = Array.from(info.target.children);
        animate(
            children,
            { opacity: [0, 1], transform: ["translateY(20px)", "translateY(0)"] },
            { duration: 0.5, delay: stagger(0.15), easing: [0.25, 0.1, 0.25, 1] }
        ).then(() => {
            children.forEach((child) => { child.style.willChange = "auto"; });
        });
    }, { amount: 0.1 });

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
