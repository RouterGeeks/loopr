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
  const raw = JSON.stringify(Array.from({length:25}, (_,index)=>({id:index+1,text:`Garden idea ${index+1}`,note:'Context '.repeat(60)+'seeds Saturday',status:['do','doing','delayed','done','dropped'][index%5]})));
  await page.evaluate(raw=>localStorage.setItem('loopr.loops',raw),raw); await page.reload();
  await page.locator('#loop-input').fill('Keep this draft');
  await page.getByRole('link',{name:'Find a thought',exact:true}).click();
  assert.equal(await page.locator('#loop-input').inputValue(),'Keep this draft');
  await page.getByText('Save your draft or close the open editor before searching.',{exact:true}).waitFor();
  await page.locator('#loop-input').fill('');
  await page.getByRole('link',{name:'Find a thought',exact:true}).press('Enter');
  const field = page.getByRole('searchbox',{name:'Words to find'});
  await page.getByText('Type a few words to find a saved thought.',{exact:true}).waitFor();
  await field.fill(' GARDEN seeds ');
  await page.getByText('25 thoughts found.',{exact:true}).waitFor();
  const links = page.getByRole('list',{name:'Search results'}).getByRole('link');
  assert.equal(await links.count(),20);
  assert((await links.first().textContent()).includes('seeds'));
  await page.getByRole('button',{name:'Show more thoughts'}).click(); assert.equal(await links.count(),25);
  await links.nth(4).click(); await page.getByText('Garden idea 5',{exact:true}).waitFor();
  await page.getByRole('link',{name:'← Back to search'}).click(); assert.equal(await field.inputValue(),' GARDEN seeds ');
  await links.first().click();
  await page.getByRole('button',{name:'More actions',exact:true}).click();
  await page.getByRole('button',{name:'Edit note',exact:true}).click();
  await page.getByRole('textbox',{name:'Note',exact:true}).fill('unsaved note');
  await page.getByRole('link',{name:'← Back to search'}).click();
  assert.equal(await page.getByRole('textbox',{name:'Note',exact:true}).inputValue(),'unsaved note');
  await page.getByRole('button',{name:'Cancel',exact:true}).click();
  assert.equal(await page.evaluate(()=>localStorage.getItem('loopr.loops')),raw);
  await page.goBack(); assert.equal(await field.inputValue(),' GARDEN seeds ');
  for (const width of [320,375,390]) for (const size of ['16px','32px']) {
   await page.setViewportSize({width,height:844}); await page.evaluate(size=>document.documentElement.style.fontSize=size,size);
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`overflow ${width}/${size}`);
   assert((await field.boundingBox()).height>=44); assert((await links.first().boundingBox()).height>=44);
  }
  await page.evaluate(()=>document.documentElement.style.fontSize='16px');
  await page.screenshot({path:'/private/tmp/dash-dot-dot-search.png',fullPage:false});
  await field.fill('not present'); await page.getByText('No matching thoughts. Try another word.',{exact:true}).waitFor();
  await page.getByRole('button',{name:'Clear search'}).click(); assert(await field.evaluate(el=>el===document.activeElement));
  const other = await context.newPage(); await other.goto(url);
  const revised = JSON.stringify([{id:99,text:'Fresh thought',note:'Only in note: sunflower',status:'dropped'}]);
  await field.fill('sunflower'); await other.evaluate(raw=>localStorage.setItem('loopr.loops',raw),revised);
  await page.getByRole('button',{name:'Review latest saved thoughts'}).click();
  await page.getByText('1 thought found.',{exact:true}).waitFor(); assert.equal(await field.inputValue(),'sunflower');
  await context.setOffline(true); await page.reload(); await field.fill('sunflower'); await page.getByText('1 thought found.',{exact:true}).waitFor();
  assert.equal(await page.evaluate(()=>localStorage.getItem('loopr.loops')),revised);
  await context.setOffline(false);
  await page.evaluate(()=>localStorage.setItem('loopr.loops','broken JSON')); await page.reload();
  await page.getByRole('button',{name:'Review latest saved thoughts'}).waitFor();
  assert.equal(await page.evaluate(()=>localStorage.getItem('loopr.loops')),'broken JSON');
  assert.equal(await page.getByText('No matching thoughts. Try another word.',{exact:true}).count(),0);
  assert.deepEqual(errors,[]);
  console.log('PASS: local search, notes/all states, paging/back, draft protection, responsive layout, stale/corrupt storage, offline search.');
 } finally { await browser.close(); await new Promise(resolve=>server.close(resolve)); }
})().catch(error=>{console.error(error);server.close();process.exitCode=1;});
