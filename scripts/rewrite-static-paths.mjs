// Rewrites absolute paths in dist/manifest.webmanifest and dist/sw.js
// when building for a sub-path (GitHub Pages). Run after `vite build`
// with VITE_BASE_PATH set (e.g. VITE_BASE_PATH=/loopr/).
//
// No-op if VITE_BASE_PATH is unset or equals "/".

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const base = process.env.VITE_BASE_PATH;

if (!base || base === '/') {
  console.log('[rewrite-static-paths] VITE_BASE_PATH not set; skipping.');
  process.exit(0);
}

if (!base.startsWith('/') || !base.endsWith('/')) {
  console.error(
    `[rewrite-static-paths] VITE_BASE_PATH must start and end with "/" (got: "${base}").`
  );
  process.exit(1);
}

const distDir = resolve(process.cwd(), 'dist');

// --- manifest.webmanifest ---
const manifestPath = resolve(distDir, 'manifest.webmanifest');
if (existsSync(manifestPath)) {
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  manifest.start_url = base;
  manifest.scope = base;
  if (Array.isArray(manifest.icons)) {
    manifest.icons = manifest.icons.map((icon) => ({
      ...icon,
      src: icon.src.replace(/^\//, base),
    }));
  }
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
  console.log(
    `[rewrite-static-paths] manifest.webmanifest rewritten for base ${base}`
  );
}

// --- sw.js ---
const swPath = resolve(distDir, 'sw.js');
if (existsSync(swPath)) {
  let sw = readFileSync(swPath, 'utf8');
  // Replace every "/<path>" literal that's an asset path. Conservative:
  // only match strings that begin with a single "/" followed by an
  // allowed character set (no double-slash, no http).
  sw = sw.replace(/(['"])\/([^'"\s]*?)\1/g, (match, quote, rest) => {
    // Skip already-rewritten paths (e.g. starts with the base path).
    if (rest.startsWith(base.slice(1))) return match;
    return `${quote}${base}${rest}${quote}`;
  });
  writeFileSync(swPath, sw);
  console.log(`[rewrite-static-paths] sw.js rewritten for base ${base}`);
}
