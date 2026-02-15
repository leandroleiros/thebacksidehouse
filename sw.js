// Service Worker — The Backside House PWA
// Strategy: stale-while-revalidate for assets, network-first for HTML

const CACHE_NAME = "tbh-v4";
const PRECACHE_URLS = [
  "/",
  "/index.html",
  "/surfclass.html",
  "/css/styles.css",
  "/css/custom.css",
  "/js/main.js",
  "/js/translations.js",
  "/js/translations-surfclass.js",
  "/js/utils.js",
  "/js/analytics.js",
  "/js/lightbox.js",
  "/js/i18n.js",
  "/js/navigation.js",
  "/js/surfclass.js",
  "/js/motion-init.js",
  "/js/sw-register.js",
  "/js/gtag-init.js",
  "/favicon.ico",
  "/manifest.json",
];

const OFFLINE_RESPONSE = new Response("Offline", {
  status: 503,
  statusText: "Service Unavailable",
  headers: { "Content-Type": "text/plain" },
});

// Install: precache core assets, then activate immediately
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// Activate: clean old caches and claim clients
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

// Fetch: network-first for HTML, stale-while-revalidate for same-origin assets
self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Skip non-GET and cross-origin requests
  if (request.method !== "GET" || !request.url.startsWith(self.location.origin)) {
    return;
  }

  const isHTML =
    request.mode === "navigate" ||
    request.headers.get("accept")?.includes("text/html");

  if (isHTML) {
    // Network-first for HTML — always try fresh content
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        })
        .catch(() =>
          caches.match(request).then((cached) => cached || caches.match("/index.html"))
        )
    );
  } else {
    // Stale-while-revalidate for assets (CSS, JS, images, fonts)
    event.respondWith(
      caches.match(request).then((cached) => {
        const fetchPromise = fetch(request)
          .then((response) => {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
            return response;
          })
          .catch(() => cached || OFFLINE_RESPONSE.clone());

        return cached || fetchPromise;
      })
    );
  }
});
