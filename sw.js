// Lotl Dash service worker: keeps a copy of the game on the device so it plays offline.
// - the page itself: network first (so updates arrive when online), cached copy when offline
// - everything else (art, font, icons): cached copy first, refreshed in the background
// Bump CACHE when the list of files changes.
const CACHE = 'lotldash-v1';
const FILES = [
  './',
  'index.html',
  'manifest.webmanifest',
  'assets/title.jpg',
  'assets/icon-64.png',
  'assets/icon-180.png',
  'assets/icon-512.png',
  'assets/fonts/baloo2-latin.woff2'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  if (req.mode === 'navigate') {
    // the game page: try the network for a few seconds, otherwise play the saved copy
    e.respondWith((async () => {
      const cache = await caches.open(CACHE);
      try {
        const net = await Promise.race([fetch(req), new Promise((_, no) => setTimeout(() => no(new Error('slow')), 3500))]);
        if (net && net.ok) cache.put('index.html', net.clone());
        return net;
      } catch (err) {
        return (await cache.match('index.html')) || (await cache.match('./')) || Response.error();
      }
    })());
    return;
  }
  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const hit = await cache.match(req, { ignoreSearch: true });
    const refresh = fetch(req).then(res => { if (res && res.ok) cache.put(req, res.clone()); return res; }).catch(() => null);
    if (hit) { e.waitUntil(refresh); return hit; }
    return (await refresh) || Response.error();
  })());
});
