import { defineConfig } from "eslint/config";
import js from "@eslint/js";
import globals from "globals";

export default defineConfig([
  {
    ignores: ["js/motion-init.js", "sw.js"],
  },
  {
    files: ["**/*.{js,mjs,cjs}"],
    ...js.configs.recommended,
    languageOptions: {
      sourceType: "module",
      globals: {
        ...globals.browser,
        gtag: "readonly",
        dataLayer: "readonly",
        translations: "readonly",
        surfclassTranslations: "readonly",

        // Cross-file globals (modules loaded via <script defer>)
        throttle: "readonly",
        handleImageError: "readonly",
        trackEvent: "readonly",
        trackBooking: "readonly",
        trackWhatsApp: "readonly",
        trackSocialClick: "readonly",
        trackMapClick: "readonly",
        trackScrollDepth: "readonly",
        openLightbox: "readonly",
        closeLightbox: "readonly",
        toggleLanguage: "readonly",
        updateContent: "readonly",
        initHeroTyped: "readonly",
        currentLang: "writable",
        toggleMenu: "readonly",
        updateNavbarOnScroll: "readonly",
      },
    },
    rules: {
      "no-var": "error",
      "prefer-const": "error",
      "no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
          varsIgnorePattern: "^(translations|surfclassTranslations|throttle|handleImageError|trackEvent|trackBooking|trackWhatsApp|trackSocialClick|trackMapClick|trackScrollDepth|openLightbox|closeLightbox|toggleLanguage|updateContent|initHeroTyped|currentLang|toggleMenu|updateNavbarOnScroll)$",
        },
      ],
    },
  },
]);
