import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';

// Use the existing compiler so tests also run on the project's Node 20 toolchain.
const source = await readFile(new URL('../src/lib/resurfacing.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText;
const { revisitGroup, revisitLabel, nextRevisitRefresh } = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);
const loop = (revisitAt) => ({ id: 1, text: 'Thought', status: 'delayed', revisitAt });

test('past, exact boundary, future, missing, and invalid dates', () => {
  const now = Date.parse('2026-10-17T13:00:00Z');
  assert.equal(revisitGroup(loop('2026-10-16T13:00:00Z'), now), 'ready');
  assert.equal(revisitGroup(loop('2026-10-17T13:00:00Z'), now), 'ready');
  assert.equal(revisitGroup(loop('2026-10-17T13:00:01Z'), now), 'later');
  assert.equal(revisitGroup(loop(undefined), now), 'undated');
  assert.equal(revisitGroup(loop('invalid'), now), 'undated');
  assert.equal(revisitLabel(loop('2026-10-16T13:00:00Z'), now), 'Ready to revisit');
});

test('calendar labels and refresh boundaries across daylight-saving changes', () => {
  const original = process.env.TZ;
  try {
    process.env.TZ = 'America/New_York';
    for (const [day, hours] of [['2026-03-08', 23], ['2026-11-01', 25]]) {
      const start = new Date(`${day}T00:00:00`).getTime();
      assert.equal(nextRevisitRefresh([], start) - start, hours * 3600000);
      const tomorrow = new Date(start); tomorrow.setDate(tomorrow.getDate() + 1); tomorrow.setHours(9);
      assert.match(revisitLabel(loop(tomorrow.toISOString()), start), /^Tomorrow at /);
    }
    const now = new Date('2026-10-17T08:59:00').getTime();
    const due = new Date('2026-10-17T09:00:00').getTime();
    assert.match(revisitLabel(loop(new Date(due).toISOString()), now), /^Today at /);
    assert.equal(nextRevisitRefresh([loop(new Date(due).toISOString())], now), due);
    assert(nextRevisitRefresh([loop('bad')], now) > now);
  } finally {
    if (original === undefined) delete process.env.TZ; else process.env.TZ = original;
  }
});
