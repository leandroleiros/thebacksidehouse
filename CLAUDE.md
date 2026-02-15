# The Backside House

Web del hostel solo para mujeres y escuela de surf en Tamarindo, Costa Rica.
Sitio estático: HTML5 vanilla + Tailwind CSS v4 + JavaScript ES6+ vanilla. Sin framework.

- **URL de producción:** `https://thebacksidehouse.com`
- **Navegadores objetivo:** modernos (últimos 2 años) — Chrome, Safari, Firefox, Samsung Internet. Sin soporte para IE ni navegadores legacy.

## Comandos principales

```bash
npm run build:css   # Tailwind: css/input.css -> css/styles.css (minificado)
npm run lint:css    # Stylelint sobre custom.css e input.css
npm run lint:html   # HTMLHint sobre todos los archivos HTML
npx eslint js/      # ESLint flat config sobre archivos JS
```

## Estructura del proyecto

```
index.html          # Página principal (home)
surfclass.html      # Página de clases de surf
marca.html          # Página de marca / sobre nosotras
manifest.json       # PWA manifest
sw.js               # Service Worker (cache stale-while-revalidate / network-first)
robots.txt          # SEO — directivas para crawlers
sitemap.xml         # SEO — mapa del sitio
favicon.ico         # Favicon
css/
  input.css         # Tailwind v4 @theme + @import (fuente de verdad para tokens de diseño)
  custom.css        # Utilidades de marca, custom properties, animaciones, componentes compartidos
  styles.css        # CSS compilado — gitignored (regenerar con npm run build:css)
js/
  main.js           # Orquestador: scroll handler, event delegation, DOMContentLoaded, Lenis
  utils.js          # Utilidades compartidas: throttle, handleImageError
  i18n.js           # Sistema de idiomas: toggleLanguage, updateContent, Typed.js hero
  navigation.js     # Menú móvil (toggleMenu) y efecto navbar al scroll
  analytics.js      # Tracking de eventos con gtag: booking, WhatsApp, social, scroll depth
  lightbox.js       # Lightbox de imágenes con cierre por ESC y click
  motion-init.js    # Motion One — animaciones scroll-triggered y microinteracciones (ES module)
  surfclass.js      # Lógica específica de la página de surf
  translations.js   # Claves de traducción EN/ES para index.html
  translations-surfclass.js  # Claves de traducción EN/ES para surfclass.html
  gtag-init.js      # Inicialización de Google Analytics
  sw-register.js    # Registro del Service Worker
img/                # Imágenes (preferir formato WebP)
data/ram-flow.json  # Datos de marketing y analytics
```

## Stack tecnológico

- **CSS:** Tailwind CSS v4.1 — configuración en `css/input.css` vía `@theme` (sin tailwind.config.js)
- **Linting:** ESLint 10 (flat config, `eslint.config.mjs`), Stylelint 17, HTMLHint
- **Scroll suave:** Lenis.js (CDN)
- **Animación de texto:** Typed.js (CDN)
- **Animaciones scroll:** Motion One v11 (CDN, import dinámico en `motion-init.js`)
- **Iconos:** Lucide (CDN, solo en surfclass.html)
- **Analytics:** Google Tag Manager / gtag
- **PWA:** Service Worker (`sw.js`) + Web App Manifest (`manifest.json`)
- **Sin bundler** — scripts cargados con `<script defer>`

## Colores de marca (variables CSS)

| Token                    | Valor     | Uso                |
|--------------------------|-----------|---------------------|
| `--color-brand-sand`     | `#FDFBF7` | Fondo               |
| `--color-brand-coral`    | `#E8A6A0` | Acento principal    |
| `--color-brand-coralhover`| `#D68C86`| Estado hover        |
| `--color-brand-teal`     | `#4A7C85` | Acento secundario   |
| `--color-brand-dark`     | `#2D3748` | Texto / oscuro      |
| `--color-brand-gold`     | `#F6E05E` | Resaltado           |
| `--color-brand-whatsapp` | `#25D366` | CTA de WhatsApp     |

Fuentes: `--font-sans: 'Poppins'`, `--font-serif: 'Playfair Display'`

## Convenciones de código

### HTML
- Etiquetas semánticas: `<main>`, `<nav>`, `<section>`, `<article>`, `<header>`, `<footer>`
- i18n mediante atributos `data-i18n="clave"` y `data-i18n-alt="clave"`
- Analytics mediante atributos `data-action`, `data-track-label`, `data-social-platform`
- Sin scripts inline ni `onclick` — todo el comportamiento en JS externo con delegación de eventos
- Compatible con CSP: todos los scripts son externos, sin `eval()`

### CSS / Tailwind
- Todos los tokens de diseño en `css/input.css` bajo `@theme`
- Utilidades personalizadas en `css/custom.css` usando `@apply`
- Diseño responsive mobile-first
- Respetar `prefers-reduced-motion` en animaciones

### JavaScript
- Arquitectura modular: cada archivo expone funciones vía `/* exported */` y las consume vía `/* global */`
- Solo `const`/`let` (`no-var` forzado por ESLint)
- Delegación de eventos en `document.body` usando selectores `[data-action]`
- Comprobar null en elementos del DOM antes de acceder
- Throttle en scroll handlers, usar `requestAnimationFrame` para animaciones
- Variables globales declaradas con comentarios `/* global nombreVar */`
- Idioma guardado en `localStorage`; por defecto inglés
- `motion-init.js` es ES module (import dinámico) — ignorado por ESLint (`eslint.config.mjs`)

## i18n (internacionalización)

Dos idiomas: inglés (en) y español (es).
Los objetos de traducción están en `translations.js` (index) y `translations-surfclass.js` (surfclass).
`marca.html` es una guía de branding y no requiere i18n.

## Seguridad (CSP)

La Content-Security-Policy se define en etiquetas `<meta>` del HTML. Reglas clave:
- `default-src 'self'`
- `script-src 'self'` + Google Tag Manager, Cloudflare, unpkg, jsdelivr
- `style-src 'self' 'unsafe-inline'` + Google Fonts, Cloudflare
- `img-src 'self' data:` + solo CDNs específicos
- `base-uri 'self'`, `form-action 'self'`

## Deploy

- **Hosting:** subida manual por FTP
- **Pruebas locales:** `npx serve .` o abrir los HTML en el navegador (el Service Worker requiere un server)
- **Flujo de trabajo Git:** `main` = producción (lo que se sube por FTP). Ramas `feature/...` para cambios puntuales, merge a `main` cuando estén listos.

## Reservas (booking engine)

- Actualmente los links de reserva apuntan a **Booking.com**
- Pendiente: integración con **FrontDesk Master** (esperando respuesta del soporte de la plataforma)

## Notas importantes

- **Siempre recompilar CSS** tras cambiar `input.css` o `custom.css`: `npm run build:css`
- **Sin framework de tests** — el linting es la principal puerta de calidad
- **styles.css es generado** — nunca editarlo directamente; está en `.gitignore`
- **Imágenes:** preferir WebP; los PNG grandes existen como fallback. Al agregar o modificar imágenes, optimizar y convertir a WebP antes de commitear.
- **Schema.org** JSON-LD está embebido en las secciones `<head>` del HTML
- **PWA:** el Service Worker usa network-first para HTML y stale-while-revalidate para assets
