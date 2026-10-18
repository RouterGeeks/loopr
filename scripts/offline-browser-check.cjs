// Optional production-browser check: requires Playwright + Chromium locally.
// Run after npm run build:pages. Uses isolated storage and a Pages-like server.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve('dist');
const base = process.env.VITE_BASE_PATH || '/loopr/';
let release = 1;
const server = http.createServer((req, res) => {
  let name = new URL(req.url, 'http://localhost').pathname.slice(base.length);
  if (!name) name = 'index.html';
  let file = path.join(root, name);
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) {
    res.statusCode = 404;
    file = path.join(root, 'index.html');
  }
  res.setHeader('Content-Type', file.endsWith('.js') ? 'application/javascript' :
    file.endsWith('.png') ? 'image/png' : file.endsWith('.css') ? 'text/css' : file.endsWith('.html') ? 'text/html' : 'application/octet-stream');
  res.setHeader('Cache-Control', 'no-store');
  let body = fs.readFileSync(file);
  if (name === 'sw.js' && release > 1) {
    body = body.toString().replace(/"cacheName":"([^"]+)"/, `"cacheName":"$1-test-${release}"`);
    if (release === 3) body = body.replace('"shell":[', '"shell":["/loopr/missing.js",');
  }
  res.end(body);
});
(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const url = `http://127.0.0.1:${server.address().port}${base}`;
  const browser = await chromium.launch();
  try {
    const context = await browser.newContext({ viewport: { width: 375, height: 812 } });
    let page = await context.newPage();
    const errors = [];
    context.on('page', p => p.on('pageerror', e => errors.push(e.message)));
    page.on('pageerror', e => errors.push(e.message));
    await page.goto(url);
    await page.waitForFunction(() => !!navigator.serviceWorker.controller);
    await page.evaluate(async () => { await caches.open('another-app-cache'); });
    await context.setOffline(true);
    for (const route of ['', 'doing', 'delayed', 'done', 'dials', 'revisit', 'archive', 'settings']) {
      await page.goto(url + route);
      await page.getByRole('heading', { level: 1 }).waitFor();
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    }
    await page.goto(url);
    await page.getByRole('textbox', { name: 'New thought', exact: true }).fill('Offline thought');
    await page.getByRole('button', { name: 'Add thought', exact: true }).click();
    await page.waitForFunction(() => document.querySelector('#loop-input').value === '');
    await page.getByRole('button', { name: 'More actions', exact: true }).click();
    await page.getByRole('button', { name: 'Add note', exact: true }).click();
    await page.getByRole('textbox', { name: 'Note', exact: true }).fill('Offline note');
    await page.getByRole('button', { name: 'Save', exact: true }).click();
    await page.getByRole('textbox', { name: 'Note', exact: true }).waitFor({ state: 'hidden' });
    await page.getByRole('button', { name: 'More actions' }).click();
    await page.getByRole('button', { name: 'Edit thought', exact: true }).click();
    await page.getByRole('textbox', { name: 'Edit thought', exact: true }).fill('Offline thought edited');
    await page.getByRole('button', { name: 'Save', exact: true }).click();
    await page.getByRole('textbox', { name: 'Edit thought', exact: true }).waitFor({ state: 'hidden' });
    const saved = await page.evaluate(() => localStorage.getItem('loopr.loops'));
    assert.equal(JSON.parse(saved)[0].note, 'Offline note');
    await page.close();
    page = await context.newPage();
    await page.goto(url);
    await page.getByRole('group', { name: 'Offline thought edited', exact: true }).waitFor();
    assert.equal(await page.evaluate(() => localStorage.getItem('loopr.loops')), saved);
    // Direct image navigations must return image bytes, online and offline.
    for (const offline of [false, true]) {
      await context.setOffline(offline);
      for (const name of ['apple-touch-icon.png', 'apple-touch-icon-lavender-v1.png', 'icon-192.png', 'icon-512.png', 'favicon.png']) {
        for (const query of ['', '?v=lavender']) {
          const response = await page.goto(url + name + query);
          assert.equal(response.headers()['content-type'], 'image/png');
          assert.equal(response.fromServiceWorker(), true);
          assert.deepEqual(await response.body(), fs.readFileSync(path.join(root, name)));
          await page.waitForFunction(() => document.querySelector('img')?.naturalWidth > 0);
          assert.equal(await page.getByRole('navigation').count(), 0);
        }
      }
      for (const route of ['find', 'thoughts/42', 'thoughts/42/connections', 'thoughts/42/labels']) {
        await page.goto(url + route);
        await page.getByRole('heading', { level: 1 }).waitFor();
      }
      await page.goto(url);
      assert.equal(await page.evaluate(() => localStorage.getItem('loopr.loops')), saved);
      const iconHref = await page.locator('link[rel="apple-touch-icon"]').getAttribute('href');
      assert(iconHref.startsWith('data:image/png;base64,'));
      assert.deepEqual(Buffer.from(iconHref.split(',')[1], 'base64'),
        fs.readFileSync(path.join(root, 'apple-touch-icon-lavender-v1.png')));
      assert.deepEqual(await page.evaluate(async href => {
        const image = new Image();
        image.src = href;
        await image.decode();
        return [image.naturalWidth, image.naturalHeight];
      }, iconHref), [180, 180]);
    }
    await context.setOffline(false);
    await page.locator('#loop-input').fill('Unsaved draft stays');
    release = 2;
    await page.evaluate(async () => (await navigator.serviceWorker.getRegistration()).update());
    await page.waitForFunction(async () => !!(await navigator.serviceWorker.getRegistration()).waiting);
    assert.equal(await page.locator('#loop-input').inputValue(), 'Unsaved draft stays');
    const oldCache = await page.evaluate(async () => (await caches.keys()).find(k => k.startsWith('loopr-offline-') && !k.endsWith('test-2')));
    await page.close();
    page = await context.newPage();
    await page.goto(url);
    await page.waitForFunction(async () => !(await navigator.serviceWorker.getRegistration()).waiting);
    await page.waitForFunction(async old => !(await caches.keys()).includes(old), oldCache);
    assert(await page.evaluate(async () => (await caches.keys()).includes('another-app-cache')));
    assert.equal(await page.evaluate(() => localStorage.getItem('loopr.loops')), saved);
    release = 3;
    await page.evaluate(async () => (await navigator.serviceWorker.getRegistration()).update());
    await page.waitForFunction(async () => !(await navigator.serviceWorker.getRegistration()).installing);
    assert.equal(await page.evaluate(async () => !!(await navigator.serviceWorker.getRegistration()).waiting), false);
    await context.setOffline(true);
    await page.reload();
    await page.getByRole('group', { name: 'Offline thought edited', exact: true }).waitFor();
    assert.deepEqual(errors, []);
    console.log('PASS offline deep links/legacy redirects, cold page reopen, capture/persistence, waiting update/draft retention, activation/cache isolation, failed update rollback, 375px layout');
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; }).finally(() => server.close());
