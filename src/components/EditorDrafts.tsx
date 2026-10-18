import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { editorDraft, listEditorDrafts, type EditorRecord } from '../lib/editorDraft';
import { useUpdateBlocker } from '../lib/updateSafety';

export default function EditorDrafts() {
  const [records, setRecords] = useState<EditorRecord[]>([]);
  const [error, setError] = useState('');
  const [confirm, setConfirm] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  useUpdateBlocker(busy || confirm !== null);
  useEffect(() => {
    const refresh = () => {
      try { setRecords(listEditorDrafts()); }
      catch { setError('Unfinished edits could not be read. Existing draft data has been kept.'); }
    };
    refresh();
    window.addEventListener('editor-drafts', refresh);
    window.addEventListener('storage', refresh);
    window.addEventListener('focus', refresh);
    return () => { window.removeEventListener('editor-drafts', refresh); window.removeEventListener('storage', refresh); window.removeEventListener('focus', refresh); };
  }, []);
  const discard = async (record: EditorRecord) => {
    setBusy(true);
    const entry = editorDraft(record.base, record.kind);
    await entry.start();
    if (!entry.getSnapshot().ready || !entry.cancel()) setError(entry.getSnapshot().error || 'Could not discard this draft.');
    else { setError(''); setConfirm(null); }
    setBusy(false);
  };
  return <details className="mt-4">
    <summary className="min-h-11 cursor-pointer py-3 text-sm font-semibold">Unfinished edits{records.length ? ` · ${records.length}` : ''}</summary>
    <p className="text-sm text-charcoal/70">Open the thought, then Add/Edit note or Edit thought to recover. Save applies changes; Cancel discards only that editor draft. If the thought was removed, copy the text here. Drafts are excluded from backups and Clear All.</p>
    {error && <p role="alert" className="mt-3 text-sm">{error}</p>}
    {!records.length && <p className="mt-3 text-sm">No unfinished edits found.</p>}
    {records.map(record => {
      const key = record.kind + '.' + record.id;
      return <div key={key} className="mt-4 border-t border-rule pt-3">
        <p className="break-words text-sm">{record.kind === 'note' ? 'Note' : 'Thought edit'} · {record.base.text}</p>
        <textarea aria-label={`Recovered ${record.kind === 'note' ? 'note' : 'thought edit'} draft`} readOnly value={record.text} rows={3} className="edit-field mt-2 w-full rounded-md border border-rule bg-paper-light p-3 text-base" />
        <div className="flex flex-wrap gap-3"><Link className="dots-link" to={`/thoughts/${record.id}`}>Open thought</Link>
          {confirm === key ? <><button className="dots-link" disabled={busy} onClick={() => setConfirm(null)}>Keep draft</button><button className="dots-link" disabled={busy} onClick={() => void discard(record)}>Discard draft</button></> : <button className="dots-link" onClick={() => setConfirm(key)}>Discard this edit…</button>}
        </div>
      </div>;
    })}
  </details>;
}
