import type { LoopItem } from './loops';

export type RevisitGroup = 'ready' | 'later' | 'undated';
export function revisitTime(loop: LoopItem): number | null {
  const time = loop.revisitAt ? Date.parse(loop.revisitAt) : NaN;
  return Number.isFinite(time) ? time : null;
}
export function revisitGroup(loop: LoopItem, now: number): RevisitGroup {
  const time = revisitTime(loop);
  return time === null ? 'undated' : time <= now ? 'ready' : 'later';
}
export function revisitLabel(loop: LoopItem, now: number): string {
  const time = revisitTime(loop);
  if (time === null) return 'Choose a date';
  if (time <= now) return 'Ready to revisit';
  const date = new Date(time);
  const today = new Date(now);
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (date.toDateString() === today.toDateString()) {
    return `Today at ${date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}`;
  }
  if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
  return `Scheduled for ${date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}`;
}
export function scheduledContext(loop: LoopItem): string | null {
  const time = revisitTime(loop);
  if (time === null) return null;
  return `Scheduled for ${new Date(time).toLocaleString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })}`;
}

// Recalculate at the next due time or local midnight (including DST changes).
export function nextRevisitRefresh(loops: LoopItem[], now: number): number {
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  return loops.reduce((next, loop) => {
    const time = loop.status === 'delayed' ? revisitTime(loop) : null;
    return time !== null && time > now ? Math.min(next, time) : next;
  }, midnight.getTime());
}
