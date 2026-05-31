/* ========================================================
   UnrealAkademi — Service Worker
   Cache-first strateji ile çevrimdışı destek
   ======================================================== */

const VERSION = 'v1.0.0';
const STATIC_CACHE = `ua-static-${VERSION}`;
const RUNTIME_CACHE = `ua-runtime-${VERSION}`;

// Kritik dosyalar — kurulum sırasında önceden cache'le
const PRECACHE_URLS = [
  './',
  './index.html',
  './404.html',
  './css/variables.css',
  './css/reset.css',
  './css/layout.css',
  './css/components.css',
  './css/content.css',
  './css/visuals.css',
  './css/extras.css',
  './css/responsive.css',
  './js/main.js',
  './js/progress.js',
  './js/quiz.js',
  './js/toc.js',
  './js/search.js',
  './js/sertifika.js',
  './og-image.svg'
];

// ─────────── INSTALL ───────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => cache.addAll(PRECACHE_URLS).catch(err => {
        console.warn('[SW] Precache eksik dosya atlandı:', err);
      }))
      .then(() => self.skipWaiting())
  );
});

// ─────────── ACTIVATE ───────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(names => Promise.all(
        names
          .filter(name => name !== STATIC_CACHE && name !== RUNTIME_CACHE)
          .map(name => caches.delete(name))
      ))
      .then(() => self.clients.claim())
  );
});

// ─────────── FETCH ───────────
self.addEventListener('fetch', event => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  // Sadece kendi origin — CDN (fonts/icons) network'e bırakılır
  if (url.origin !== location.origin) return;

  // HTML — network-first (taze içerik)
  if (request.headers.get('Accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(RUNTIME_CACHE).then(cache => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => caches.match(request).then(cached => cached || caches.match('./404.html')))
    );
    return;
  }

  // CSS/JS/SVG/IMG — cache-first
  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request).then(response => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(RUNTIME_CACHE).then(cache => cache.put(request, copy));
        }
        return response;
      }).catch(() => cached);
    })
  );
});

// ─────────── MESSAGE — kullanıcı manuel cache temizleyebilir ───────────
self.addEventListener('message', event => {
  if (event.data === 'CLEAR_CACHE') {
    caches.keys().then(names => names.forEach(n => caches.delete(n)));
  }
});
