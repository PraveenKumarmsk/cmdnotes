// ════════════════════════════════════════════════════════════════════════════
// CMD Notes — Service Worker
// Bump VERSION to force an update on every device. Old caches are deleted.
// Sheet data is NOT cached here (the app keeps its own copy in localStorage).
// ════════════════════════════════════════════════════════════════════════════
const VERSION = 'cmdnotes-v2.0.0';
const CACHE_SHELL   = VERSION + '-shell';
const CACHE_RUNTIME = VERSION + '-runtime';
const CACHE_IMAGES  = VERSION + '-images';

const abs = (p) => new URL(p, self.registration.scope).href;
const CORE_URLS = ['./', 'index.html', 'offline.html', 'manifest.json'];
const ICON_URLS = ['icons/icon-192.png', 'icons/icon-512.png', 'icons/maskable-512.png', 'icons/apple-touch-icon.png'];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_SHELL);
    await cache.addAll(CORE_URLS.map(abs));
    await Promise.all(ICON_URLS.map((u) => cache.add(abs(u)).catch(() => {})));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k.startsWith('cmdnotes-') && !k.startsWith(VERSION + '-')).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  let url; try { url = new URL(req.url); } catch (e) { return; }
  if (url.origin !== self.location.origin) return;          // Google Apps Script calls go straight to the network
  if (url.searchParams.has('ping')) return;                 // real connectivity checks

  // Pages: network-first, offline fallback
  if (req.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const res = await fetch(req);
        if (res && res.status === 200 && res.type === 'basic') {
          const copy = res.clone();
          caches.open(CACHE_RUNTIME).then((c) => c.put(url.origin + url.pathname, copy)).catch(() => {});
        }
        return res;
      } catch (err) {
        return (await caches.match(req, { ignoreSearch: true }))
            || (await caches.match(abs('index.html')))
            || (await caches.match(abs('offline.html')))
            || new Response('<h1>Offline</h1>', { status: 503, headers: { 'Content-Type': 'text/html' } });
      }
    })());
    return;
  }

  // Images / icons: cache-first
  if (req.destination === 'image' || /\.(png|jpe?g|svg|gif|webp|ico)$/i.test(url.pathname)) {
    event.respondWith((async () => {
      const cached = await caches.match(req);
      if (cached) return cached;
      try {
        const res = await fetch(req);
        if (res && res.status === 200) { const copy = res.clone(); caches.open(CACHE_IMAGES).then((c) => c.put(req, copy)).catch(() => {}); }
        return res;
      } catch (err) { return new Response('', { status: 504 }); }
    })());
    return;
  }

  // HTML / CSS / JS / JSON: network-first, cache fallback
  event.respondWith((async () => {
    try {
      const res = await fetch(req, { cache: 'no-cache' });
      if (res && res.status === 200 && res.type === 'basic') { const copy = res.clone(); caches.open(CACHE_RUNTIME).then((c) => c.put(req, copy)).catch(() => {}); }
      return res;
    } catch (err) {
      return (await caches.match(req)) || new Response('Offline', { status: 503, headers: { 'Content-Type': 'text/plain' } });
    }
  })());
});

self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
  if (event.data === 'GET_VERSION' && event.ports && event.ports[0]) event.ports[0].postMessage(VERSION);
});
