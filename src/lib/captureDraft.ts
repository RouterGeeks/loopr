import { useEffect, useSyncExternalStore } from 'react';

const PREFIX = 'loopr.captureDraft.';
const SESSION = 'loopr.captureDraftSession';
const FALLBACK = 'loopr.captureDraftLocal';
let fallbackKey = FALLBACK;
type DraftRecord = { version: 1; text: string; updatedAt: number; pendingId?: number };
type Snapshot = { ready: boolean; limited: boolean; text: string; restored: boolean; error: string; others: { id: string; text: string }[] };
let snapshot: Snapshot = { ready: false, limited: false, text: '', restored: false, error: '', others: [] };
const listeners = new Set<() => void>();
let started = false;
let id = '';
let release: (() => void) | undefined;
let durable = false;
let pendingId: number | undefined;
const publish = (change: Partial<Snapshot>) => { snapshot = { ...snapshot, ...change }; listeners.forEach(fn => fn()); };
const uniqueId = () => Array.from(crypto.getRandomValues(new Uint32Array(4)), n => n.toString(16)).join('-');
export function parseDraft(raw: string | null): DraftRecord | null {
  if (raw === null) return null;
  const value = JSON.parse(raw);
  if (!value || value.version !== 1 || typeof value.text !== 'string' || !Number.isFinite(value.updatedAt) ||
      (value.pendingId !== undefined && !Number.isSafeInteger(value.pendingId))) throw Error('Invalid draft');
  return value;
}
async function claim(key: string): Promise<(() => void) | null> {
  return new Promise((resolve, reject) => {
    navigator.locks.request(PREFIX + key, { ifAvailable: true }, lock => {
      if (!lock) { resolve(null); return; }
      return new Promise<void>(unlock => resolve(unlock));
    }).catch(reject);
  });
}
function refreshOthers() {
  if (!durable) return;
  try {
    const others: Snapshot['others'] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key?.startsWith(PREFIX) || key === PREFIX + id) continue;
      try {
        const record = parseDraft(localStorage.getItem(key));
        if (record?.text) others.push({ id: key.slice(PREFIX.length), text: record.text });
      } catch { /* Preserve unknown records without offering unusable drafts. */ }
    }
    publish({ others });
  } catch { publish({ error: 'Draft recovery storage is unavailable. Keep this page open or copy your text.' }); }
}
function storage() { return durable ? localStorage : sessionStorage; }
function key() { return durable ? PREFIX + id : fallbackKey; }
function persist(): boolean {
  try {
    if (snapshot.text) storage().setItem(key(), JSON.stringify({ version: 1, text: snapshot.text, updatedAt: Date.now(), ...(pendingId === undefined ? {} : { pendingId }) }));
    else storage().removeItem(key());
    publish({ error: '' });
    return true;
  } catch {
    publish({ error: 'Could not store this draft. Keep this page open or copy your text before leaving.' });
    return false;
  }
}
function loadOwned() {
  try {
    const record = parseDraft(storage().getItem(key()));
    pendingId = record?.pendingId;
    let captured = false;
    if (pendingId !== undefined) {
      try {
        const thoughts = JSON.parse(localStorage.getItem('loopr.loops') ?? '[]');
        captured = Array.isArray(thoughts) && thoughts.some(item => item?.id === pendingId && item.text === record?.text.trim());
      } catch { /* Never discard a draft if saved thought data cannot be verified. */ }
    }
    publish({ ready: true, text: captured ? '' : record?.text ?? '', restored: Boolean(record?.text && !captured), error: '', limited: !durable });
    if (captured) { pendingId = undefined; persist(); }
  } catch {
    // Leave malformed data intact; a fresh key keeps subsequent typing separate.
    pendingId = undefined;
    if (durable) { release?.(); id = ''; }
    else { fallbackKey = `${FALLBACK}.${uniqueId()}`; try { sessionStorage.setItem(`${FALLBACK}.pointer`, fallbackKey); } catch { /* Preserve inaccessible storage. */ } }
    publish({ ready: false, error: 'A saved draft could not be read. Its original data has been kept.' });
  }
  refreshOthers();
}
async function start() {
  if (started) return;
  started = true;
  try {
    durable = Boolean(navigator.locks);
    if (durable) {
      try { id = sessionStorage.getItem(SESSION) ?? ''; } catch { /* Use a new owner. */ }
      if (!/^[a-f0-9-]+$/.test(id)) id = uniqueId();
      release = await claim(id) ?? undefined;
      if (!release) { id = uniqueId(); release = await claim(id) ?? undefined; }
      if (!release) throw Error('No draft owner');
      try { sessionStorage.setItem(SESSION, id); } catch { /* Recover through the draft list if session storage is unavailable. */ }
    }
    if (!durable) { try { fallbackKey = sessionStorage.getItem(`${FALLBACK}.pointer`) ?? FALLBACK; } catch { /* Memory remains usable. */ } }
    loadOwned();
    if (!snapshot.ready) {
      // Do not strand capture on an unreadable draft.
      if (durable) { id = uniqueId(); release = await claim(id) ?? undefined; if (!release) throw Error('No draft owner'); try { sessionStorage.setItem(SESSION, id); } catch { /* Optional pointer. */ } }
      else { publish({ ready: true }); return; }
      publish({ ready: true });
    }
    window.addEventListener('storage', refreshOthers);
    window.addEventListener('focus', refreshOthers);
  } catch {
    release?.(); release = undefined;
    durable = false;
    try { fallbackKey = sessionStorage.getItem(`${FALLBACK}.pointer`) ?? FALLBACK; } catch { /* loadOwned reports inaccessible storage. */ }
    loadOwned();
    publish({ ready: true, limited: true });
  }
}
export function changeCaptureDraft(value: string | ((previous: string) => string)) {
  const text = typeof value === 'function' ? value(snapshot.text) : value;
  pendingId = undefined;
  publish({ text, restored: false });
  persist();
}
export function prepareDraftCapture(thoughtId: number): boolean {
  pendingId = thoughtId;
  return persist();
}
export function finishDraftCapture(text: string) {
  if (snapshot.text !== text) return;
  pendingId = undefined;
  publish({ text: '', restored: false });
  persist();
}
export async function recoverCaptureDraft(source: string) {
  if (!durable || snapshot.text || !snapshot.ready) return;
  publish({ ready: false });
  try {
    const nextRelease = await claim(source);
    if (!nextRelease) { publish({ ready: true, error: 'That draft is open in another tab. Close that tab before recovering it here.' }); return; }
    release?.(); release = nextRelease; id = source;
    try { sessionStorage.setItem(SESSION, id); } catch { /* The local draft remains recoverable. */ }
    loadOwned();
    if (!snapshot.ready) { started = false; await start(); }
  } catch { publish({ ready: true, error: 'Could not recover that draft. Its saved text has been kept.' }); }
}
export function retryCaptureDraft() { persist(); }
export function useCaptureDraft() {
  useEffect(() => { void start(); }, []);
  return useSyncExternalStore(listener => { listeners.add(listener); return () => { listeners.delete(listener); }; }, () => snapshot);
}
