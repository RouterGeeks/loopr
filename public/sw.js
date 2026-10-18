// The production build replaces this configuration with its exact asset list.
const CONFIG = /* BUILD_CONFIG */ null;
const { cacheName, prefix, shell, base } = CONFIG;
const indexUrl = `${base}index.html`;

self.addEventListener('install', (event) => {
  // A partial download must never replace a working offline release.
  event.waitUntil(caches.open(cacheName).then((cache) => cache.addAll(shell)));
  // Wait for existing tabs to close: never reload or replace an open draft.
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((key) => key !== cacheName &&
        (key.startsWith(prefix) || key === 'loopr-shell-v6' || key === 'loopr-shell-v5'))
        .map((key) => caches.delete(key))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin ||
      !url.pathname.startsWith(base)) return;

  if (request.mode === 'navigate') {
    event.respondWith(caches.open(cacheName).then(async (cache) =>
      (await cache.match(indexUrl)) || fetch(request)));
  } else if (shell.includes(url.pathname)) {
    event.respondWith(caches.open(cacheName).then(async (cache) =>
      (await cache.match(url.pathname)) || fetch(request)));
  }
});
