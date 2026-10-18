import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import vm from 'node:vm';

const script = resolve('scripts/rewrite-static-paths.mjs');
const worker = readFileSync('public/sw.js', 'utf8');
function fixture(run) {
  const dir = mkdtempSync(join(tmpdir(), 'loopr-shell-'));
  mkdirSync(join(dir, 'dist/assets'), { recursive: true });
  const files = ['index.html', 'favicon.png', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png', 'assets/app.js', 'assets/app.css'];
  for (const file of files) writeFileSync(join(dir, 'dist', file), file);
  const build = (base) => {
    writeFileSync(join(dir, 'dist/sw.js'), worker);
    writeFileSync(join(dir, 'dist/manifest.webmanifest'), JSON.stringify({ icons: [{ src: '/icon-192.png' }] }));
    execFileSync(process.execPath, [script], { cwd: dir, env: { ...process.env, VITE_BASE_PATH: base } });
    const source = readFileSync(join(dir, 'dist/sw.js'), 'utf8');
    new vm.Script(source);
    return { source, config: JSON.parse(source.match(/const CONFIG = (.*);/)[1]),
      manifest: JSON.parse(readFileSync(join(dir, 'dist/manifest.webmanifest'), 'utf8')) };
  };
  try { run(build, dir); } finally { rmSync(dir, { recursive: true, force: true }); }
}

test('offline builds include actual bundles, correct scope, and no virtual route URLs', () => fixture(build => {
  for (const base of ['/', '/loopr/']) {
    const { config, manifest } = build(base);
    assert.equal(manifest.scope, base);
    assert.equal(manifest.start_url, base);
    assert.equal(manifest.icons[0].src, `${base}icon-192.png`);
    assert(config.shell.includes(`${base}assets/app.js`));
    assert(config.shell.includes(`${base}assets/app.css`));
    assert(config.shell.includes(`${base}index.html`));
    assert(!config.shell.includes(`${base}doing`));
  }
}));

test('release identity is deterministic and changes when shell bytes change', () => fixture((build, dir) => {
  const first = build('/loopr/').config.cacheName;
  assert.equal(build('/loopr/').config.cacheName, first);
  writeFileSync(join(dir, 'dist/assets/app.js'), 'new release');
  assert.notEqual(build('/loopr/').config.cacheName, first);
}));

test('worker template compiles and does not force activation of waiting updates', () => {
  const handlers = {};
  let waited;
  const failure = new Error('asset unavailable');
  vm.runInNewContext(worker.replace('/* BUILD_CONFIG */ null', JSON.stringify({cacheName:'test',prefix:'loopr-offline-',shell:['/index.html'],base:'/'})), {
    self: { addEventListener: (name, fn) => { handlers[name] = fn; } },
    caches: { open: async () => ({ addAll: async () => { throw failure; } }) },
  });
  handlers.install({ waitUntil: promise => { waited = promise; } });
  return assert.rejects(waited, /asset unavailable/);
});
