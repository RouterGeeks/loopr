// Optional production check: npm run build:pages; isolated Chromium and WebKit.
const {chromium,webkit}=require('playwright');
const assert=require('node:assert/strict');
const http=require('node:http');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve('dist');
let release=1;
const server=http.createServer((req,res)=>{
 const name=new URL(req.url,'http://localhost').pathname.slice('/loopr/'.length)||'index.html';
 let file=path.join(root,name);
 if(!fs.existsSync(file)||!fs.statSync(file).isFile()){res.statusCode=404;file=path.join(root,'index.html');}
 res.setHeader('Content-Type',file.endsWith('.js')?'application/javascript':file.endsWith('.css')?'text/css':file.endsWith('.html')?'text/html':file.endsWith('.png')?'image/png':'application/json');
 res.setHeader('Cache-Control','no-store');
 let body=fs.readFileSync(file);
 if(name==='sw.js') body=body.toString().replace(/"cacheName":"([^"]+)"/,`"cacheName":"$1-integrity-${release}"`);
 if(name==='index.html' && release===2) body=body.toString().replace(/assets\/[^" ]+\.js/,'assets/retired.js');
 res.end(body);
});
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 try {
  for(const engine of [chromium,webkit]) {
   release=1;const browser=await engine.launch();
   try {
    const context=await browser.newContext();let page=await context.newPage();
    const url=`http://127.0.0.1:${server.address().port}/loopr/`;
    await page.goto(url);await page.waitForFunction(()=>!!navigator.serviceWorker.controller);
    await page.locator('#loop-input').fill('Saved before update');await page.getByRole('button',{name:'Add thought',exact:true}).click();
    await page.getByRole('group',{name:'Saved before update',exact:true}).waitFor();
    await page.locator('#loop-input').fill('Keep this unfinished draft');
    const before=await page.evaluate(()=>localStorage.getItem('loopr.loops'));
    release=2;
    const state=await page.evaluate(async()=>{
     const r=await navigator.serviceWorker.getRegistration();
     const result=new Promise(resolve=>r.addEventListener('updatefound',()=>{const worker=r.installing;worker.addEventListener('statechange',()=>{if(['installed','redundant'].includes(worker.state))resolve(worker.state);});},{once:true}));
     await r.update();return result;
    });
    assert.equal(state,'redundant','mixed HTML must reject installation');
    assert.equal(await page.evaluate(async()=>Boolean((await navigator.serviceWorker.getRegistration()).waiting)),false);
    assert.equal(await page.locator('#loop-input').inputValue(),'Keep this unfinished draft');
    assert.equal(await page.evaluate(()=>localStorage.getItem('loopr.loops')),before);
    await page.reload();await page.waitForFunction(()=>document.querySelector('#loop-input')?.value==='Keep this unfinished draft');
    // The rejected install did not replace the healthy cached page or its assets.
    assert.equal((await page.locator('script[type=module]').getAttribute('src')).includes('retired'),false);
    release=3;await page.evaluate(async()=>{const r=await navigator.serviceWorker.getRegistration();await r.update();});
    await page.waitForFunction(async()=>Boolean((await navigator.serviceWorker.getRegistration()).waiting));
    await page.goto('about:blank');await page.goto(url);
    await page.getByRole('heading',{name:'Dashboard',exact:true}).waitFor();
    assert.equal(await page.evaluate(()=>localStorage.getItem('loopr.loops')),before);
    await page.waitForFunction(()=>document.querySelector('#loop-input')?.value==='Keep this unfinished draft');
    console.log(`PASS ${engine.name()}: reject HTTP-200 mixed HTML, retain active release and thoughts/draft, accept consistent update on reopen`);
    await context.close();
   }finally{await browser.close();}
  }
 }finally{server.close();}
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
