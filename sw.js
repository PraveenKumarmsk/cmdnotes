// ════════════════════════════════════════════════════════════════════════════
// CMD Notes — Service Worker
//
// Bump VERSION to force an update on every device. Old caches are deleted.
// Sheet data is NOT cached here — the app keeps its own copy in localStorage.
//
// Behaviour:
//   • Navigations (HTML pages)     → network-first, offline fallback
//   • Images / icons               → cache-first (rarely change)
//   • CSS / JS / JSON / manifest   → network-first, cache fallback
//   • Anything on script.google.com → bypass (never cached)
//   • Non-GET requests              → bypass (never cached)
// ════════════════════════════════════════════════════════════════════════════

const VERSION       = 'cmdnotes-v2.0.1';
const CACHE_SHELL   = VERSION + '-shell';
const CACHE_RUNTIME = VERSION + '-runtime';
const CACHE_IMAGES  = VERSION + '-images';

const abs = (p) => new URL(p, self.registration.scope).href;

const CORE_URLS = [
  './',
  'index.html',
  'offline.html',
  'manifest.json'
];

const ICON_URLS = [
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/maskable-512.png',
  'icons/apple-touch-icon.png'
];

// ── install ────────────────────────────────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_SHELL);
    // Core shell — required. If any of these fails, install fails (that's OK,
    // it means a file is missing from the repo and we want to know).
    await cache.addAll(CORE_URLS.map(abs));
    // Icons — best-effort. Missing icons shouldn't block install.
    await Promise.all(
      ICON_URLS.map((u) => cache.add(abs(u)).catch(() => {}))
    );
    // Activate this SW immediately so users don't need to close every tab.
    await self.skipWaiting();
  })());
});

// ── activate ───────────────────────────────────────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    // Delete any cache from an older VERSION. Keeps localStorage untouched.
    const keys = await caches.keys();
    await Promise.all(
      keys
        .filter((k) => k.startsWith('cmdnotes-') && !k.startsWith(VERSION + '-'))
        .map((k) => caches.delete(k))
    );
    await self.clients.claim();
  })());
});

// ── fetch ──────────────────────────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const req = event.request;

  // Never touch non-GET requests (writes to Google Sheets, etc.)
  if (req.method !== 'GET') return;

  let url;
  try { url = new URL(req.url); } catch (e) { return; }

  // Never cache cross-origin requests (Google Apps Script, fonts CDNs, etc.)
  if (url.origin !== self.location.origin) return;

  // Never cache our own connectivity-ping queries
  if (url.searchParams.has('ping')) return;

  // ---- Navigations: network-first, offline.html fallback ----------------
  if (req.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const res = await fetch(req);
        if (res && res.status === 200 && res.type === 'basic') {
          const copy = res.clone();
          caches.open(CACHE_RUNTIME)
            .then((c) => c.put(url.origin + url.pathname, copy))
            .catch(() => {});
        }
        return res;
      } catch (err) {
        return (await caches.match(req, { ignoreSearch: true }))
            || (await caches.match(abs('index.html')))
            || (await caches.match(abs('offline.html')))
            || new Response('<h1>Offline</h1>', {
                 status: 503,
                 headers: { 'Content-Type': 'text/html; charset=utf-8' }
               });
      }
    })());
    return;
  }

  // ---- Images / icons: cache-first --------------------------------------
  if (
    req.destination === 'image' ||
    /\.(png|jpe?g|svg|gif|webp|ico|avif)$/i.test(url.pathname)
  ) {
    event.respondWith((async () => {
      const cached = await caches.match(req);
      if (cached) return cached;
      try {
        const res = await fetch(req);
        if (res && res.status === 200) {
          const copy = res.clone();
          caches.open(CACHE_IMAGES)
            .then((c) => c.put(req, copy))
            .catch(() => {});
        }
        return res;
      } catch (err) {
        return new Response('', { status: 504 });
      }
    })());
    return;
  }

  // ---- HTML / CSS / JS / JSON / manifest: network-first, cache fallback --
  event.respondWith((async () => {
    try {
      const res = await fetch(req, { cache: 'no-cache' });
      if (res && res.status === 200 && res.type === 'basic') {
        const copy = res.clone();
        caches.open(CACHE_RUNTIME)
          .then((c) => c.put(req, copy))
          .catch(() => {});
      }
      return res;
    } catch (err) {
      return (await caches.match(req))
          || new Response('Offline', {
               status: 503,
               headers: { 'Content-Type': 'text/plain; charset=utf-8' }
             });
    }
  })());
});

// ── messages from the page ─────────────────────────────────────────────────
self.addEventListener('message', (event) => {
  // Page can force-activate a waiting SW: navigator.serviceWorker.controller.postMessage('SKIP_WAITING')
  if (event.data === 'SKIP_WAITING') self.skipWaiting();

  // Page can query the running version: channel.port1
  if (event.data === 'GET_VERSION' && event.ports && event.ports[0]) {
    event.ports[0].postMessage(VERSION);
  }
});
