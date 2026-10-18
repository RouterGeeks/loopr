import { useLayoutEffect, useRef, useSyncExternalStore } from 'react';
const blockers = new Set<symbol>();
const listeners = new Set<() => void>();
export const hasUpdateBlockers = () => blockers.size > 0;
const subscribe = (listener: () => void) => { listeners.add(listener); return () => { listeners.delete(listener); }; };
export const useUpdateBlocked = () => useSyncExternalStore(subscribe, hasUpdateBlockers);
export function useUpdateBlocker(blocked: boolean) {
  const key = useRef(Symbol());
  useLayoutEffect(() => {
    const id = key.current;
    if (blocked) blockers.add(id);
    else blockers.delete(id);
    listeners.forEach(fn => fn());
    return () => { blockers.delete(id); listeners.forEach(fn => fn()); };
  }, [blocked]);
}
