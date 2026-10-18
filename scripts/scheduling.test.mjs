import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';
const source = await readFile(new URL('../src/lib/scheduling.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText;
const { scheduledDate, presetDate, readRevisitTime, saveRevisitTime } = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);

test('default time is validated, read failures are safe, failed writes preserve saved preference', () => {
  let stored = null;
  globalThis.localStorage = { getItem: () => stored, setItem: (_, value) => { stored = value; } };
  assert.equal(readRevisitTime().time, '09:00');
  saveRevisitTime('14:30'); assert.equal(readRevisitTime().time, '14:30');
  assert.throws(() => saveRevisitTime('25:00'));
  assert.equal(stored, '14:30');
  globalThis.localStorage.setItem = () => { throw new Error('quota'); };
  assert.throws(() => saveRevisitTime('10:00')); assert.equal(stored, '14:30');
  globalThis.localStorage.getItem = () => { throw new Error('blocked'); };
  assert.equal(readRevisitTime().time, '09:00'); assert(readRevisitTime().error);
});

test('presets retain weekend semantics and use the selected local time', () => {
  const saturday = new Date(2026, 9, 17, 18);
  assert.equal(presetDate('weekend','14:30',saturday).getDate(),18);
  const monday = presetDate('nextWeek','14:30',saturday);
  assert.equal(monday.getDay(),1); assert.equal(monday.getHours(),14); assert.equal(monday.getMinutes(),30);
  assert.equal(presetDate('nextWeek','09:00',monday).getDate(),26);
  assert.equal(presetDate('tomorrow','00:00',new Date(2026,11,31)).getFullYear(),2027);
});

test('custom date rejects invalid calendars and nonexistent DST times', () => {
  const previous = process.env.TZ;
  process.env.TZ = 'America/New_York';
  try {
    assert.throws(() => scheduledDate('2026-02-30','09:00'));
    assert.throws(() => scheduledDate('2026-03-08','02:30'));
    assert.equal(scheduledDate('2026-03-08','03:30').getHours(),3);
    assert.equal(scheduledDate('2026-11-01','01:30').getHours(),1);
    assert.throws(() => scheduledDate('','12:00'));
  } finally { if(previous === undefined) delete process.env.TZ; else process.env.TZ=previous; }
});
