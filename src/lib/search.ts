import type { LoopItem } from './loops';

const normalize = (text: string) => text.normalize('NFC').toLocaleLowerCase();
export function searchTerms(query: string): string[] {
  return normalize(query).trim().split(/\s+/).filter(Boolean);
}

// Literal, case-insensitive words may match across thought text and note.
// Keep saved order and never mutate the source dataset.
export function findThoughts(thoughts: LoopItem[], query: string): LoopItem[] {
  const terms = searchTerms(query);
  if (!terms.length) return [];
  return thoughts.filter(thought => {
    const text = normalize(`${thought.text}\n${thought.note ?? ''}`);
    return terms.every(term => text.includes(term));
  });
}

export function searchExcerpt(text: string, query: string): string {
  const compact = text.replace(/\s+/g, ' ').trim();
  const normalized = normalize(compact);
  const positions = searchTerms(query).map(term => normalized.indexOf(term)).filter(index => index >= 0);
  const first = positions.length ? Math.min(...positions) : 0;
  const start = Math.max(0, first - 45);
  const end = Math.min(compact.length, start + 180);
  return `${start ? '…' : ''}${compact.slice(start, end)}${end < compact.length ? '…' : ''}`;
}
