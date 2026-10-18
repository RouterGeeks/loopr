import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';
const compile = source => `data:text/javascript;base64,${Buffer.from(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText).toString('base64')}`;
const loopsUrl = compile(await readFile(new URL('../src/lib/loops.ts', import.meta.url), 'utf8'));
const { decodeLoops, validateLabels, allLabels, sharedLabels, setConnection } = await import(loopsUrl);
const backupSource = (await readFile(new URL('../src/lib/backup.ts', import.meta.url), 'utf8')).replace("'./loops'", JSON.stringify(loopsUrl));
const { parseBackup, createBackup } = await import(compile(backupSource));
const { findThoughts, filterError } = await import(compile(await readFile(new URL('../src/lib/search.ts', import.meta.url), 'utf8')));
const thoughts = ['do', 'doing', 'delayed', 'done', 'dropped'].map((status, index) => ({ id: index + 1, text: 'Grow flowers', status, note:'Seeds', labels: [index % 2 ? 'garden' : 'Garden', 'Home'], createdAt:'2026-10-18T12:00:00Z' }));
test('labels preserve data in all states and backups v3; v1/v2 still load', () => {
  const linked = setConnection(thoughts, 1, 2, true);
  assert.deepEqual(decodeLoops(JSON.stringify(linked)), linked);
  const backup = createBackup(linked);
  assert.equal(JSON.parse(backup).version, 3);
  assert.deepEqual(parseBackup(backup), linked);
  for (const labels of [undefined, []]) validateLabels(labels);
  const bare = [{id:1,text:'Old thought',status:'do'}];
  assert.equal(JSON.parse(createBackup(bare)).version,1);
  assert.deepEqual(parseBackup(createBackup(bare)),bare);
  const connected = [{...bare[0],connections:[2]},{id:2,text:'Other',status:'done'}];
  assert.equal(JSON.parse(createBackup(connected)).version,2);
  assert.deepEqual(parseBackup(createBackup(connected)),connected);
  assert.deepEqual(allLabels(thoughts),['Garden','Home']);
  assert.deepEqual(sharedLabels(thoughts[0],thoughts[1]),['Garden','Home']);
  assert(thoughts.every(item=>item.connections===undefined));
});
test('invalid labels fail closed; backups do not silently drop labels', () => {
  for (const labels of [null,'Garden',[1],[''],[' Garden'],['Garden','garden'],['x'.repeat(41)]]) {
    const raw=JSON.stringify([{...thoughts[0],labels}]);
    assert.throws(()=>decodeLoops(raw));
    assert.throws(()=>parseBackup(JSON.stringify({app:'loopr',version:3,exportedAt:'2026-10-18T12:00:00Z',loops:JSON.parse(raw)})));
  }
  for (const version of [1,2]) assert.throws(()=>parseBackup(JSON.stringify({app:'loopr',version,exportedAt:'2026-10-18T12:00:00Z',loops:thoughts})));
});
test('filter-only search uses OR labels, AND text/date; inclusive local dates and invalid ranges', () => {
  process.env.TZ='America/New_York';
  assert.equal(findThoughts(thoughts,'',{labels:['GARDEN','Absent']}).length,5);
  assert.equal(findThoughts(thoughts,'Seeds',{labels:['Garden'],from:'2026-10-18',to:'2026-10-18'}).length,5);
  assert.equal(findThoughts(thoughts,'absent',{labels:['Garden']}).length,0);
  assert.equal(findThoughts(thoughts,'',{labels:['Absent']}).length,0);
  const dates=['2026-10-18T03:59:59Z','2026-10-18T04:00:00Z','2026-10-19T03:59:59Z','2026-10-19T04:00:00Z',undefined,'bad'];
  const items=dates.map((createdAt,id)=>({id,text:'test',status:'do',createdAt}));
  assert.deepEqual(findThoughts(items,'',{from:'2026-10-18',to:'2026-10-18'}).map(x=>x.id),[1,2]);
  assert.equal(findThoughts(items,'',{to:'2026-10-17'}).length,1);
  assert(filterError({from:'2026-02-30'}));
  assert(filterError({from:'2026-10-19',to:'2026-10-18'}));
  assert.equal(findThoughts(thoughts,'Seeds',{from:'bad'}).length,0);
});
