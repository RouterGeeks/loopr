import type { LoopItem } from './loops';

const normalize = (text: string) => text.normalize('NFC').toLocaleLowerCase();
export function searchTerms(query: string): string[] {
  return normalize(query).trim().split(/\s+/).filter(Boolean);
}

// Literal, case-insensitive words may match across thought text and note.
// Keep saved order and never mutate the source dataset.
export interface SearchFilters { labels?: string[]; from?: string; to?: string }
const labelKey = (value: string) => value.normalize('NFC').trim().replace(/\s+/g, ' ').toLowerCase();
export function validDay(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T12:00:00`);
  return Number.isFinite(date.getTime()) && localDay(date) === value;
}
function localDay(date: Date): string {
  return `${String(date.getFullYear()).padStart(4, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
export function filterError(filters: SearchFilters): string {
  if ((filters.from && !validDay(filters.from)) || (filters.to && !validDay(filters.to))) return 'Choose valid captured dates.';
  if (filters.from && filters.to && filters.from > filters.to) return 'From must be on or before To.';
  return '';
}
export function findThoughts(thoughts: LoopItem[], query: string, filters: SearchFilters = {}): LoopItem[] {
  const terms = searchTerms(query);
  if (filterError(filters) || (!terms.length && !filters.labels?.length && !filters.from && !filters.to)) return [];
  return thoughts.filter(thought => {
    if (filters.labels?.length && !filters.labels.some(label => thought.labels?.some(saved => labelKey(saved) === labelKey(label)))) return false;
    if (filters.from || filters.to) {
      const date = new Date(thought.createdAt ?? NaN);
      if (!Number.isFinite(date.getTime())) return false;
      const day = localDay(date);
      if ((filters.from && day < filters.from) || (filters.to && day > filters.to)) return false;
    }
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
