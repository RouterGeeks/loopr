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
  const items = ['do','doing','delayed','done','dropped'].map((status,index)=>({id:index+1,text:`Thought ${index+1}`,note:'Seeds',status,createdAt:`2026-10-${18+index}T12:00:00Z`,...(index===1?{labels:['Garden']}: {})}));
  const raw=JSON.stringify(items);
  await page.evaluate(raw=>localStorage.setItem('loopr.loops',raw),raw); await page.reload();
  await page.getByRole('button',{name:'More actions',exact:true}).click();
  await page.getByRole('link',{name:'Edit labels',exact:true}).click();
  const labelField=page.getByLabel('Find or create a label');
  for(const width of [320,375,390])for(const size of ['16px','32px']){
    await page.setViewportSize({width,height:844});await page.evaluate(size=>document.documentElement.style.fontSize=size,size);
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`editor overflow ${width}/${size}`);
  }
  await page.evaluate(()=>document.documentElement.style.fontSize='16px');
  await labelField.fill(' garden '); await page.getByRole('button',{name:'Add label',exact:true}).click();
  await page.getByRole('button',{name:'Remove label Garden',exact:true}).waitFor();
  assert.equal(await page.evaluate(()=>localStorage.getItem('loopr.loops')),raw);
  await page.evaluate(()=>{window.originalSet=Storage.prototype.setItem;Storage.prototype.setItem=()=>{throw Error('quota');};});
  await page.getByRole('button',{name:'Save labels',exact:true}).click();
  await page.getByRole('alert').filter({hasText:'Could not save'}).waitFor();
  await page.getByRole('button',{name:'Remove label Garden',exact:true}).waitFor();
  await page.getByRole('link',{name:'Find a thought',exact:true}).click(); assert(await labelField.isVisible());
  await page.evaluate(()=>{Storage.prototype.setItem=window.originalSet;});
  await page.getByRole('button',{name:'Save labels',exact:true}).click();
  await page.getByRole('link',{name:'Garden',exact:true}).waitFor();
  let saved=JSON.parse(await page.evaluate(()=>localStorage.getItem('loopr.loops')));
  assert.deepEqual(saved[0].labels,['Garden']); assert(saved.every(x=>!x.connections));
  // The detail label chip opens filter-only search; boundaries combine with it.
  await page.getByRole('link',{name:'Garden',exact:true}).click();
  await page.getByText('2 thoughts found.',{exact:true}).waitFor();
  await page.getByRole('button',{name:'Filters',exact:true}).click();
  await page.getByLabel('From',{exact:true}).fill('2026-10-18');
  await page.getByLabel('To',{exact:true}).fill('2026-10-18');
  await page.getByText('1 thought found.',{exact:true}).waitFor();
  await page.getByRole('list',{name:'Search results'}).getByRole('link').first().click();
  await page.getByRole('link',{name:'← Back to search'}).click();
  await page.getByText('1 thought found.',{exact:true}).waitFor();
  await page.getByRole('button',{name:'Filters',exact:true}).click();
  assert.equal(await page.getByLabel('To',{exact:true}).inputValue(),'2026-10-18');
  await page.getByLabel('From',{exact:true}).fill('2026-10-20');
  await page.getByText('From must be on or before To.',{exact:true}).waitFor();
  for(const width of [320,375,390])for(const size of ['16px','32px']){
    await page.setViewportSize({width,height:844});await page.evaluate(size=>document.documentElement.style.fontSize=size,size);
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`filter overflow ${width}/${size}`);
  }
  await page.evaluate(()=>document.documentElement.style.fontSize='16px');
  await page.getByRole('button',{name:'Clear filters',exact:true}).click();
  await page.goto(url+'thoughts/1/connections');
  const summary=page.locator('summary').filter({hasText:'Shared labels'}); await summary.click();
  await page.getByText('Also labeled Garden · Doing',{exact:true}).waitFor();
  const before=await page.evaluate(()=>localStorage.getItem('loopr.loops'));
  await page.getByRole('link',{name:'Thought 2',exact:true}).click();
  await page.getByRole('link',{name:'← Back to connections'}).click();
  assert.equal(await page.evaluate(()=>localStorage.getItem('loopr.loops')),before);
  await summary.click();
  await page.getByRole('button',{name:'Connect shared thought: Thought 2',exact:true}).click();
  await page.getByText('Connection saved.',{exact:true}).waitFor();
  assert.equal(await page.getByRole('button',{name:'Connect shared thought: Thought 2',exact:true}).count(),0);
  saved=JSON.parse(await page.evaluate(()=>localStorage.getItem('loopr.loops')));assert.deepEqual(saved[0].connections,[2]);
  // All remaining states support labels; closing a draft is not a save.
  for(const id of [2,3,4,5]){
    await page.goto(url+`thoughts/${id}/labels`);await labelField.fill('Home');await page.getByRole('button',{name:'Add label',exact:true}).click();
    await page.getByRole('button',{name:'Save labels',exact:true}).click();await page.getByRole('link',{name:'Home',exact:true}).waitFor();
  }
  await page.goto(url+'thoughts/1/labels');await labelField.fill('Not saved');await page.getByRole('button',{name:'Cancel labels',exact:true}).click();
  assert(!JSON.parse(await page.evaluate(()=>localStorage.getItem('loopr.loops')))[0].labels.includes('Not saved'));
  // Stale save preserves a new label draft until the user reviews and retries.
  await page.goto(url+'thoughts/1/labels');await labelField.fill('Writing');await page.getByRole('button',{name:'Add label',exact:true}).click();
  const other=await context.newPage();await other.goto(url);
  await other.evaluate(()=>{const items=JSON.parse(localStorage.getItem('loopr.loops'));items[0].note='Changed elsewhere';localStorage.setItem('loopr.loops',JSON.stringify(items));});
  await page.getByRole('button',{name:'Save labels',exact:true}).click();
  await page.getByRole('button',{name:'Remove label Writing',exact:true}).waitFor();
  await page.getByRole('button',{name:'Review latest saved thoughts'}).click();
  await page.getByRole('button',{name:'Save labels',exact:true}).click();await page.getByRole('link',{name:'Writing',exact:true}).waitFor();await other.close();
  // Real backup export/restore includes labels and connections.
  await page.goto(url+'dials');const downloadPromise=page.waitForEvent('download');await page.getByRole('button',{name:'Export backup',exact:true}).click();
  const download=await downloadPromise;const backup=fs.readFileSync(await download.path(),'utf8');assert.equal(JSON.parse(backup).version,3);
  await page.getByLabel('Restore backup',{exact:true}).setInputFiles({name:'labels.json',mimeType:'application/json',buffer:Buffer.from(backup)});
  await page.getByRole('button',{name:'Replace all thoughts',exact:true}).click();await page.getByText('Restored 5 thoughts from your backup.',{exact:true}).waitFor();
  assert.deepEqual(JSON.parse(await page.evaluate(()=>localStorage.getItem('loopr.loops'))),JSON.parse(backup).loops);
  await page.goto(url+'thoughts/1/labels');
  await page.getByRole('button',{name:'Remove label Garden',exact:true}).click();
  await page.getByRole('button',{name:'Save labels',exact:true}).click();
  await page.getByRole('link',{name:'Writing',exact:true}).waitFor();
  assert.deepEqual(JSON.parse(await page.evaluate(()=>localStorage.getItem('loopr.loops')))[0].connections,[2]);
  await context.setOffline(true);await page.goto(url+'thoughts/1/labels');await labelField.fill('Offline');await page.getByRole('button',{name:'Add label',exact:true}).click();await page.getByRole('button',{name:'Save labels',exact:true}).click();
  await page.getByRole('link',{name:'Offline',exact:true}).click();await page.getByText('1 thought found.',{exact:true}).waitFor();await page.reload();await page.getByText('1 thought found.',{exact:true}).waitFor();
  await page.getByRole('button',{name:'Filters',exact:true}).click();await page.screenshot({path:'/private/tmp/dash-dot-dot-label-filters.png',fullPage:true});
  assert.deepEqual(errors,[]);console.log('PASS labels, failures/stale retry, filters/back, suggestions/manual connect, v3 restore, offline, mobile layouts.');
 } finally { await browser.close(); await new Promise(resolve=>server.close(resolve)); }
})().catch(error=>{console.error(error);server.close();process.exitCode=1;});
