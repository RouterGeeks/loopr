import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import vm from 'node:vm';
import { createHash, webcrypto } from 'node:crypto';

const script = resolve('scripts/rewrite-static-paths.mjs');
const worker = readFileSync('public/sw.js', 'utf8');
function fixture(run) {
  const dir = mkdtempSync(join(tmpdir(), 'loopr-shell-'));
  mkdirSync(join(dir, 'dist/assets'), { recursive: true });
  const files = ['index.html', 'favicon.png', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png', 'apple-touch-icon-lavender-v1.png', 'assets/app.js', 'assets/app.css'];
  for (const file of files) writeFileSync(join(dir, 'dist', file), file);
  writeFileSync(join(dir, 'dist/index.html'), readFileSync('index.html'));
  const build = (base) => {
    writeFileSync(join(dir, 'dist/sw.js'), worker);
    writeFileSync(join(dir, 'dist/manifest.webmanifest'), JSON.stringify({ icons: [{ src: '/icon-192.png' }] }));
    execFileSync(process.execPath, [script], { cwd: dir, env: { ...process.env, VITE_BASE_PATH: base } });
    const source = readFileSync(join(dir, 'dist/sw.js'), 'utf8');
    new vm.Script(source);
    return { source, config: JSON.parse(source.match(/const CONFIG = (.*);/)[1]),
      html: readFileSync(join(dir, 'dist/index.html'), 'utf8'),
      manifest: JSON.parse(readFileSync(join(dir, 'dist/manifest.webmanifest'), 'utf8')) };
  };
  try { run(build, dir); } finally { rmSync(dir, { recursive: true, force: true }); }
}

test('offline builds include actual bundles, correct scope, and no virtual route URLs', () => fixture(build => {
  for (const base of ['/', '/loopr/']) {
    const { config, manifest, html } = build(base);
    assert.equal(manifest.scope, base);
    assert.equal(manifest.start_url, base);
    assert.equal(manifest.icons[0].src, `${base}icon-192.png`);
    assert(config.shell.includes(`${base}assets/app.js`));
    assert(config.shell.includes(`${base}assets/app.css`));
    assert(config.shell.includes(`${base}index.html`));
    assert.equal(config.integrity[`${base}index.html`], createHash('sha256').update(html).digest('hex'));
    assert.deepEqual(Object.keys(config.integrity), config.shell);
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
    fetch: async () => { throw failure; },
  });
  handlers.install({ waitUntil: promise => { waited = promise; } });
  return assert.rejects(waited, /asset unavailable/);
});


test('asset navigations return assets; only known app routes receive the offline index', async () => {
  for (const base of ['/', '/loopr/']) {
    const handlers = {};
    const assets = ['index.html', 'apple-touch-icon.png', 'apple-touch-icon-lavender-v1.png', 'icon-192.png', 'icon-512.png', 'favicon.png', 'manifest.webmanifest', 'assets/app.js'];
    const shell = assets.map(name => base + name);
    vm.runInNewContext(worker.replace('/* BUILD_CONFIG */ null', JSON.stringify({cacheName:'test',prefix:'test',shell,base})), {
      URL,
      self: { location: { origin: 'https://example.test' }, addEventListener: (name, fn) => { handlers[name] = fn; } },
      caches: { open: async () => ({ match: async path => ({ path }) }) },
      fetch: async () => ({ path: 'network' }),
    });
    const request = async (path, mode = 'navigate', method = 'GET') => {
      let response;
      handlers.fetch({ request: {url:'https://example.test' + path, mode, method}, respondWith: value => { response = value; } });
      return response ? (await response).path : 'network';
    };
    for (const asset of assets) for (const query of ['', '?v=lavender']) {
      assert.equal(await request(base + asset + query), base + asset);
      assert.equal(await request(base + asset + query, 'no-cors'), base + asset);
    }
    for (const route of ['', 'find', 'doing', 'delayed', 'done', 'dials', 'revisit', 'archive', 'settings', 'thoughts/42', 'thoughts/42/connections', 'thoughts/42/labels']) {
      assert.equal(await request(base + route + '?view=test'), base + 'index.html');
      if (route) assert.equal(await request(base + route + '/'), base + 'index.html');
    }
    for (const path of ['missing.png', 'brand-icon.svg', 'assets/missing.js', 'unknown', 'thoughts/not-an-id']) {
      assert.equal(await request(base + path), 'network');
    }
    assert.equal(await request(base + 'doing', 'cors'), 'network');
    for (const icon of ['apple-touch-icon.png', 'apple-touch-icon-lavender-v1.png']) {
      assert.equal(await request(base + icon, 'navigate', 'POST'), 'network');
    }
  }
});


test('install rejects mixed HTML, wrong asset bytes, and HTTP failures before caching', async () => {
  for (const bad of ['html', 'asset', 'http', 'missing-integrity', null, 'put']) {
    const handlers = {}; const writes = []; const removed = []; let opened = 0;
    const files = {'/loopr/index.html':'new html', '/loopr/assets/app.js':'new script'};
    const integrity = Object.fromEntries(Object.entries(files).map(([path,body])=>[path,createHash('sha256').update(body).digest('hex')]));
    if (bad === 'missing-integrity') delete integrity['/loopr/index.html'];
    const config = {cacheName:'candidate',prefix:'loopr-',base:'/loopr/',shell:Object.keys(files),integrity};
    vm.runInNewContext(worker.replace('/* BUILD_CONFIG */ null',JSON.stringify(config)), {
      crypto:webcrypto, Uint8Array,
      self:{addEventListener:(name,fn)=>{handlers[name]=fn;}},
      fetch:async(path, options)=>{
        assert.equal(options.cache,'reload');
        return new Response((bad==='html' && path.endsWith('.html')) || (bad==='asset' && path.endsWith('.js')) ? 'stale bytes' : files[path], {status:bad==='http'?404:200});
      },
      caches:{open:async()=>{opened++;return {put:async(path)=>{if(bad==='put' && writes.length) throw Error('quota');writes.push(path);}};},delete:async key=>{removed.push(key);}},
    });
    let install;handlers.install({waitUntil:p=>{install=p;}});
    if (bad) await assert.rejects(install);else await install;
    if(['html','asset','http','missing-integrity'].includes(bad)){assert.equal(opened,0);assert.deepEqual(writes,[]);assert.deepEqual(removed,[]);}
    if(bad==='put') assert.deepEqual(removed,['candidate']);
    if(bad===null){assert.deepEqual(writes,Object.keys(files));assert.deepEqual(removed,[]);}
  }
});

test('Home Screen metadata uses a fresh Lavender PNG and preserves the legacy icon', () => {
  const html = readFileSync('index.html', 'utf8');
  const name = html.match(/rel="apple-touch-icon"[^>]*href="\/([^"?]+)"/)[1];
  assert.equal(name, 'apple-touch-icon-lavender-v1.png');
  const png = readFileSync('public/' + name);
  assert.deepEqual(png, readFileSync('public/apple-touch-icon.png'));
  assert.equal(png.subarray(1, 4).toString(), 'PNG');
  assert.equal(png.readUInt32BE(16), 180);
  assert.equal(png.readUInt32BE(20), 180);
  fixture(build => {
    for (const base of ['/', '/loopr/']) {
      const { config } = build(base);
      assert(config.shell.includes(base + name));
      assert(config.integrity[base + name]);
    }
  });
});

test('build embeds exact icon bytes before hashing HTML and refreshes them on rebuild', () => fixture((build, dir) => {
  const pngPath = join(dir, 'dist/apple-touch-icon-lavender-v1.png');
  writeFileSync(pngPath, readFileSync('public/apple-touch-icon-lavender-v1.png'));
  for (const base of ['/', '/loopr/']) {
    const result = build(base);
    const encoded = result.html.match(/href="data:image\/png;base64,([^"]+)"/)[1];
    assert.deepEqual(Buffer.from(encoded, 'base64'), readFileSync(pngPath));
    assert.equal(result.config.integrity[base + 'index.html'], createHash('sha256').update(result.html).digest('hex'));
    assert.equal(build(base).config.cacheName, result.config.cacheName);
  }
  const before = build('/loopr/');
  writeFileSync(pngPath, 'different icon fixture');
  const after = build('/loopr/');
  assert.notEqual(after.html, before.html);
  assert.notEqual(after.config.cacheName, before.config.cacheName);
  assert.notEqual(after.config.integrity['/loopr/index.html'], before.config.integrity['/loopr/index.html']);
}));
