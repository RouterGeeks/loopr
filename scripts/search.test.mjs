import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';
const source = await readFile(new URL('../src/lib/search.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText;
const { findThoughts, searchExcerpt } = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);
const thoughts = ['do', 'doing', 'delayed', 'done', 'dropped'].map((status, index) => ({ id: index + 1, text: `Garden ${index}`, note: 'Buy seeds\nSaturday', status }));
test('search finds words across thoughts and notes in all states without changing data', () => {
  const before = JSON.stringify(thoughts);
  assert.deepEqual(findThoughts(thoughts, ' GARDEN\n seeds '), thoughts);
  assert.deepEqual(findThoughts(thoughts, 'Saturday'), thoughts);
  assert.equal(findThoughts(thoughts, 'Garden 3')[0].status, 'done');
  assert.deepEqual(findThoughts(thoughts, 'garden absent'), []);
  assert.deepEqual(findThoughts(thoughts, ' \n '), []);
  assert.equal(JSON.stringify(thoughts), before);
});
test('search is literal and Unicode-normalized; absent notes and long note matches work', () => {
  assert.equal(findThoughts([{ id: 1, text: 'Café [idea]' }], 'Cafe\u0301 [idea]').length, 1);
  assert.equal(findThoughts([{ id: 1, text: 'anything' }], '.*').length, 0);
  const note = 'before '.repeat(80) + 'needle here ' + 'after '.repeat(80);
  const excerpt = searchExcerpt(note, 'needle');
  assert(excerpt.includes('needle'));
  assert(excerpt.startsWith('…') && excerpt.endsWith('…'));
  assert(excerpt.length <= 182);
});
