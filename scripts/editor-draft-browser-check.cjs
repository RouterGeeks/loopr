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
 const url = `http://127.0.0.1:${server.address().port}/loopr/`;
 try {
  const context = await browser.newContext({viewport:{width:390,height:844}});
  const errors=[]; context.on('page',p=>p.on('pageerror',e=>errors.push(e.message)));
  let page=await context.newPage(); await page.goto(url);
  await page.waitForFunction(()=>!!navigator.serviceWorker.controller);
  const original=[{id:1,text:'A quieter morning',status:'do',note:'Original note',labels:['Home'],createdAt:'2026-10-18T12:00:00Z'},{id:2,text:'Completed',status:'done'}];
  await page.evaluate(items=>localStorage.setItem('loopr.loops',JSON.stringify(items)),original);await page.reload();
  const saved=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('loopr.loops')));
  const open=async(p,kind='note',id=1,ready=true)=>{
   await p.goto(`${url}thoughts/${id}`);
   await p.getByRole('button',{name:'More actions',exact:true}).click();
   await p.getByRole('button',{name:kind==='note'?(id===1?'Edit note':'Add note'):'Edit thought',exact:true}).click();
   const selector=`#loop-${kind==='note'?'note':'edit'}-${id}`;
   if(ready) await p.waitForFunction(selector=>{const el=document.querySelector(selector);return el && !el.readOnly;},selector);
   return p.locator(selector);
  };
  let field=await open(page);await field.fill('Unfinished note\nsecond line');
  assert.equal((await saved())[0].note,'Original note');
  await page.reload(); field=await open(page);
  await page.getByText('Draft restored. Review it, then Save or Cancel.',{exact:true}).waitFor();
  assert.equal(await field.inputValue(),'Unfinished note\nsecond line');
  // Another tab cannot edit, save, or cancel the owner's recovery record.
  const other=await context.newPage();const locked=await open(other,'note',1,false);
  await other.getByText('This editor is open in another tab.',{exact:false}).waitFor();
  assert(await locked.getAttribute('readonly')!==null);
  await other.getByRole('button',{name:'Cancel',exact:true}).click();
  assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('loopr.editorDraft.note.1')).text),'Unfinished note\nsecond line');
  await page.close();page=other;field=await open(page);
  await page.getByText('Draft restored. Review it, then Save or Cancel.',{exact:true}).waitFor();
  await page.getByRole('button',{name:'Save',exact:true}).click();
  await page.getByRole('button',{name:'More actions',exact:true}).waitFor();
  assert.equal((await saved())[0].note,'Unfinished note\nsecond line');
  assert.equal(await page.evaluate(()=>localStorage.getItem('loopr.editorDraft.note.1')),null);
  // Text recovery, explicit cancel and ordinary navigation.
  field=await open(page,'text');await field.fill('Edited but not saved');
  await page.getByRole('link',{name:'Doing',exact:true}).click();field=await open(page,'text');
  assert.equal(await field.inputValue(),'Edited but not saved');
  await page.getByRole('button',{name:'Cancel',exact:true}).click();
  assert.equal((await saved())[0].text,'A quieter morning');
  assert.equal(await page.evaluate(()=>localStorage.getItem('loopr.editorDraft.text.1')),null);
  field=await open(page,'text');await field.fill('My recovered edit');
  // Newer saved data cannot be overwritten merely by reloading a recovered draft.
  const writer=await context.newPage();await writer.goto(url);
  await writer.evaluate(()=>{const x=JSON.parse(localStorage.getItem('loopr.loops'));x[0].text='Newer saved thought';localStorage.setItem('loopr.loops',JSON.stringify(x));});
  await page.getByText('The saved thought changed.',{exact:false}).waitFor();
  assert(await page.getByRole('button',{name:'Save',exact:true}).isDisabled());
  assert.equal(await field.inputValue(),'My recovered edit');
  await page.getByRole('button',{name:'Review latest saved thoughts',exact:true}).click();
  await page.getByRole('button',{name:'Use my draft after review',exact:true}).click();
  await page.getByRole('button',{name:'Save',exact:true}).click();
  await page.getByRole('button',{name:'More actions',exact:true}).waitFor();
  assert.equal((await saved())[0].text,'My recovered edit');
  // Failed saved-data writes retain recoverable drafts and allow retry.
  field=await open(page,'text');await field.fill('Retry edit');
  await page.evaluate(()=>{window.realSet=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(k==='loopr.loops')throw Error('quota');return window.realSet.call(this,k,v);};});
  await page.getByRole('button',{name:'Save',exact:true}).click();
  await page.getByText('Could not save.',{exact:false}).waitFor();assert.equal(await field.inputValue(),'Retry edit');
  await page.evaluate(()=>Storage.prototype.setItem=window.realSet);
  await page.getByRole('button',{name:'Save',exact:true}).click();await page.getByRole('button',{name:'More actions',exact:true}).waitFor();
  // Cleanup failure after successful commit must not resurrect an old edit.
  field=await open(page,'text');await field.fill('Committed once');
  await page.evaluate(()=>{window.realRemove=Storage.prototype.removeItem;Storage.prototype.removeItem=function(k){if(k==='loopr.editorDraft.text.1')throw Error('quota');return window.realRemove.call(this,k);};});
  await page.getByRole('button',{name:'Save',exact:true}).click();
  await page.getByText('Saved, but draft cleanup failed.',{exact:false}).waitFor();
  assert.equal((await saved())[0].text,'Committed once');await page.reload();field=await open(page,'text');
  await page.waitForFunction(()=>localStorage.getItem('loopr.editorDraft.text.1')===null);
  assert.equal(await field.inputValue(),'Committed once');await page.getByRole('button',{name:'Cancel',exact:true}).click();
  // Empty note is a recoverable intentional deletion, including on Done.
  field=await open(page);await field.fill('');await page.reload();field=await open(page);
  await page.getByText('Draft restored.',{exact:false}).waitFor();assert.equal(await field.inputValue(),'');
  await page.getByRole('button',{name:'Save',exact:true}).click();await page.getByRole('button',{name:'More actions',exact:true}).waitFor();assert.equal((await saved())[0].note,undefined);
  field=await open(page,'note',2);await field.fill('Done note draft');await page.reload();field=await open(page,'note',2);await page.getByText('Draft restored.',{exact:false}).waitFor();
  await field.press('Control+Enter');await page.getByRole('button',{name:'More actions',exact:true}).waitFor();assert.equal((await saved())[1].note,'Done note draft');
  // Deleted thoughts leave selectable orphan text; recovery never recreates them.
  field=await open(page,'text');await field.fill('Keep after deletion');
  await writer.evaluate(()=>localStorage.setItem('loopr.loops',JSON.stringify([])));
  await page.getByText('This thought is unavailable.',{exact:false}).waitFor();
  assert(await page.getByRole('button',{name:'Save',exact:true}).isDisabled());
  await page.goto(`${url}dials`);await page.getByText('Unfinished edits',{exact:false}).last().click();
  assert.equal(await page.getByRole('textbox',{name:'Recovered thought edit draft'}).inputValue(),'Keep after deletion');
  await page.getByRole('button',{name:'Discard this edit…',exact:true}).click();await page.getByRole('button',{name:'Discard draft',exact:true}).click();
  await page.getByText('No unfinished edits found.',{exact:true}).waitFor();assert.deepEqual(await saved(),[]);
  // Malformed draft stays untouched and cannot be overwritten by typing.
  await page.evaluate(items=>{localStorage.setItem('loopr.loops',JSON.stringify(items));localStorage.setItem('loopr.editorDraft.note.1','broken');},original);
  field=await open(page,'note',1,false);await page.getByText('Draft recovery could not be read.',{exact:false}).waitFor();assert(await field.getAttribute('readonly')!==null);
  assert.equal(await page.evaluate(()=>localStorage.getItem('loopr.editorDraft.note.1')),'broken');
  await page.getByRole('button',{name:'Cancel',exact:true}).click();await page.evaluate(()=>localStorage.removeItem('loopr.editorDraft.note.1'));
  // Offline recovery and mobile fit.
  field=await open(page,'text');await field.fill('Offline edit');await context.setOffline(true);await page.reload();field=await open(page,'text');await page.getByText('Draft restored.',{exact:false}).waitFor();assert.equal(await field.inputValue(),'Offline edit');
  for(const width of [320,375,390]) {await page.setViewportSize({width,height:844});await page.evaluate(()=>document.documentElement.style.fontSize='32px');assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));}
  await page.screenshot({path:'/private/tmp/editor-draft-mobile.png',fullPage:true});
  await context.setOffline(false);await context.close();
  // No-lock fallback uses only this session's storage; reload works, no shared draft.
  const fallback=await browser.newContext();await fallback.addInitScript(()=>Object.defineProperty(navigator,'locks',{value:undefined}));
  page=await fallback.newPage();await page.goto(url);await page.evaluate(items=>localStorage.setItem('loopr.loops',JSON.stringify(items)),original);
  field=await open(page,'text');await field.fill('Session edit');await page.reload();field=await open(page,'text');await page.getByText('Draft restored.',{exact:false}).waitFor();assert.equal(await field.inputValue(),'Session edit');
  assert.equal(await page.evaluate(()=>localStorage.getItem('loopr.editorDraft.text.1')),null);
  await fallback.close();assert.deepEqual(errors,[]);
  console.log('PASS: note/text reload and navigation, ownership, explicit save/cancel, stale review, write/cleanup failure, empty note, Done note, deleted-thought recovery, malformed preservation, offline, session fallback, mobile fit');
 } finally {await browser.close();server.close();}
})().catch(error=>{console.error(error);server.close();process.exitCode=1;});
