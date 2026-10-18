export type LoopStatus = 'do' | 'doing' | 'delayed' | 'dropped' | 'done';

export interface LoopItem {
  id: number;
  text: string;
  status: LoopStatus;
  createdAt?: string;
  revisitAt?: string;
  startedAt?: string;
  doneAt?: string;
  droppedAt?: string;
  note?: string;
  labels?: string[];
  connections?: number[]; // Undirected edges stored once, on the lower-ID thought.
}

export const STORAGE_KEY = 'loopr.loops';

const LEGACY_STATUS_STRINGS = new Set([
  'active',
  'pending',
  'delay',
  'drop',
]);

const isLegacyStatusPresent = (parsed: unknown[]): boolean =>
  parsed.some((item) => {
    if (!item || typeof item !== 'object') return false;
    const status = (item as { status?: unknown }).status;
    return typeof status === 'string' && LEGACY_STATUS_STRINGS.has(status);
  });

const normalizeStatus = (
  rawStatus: unknown,
  isLegacySchema: boolean
): LoopStatus => {
  if (typeof rawStatus !== 'string') return 'do';

  switch (rawStatus) {
    case 'pending':
      return 'do';
    case 'do':
      // In legacy schemas 'do' meant completed; in the new schema 'do' is open.
      return isLegacySchema ? 'done' : 'do';
    case 'doing':
      return 'doing';
    case 'delay':
    case 'delayed':
      return 'delayed';
    case 'drop':
    case 'dropped':
      return 'dropped';
    case 'active':
      return 'do';
    case 'done':
      return 'done';
    default:
      return 'do';
  }
};

const ensureCreatedAt = (item: { id?: unknown; createdAt?: unknown }): string => {
  if (typeof item.createdAt === 'string') return item.createdAt;
  if (typeof item.id === 'number') return new Date(item.id).toISOString();
  return new Date().toISOString();
};

export function decodeLoops(saved: string | null): LoopItem[] {
  if (saved === null) return [];
  let parsed: unknown;
  try { parsed = JSON.parse(saved); } catch {
    throw new Error('Saved thoughts could not be read. The original data has been kept.');
  }
  if (!Array.isArray(parsed)) throw new Error('Saved thoughts have an unexpected format. The original data has been kept.');
  const ids = new Set<number>();
  for (const item of parsed) {
    const id = typeof item?.id === 'string' && item.id.trim() ? Number(item.id) : item?.id;
    if (!item || typeof item !== 'object' || Array.isArray(item) ||
        !Number.isSafeInteger(id) || id < 0 || id > 8640000000000000 ||
        ids.has(id) || typeof item.text !== 'string' ||
        !['do', 'doing', 'delayed', 'done', 'dropped', 'active', 'pending', 'delay', 'drop'].includes(item.status) ||
        ['createdAt', 'revisitAt', 'startedAt', 'doneAt', 'droppedAt', 'note'].some(key => item[key] !== undefined && typeof item[key] !== 'string')) {
      throw new Error('Some saved thoughts could not be read. The original data has been kept.');
    }
    ids.add(id);
  }

  validateConnections(parsed as LoopItem[]);
  for (const item of parsed) validateLabels(item.labels);
  const legacy = isLegacyStatusPresent(parsed);

  return parsed
    .filter((item): item is Record<string, unknown> =>
      Boolean(item) && typeof item === 'object'
    )
    .map((item) => {
      const id =
        typeof item.id === 'number' ? item.id : Number(item.id) || Date.now();
      const text = typeof item.text === 'string' ? item.text : '';
      const status = normalizeStatus(item.status, legacy);

      const loop: LoopItem = {
        id,
        text,
        status,
        createdAt: ensureCreatedAt({ ...item, id }),
      };

      if (typeof item.revisitAt === 'string') loop.revisitAt = item.revisitAt;
      if (typeof item.startedAt === 'string') loop.startedAt = item.startedAt;
      if (typeof item.doneAt === 'string') loop.doneAt = item.doneAt;
      if (typeof item.droppedAt === 'string') loop.droppedAt = item.droppedAt;
      if (typeof item.note === 'string' && item.note.trim()) {
        loop.note = item.note;
      }

      if (Array.isArray(item.connections) && item.connections.length) loop.connections = [...item.connections];
      if (Array.isArray(item.labels) && item.labels.length) loop.labels = [...item.labels];
      return loop;
    });
};

