// Garde une copie de la ville pour qu'elle s'ouvre même avec un mauvais réseau.
const V = 'st-v1';
const CORE = ['/', '/index.html', '/app.css', '/app.js', '/manifest.webmanifest', '/icons/icon-192.png', '/icons/icon-180.png',
  'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js'];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(V).then((c) => c.addAll(CORE)).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== V).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', (e) => {
  const r = e.request; if (r.method !== 'GET') return;
  const u = new URL(r.url);
  const page = r.mode === 'navigate' || (u.origin === location.origin && /\.(html|js|css|webmanifest)$/.test(u.pathname));
  if (page) { // réseau d'abord (toujours la dernière version de la ville), copie sinon
    e.respondWith(fetch(r).then((res) => { const c = res.clone(); caches.open(V).then((k) => k.put(r, c)); return res; }).catch(() => caches.match(r).then((m) => m || caches.match('/'))));
  } else if (u.hostname.includes('jsdelivr') || u.hostname.includes('gstatic') || u.hostname.includes('googleapis') || u.origin === location.origin) {
    e.respondWith(caches.match(r).then((m) => m || fetch(r).then((res) => { const c = res.clone(); caches.open(V).then((k) => k.put(r, c)); return res; })));
  }
});
