export const REVISIT_TIME_KEY = 'loopr.revisitTime';
export const validTime = (time: string) => /^([01]\d|2[0-3]):[0-5]\d$/.test(time);
export function readRevisitTime(): { time: string; error: string } {
  try {
    const value = localStorage.getItem(REVISIT_TIME_KEY);
    if (value === null) return { time: '09:00', error: '' };
    if (!validTime(value)) throw new Error();
    return { time: value, error: '' };
  } catch {
    return { time: '09:00', error: 'Could not read your default time. Using 9:00 AM for now.' };
  }
}
export function saveRevisitTime(time: string) {
  if (!validTime(time)) throw new Error('Choose a valid time.');
  localStorage.setItem(REVISIT_TIME_KEY, time);
}
export const localDate = (date: Date) => `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
export function scheduledDate(day: string, time: string): Date {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day) || !validTime(time)) throw new Error('Choose a date and time.');
  const [y, m, d] = day.split('-').map(Number);
  const [h, min] = time.split(':').map(Number);
  const date = new Date(y, m - 1, d, h, min);
  if (localDate(date) !== day || date.getHours() !== h || date.getMinutes() !== min)
    throw new Error('That local time is unavailable. Choose another time.');
  return date;
}
export type DelayPreset = 'tomorrow' | 'weekend' | 'nextWeek';
export function presetDate(preset: DelayPreset, time: string, now = new Date()): Date {
  const date = new Date(now);
  const day = date.getDay();
  const add = preset === 'tomorrow' ? 1 : preset === 'weekend'
    ? day === 6 ? 1 : day === 0 ? 6 : 6 - day
    : day === 1 ? 7 : (8 - day) % 7 || 7;
  date.setDate(date.getDate() + add);
  return scheduledDate(localDate(date), time);
}
export function timeLabel(time: string): string {
  return scheduledDate('2026-01-15', time).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}
