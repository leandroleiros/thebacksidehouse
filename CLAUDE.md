# The Backside House

Women-only hostel & surf school website in Tamarindo, Costa Rica.
Static site: vanilla HTML5 + Tailwind CSS v4 + vanilla ES6+ JavaScript. No framework.

## Quick Commands

```bash
npm run build:css   # Tailwind: css/input.css -> css/styles.css (minified)
npm run lint:css    # Stylelint on custom.css & input.css
npm run lint:html   # HTMLHint on all HTML files
npx eslint js/      # ESLint flat config on JS files
```

## Project Structure

```
index.html          # Homepage (main page)
surfclass.html      # Surf lessons page
marca.html          # Brand/about page
css/
  input.css         # Tailwind v4 @theme + @import (source of truth for design tokens)
  custom.css        # Brand utilities, custom properties, @apply rules
  styles.css        # Compiled output (rebuild with npm run build:css)
js/
  main.js           # Core logic: i18n, analytics, lightbox, navigation, scroll
  surfclass.js      # Surf class page-specific logic
  translations.js   # EN/ES translation keys for index.html
  translations-surfclass.js  # EN/ES translation keys for surfclass.html
  gtag-init.js      # Google Analytics initialization
img/                # Images (prefer WebP format)
data/ram-flow.json  # Marketing analytics data
```

## Tech Stack

- **CSS:** Tailwind CSS v4.1 — config lives in `css/input.css` via `@theme` (no tailwind.config.js)
- **Linting:** ESLint 10 (flat config, `eslint.config.mjs`), Stylelint 17, HTMLHint
- **Smooth scroll:** Lenis.js (CDN)
- **Typing animation:** Typed.js (CDN)
- **Icons:** Lucide (CDN, surfclass.html only)
- **Analytics:** Google Tag Manager / gtag
- **No bundler** — scripts loaded via `<script defer>` tags

## Brand Colors (CSS Variables)

| Token                    | Value     | Usage            |
|--------------------------|-----------|------------------|
| `--color-brand-sand`     | `#FDFBF7` | Background       |
| `--color-brand-coral`    | `#E8A6A0` | Primary accent   |
| `--color-brand-coralhover`| `#D68C86`| Hover state      |
| `--color-brand-teal`     | `#4A7C85` | Secondary accent |
| `--color-brand-dark`     | `#2D3748` | Text / dark      |
| `--color-brand-gold`     | `#F6E05E` | Highlight        |
| `--color-brand-whatsapp` | `#25D366` | WhatsApp CTA     |

Fonts: `--font-sans: 'Poppins'`, `--font-serif: 'Playfair Display'`

## Coding Conventions

### HTML
- Semantic tags: `<main>`, `<nav>`, `<section>`, `<article>`, `<header>`, `<footer>`
- i18n via `data-i18n="key"` and `data-i18n-alt="key"` attributes
- Analytics via `data-action`, `data-track-label`, `data-social-platform` attributes
- No inline scripts or `onclick` — all behavior in external JS with event delegation
- CSP-compliant: all scripts external, no `eval()`

### CSS / Tailwind
- All design tokens in `css/input.css` under `@theme`
- Custom utilities in `css/custom.css` using `@apply`
- Mobile-first responsive design
- Respect `prefers-reduced-motion` for animations

### JavaScript
- `const`/`let` only (`no-var` enforced)
- Event delegation on `document.body` using `[data-action]` selectors
- Null-check DOM elements before access
- Throttle scroll handlers, use `requestAnimationFrame` for animations
- Global vars declared via `/* global varName */` JSDoc comments
- Language stored in `localStorage`; defaults to English

## i18n

Two languages: English (en) and Spanish (es).
Translation objects live in `translations.js` (index) and `translations-surfclass.js` (surfclass).
`marca.html` is not yet internationalized.

## Security (CSP)

Content-Security-Policy is defined in HTML `<meta>` tags. Key rules:
- `default-src 'self'`
- `script-src 'self'` + Google Tag Manager, Cloudflare, unpkg
- `style-src 'self' 'unsafe-inline'` + Google Fonts, Cloudflare
- `img-src 'self' data:` + specific CDNs only
- `base-uri 'self'`, `form-action 'self'`

## Important Notes

- **Always rebuild CSS** after changing `input.css` or `custom.css`: `npm run build:css`
- **No test framework** — linting is the primary quality gate
- **styles.css is generated** — never edit it directly
- **Images:** prefer WebP; large PNGs exist as fallbacks
- **Schema.org** JSON-LD is embedded in HTML `<head>` sections
