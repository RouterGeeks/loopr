import { loadLoops, type LoopItem } from './loops';

export type EditorKind = 'note' | 'text';
export const EDITOR_DRAFT_PREFIX = 'loopr.editorDraft.';
const FALLBACK = 'loopr.editorSession.';
export type EditorRecord = { version: 1; id: number; kind: EditorKind; text: string; base: LoopItem; pending?: string };
export function parseEditorDraft(raw: string | null): EditorRecord | null {
  if (raw === null) return null;
  const value = JSON.parse(raw);
  if (!value || value.version !== 1 || !Number.isSafeInteger(value.id) || value.id < 0 ||
      !['note', 'text'].includes(value.kind) || typeof value.text !== 'string' ||
      !value.base || value.base.id !== value.id || typeof value.base.text !== 'string' ||
      typeof value.base.status !== 'string' || (value.base.note !== undefined && typeof value.base.note !== 'string') ||
      (value.pending !== undefined && typeof value.pending !== 'string')) throw Error('Unreadable editor draft');
  return value;
}
const fingerprint = (item: LoopItem) => JSON.stringify(item, Object.keys(item).sort());
const field = (item: LoopItem, kind: EditorKind) => kind === 'note' ? item.note ?? '' : item.text;
const changed = () => window.dispatchEvent(new Event('editor-drafts'));
async function claim(key: string): Promise<(() => void) | null> {
  return new Promise((resolve, reject) => {
    navigator.locks.request(key, { ifAvailable: true }, lock => {
      if (!lock) { resolve(null); return; }
      return new Promise<void>(release => resolve(release));
    }).catch(reject);
  });
}
type Snapshot = { ready: boolean; busy: boolean; text: string; restored: boolean; limited: boolean; error: string; conflict: boolean; latest?: LoopItem };
export class EditorDraft {
  private listeners = new Set<() => void>();
  private release?: () => void;
  private record: EditorRecord;
  private storage?: Storage;
  private key: string;
  private started = false;
  private ended = false;
  private writable = false;
  snapshot: Snapshot;
  constructor(item: LoopItem, kind: EditorKind) {
    this.record = { version: 1, id: item.id, kind, text: field(item, kind), base: item };
    this.key = EDITOR_DRAFT_PREFIX + kind + '.' + item.id;
    this.snapshot = { ready: false, busy: false, text: this.record.text, restored: false, limited: false, error: '', conflict: false };
  }
  subscribe = (listener: () => void) => { this.listeners.add(listener); return () => { this.listeners.delete(listener); }; };
  getSnapshot = () => this.snapshot;
  private publish(change: Partial<Snapshot>) { this.snapshot = { ...this.snapshot, ...change }; this.listeners.forEach(fn => fn()); }
  private current() { return loadLoops().find(item => item.id === this.record.id); }
  refresh = () => {
    if (!this.writable || this.ended || this.snapshot.busy) return;
    try {
      const latest = this.current();
      this.publish({ latest, conflict: !latest || fingerprint(latest) !== fingerprint(this.record.base) });
    } catch { this.publish({ conflict: true, latest: undefined, error: 'Saved thoughts could not be read. Keep or copy this draft; nothing has been replaced.' }); }
  };
  async start() {
    if (this.started || this.ended) return;
    this.started = true;
    try {
      if (navigator.locks) {
        this.release = await claim(this.key) ?? undefined;
        if (this.ended) { this.release?.(); this.release = undefined; return; }
        if (!this.release) {
          this.started = false;
          this.publish({ error: 'This editor is open in another tab. Save or cancel there, or close that tab, then retry here.' });
          return;
        }
      } else this.publish({ limited: true });
      this.storage = this.snapshot.limited ? sessionStorage : localStorage;
      if (this.snapshot.limited) this.key = FALLBACK + this.record.kind + '.' + this.record.id;
      const stored = parseEditorDraft(this.storage.getItem(this.key));
      if (stored && (stored.id !== this.record.id || stored.kind !== this.record.kind)) throw Error('Wrong draft');
      const latest = this.current();
      if (stored) {
        this.record = stored;
        // A save can commit before cleanup. Only retire it when the exact intended
        // saved thought is still present; later changes require review instead.
        if (stored.pending && latest && stored.pending === fingerprint(latest)) {
          this.storage.removeItem(this.key);
          this.record = { version: 1, id: latest.id, kind: stored.kind, text: field(latest, stored.kind), base: latest };
          changed();
        } else this.publish({ restored: true });
      } else if (latest) this.record = { ...this.record, base: latest, text: field(latest, this.record.kind) };
      this.writable = true;
      this.publish({ ready: true, text: this.record.text, error: '' });
      this.refresh();
      window.addEventListener('storage', this.refresh);
      window.addEventListener('focus', this.refresh);
    } catch {
      this.release?.(); this.release = undefined;
      this.started = false;
      this.publish({ error: 'Draft recovery could not be read. Original data has been kept. Retry when storage is available.' });
    }
  }
  private persist() {
    try {
      if (!this.storage || !this.writable) return false;
      if (this.record.text === field(this.record.base, this.record.kind) && !this.record.pending) this.storage.removeItem(this.key);
      else this.storage.setItem(this.key, JSON.stringify(this.record));
      this.publish({ error: '' }); changed(); return true;
    } catch {
      this.publish({ error: 'Could not store this draft. Keep this page open or copy your text before leaving. Retry before saving.' });
      return false;
    }
  }
  change = (value: string | ((text: string) => string)) => {
    if (!this.writable || this.snapshot.busy || this.ended) return;
    const text = typeof value === 'function' ? value(this.record.text) : value;
    this.record = { ...this.record, text, pending: undefined };
    this.publish({ text, restored: false }); this.persist();
  };
  retry = () => { if (this.writable) { this.persist(); this.refresh(); } else void this.start(); };
  review = () => {
    if (!this.writable || this.snapshot.busy) return;
    try {
      const latest = this.current();
      // A second change while the review was visible needs a fresh review.
      if (!latest || !this.snapshot.latest || fingerprint(latest) !== fingerprint(this.snapshot.latest)) { this.refresh(); return; }
      this.record = { ...this.record, base: latest, pending: undefined };
      this.publish({ conflict: false }); this.persist();
    } catch { this.refresh(); }
  };
  recoverable() { return this.writable && !this.ended && this.record.text !== field(this.record.base, this.record.kind) ? this.record : null; }
  private end() {
    this.ended = true; this.writable = false;
    this.release?.(); this.release = undefined;
    window.removeEventListener('storage', this.refresh);
    window.removeEventListener('focus', this.refresh);
    entries.delete(this.record.kind + '.' + this.record.id);
    changed();
  }
  cancel = () => {
    if (this.snapshot.busy) return false;
    if (!this.writable) { this.end(); return true; } // Never delete another owner's record.
    try { this.storage!.removeItem(this.key); this.end(); return true; }
    catch { this.publish({ error: 'Could not discard this draft. Keep the editor open and retry Cancel.' }); return false; }
  };
  async save(write: (value: string) => Promise<boolean>) {
    if (!this.writable || this.snapshot.busy || this.ended) return false;
    if (this.record.pending) {
      try {
        const latest = this.current();
        if (latest && this.record.pending === fingerprint(latest)) {
          this.storage!.removeItem(this.key); this.end(); return true;
        }
      } catch { this.publish({ error: 'Could not finish draft cleanup. Keep the editor open and retry Save.' }); return false; }
    }
    this.refresh();
    if (this.snapshot.conflict) return false;
    const value = this.record.text.trim();
    if (this.record.kind === 'text' && !value) return false;
    const expected = { ...this.record.base, [this.record.kind]: value || undefined };
    this.record = { ...this.record, pending: fingerprint(expected) };
    if (!this.persist()) return false;
    this.publish({ busy: true });
    try {
      if (!await write(value)) return false;
      // If cleanup fails, the pending snapshot prevents resurrection on reopen.
      try { this.storage!.removeItem(this.key); }
      catch { this.publish({ error: 'Saved, but draft cleanup failed. Retry Save to clear the recovery copy.' }); return false; }
      this.end(); return true;
    } catch {
      this.publish({ error: 'Could not save this edit. Your draft is kept; review the saved thought and retry.' });
      return false;
    } finally { this.publish({ busy: false }); }
  }
}
const entries = new Map<string, EditorDraft>();
export function editorDraft(item: LoopItem, kind: EditorKind) {
  const key = kind + '.' + item.id;
  let entry = entries.get(key);
  if (!entry) { entry = new EditorDraft(item, kind); entries.set(key, entry); }
  return entry;
}
export function listEditorDrafts(): EditorRecord[] {
  const storage = navigator.locks ? localStorage : sessionStorage;
  const prefix = navigator.locks ? EDITOR_DRAFT_PREFIX : FALLBACK;
  const records: EditorRecord[] = [];
  for (let index = 0; index < storage.length; index++) {
    const key = storage.key(index);
    if (!key?.startsWith(prefix)) continue;
    try { const record = parseEditorDraft(storage.getItem(key)); if (record) records.push(record); }
    catch { /* Leave malformed records untouched. Editors explain read failures. */ }
  }
  for (const entry of entries.values()) {
    const record = entry.recoverable();
    if (record) {
      const index = records.findIndex(item => item.id === record.id && item.kind === record.kind);
      if (index < 0) records.push(record); else records[index] = record;
    }
  }
  return records;
}
