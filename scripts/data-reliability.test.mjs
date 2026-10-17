import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';
const source = await readFile(new URL('../src/lib/loops.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText;
const { decodeLoops, writeLoops } = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);
const item = { id: 1, text: 'Keep me', status: 'do', note: 'Context', createdAt: '2026-10-17T12:00:00Z' };
let raw, fail;
function setup(value, locked = true) {
  raw = value; fail = false;
  globalThis.window = { localStorage: {
    getItem: () => raw,
    setItem: (_key, value) => { if (fail) throw new Error('quota'); raw = value; },
    removeItem: () => { if (fail) throw new Error('blocked'); raw = null; },
  } };
  let tail = Promise.resolve();
  Object.defineProperty(globalThis, 'navigator', { configurable: true, value: {
    locks: locked ? { request: (_name, callback) => {
      const next = tail.then(callback); tail = next.catch(() => {}); return next;
    } } : undefined,
  } });
}
test('unreadable data is rejected without mutation; absent storage is empty', () => {
  assert.deepEqual(decodeLoops(null), []);
  for (const bad of ['', '{bad', '{}', '[null]', JSON.stringify([{...item,status:'unknown'}]), JSON.stringify([item,item])]) {
    setup(bad); assert.throws(() => decodeLoops(raw)); assert.equal(raw,bad);
  }
});
test('legacy migration is read-only and retains notes and dates', () => {
  const saved=JSON.stringify([{...item,status:'active'}]); setup(saved);
  assert.deepEqual(decodeLoops(saved),[item]); assert.equal(raw,saved);
});
test('successful writes, rejected saves, and rejected clear preserve exact previous bytes', async () => {
  setup(JSON.stringify([item])); const before=raw; fail=true;
  await assert.rejects(writeLoops([],before)); assert.equal(raw,before);
  await assert.rejects(writeLoops(null,before)); assert.equal(raw,before);
  fail=false; await writeLoops([{...item,text:'Saved'}],before); assert.equal(JSON.parse(raw)[0].text,'Saved');
});
test('stale writes cannot overwrite newer data, with and without Web Locks', async () => {
  for (const locked of [true,false]) {
    setup(JSON.stringify([item]),locked); const before=raw;
    await writeLoops([{...item,text:'Newer'}],before); const newer=raw;
    await assert.rejects(writeLoops([],before),/another tab/); assert.equal(raw,newer);
  }
});
test('serialized simultaneous saves allow one winner and reject the stale writer', async () => {
  setup(JSON.stringify([item])); const before=raw;
  const results=await Promise.allSettled([writeLoops([{...item,text:'First'}],before),writeLoops([{...item,text:'Second'}],before)]);
  assert.deepEqual(results.map(x=>x.status),['fulfilled','rejected']); assert.equal(JSON.parse(raw)[0].text,'First');
});
test('explicit recovery replacement can replace unreadable bytes but still rejects stale review', async () => {
  setup('{broken'); await writeLoops([item],'{broken'); assert.deepEqual(decodeLoops(raw),[item]);
  await assert.rejects(writeLoops([],'{broken'),/another tab/);
});

test('legacy numeric string IDs normalize without changing the source', () => {
  const saved = JSON.stringify([{ ...item, id: '1', status: 'pending' }]);
  setup(saved); assert.deepEqual(decodeLoops(saved), [item]); assert.equal(raw, saved);
});
