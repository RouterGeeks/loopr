import type { LoopItem } from './loops';

export const MAX_BACKUP_BYTES = 5 * 1024 * 1024;
const dateFields = ['createdAt', 'revisitAt', 'startedAt', 'doneAt', 'droppedAt'] as const;
const statuses = new Set(['do', 'doing', 'delayed', 'done', 'dropped']);
const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);
const isDate = (value: unknown): value is string =>
  typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(value) && Number.isFinite(Date.parse(value));

export function parseBackup(text: string): LoopItem[] {
  if (new Blob([text]).size > MAX_BACKUP_BYTES) throw new Error('Choose a backup smaller than 5 MB.');
  let data: unknown;
  try { data = JSON.parse(text); } catch { throw new Error('This file is not valid JSON. Choose a Loopr backup.'); }
  if (!isObject(data) || data.app !== 'loopr' || data.version !== 1 || !isDate(data.exportedAt) || !Array.isArray(data.loops)) {
    throw new Error('This is not a supported Loopr backup. Choose a version 1 backup exported from Dials.');
  }
  const ids = new Set<number>();
  return data.loops.map((item, index) => {
    const invalid = () => new Error(`Loop ${index + 1} has invalid or missing data. Nothing was restored.`);
    if (!isObject(item) || typeof item.id !== 'number' || !Number.isSafeInteger(item.id) || item.id < 0 || item.id > 8640000000000000 || ids.has(item.id) || typeof item.text !== 'string' || typeof item.status !== 'string' || !statuses.has(item.status)) throw invalid();
    ids.add(item.id);
    const loop: LoopItem = { id: item.id, text: item.text, status: item.status as LoopItem['status'] };
    for (const field of dateFields) {
      if (item[field] !== undefined) {
        if (!isDate(item[field])) throw invalid();
        loop[field] = item[field];
      }
    }
    if (item.note !== undefined) {
      if (typeof item.note !== 'string') throw invalid();
      loop.note = item.note;
    }
    return loop;
  });
}

export function createBackup(loops: LoopItem[]): string {
  const text = JSON.stringify({ app: 'loopr', version: 1, exportedAt: new Date().toISOString(), loops }, null, 2);
  parseBackup(text);
  return text;
}
