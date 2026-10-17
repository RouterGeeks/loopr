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
