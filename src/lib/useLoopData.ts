import { useUpdateBlocker } from './updateSafety';
import { useEffect, useRef, useState } from 'react';
import { decodeLoops, STORAGE_KEY, writeLoops } from './loops';
import type { LoopItem } from './loops';

function read() {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(STORAGE_KEY);
    return { raw, loops: decodeLoops(raw), error: '', readable: true };
  } catch (cause) {
    return { raw, loops: [] as LoopItem[], error: cause instanceof Error ? cause.message : 'Saved thoughts could not be read.', readable: false };
  }
}
export function useLoopData() {
  const [snapshot, setSnapshot] = useState(read);
  const current = useRef(snapshot);
  const busy = useRef(false);
  const [error, setError] = useState(snapshot.error);
  const [saving, setSaving] = useState(false);
  useUpdateBlocker(saving);
  const reload = () => {
    if (busy.current) return;
    const next = read(); current.current = next; setSnapshot(next); setError(next.error);
  };
  useEffect(() => {
    const changed = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY || event.key === null) {
        setError('Thoughts changed in another tab. Review the latest saved thoughts before saving. Copy any open draft first if its thought was removed.');
      }
    };
    window.addEventListener('storage', changed);
    return () => window.removeEventListener('storage', changed);
  }, []);
  const setLoops = async (update: (loops: LoopItem[]) => LoopItem[]): Promise<boolean> => {
    if (busy.current) return false;
    if (!current.current.readable) { setError('Saved thoughts could not be read. Download the original data in Dials before restoring a backup. Your draft is still here.'); return false; }
    busy.current = true; setSaving(true);
    try {
      const loops = update(current.current.loops);
      const raw = await writeLoops(loops, current.current.raw);
      const next = { raw, loops, error: '', readable: true };
      current.current = next; setSnapshot(next); setError('');
      return true;
    } catch (cause) {
      setError(cause instanceof Error && cause.message.includes('another tab') ? cause.message : 'Could not save. Your draft and previously saved thoughts are unchanged. Free some browser storage or allow storage, then try again.');
      return false;
    } finally { busy.current = false; setSaving(false); }
  };
  return { loops: snapshot.loops, raw: snapshot.raw, readable: snapshot.readable, setLoops, error, saving, reload };
}
