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
    file.endsWith('.css') ? 'text/css' : file.endsWith('.html') ? 'text/html' : 'application/octet-stream');
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
    const context = await browser.newContext({ viewport: {width:375,height:812} });
    const page = await context.newPage();
    await page.goto(url);
    await page.waitForFunction(() => !!navigator.serviceWorker.controller);
    await page.locator('#loop-input').fill('Keep my draft');
    release = 2;
    await page.evaluate(async () => (await navigator.serviceWorker.getRegistration()).update());
    const notice = page.getByRole('complementary', {name:'App update'});
    await notice.waitFor();
    const update = notice.getByRole('button', {name:'Update now'});
    assert.equal(await update.isEnabled(), false);
    assert.equal(await page.locator('#loop-input').inputValue(),'Keep my draft');
    await page.evaluate(() => { window.originalSet=Storage.prototype.setItem; Storage.prototype.setItem=()=>{throw new Error('quota');}; });
    await page.getByRole('button',{name:'Add loop',exact:true}).click();
    await page.getByRole('alert').filter({hasText:'Could not save'}).waitFor();
    assert.equal(await update.isEnabled(),false);
    await page.evaluate(()=>{Storage.prototype.setItem=window.originalSet;});
    await page.getByRole('button',{name:'Add loop',exact:true}).click();
    await page.waitForFunction(()=>document.querySelector('#loop-input').value==='');
    await update.waitFor({state:'visible'});
    await page.waitForFunction(()=>!Array.from(document.querySelectorAll('button')).find(b=>b.textContent==='Update now').disabled);
    await page.getByRole('button',{name:'Add note',exact:true}).click();
    await page.getByRole('textbox',{name:'Note',exact:true}).fill('Keep note');
    assert.equal(await update.isEnabled(),false);
    await page.getByRole('button',{name:'Cancel',exact:true}).click();
    await page.getByRole('button',{name:'More actions'}).click();
    await page.getByRole('button',{name:'Edit loop',exact:true}).click();
    await page.getByRole('textbox',{name:'Edit loop',exact:true}).fill('Keep edit');
    assert.equal(await update.isEnabled(),false);
    await page.getByRole('button',{name:'Cancel',exact:true}).click();
    await page.getByRole('button',{name:'Delay',exact:true}).click();
    await page.getByLabel('Pick date').fill('2027-01-20');
    assert.equal(await update.isEnabled(),false);
    await page.getByRole('button',{name:'Cancel',exact:true}).click();
    const other = await context.newPage(); await other.goto(url);
    await other.locator('#loop-input').fill('Other window draft');
    await page.waitForFunction(()=>Array.from(document.querySelectorAll('button')).find(b=>b.textContent==='Update now').disabled);
    // Authoritative worker check must reject even if the UI is stale or bypassed.
    assert.equal(await page.evaluate(async()=>new Promise(async resolve=>{const ch=new MessageChannel();ch.port1.onmessage=e=>resolve(e.data.allowed);(await navigator.serviceWorker.getRegistration()).waiting.postMessage({type:'LOOPR_UPDATE_ACTIVATE'},[ch.port2]);})),false);
    assert.equal(await other.locator('#loop-input').inputValue(),'Other window draft');
    await other.close();
    await page.getByRole('link',{name:'Dials',exact:true}).click();
    await page.getByLabel('Default revisit time').fill('15:00');
    assert.equal(await update.isEnabled(),false);
    await page.getByRole('button',{name:'Save default time'}).click();
    await page.waitForFunction(()=>!Array.from(document.querySelectorAll('button')).find(b=>b.textContent==='Update now').disabled);
    await notice.getByRole('button',{name:'Later'}).click();
    await notice.waitFor({state:'hidden'});
    await page.reload();
    await notice.waitFor();
    await page.waitForFunction(()=>!Array.from(document.querySelectorAll('button')).find(b=>b.textContent==='Update now').disabled);
    const saved = await page.evaluate(()=>localStorage.getItem('loopr.loops'));
    const navigation = page.waitForEvent('load');
    await update.click(); await navigation;
    await page.waitForFunction(async()=>!(await navigator.serviceWorker.getRegistration()).waiting);
    await notice.waitFor({state:'hidden'});
    assert.equal(await page.evaluate(()=>localStorage.getItem('loopr.loops')),saved);
    assert.equal(await page.evaluate(()=>localStorage.getItem('loopr.revisitTime')),'15:00');
    assert.equal(await page.locator('#loopr-content').evaluate(e=>e.inert),false);
    console.log('PASS waiting notice, capture/edit/note/schedule/default guards, failed save, other-window rejection, Later, explicit activation/reload with saved data intact');
  } finally { await browser.close(); }
})().catch(e=>{console.error(e);process.exitCode=1;}).finally(()=>server.close());
