import { useEffect, useState } from 'react';
import type { LoopItem } from './loops';
import { nextRevisitRefresh } from './resurfacing';

export function useRevisitClock(loops: LoopItem[]): number {
  const [now, setNow] = useState(Date.now);
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const schedule = () => {
      clearTimeout(timer);
      const current = Date.now();
      timer = setTimeout(refresh, Math.max(1, nextRevisitRefresh(loops, current) - current));
    };
    const refresh = () => {
      setNow(Date.now());
      schedule();
    };
    const onVisibility = () => {
      if (document.visibilityState === 'visible') refresh();
    };
    timer = setTimeout(refresh, 0);
    window.addEventListener('focus', refresh);
    window.addEventListener('pageshow', refresh);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('focus', refresh);
      window.removeEventListener('pageshow', refresh);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [loops]);
  return now;
}
