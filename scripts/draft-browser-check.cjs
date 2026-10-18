// Optional isolated production check. Run after npm run build:pages.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve('dist');
const server = http.createServer((req, res) => {
 let file = path.join(root, new URL(req.url, 'http://localhost').pathname.slice('/loopr/'.length) || 'index.html');
 if (!fs.existsSync(file) || !fs.statSync(file).isFile()) { res.statusCode = 404; file = path.join(root, 'index.html'); }
 res.setHeader('Content-Type', file.endsWith('.js') ? 'application/javascript' : file.endsWith('.css') ? 'text/css' : file.endsWith('.html') ? 'text/html' : file.endsWith('.png') ? 'image/png' : 'application/octet-stream');
 res.setHeader('Cache-Control', 'no-store'); res.end(fs.readFileSync(file));
});
(async () => {
 await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
 const browser = await chromium.launch();
 try {
  const context = await browser.newContext({viewport:{width:390,height:844}});
  const page = await context.newPage(); const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const url = `http://127.0.0.1:${server.address().port}/loopr/`;
  await page.goto(url); await page.waitForFunction(()=>!!navigator.serviceWorker.controller);
  const field=page.locator('#loop-input');
  await field.fill('First unfinished\nthought');
  const initial=await field.boundingBox();
  await page.getByRole('link',{name:'Doing',exact:true}).click();
  await page.getByRole('link',{name:'Dashboard',exact:true}).click();
  assert.equal(await field.inputValue(),'First unfinished\nthought');
  await page.reload();await page.getByText('Draft restored.',{exact:true}).waitFor();
  assert.equal(await field.inputValue(),'First unfinished\nthought');
  assert.equal((await field.boundingBox()).y,initial.y);
  const sourceId=await page.evaluate(()=>sessionStorage.getItem('loopr.captureDraftSession'));
  const other=await context.newPage();await other.goto(url);await other.locator('#loop-input').fill('Second tab draft');
  await page.reload();assert.equal(await field.inputValue(),'First unfinished\nthought');
  assert.equal(await other.locator('#loop-input').inputValue(),'Second tab draft');
  // A duplicated session ID cannot acquire an existing tab's draft ownership.
  const duplicate=await context.newPage();await duplicate.goto(url);
  await duplicate.evaluate(id=>sessionStorage.setItem('loopr.captureDraftSession',id),sourceId);await duplicate.reload();
  await duplicate.locator('#loop-input').fill('Duplicated tab is separate');
  assert.notEqual(await duplicate.evaluate(()=>sessionStorage.getItem('loopr.captureDraftSession')),sourceId);
  assert.equal(await field.inputValue(),'First unfinished\nthought');
  await duplicate.getByRole('button',{name:'Discard draft',exact:true}).click();
  await duplicate.getByRole('button',{name:'Keep draft',exact:true}).click();assert.equal(await duplicate.locator('#loop-input').inputValue(),'Duplicated tab is separate');
  await duplicate.getByRole('button',{name:'Discard draft',exact:true}).click();await duplicate.getByRole('button',{name:'Discard draft',exact:true}).click();
  await duplicate.locator('summary').filter({hasText:'Other saved drafts'}).click();
  const firstDraft=duplicate.locator('li').filter({hasText:'First unfinished'});
  await firstDraft.getByRole('button',{name:'Recover draft'}).click();
  await duplicate.getByText('That draft is open in another tab. Close that tab before recovering it here.',{exact:true}).waitFor();
  assert.equal(await duplicate.locator('#loop-input').inputValue(),'');
  await page.close();
  await firstDraft.getByRole('button',{name:'Recover draft'}).click();
  await duplicate.getByText('Draft restored.',{exact:true}).waitFor();assert.equal(await duplicate.locator('#loop-input').inputValue(),'First unfinished\nthought');
  assert.equal(await other.locator('#loop-input').inputValue(),'Second tab draft');
  // Thought write failure retains a recoverable draft; successful capture clears it.
  await duplicate.evaluate(()=>{window.originalSet=Storage.prototype.setItem;Storage.prototype.setItem=function(key,value){if(key==='loopr.loops')throw Error('quota');return window.originalSet.call(this,key,value);};});
  await duplicate.getByRole('button',{name:'Add thought',exact:true}).click();await duplicate.getByRole('alert').filter({hasText:'Could not save'}).waitFor();
  await duplicate.reload();assert.equal(await duplicate.locator('#loop-input').inputValue(),'First unfinished\nthought');
  // Simulate a crash/failed cleanup between saving the thought and removing its journal.
  await duplicate.evaluate(()=>{window.originalRemove=Storage.prototype.removeItem;Storage.prototype.removeItem=function(key){if(key.startsWith('loopr.captureDraft.'))throw Error('cleanup failed');return window.originalRemove.call(this,key);};});
  await duplicate.getByRole('button',{name:'Add thought',exact:true}).click();
  await duplicate.waitForFunction(()=>document.querySelector('#loop-input').value==='');
  await duplicate.reload();await duplicate.getByRole('group',{name:'First unfinished thought',exact:true}).waitFor();
  assert.equal(await duplicate.locator('#loop-input').inputValue(),'');
  assert.equal(await duplicate.evaluate(()=>JSON.parse(localStorage.getItem('loopr.loops')).length),1);
  assert.equal(await other.locator('#loop-input').inputValue(),'Second tab draft');
  // Explicit discard clears only this tab. Offline reload retains the other tab.
  await context.setOffline(true);await other.reload();await other.getByText('Draft restored.',{exact:true}).waitFor();
  assert.equal(await other.locator('#loop-input').inputValue(),'Second tab draft');
  await other.getByRole('button',{name:'Discard draft',exact:true}).click();await other.getByRole('button',{name:'Discard draft',exact:true}).click();await other.reload();
  assert.equal(await other.locator('#loop-input').inputValue(),'');
  await context.setOffline(false);
  await duplicate.locator('#loop-input').fill('Capture while typing');
  await duplicate.evaluate(()=>{navigator.locks.request('loopr-write',()=>new Promise(resolve=>{window.releaseWrite=resolve;}));});
  await duplicate.waitForFunction(()=>Boolean(window.releaseWrite));
  await duplicate.getByRole('button',{name:'Add thought',exact:true}).click();
  await duplicate.locator('#loop-input').fill('A newer unfinished draft');
  await duplicate.evaluate(()=>window.releaseWrite());
  await duplicate.getByRole('group',{name:'Capture while typing',exact:true}).waitFor();
  await duplicate.reload();assert.equal(await duplicate.locator('#loop-input').inputValue(),'A newer unfinished draft');
  await duplicate.locator('#loop-input').fill('A mobile draft');
  for(const width of [320,375,390])for(const size of ['16px','32px']){
    await duplicate.setViewportSize({width,height:844});await duplicate.evaluate(size=>document.documentElement.style.fontSize=size,size);
    assert(await duplicate.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  }
  await duplicate.evaluate(()=>document.documentElement.style.fontSize='16px');await duplicate.screenshot({path:'/private/tmp/dash-dot-dot-draft.png',fullPage:true});
  // Without Web Locks, only isolated session storage is used.
  const fallback=await browser.newContext();await fallback.addInitScript(()=>Object.defineProperty(navigator,'locks',{value:undefined}));
  const fallbackPage=await fallback.newPage();await fallbackPage.goto(url);await fallbackPage.locator('#loop-input').fill('Session-only fallback');await fallbackPage.reload();
  assert.equal(await fallbackPage.locator('#loop-input').inputValue(),'Session-only fallback');
  assert.equal(await fallbackPage.evaluate(()=>Object.keys(localStorage).filter(key=>key.startsWith('loopr.captureDraft.')).length),0);
  await fallbackPage.evaluate(()=>sessionStorage.setItem('loopr.captureDraftLocal','not JSON'));
  await fallbackPage.reload();await fallbackPage.locator('#loop-input').fill('New fallback draft');
  assert.equal(await fallbackPage.evaluate(()=>sessionStorage.getItem('loopr.captureDraftLocal')),'not JSON');
  await fallback.close();
  const denied=await browser.newContext();await denied.addInitScript(()=>Object.defineProperty(navigator,'locks',{value:{request:()=>Promise.reject(Error('locks denied'))}}));
  const deniedPage=await denied.newPage();await deniedPage.goto(url);await deniedPage.locator('#loop-input').fill('Locks unavailable draft');await deniedPage.reload();assert.equal(await deniedPage.locator('#loop-input').inputValue(),'Locks unavailable draft');await denied.close();
  const corrupt=await browser.newContext();const corruptPage=await corrupt.newPage();await corruptPage.goto(url);
  await corruptPage.evaluate(()=>{localStorage.setItem('loopr.captureDraft.abc-def','broken');sessionStorage.setItem('loopr.captureDraftSession','abc-def');});
  await corruptPage.reload();await corruptPage.locator('#loop-input').fill('New draft after corrupt record');
  assert.equal(await corruptPage.evaluate(()=>localStorage.getItem('loopr.captureDraft.abc-def')),'broken');await corrupt.close();
  assert.deepEqual(errors,[]);console.log('PASS draft navigation/reload, ownership/duplicated tabs, closed-tab recovery, failed saves, capture journal cleanup, discard, offline, fallback and mobile layout.');
 } finally { await browser.close(); await new Promise(resolve=>server.close(resolve)); }
})().catch(error=>{console.error(error);server.close();process.exitCode=1;});
