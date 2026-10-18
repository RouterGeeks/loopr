// Optional production-preview check; uses an isolated browser profile.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
(async () => {
 const browser = await chromium.launch();
 try {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  const errors = []; page.on('pageerror', e => errors.push(e.message));
  await page.goto('http://localhost:4173/');
  await page.evaluate(() => localStorage.setItem('loopr.loops', JSON.stringify([
   {id:1,text:'A quieter morning',status:'do',note:'Keep this note'},
   {id:2,text:'Walk before coffee',status:'do'},
   {id:3,text:'A completed thought',status:'done'},
  ]))); await page.reload();
  const card = page.getByRole('group', {name:'A quieter morning',exact:true});
  const more = card.getByRole('button',{name:'More actions',exact:true});
  const menu = page.getByRole('group',{name:'Thought actions',exact:true});
  await more.scrollIntoViewIfNeeded(); const before = await card.boundingBox();
  await more.click(); await menu.waitFor();
  assert.equal(await more.getAttribute('aria-expanded'),'true');
  assert.equal((await card.boundingBox()).height,before.height);
  assert.equal(await page.locator(':focus').textContent(),'Edit note');
  await page.keyboard.press('Tab'); assert.equal(await page.locator(':focus').textContent(),'Connect the dots');
  await page.keyboard.press('Tab'); assert.equal(await page.locator(':focus').textContent(),'Edit thought');
  await page.keyboard.press('Tab'); assert.equal(await page.locator(':focus').textContent(),'Delete thought');
  await page.keyboard.press('Escape'); await menu.waitFor({state:'hidden'});
  assert.equal(await more.evaluate(el=>el===document.activeElement),true);
  await more.press('Enter'); await menu.waitFor();
  await page.keyboard.press('Shift+Tab'); assert.equal(await more.evaluate(el=>el===document.activeElement),true);
  await page.keyboard.press('Shift+Tab'); await menu.waitFor({state:'hidden'});
  assert.equal(await card.getByRole('button',{name:'Drop',exact:true}).evaluate(el=>el===document.activeElement),true);
  await more.click(); await card.getByRole('button',{name:'Edit note',exact:true}).click();
  await menu.waitFor({state:'hidden'}); await page.getByRole('textbox',{name:'Note',exact:true}).waitFor();
  await page.getByRole('button',{name:'Cancel',exact:true}).click();
  assert.equal(await more.evaluate(el=>el===document.activeElement),true);
  await more.click(); await menu.getByRole('button',{name:'Edit thought',exact:true}).click();
  await page.getByRole('textbox',{name:'Edit thought',exact:true}).waitFor(); await menu.waitFor({state:'hidden'});
  await page.getByRole('button',{name:'Cancel',exact:true}).click();
  assert.equal(await more.evaluate(el=>el===document.activeElement),true);
  await more.click(); await menu.getByRole('button',{name:'Delete thought',exact:true}).click();
  assert.equal(await page.locator(':focus').textContent().then(t=>t.trim()),'Cancel');
  await page.getByRole('button',{name:'Cancel',exact:true}).click();
  assert.equal(await more.evaluate(el=>el===document.activeElement),true);
  for (const width of [320,375,390]) for (const font of ['16px','32px']) {
   await page.setViewportSize({width,height:844}); await page.evaluate(value=>{document.documentElement.style.fontSize=value;},font);
   await more.scrollIntoViewIfNeeded(); await more.click(); await menu.waitFor();
   const bounds = await menu.boundingBox();
   assert(bounds.x>=0 && bounds.x+bounds.width<=width, `menu width ${width}/${font}`);
   assert(bounds.y>=0 && bounds.y+bounds.height<=844, `menu height ${width}/${font}`);
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   for (const item of await menu.locator('a,button').all()) assert((await item.boundingBox()).height>=44);
   assert((await card.getByRole('button',{name:'Edit note',exact:true}).boundingBox()).height>=44);
   await page.keyboard.press('Escape');
  }
  await page.setViewportSize({width:390,height:844}); await page.evaluate(()=>{document.documentElement.style.fontSize='';});
  await more.scrollIntoViewIfNeeded(); await more.click();
  await page.screenshot({path:'/private/tmp/dash-dot-dot-compact-menu.png'});
  await menu.getByRole('link',{name:'Connect the dots',exact:true}).click();
  await page.getByRole('heading',{name:'Connect the dots',exact:true}).waitFor(); await menu.waitFor({state:'hidden'});
  await page.getByRole('link',{name:'Done',exact:true}).click();
  const archived = page.getByRole('group',{name:'A completed thought',exact:true});
  const archivedMore = archived.getByRole('button',{name:'More actions',exact:true});
  await archivedMore.click();
  await page.getByRole('button',{name:'Add note',exact:true}).click();
  await page.getByRole('textbox',{name:'Note',exact:true}).fill('First paragraph\nSecond paragraph');
  await page.getByRole('button',{name:'Save',exact:true}).click();
  assert.equal(await archivedMore.evaluate(el=>el===document.activeElement),true);
  await archived.getByText('First paragraph',{exact:true}).waitFor();
  await archivedMore.click(); await page.getByRole('button',{name:'Edit note',exact:true}).click();
  assert.equal(await page.getByRole('textbox',{name:'Note',exact:true}).inputValue(),'First paragraph\nSecond paragraph');
  await page.getByRole('textbox',{name:'Note',exact:true}).fill('');
  await page.getByRole('button',{name:'Save',exact:true}).click();
  await archivedMore.click(); await page.getByRole('button',{name:'Add note',exact:true}).waitFor();
  await page.keyboard.press('Escape');
  assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('loopr.loops')).length),3);
  assert.deepEqual(errors,[]);
  console.log('PASS stable card layout, menu selection, outside dismissal, Escape/Tab/focus return, delete confirmation, connection navigation, 320/375/390px and 200% text, quiet Note touch targets');
 } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exit(1)});
