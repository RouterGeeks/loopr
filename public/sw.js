// The production build replaces this configuration with its exact asset list.
const CONFIG = /* BUILD_CONFIG */ null;
const { cacheName, prefix, shell, base } = CONFIG;
let preserveCaches = false;
const indexUrl = `${base}index.html`;

self.addEventListener('install', (event) => {
  // A partial download must never replace a working offline release.
  event.waitUntil(caches.open(cacheName).then((cache) => cache.addAll(shell)));
  // Wait for existing tabs to close: never reload or replace an open draft.
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (preserveCaches ? Promise.resolve([]) : caches.keys()).then((keys) => Promise.all(
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


// The worker counts clients, including older versions that cannot report drafts.
// Only the requesting window may remain; it freezes its UI before this request.
self.addEventListener('message', (event) => {
  if (!['LOOPR_UPDATE_CHECK', 'LOOPR_UPDATE_ACTIVATE'].includes(event.data?.type)) return;
  event.waitUntil((async () => {
    const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    const scope = self.registration.scope;
    const ours = windows.filter(client => client.url.startsWith(scope));
    const allowed = ours.length === 1 && ours[0].id === event.source?.id;
    event.ports[0]?.postMessage({ allowed });
    if (allowed && event.data.type === 'LOOPR_UPDATE_ACTIVATE') {
      // Retain old assets in case a new tab opens during the activation handshake.
      // A later normal activation can clean these caches when old clients are gone.
      preserveCaches = true;
      await self.skipWaiting();
    }
  })());
});
