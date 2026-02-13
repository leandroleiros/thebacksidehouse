# Prompts de developer para The Backside House

Prompts listos para usar en Cursor, Claude o ChatGPT para buscar errores de frontend, refactorizar y mejorar el proyecto.

---

## Rutina semanal recomendada

Sí, estos prompts sirven para ejecutarlos semanalmente. Para no saturarte, usa esta distribución:

| Frecuencia | Prompts | Motivo |
|------------|--------|--------|
| **Cada semana** | 1 (HTML), 2 (JS), 3 (CSS), 4 (multiidioma) | Errores que se cuelan con cambios pequeños; detectarlos pronto. |
| **Cada semana** | 14 (booking/WhatsApp), 18 (checklist testing) | Asegurar que conversión y flujos críticos siguen funcionando. |
| **Cada 2 semanas** | 11 (a11y), 9 (imágenes/recursos) | Buen equilibrio entre calidad y tiempo. |
| **Cada mes** | 13 (SEO), 10 (Core Web Vitals), 17 (marca/contenido) | Cambian menos; una pasada mensual suele bastar. |
| **Cuando toques código** | 5–8 (refactor), 15 (CSP), 16 (limpieza) | Úsalos en sprints de mantenimiento, no cada semana. |

**Semana tipo (rápida):** ejecuta en un solo chat los prompts **1, 2, 14 y 18**. Si hay tiempo, añade **3** y **4**.

**Tip:** al final del prompt puedes añadir: *“Responde solo con la lista de issues; si no hay ninguno, di ‘Sin hallazgos esta semana’.”* Así obtienes un reporte breve para revisar en pocos minutos.

---

## Errores de frontend

### 1. Auditoría de errores en HTML
```
Revisa todos los archivos .html del proyecto The Backside House (index.html, surfclass.html, marca.html). Busca y lista:
- Etiquetas sin cerrar o mal anidadas
- Atributos alt faltantes o vacíos en imágenes
- IDs duplicados
- Enlaces rotos (href="#", enlaces externos sin rel="noopener")
- Formularios sin label asociado o sin atributo for
- Uso de atributos obsoletos (border, align, etc.)
Sugiere correcciones concretas con el código exacto a reemplazar.
```

### 2. Errores de JavaScript en tiempo de ejecución
```
Analiza js/main.js, js/translations.js, js/surfclass.js y js/translations-surfclass.js del proyecto. Identifica:
- Variables o funciones usadas antes de estar definidas (hoisting issues)
- Acceso a propiedades de objetos que podrían ser null/undefined sin comprobación
- Uso de getElementById / querySelector que podría devolver null
- Event listeners que no se limpian o que se añaden múltiples veces
- Posibles memory leaks (referencias que impiden GC)
Indica el archivo, línea aproximada y cómo corregirlo de forma segura.
```

### 3. Errores de CSS y consistencia
```
Revisa css/custom.css, css/input.css y el uso de clases Tailwind en los HTML. Busca:
- Clases que no existen en el proyecto (typos, clases Tailwind mal escritas)
- Reglas CSS duplicadas o contradictorias
- Especificidad excesiva que pueda causar bugs difíciles de depurar
- Uso de !important innecesario
- Valores en px donde sería mejor rem para accesibilidad
- Media queries que se solapan o dejan huecos entre breakpoints
Lista los hallazgos con archivo y sugerencia de refactor.
```

### 4. Consistencia multiidioma (EN/ES)
```
El sitio The Backside House tiene inglés y español. Revisa:
- Que todas las cadenas traducibles estén en el sistema de traducción (data-i18n o equivalente) y no hardcodeadas en HTML/JS
- Que no queden textos en un solo idioma en páginas que deberían estar traducidas
- Que los hreflang y el selector de idioma sean consistentes en todas las páginas
- Que no haya mezcla de idiomas en la misma vista
Da una lista de strings o bloques que falten traducir o estén mal ubicados.
```

---

## Refactorización

