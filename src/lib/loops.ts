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

export const loadLoops = (): LoopItem[] => {
  if (typeof window === 'undefined') return [];

  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (!saved) return [];

  let parsed: unknown;
  try {
    parsed = JSON.parse(saved);
  } catch {
    return [];
  }

  if (!Array.isArray(parsed)) return [];

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
        createdAt: ensureCreatedAt(item),
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

export const saveLoops = (loops: LoopItem[]): void => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(loops));
};

export const clearLoops = (): void => {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(STORAGE_KEY);
};
