// Finalize the manifest and an atomic, build-specific offline shell.
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';

const base = process.env.VITE_BASE_PATH || '/';
if (!base.startsWith('/') || !base.endsWith('/')) {
  throw new Error('VITE_BASE_PATH must start and end with /');
}
const dist = resolve('dist');
const manifest = JSON.parse(readFileSync(resolve(dist, 'manifest.webmanifest'), 'utf8'));
manifest.start_url = base;
manifest.scope = base;
manifest.icons = manifest.icons.map((icon) => ({ ...icon, src: `${base}${icon.src.replace(/^\//, '')}` }));
writeFileSync(resolve(dist, 'manifest.webmanifest'), JSON.stringify(manifest, null, 2) + '\n');

// Only real files: Pages returns HTTP 404 for SPA deep links.
const files = ['index.html', 'manifest.webmanifest', 'favicon.png', 'icon-192.png',
  'icon-512.png', 'apple-touch-icon.png',
  ...readdirSync(resolve(dist, 'assets')).sort().map((file) => `assets/${file}`)];
const source = readFileSync(resolve(dist, 'sw.js'), 'utf8');
const hash = createHash('sha256').update(base).update(source);
for (const file of files) hash.update(file).update(readFileSync(resolve(dist, file)));
const prefix = `loopr-offline-${encodeURIComponent(base)}-`;
const config = { base, prefix, cacheName: `${prefix}${hash.digest('hex').slice(0, 16)}`,
  shell: files.map((file) => `${base}${file}`) };
writeFileSync(resolve(dist, 'sw.js'), source.replace('/* BUILD_CONFIG */ null', JSON.stringify(config)));
console.log(`[offline-shell] ${config.cacheName}: ${files.length} files`);
