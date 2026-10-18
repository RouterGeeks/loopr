// Optional local QA: npm run build, start preview, then run with Playwright installed.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const base = process.env.PREVIEW_URL || 'http://localhost:4173/';
(async () => {
 const browser = await chromium.launch();
 try {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  const page = await context.newPage(); const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(base);
  const thoughts = ['A quieter morning', 'Put my phone away', 'Walk before coffee', 'Prepare breakfast', 'Done thought', 'Dropped thought', 'A long thought '.repeat(18)].map((text, index) => ({ id: index + 1, text, status: index === 4 ? 'done' : index === 5 ? 'dropped' : 'do', createdAt: '2026-10-18T12:00:00Z' }));
  await page.evaluate(items => localStorage.setItem('loopr.loops', JSON.stringify(items)), thoughts); await page.reload();
  await page.getByRole('group', { name: thoughts[0].text, exact: true }).getByRole('button', { name: 'More actions' }).click();
  await page.getByRole('link', { name: 'Connect the dots', exact: true }).click();
  await page.getByRole('heading', { name: 'Connect the dots' }).waitFor();
  assert.equal(await page.locator(':focus').textContent(), 'Connect the dots');
  const connect = async text => { await page.getByRole('button', { name: 'Connect a thought', exact: true }).click(); await page.getByLabel('Find a thought').fill(text); await page.getByRole('button', { name: `Connect: ${text}`, exact: true }).click(); await page.getByRole('status').filter({ hasText: 'Connection saved.' }).waitFor(); };
  for (const item of thoughts.slice(1, 4)) await connect(item.text);
  await page.screenshot({ path: '/private/tmp/connect-dots-mobile.png', fullPage: true });
  await page.getByRole('link', { name: 'Open thought: Walk before coffee', exact: true }).click();
  await page.getByRole('group', { name: 'Walk before coffee', exact: true }).waitFor();
  await page.getByRole('link', { name: 'Connect the dots →', exact: true }).click();
  await page.getByRole('link', { name: 'Open thought: A quieter morning', exact: true }).waitFor();
  await page.goto(`${base}thoughts/1/connections`);
  // Failed save retains picker/search and existing saved bytes.
  await page.getByRole('button', { name: 'Connect a thought', exact: true }).click(); await page.getByLabel('Find a thought').fill('Done thought');
  const before = await page.evaluate(() => localStorage.getItem('loopr.loops'));
  await page.evaluate(() => { window.originalSet = Storage.prototype.setItem; Storage.prototype.setItem = () => { throw new Error('quota'); }; });
  await page.getByRole('button', { name: 'Connect: Done thought', exact: true }).click();
  await page.getByRole('alert').waitFor(); assert.equal(await page.getByLabel('Find a thought').inputValue(), 'Done thought');
  assert.equal(await page.evaluate(() => localStorage.getItem('loopr.loops')), before);
  await page.evaluate(() => { Storage.prototype.setItem = window.originalSet; });
  await page.getByRole('button', { name: 'Connect: Done thought', exact: true }).click();
  await page.getByRole('status').filter({ hasText: 'Connection saved.' }).waitFor();
  await connect('Dropped thought'); await connect(thoughts[6].text);
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await page.getByRole('link', { name: `Open thought: ${thoughts[6].text}`, exact: true }).waitFor();
  for (const width of [320, 375, 390]) for (const size of ['16px', '32px']) {
   await page.setViewportSize({ width, height: 844 }); await page.evaluate(font => { document.documentElement.style.fontSize = font; }, size);
   assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `overflow ${width} ${size}`);
   for (const dot of await page.locator('.thought-dot').all()) { const box = await dot.boundingBox(); assert(box.width >= 44 && box.height >= 44); }
  }
  await page.evaluate(() => { document.documentElement.style.fontSize = ''; });
  await page.getByRole('button', { name: 'List', exact: true }).click();
  await page.getByRole('button', { name: 'Remove connection: Put my phone away', exact: true }).click();
  await page.getByRole('status').filter({ hasText: 'Both thoughts are kept' }).waitFor();
  await page.reload(); assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem('loopr.loops')).length), 7);
  // Export and restore through Dials preserves relationships.
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('loopr.loops')));
  await page.goto(`${base}dials`);
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export backup', exact: true }).click();
  const download = await downloadPromise;
  const backup = require('node:fs').readFileSync(await download.path(), 'utf8');
  assert.equal(JSON.parse(backup).version, 2);
  await page.getByLabel('Restore backup', {exact:true}).setInputFiles({name:'connections.json',mimeType:'application/json',buffer:Buffer.from(backup)});
  await page.getByRole('button', {name:'Replace all thoughts',exact:true}).click();
  await page.getByText('Restored 7 thoughts from your backup.', {exact:true}).waitFor();
  assert.deepEqual(await page.evaluate(() => JSON.parse(localStorage.getItem('loopr.loops'))), saved);
  // Restore on the existing Done page retains connections.
  await page.goto(`${base}done`); await page.getByRole('group', { name: 'Done thought', exact: true }).getByRole('button', { name: 'Restore', exact: true }).click();
  await page.goto(`${base}thoughts/5/connections`); await page.getByRole('link', { name: 'Open thought: A quieter morning', exact: true }).waitFor();
  // Deletion removes incoming edges and missing routes remain usable.
  await page.goto(`${base}thoughts/3`); await page.getByRole('button', { name: 'More actions' }).click(); await page.getByRole('button', { name: 'Delete thought', exact: true }).click(); await page.getByRole('button', { name: 'Delete', exact: true }).click();
  await page.getByRole('heading', { name: 'Thought unavailable' }).waitFor();
  assert(!await page.evaluate(() => JSON.parse(localStorage.getItem('loopr.loops')).some(item => item.connections?.includes(3))));
  // Stale connection writes must not replace a newer tab's edit.
  await page.goto(`${base}thoughts/1/connections`);
  const other = await context.newPage(); await other.goto(base);
  await other.evaluate(() => { const items = JSON.parse(localStorage.getItem('loopr.loops')); items[0].note = 'Other tab'; localStorage.setItem('loopr.loops', JSON.stringify(items)); });
  await page.getByRole('button', { name: 'List', exact: true }).click(); await page.getByRole('button', { name: 'Remove connection: Prepare breakfast', exact: true }).click();
  await page.getByRole('alert').waitFor(); assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem('loopr.loops'))[0].note), 'Other tab'); await other.close();
  await page.getByRole('button', { name: 'Review latest saved thoughts' }).click();
  await page.getByRole('button', { name: 'Remove connection: Prepare breakfast', exact: true }).click();
  await page.getByRole('status').filter({ hasText: 'Both thoughts are kept' }).waitFor();
  // Real production worker deep links and edits offline (localhost is secure).
  await page.evaluate(async () => { await navigator.serviceWorker.ready; }); await page.reload();
  await context.setOffline(true); await page.goto(`${base}thoughts/1/connections`); await page.getByRole('heading', { name: 'Connect the dots' }).waitFor();
  await connect('Put my phone away'); await page.reload(); await page.getByRole('link', { name: 'Open thought: Put my phone away', exact: true }).waitFor();
  assert.deepEqual(errors, []);
  console.log('PASS manual graph/list, clickable thoughts, reciprocal links, paging, failed saves, stale writes, restore/delete, offline deep links and connection saves, mobile/enlarged text');
 } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exit(1); });
