import { useCallback, useEffect, useRef, useSyncExternalStore } from 'react';
import { editorDraft, type EditorKind } from '../lib/editorDraft';
import type { LoopItem } from '../lib/loops';
import { useUpdateBlocker } from '../lib/updateSafety';
import MicButton from './MicButton';
import { isSpeechCaptureSupported } from '../lib/useSpeechCapture';

export default function RecoveredEditor({ thought, kind, saving = false, onSave, onClose }: {
  thought: LoopItem; kind: EditorKind; saving?: boolean;
  onSave: (text: string) => Promise<boolean>; onClose: () => void;
}) {
  const entry = editorDraft(thought, kind);
  const state = useSyncExternalStore(entry.subscribe, entry.getSnapshot);
  const input = useRef<HTMLTextAreaElement>(null);
  useUpdateBlocker(true);
  useEffect(() => { void entry.start(); input.current?.focus(); }, [entry]);
  const busy = saving || state.busy;
  const cancel = () => { if (!busy && entry.cancel()) onClose(); };
  const save = async () => { if (!busy && await entry.save(onSave)) onClose(); };
  const append = useCallback((text: string) => { entry.change(previous => previous ? `${previous.trimEnd()} ${text}` : text); input.current?.focus({ preventScroll: true }); }, [entry]);
  const note = kind === 'note';
  return <div className="space-y-3 rounded-md border border-rule bg-paper-light/60 p-4">
    <label htmlFor={`loop-${note ? 'note' : 'edit'}-${thought.id}`} className={note ? 'block text-xs font-semibold uppercase tracking-[0.2em] text-charcoal/70' : 'sr-only'}>{note ? 'Note' : 'Edit thought'}</label>
    {state.restored && <p role="status" className="text-sm text-charcoal/70">Draft restored. Review it, then Save or Cancel.</p>}
    {state.limited && <p className="text-sm text-charcoal/70">Draft recovery is limited to this tab session in this browser.</p>}
    {state.error && <div role="alert" className="text-sm"><p>{state.error}</p><button type="button" disabled={busy} className="dots-link" onClick={entry.retry}>Retry draft recovery</button></div>}
    <textarea id={`loop-${note ? 'note' : 'edit'}-${thought.id}`} ref={input} readOnly={!state.ready || busy} value={state.text}
      onChange={event => entry.change(event.target.value)} rows={3}
      onKeyDown={event => { if (event.key === 'Escape') { event.preventDefault(); cancel(); } else if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) { event.preventDefault(); void save(); } }}
      placeholder={note ? 'A small breadcrumb for later...' : undefined}
      className="edit-field block w-full rounded-md border border-rule bg-paper-light/90 p-3 font-serif text-base leading-6 text-charcoal" />
    {state.conflict && <div className="space-y-2 text-sm" role="status">
      <p>{state.latest ? 'The saved thought changed. Review the latest version before saving your draft.' : 'This thought is unavailable. Your draft is kept here and in Dials → Unfinished edits. Copy it or Cancel to discard; it will not recreate a deleted thought.'}</p>
      {state.latest && <><p className="whitespace-pre-wrap break-words">Latest saved {note ? 'note' : 'thought'}: {(note ? state.latest.note : state.latest.text) || '(empty)'}</p>
        <button type="button" className="dots-link" disabled={busy} onClick={entry.review}>Use my draft after review</button></>}
    </div>}
    <div className="flex flex-wrap items-center justify-between gap-2">
      <div>{note && state.ready && !busy && (isSpeechCaptureSupported() ? <MicButton onText={append} label="Voice append to note" /> : <span className="text-xs italic text-charcoal/70">Voice capture isn't built into this browser. Try your keyboard's mic instead.</span>)}</div>
      <div className="flex flex-wrap gap-2">
        <button type="button" disabled={busy} onClick={cancel} className="rounded-md bg-paper-light/90 px-4 py-2 text-sm font-semibold ring-1 ring-charcoal/10">Cancel</button>
        <button type="button" disabled={!state.ready || busy || state.conflict || (!note && !state.text.trim())} onClick={() => void save()} className="rounded-md bg-charcoal px-5 py-2 text-sm font-semibold text-cream-light disabled:opacity-50">Save</button>
      </div>
    </div>
  </div>;
}
