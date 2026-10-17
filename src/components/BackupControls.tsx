import { useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import { createBackup, MAX_BACKUP_BYTES, parseBackup } from '../lib/backup';
import { loadLoops, writeLoops, STORAGE_KEY } from '../lib/loops';
import type { LoopItem } from '../lib/loops';

const buttonClass = 'rounded-md bg-paper-light/80 px-4 py-3 text-sm font-semibold text-charcoal ring-1 ring-charcoal/20 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50';

export default function BackupControls({ onRestore, needsRecovery = false }: { needsRecovery?: boolean; onRestore: (loops: LoopItem[]) => void }) {
  const [pending, setPending] = useState<{ loops: LoopItem[]; previous: string | null } | null>(null);
  const [reading, setReading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const exportBackup = () => {
    setError('');
    setMessage('');
    try {
      const blob = new Blob([createBackup(loadLoops())], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `loopr-backup-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
      document.body.append(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
      setMessage('Backup download requested. Keep the file somewhere you can find it again.');
    } catch (cause) {
      setError(cause instanceof Error ? `Could not export: ${cause.message}` : 'Could not export a backup. Your loops are unchanged.');
    }
  };

  const chooseBackup = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = '';
    if (!file) return;
    setPending(null);
    setError('');
    setMessage('');
    setReading(true);
    try {
      if (file.size > MAX_BACKUP_BYTES) throw new Error('Choose a backup smaller than 5 MB.');
      const restored = parseBackup(await file.text());
      setPending({ loops: restored, previous: localStorage.getItem(STORAGE_KEY) });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not read this file. Your loops are unchanged.');
    } finally {
      setReading(false);
    }
  };

  const restoreBackup = async () => {
    if (!pending) return;
    setError('');
    try {
      if (localStorage.getItem(STORAGE_KEY) !== pending.previous) {
        setPending(null);
        setError('Your loops changed while reviewing this backup. Choose the file again to review the replacement.');
        return;
      }
      // A single localStorage write is atomic: on failure, existing data remains.
      await writeLoops(pending.loops, pending.previous);
      onRestore(pending.loops);
      setMessage(`Restored ${pending.loops.length} loops from your backup.`);
      setPending(null);
      fileRef.current?.focus();
    } catch {
      setError('Could not restore. Your current loops are unchanged. Storage may be full or unavailable.');
    }
  };

  return (
    <div className="space-y-3">
      <p className="text-sm text-charcoal/70">Save a backup of your thoughts, notes, and dates. Backup files contain your text, so keep them somewhere private.</p>
      <button type="button" className={buttonClass} onClick={exportBackup}>Export backup</button>
      {needsRecovery && <>
      <button type="button" className={buttonClass} onClick={() => {
        try {
          const raw = localStorage.getItem(STORAGE_KEY);
          if (raw === null) { setError('There is no stored data to download.'); return; }
          const url = URL.createObjectURL(new Blob([raw], { type: 'text/plain' }));
          const link = document.createElement('a'); link.href = url;
          link.download = 'loopr-original-data.txt'; document.body.append(link); link.click(); link.remove();
          setTimeout(() => URL.revokeObjectURL(url), 60000);
          setMessage('Original data download requested. Keep this recovery copy before replacing unreadable data.');
        } catch { setError('Could not read the original data. Browser storage may be unavailable.'); }
      }}>Download original data</button>
      <p className="text-sm text-charcoal/70">If saved thoughts cannot be read, keep an original-data copy before restoring a valid backup. This recovery file is not a restorable Loopr backup.</p>
      </>}
      <div className="space-y-2">
        <label htmlFor="restore-backup" className="block text-sm font-semibold text-charcoal">Restore backup</label>
        <p id="backup-help" className="text-sm text-charcoal/70">Choose a Loopr JSON backup (up to 5 MB). You’ll review it before replacing any loops.</p>
        <input ref={fileRef} id="restore-backup" type="file" accept=".json,application/json" disabled={reading} onChange={chooseBackup} aria-describedby="backup-help" className="block w-full min-w-0 text-sm text-charcoal file:mr-3 file:rounded-md file:border-0 file:bg-paper-light file:px-3 file:py-3 file:text-charcoal" />
      </div>
      {reading && <p role="status">Reading backup…</p>}
      {pending && (
        <section aria-labelledby="restore-heading" className="space-y-3 rounded-md border border-rule p-4">
          <h3 id="restore-heading" className="font-semibold" aria-live="polite">Replace all loops with this backup?</h3>
          <p className="text-sm">This backup contains {pending.loops.length} loops. Restoring replaces every current loop and note in this browser, including completed and dropped loops. It does not merge them. Export your current loops first if you want to keep them.</p>
          {pending.loops.length === 0 && <p className="text-sm font-semibold">This backup is empty. Restoring it will remove all current loops.</p>}
          <div className="flex flex-wrap gap-3">
            <button type="button" className={buttonClass} onClick={() => { setPending(null); setMessage('Restore canceled. Your loops are unchanged.'); fileRef.current?.focus(); }}>Cancel restore</button>
            <button type="button" className={buttonClass} onClick={restoreBackup}>Replace all loops</button>
          </div>
        </section>
      )}
      <p role="status" className="text-sm text-charcoal/70">{message}</p>
      <p role="alert" className="text-sm text-charcoal">{error}</p>
    </div>
  );
}