export const loadLoops = (): LoopItem[] => decodeLoops(window.localStorage.getItem(STORAGE_KEY));

// Every application writer uses the same lock and compares the exact version
// the user reviewed before committing. No writes occur during loading/migration.
export async function writeLoops(loops: LoopItem[] | null, expected: string | null): Promise<string | null> {
  const commit = () => {
    if (window.localStorage.getItem(STORAGE_KEY) !== expected) {
      throw new Error('Thoughts changed in another tab. Review the latest saved thoughts before trying again. Your draft is still here.');
    }
    const next = loops === null ? null : JSON.stringify(loops);
    if (next === null) window.localStorage.removeItem(STORAGE_KEY);
    else window.localStorage.setItem(STORAGE_KEY, next);
    return next;
  };
  // Web Locks serializes simultaneous writers on supported secure origins.
  // The fallback still rejects stale snapshots, but is not a cross-tab transaction.
  if (navigator.locks) return navigator.locks.request('loopr-write', commit);
  return commit();
}

// Fail closed on malformed relationships; never silently drop backup data.
export function validateConnections(loops: LoopItem[]) {
  const ids = new Set(loops.map(item => Number(item.id)));
  for (const item of loops) {
    if (item.connections === undefined) continue;
    if (!Array.isArray(item.connections) || new Set(item.connections).size !== item.connections.length ||
        item.connections.some(id => !Number.isSafeInteger(id) || id <= Number(item.id) || !ids.has(id))) {
      throw new Error('Some thought connections could not be read. The original data has been kept.');
    }
  }
}

export function pruneConnections(loops: LoopItem[]): LoopItem[] {
  const ids = new Set(loops.map(item => item.id));
  return loops.map(item => {
    if (!item.connections) return item;
    const next = { ...item };
    const connections = item.connections.filter(id => ids.has(id));
    if (connections.length) next.connections = connections;
    else delete next.connections;
    return next;
  });
}

export function connectedThoughts(loops: LoopItem[], id: number): LoopItem[] {
  const own = loops.find(item => item.id === id)?.connections ?? [];
  return loops.filter(item => own.includes(item.id) || item.connections?.includes(id));
}

export function setConnection(loops: LoopItem[], from: number, to: number, connected: boolean): LoopItem[] {
  if (from === to || !loops.some(item => item.id === from) || !loops.some(item => item.id === to)) {
    throw new Error('Choose two different saved thoughts.');
  }
  const low = Math.min(from, to), high = Math.max(from, to);
  return loops.map(item => {
    if (item.id !== low) return item;
    const next = { ...item };
    const ids = new Set(item.connections ?? []);
    if (connected) ids.add(high); else ids.delete(high);
    if (ids.size) next.connections = [...ids].sort((a, b) => a - b);
    else delete next.connections;
    return next;
  });
}

export const stateLabel: Record<LoopStatus, string> = { do: 'Do', doing: 'Doing', delayed: 'Delayed', done: 'Done', dropped: 'Dropped' };


export const cleanLabel = (value: string) => value.normalize('NFC').trim().replace(/\s+/g, ' ');
export const labelKey = (value: string) => cleanLabel(value).toLowerCase();
export function validateLabels(value: unknown): asserts value is string[] | undefined {
  if (value === undefined) return;
  if (!Array.isArray(value) || value.some(label => typeof label !== 'string' || !cleanLabel(label) || cleanLabel(label) !== label || label.length > 40) ||
      new Set(value.map(labelKey)).size !== value.length) {
    throw new Error('Some thought labels could not be read. The original data has been kept.');
  }
}
export function allLabels(thoughts: LoopItem[]): string[] {
  const labels = new Map<string, string>();
  for (const thought of thoughts) for (const label of thought.labels ?? []) {
    if (!labels.has(labelKey(label))) labels.set(labelKey(label), label);
  }
  return [...labels.values()].sort((a, b) => a.localeCompare(b));
}
export function sharedLabels(first: LoopItem, second: LoopItem): string[] {
  const keys = new Set((second.labels ?? []).map(labelKey));
  return (first.labels ?? []).filter(label => keys.has(labelKey(label)));
}
