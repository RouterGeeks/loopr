// The production build replaces this configuration with its exact asset list.
const CONFIG = /* BUILD_CONFIG */ null;
const { cacheName, prefix, shell, base, integrity } = CONFIG;
let preserveCaches = false;
const indexUrl = `${base}index.html`;

async function installShell() {
  // HTTP/CDN caches can return an older index.html alongside newer bundles.
  // Verify every response against this build before accepting an offline shell.
  const responses = await Promise.all(shell.map(async path => {
    const response = await fetch(path, { cache: 'reload' });
    if (!response.ok || !integrity?.[path]) throw new Error('Offline shell file unavailable');
    const digest = await crypto.subtle.digest('SHA-256', await response.clone().arrayBuffer());
    const actual = Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');
    if (actual !== integrity[path]) throw new Error('Offline shell release mismatch');
    return response;
  }));
  const cache = await caches.open(cacheName);
  try {
    // Sequential puts ensure cleanup cannot race a still-pending write.
    for (let index = 0; index < shell.length; index++) await cache.put(shell[index], responses[index]);
  } catch (error) {
    await caches.delete(cacheName);
    throw error;
  }
}

self.addEventListener('install', (event) => {
  // A partial or mixed download must never replace a working offline release.
  event.waitUntil(installShell());
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

  // Asset URLs must remain assets even when opened as a top-level document.
  // Query strings do not change which versioned shell asset we serve.
  if (shell.includes(url.pathname)) {
    event.respondWith(caches.open(cacheName).then(async (cache) =>
      (await cache.match(url.pathname)) || fetch(request)));
    return;
  }

  const route = url.pathname.slice(base.length).replace(/\/$/, '');
  const appRoute = ['', 'find', 'doing', 'delayed', 'done', 'dials', 'revisit', 'archive', 'settings'].includes(route) ||
    /^thoughts\/\d+(?:\/(?:connections|labels))?$/.test(route);
  if (request.mode === 'navigate' && appRoute) {
    event.respondWith(caches.open(cacheName).then(async (cache) =>
      (await cache.match(indexUrl)) || fetch(request)));
  }
  // Unknown files/routes use the network, never an offline HTML substitute.

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