### 5. Refactorizar main.js por módulos
```
El archivo js/main.js del proyecto The Backside House tiene muchas funciones globales (handleImageError, trackBooking, lightbox, idioma, etc.). Propón una estructura de refactorización:
- Agrupar por dominio: analytics, lightbox, i18n, imágenes, navegación
- Evitar contaminar el global scope; usar un namespace o módulos (ES modules o IIFE)
- Mantener compatibilidad con los onclick y data-* que haya en el HTML
Incluye un esquema de archivos/carpetas y cómo quedarían las exportaciones e imports sin romper el sitio.
```

### 6. Extraer componentes repetidos
```
En los HTML del proyecto (index, surfclass, marca) busca bloques repetidos: headers, footers, cards de habitaciones, botones de WhatsApp, secciones de redes sociales, etc. Propón:
- Qué bloques se pueden extraer a fragmentos o componentes reutilizables
- Cómo implementarlo sin framework (HTML partials, JS que inyecte plantillas, o sugerencia de herramienta ligera)
- Lista de duplicados con rutas de archivo y línea aproximada
Objetivo: un solo lugar de verdad para cada bloque repetido.
```

### 7. Simplificar CSS y Tailwind
```
Revisa el uso de Tailwind y custom.css en The Backside House. Propón:
- Clases utility que se repiten mucho y podrían ser @apply en custom.css o un componente
- Reglas en custom.css que ya están cubiertas por Tailwind y se pueden eliminar
- Oportunidades de usar CSS variables (por ejemplo para colores de marca) en lugar de valores fijos
- Orden sugerido de las directivas en input.css para mantener claridad
Objetivo: menos duplicación y más mantenibilidad sin cambiar el diseño actual.
```

### 8. Refactorizar el sistema de traducción
```
Analiza cómo está implementada la traducción EN/ES (translations.js, data-i18n, etc.). Propón una refactorización que:
- Tenga un único objeto o archivo de traducciones por idioma, fácil de editar
- Evite repetir claves o textos similares con pequeñas variaciones
- Facilite añadir un tercer idioma en el futuro
- Mantenga el comportamiento actual del selector de idioma y la persistencia (cookie/localStorage)
Incluye estructura de datos sugerida y cambios mínimos en el HTML/JS para no romper nada.
```

---

## Rendimiento y buenas prácticas

### 9. Optimización de imágenes y recursos
```
Revisa el uso de imágenes en The Backside House (img/, referencias en HTML). Indica:
- Imágenes que deberían tener srcset o sizes para responsive
- Uso de loading="lazy" en imágenes below the fold
- Si hay imágenes pesadas que no estén en WebP/AVIF donde sea posible
- Preload de LCP image (hero) si aplica
- Referencias a fuentes o scripts que bloqueen el render y cómo deferir o preload
Lista priorizada por impacto en LCP y FCP.
```

### 10. Mejorar Core Web Vitals
```
Para el proyecto estático The Backside House (HTML, Tailwind, JS vanilla):
- Identifica qué puede estar afectando LCP, FID/INP y CLS (scripts, fuentes, imágenes, layout shifts)
- Sugiere cambios concretos: orden de scripts, atributos async/defer, reserva de espacio para imágenes/ads, reducción de CSS/JS crítico
- No proponer frameworks ni cambios de stack; solo mejoras sobre el código actual
Prioriza cambios de bajo esfuerzo y alto impacto.
```

---

## Accesibilidad (a11y)

### 11. Auditoría de accesibilidad
```
Haz una auditoría de accesibilidad sobre index.html (y si aplica surfclass.html, marca.html) de The Backside House. Revisa:
- Contraste de texto y fondos (WCAG AA)
- Navegación por teclado (tab order, focus visible, trampas de foco)
- Uso correcto de landmarks (header, main, nav, footer) y encabezados (h1–h6)
- Botones y enlaces (diferenciación, texto accesible, no solo iconos)
- Lightbox y modales: foco atrapado, cierre con Escape, anuncio a lectores de pantalla
- Formularios: labels, mensajes de error, estados
Lista issues con severidad (crítico / importante / sugerencia) y código de corrección.
```

