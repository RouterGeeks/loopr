import { useState } from 'react';
import { readRevisitTime, saveRevisitTime } from '../lib/scheduling';

export default function RevisitTimeSetting() {
  const [initial] = useState(readRevisitTime);
  const [time, setTime] = useState(initial.time);
  const [error, setError] = useState(initial.error);
  const [message, setMessage] = useState('');
  return <form className="space-y-3 border-t border-rule pt-6" onSubmit={event => {
    event.preventDefault();
    try { saveRevisitTime(time); setError(''); setMessage('Default time saved. Existing schedules are unchanged.'); }
    catch { setMessage(''); setError('Could not save the default time. Your previous setting is unchanged. Try again.'); }
  }}>
    <h2 className="text-lg font-semibold text-charcoal">Revisit timing</h2>
    <label htmlFor="revisit-time" className="block text-sm text-charcoal">Default revisit time</label>
    <div className="flex flex-wrap items-center gap-3">
      <input id="revisit-time" type="time" required value={time} onChange={event => { setTime(event.target.value); setMessage(''); }} className="min-h-11 max-w-full rounded-md border border-rule bg-paper-light px-3 text-base" />
      <button type="submit" className="min-h-11 rounded-md bg-lavender/25 px-4 text-sm font-semibold">Save default time</button>
    </div>
    <p className="text-sm text-charcoal/70">Used for new delay choices in your local timezone. Existing schedules stay as they are. This device setting is separate from thought backups.</p>
    {error && <p role="alert" className="text-sm text-charcoal">{error}</p>}
    <p role="status" className="text-sm text-charcoal">{message}</p>
  </form>;
}
