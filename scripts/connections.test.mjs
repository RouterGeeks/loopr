import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';
const compile = source => `data:text/javascript;base64,${Buffer.from(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText).toString('base64')}`;
const loopsUrl = compile(await readFile(new URL('../src/lib/loops.ts', import.meta.url), 'utf8'));
const { decodeLoops, setConnection, connectedThoughts, pruneConnections, validateConnections } = await import(loopsUrl);
const backupSource = (await readFile(new URL('../src/lib/backup.ts', import.meta.url), 'utf8')).replace("'./loops'", JSON.stringify(loopsUrl));
const { parseBackup, createBackup } = await import(compile(backupSource));
const thoughts = ['do', 'doing', 'delayed', 'done', 'dropped'].map((status, index) => ({ id: index + 1, text: `Thought ${index}`, status, note: 'Keep this', createdAt: '2026-10-18T12:00:00Z' }));
test('connections are undirected, unique, editable from either end, and never self-links', () => {
  let linked = setConnection(thoughts, 4, 1, true);
  linked = setConnection(linked, 1, 4, true);
  assert.deepEqual(linked[0].connections, [4]);
  assert.deepEqual(connectedThoughts(linked, 4).map(item => item.id), [1]);
  assert.deepEqual(connectedThoughts(linked, 1).map(item => item.id), [4]);
  assert.deepEqual(setConnection(linked, 4, 1, false), thoughts);
  assert.throws(() => setConnection(thoughts, 1, 1, true));
  assert.throws(() => setConnection(thoughts, 1, 90, true));
  assert.equal(thoughts[0].connections, undefined);
});
test('deletion removes only affected edges; states and notes survive', () => {
  const linked = setConnection(setConnection(thoughts, 1, 2, true), 1, 3, true);
  const removed = pruneConnections(linked.filter(item => item.id !== 2));
  assert.deepEqual(removed[0].connections, [3]);
  validateConnections(removed);
  assert.equal(removed[0].note, 'Keep this');
  assert.equal(removed[1].status, 'delayed');
  assert.deepEqual(pruneConnections(linked.filter(item => item.id !== 1)), thoughts.slice(1));
});
test('storage and backup round trips preserve connections in all states; v1 remains supported', () => {
  let linked = thoughts;
  for (let id = 2; id <= 5; id++) linked = setConnection(linked, 1, id, true);
  assert.deepEqual(decodeLoops(JSON.stringify(linked)), linked);
  assert.equal(JSON.parse(createBackup(linked)).version, 2);
  assert.deepEqual(parseBackup(createBackup(linked)), linked);
  assert.equal(JSON.parse(createBackup(thoughts)).version, 1);
  assert.deepEqual(parseBackup(createBackup(thoughts)), thoughts);
  const emptyEdges = [{ ...thoughts[0], connections: [] }];
  assert.deepEqual(parseBackup(createBackup(emptyEdges)), emptyEdges);
});
test('malformed edges fail closed, including missing endpoints, duplicates and self-links', () => {
  for (const connections of ['bad', [1], [99], [2, 2], ['2'], [null], [1.5]]) {
    const bad = [{ ...thoughts[0], connections }, ...thoughts.slice(1)];
    assert.throws(() => decodeLoops(JSON.stringify(bad)));
    assert.throws(() => parseBackup(JSON.stringify({ app: 'loopr', version: 2, exportedAt: '2026-10-18T12:00:00Z', loops: bad })));
  }
});