### 12. Mejoras de lectores de pantalla
```
Revisa el sitio The Backside House pensando en lectores de pantalla. Identifica:
- Textos que deberían estar en aria-label o sr-only para contexto (iconos, “WhatsApp”, “Instagram”)
- Contenido dinámico (cambio de idioma, lightbox) que debería anunciarse con aria-live
- Imágenes decorativas que deberían tener alt="" o role="presentation"
- Listas (nav, redes, servicios) que deberían usar listas semánticas (ul/ol) si no lo hacen
Propón los cambios HTML/ARIA mínimos necesarios.
```

---

## SEO y metadatos

### 13. Revisión SEO técnica
```
Revisa el SEO técnico del proyecto The Backside House: meta tags, canonical, hreflang, schema.org, sitemap. Comprueba:
- Consistencia entre title, meta description y og:* en cada página
- Que el JSON-LD (Hostel, etc.) sea válido y esté completo
- Que no haya contenido importante solo en imágenes sin texto alternativo
- Estructura de headings (un solo h1 por página, orden lógico)
- URLs en sitemap.xml coherentes con las páginas reales
Lista mejoras concretas con el fragmento de código a añadir o modificar.
```

---

## Proyecto específico The Backside House

### 14. Flujo de conversión (booking / WhatsApp)
```
En The Backside House los CTAs principales son reservas y WhatsApp. Revisa:
- Que todos los botones de “Book” y “WhatsApp” tengan el tracking correcto (trackBooking, trackWhatsApp) donde corresponda
- Que no haya enlaces rotos a Booking/WhatsApp (tel:, href correctos)
- Que en móvil y desktop los CTAs sean claros y no se dupliquen de forma confusa
- Que el número de teléfono/WhatsApp sea único y correcto en todo el sitio
Lista discrepancias y sugerencias de mejora en conversión sin cambiar el diseño visual.
```

### 15. Content Security Policy
```
En index.html hay una Content-Security-Policy en meta. Revisa:
- Si todos los orígenes necesarios (Google Analytics, fonts, CDNs, mapas, etc.) están permitidos
- Si 'unsafe-inline' en style-src se puede reducir con nonces o hashes
- Si hay scripts o estilos que fallen por la CSP en desarrollo o producción
Propón una política más estricta donde sea posible sin romper funcionalidad.
```

### 16. Limpieza de código legacy
```
Revisa el repositorio The Backside House en busca de:
- Archivos que parezcan duplicados o de prueba (por ejemplo “marca - copia.html”, “Notas.docx” en raíz)
- Comentarios TODO, FIXME o código comentado que ya no aporte
- Scripts o estilos no usados (referencias en HTML que no existan o archivos que nadie enlaza)
- Dependencias en package.json que no se usen en el build o en los scripts
Propón qué eliminar o mover a una carpeta /archive o similar.
```

### 17. Consistencia de marca y contenido
```
Revisa que en todo el sitio The Backside House:
- El nombre “The Backside House” y el claim (women-only hostel, Tamarindo, etc.) sean consistentes
- No haya textos de relleno tipo “Lorem” o “Placeholder”
- Las imágenes tengan alt descriptivos y coherentes con la sección
- Los precios, horarios o políticas que aparezcan estén alineados entre páginas
Lista incoherencias encontradas por archivo y sugerencia de texto unificado.
```

### 18. Testing manual y checklist
```
Genera un checklist de testing manual para The Backside House que incluya:
- Navegación: menú, enlaces internos, enlaces externos, botón de idioma
- Funcionalidad: lightbox, selector EN/ES, formularios si los hay
- Dispositivos: vista móvil, tablet, desktop (breakpoints de Tailwind)
- Navegadores: Chrome, Firefox, Safari, Edge
- Casos edge: sin JS, imágenes rotas (comportamiento de handleImageError)
Formato: lista de ítems con pasos y resultado esperado para poder marcar OK/KO.
```

---

## Uso rápido en Cursor

1. Copia el bloque del prompt que te interese.
2. Pega en el chat de Cursor.
3. Si quieres limitar el alcance, añade al final:  
   `Solo revisa [archivo o carpeta].`
4. Para que genere cambios directos:  
   `Aplica las correcciones en el código y dime qué archivos toqué.`

---

*Documento generado para el proyecto The Backside House. Puedes duplicar y adaptar estos prompts a tu flujo.*
