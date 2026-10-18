import { useCaptureDraft, changeCaptureDraft, prepareDraftCapture, finishDraftCapture, recoverCaptureDraft, retryCaptureDraft } from '../lib/captureDraft';
import { useUpdateBlocker } from '../lib/updateSafety';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { revisitGroup } from '../lib/resurfacing';
import { useRevisitClock } from '../lib/useRevisitClock';
import type { FC, KeyboardEvent } from 'react';
import PageContainer from '../components/PageContainer';
import LoopCard from '../components/LoopCard';
import MicButton from '../components/MicButton';
import { useLoopData } from '../lib/useLoopData';
import StorageNotice from '../components/StorageNotice';
import type { LoopItem, LoopStatus } from '../lib/loops';
import DateEyebrow from '../components/DateEyebrow';
import HandUnderline from '../components/HandUnderline';
import DashDotDotMark from '../components/DashDotDotMark';
import SketchMountain from '../components/SketchMountain';
import { isSpeechCaptureSupported } from '../lib/useSpeechCapture';

type TransitionStatus = Exclude<LoopStatus, 'delayed'>;

const Home: FC = () => {
  const recovery = useCaptureDraft();
  const draft = recovery.text;
  const setDraft = changeCaptureDraft;
  const [discarding, setDiscarding] = useState(false);
  const [captureError, setCaptureError] = useState('');
  const { loops, setLoops, error, saving, reload } = useLoopData();
  const now = useRevisitClock(loops);
  useUpdateBlocker(draft.length > 0 || saving);
  const readyCount = loops.filter(loop => loop.status === 'delayed' && revisitGroup(loop, now) === 'ready').length;
  const captureRef = useRef<HTMLTextAreaElement | null>(null);


  // Focus the capture field on mount and when navigating back to Home.
  // useEffect is more reliable than the HTML autofocus attribute under
  // React hydration in an SPA.
  useEffect(() => {
    captureRef.current?.focus({ preventScroll: true });
  }, []);

  const addLoop = async () => {
    const trimmed = draft.trim();
    if (!trimmed || !recovery.ready || saving) return;
    setCaptureError('');

    const now = new Date();

    const captureId = loops.reduce((id, loop) => Math.max(id, loop.id + 1), now.getTime());
    if (!prepareDraftCapture(captureId)) {
      setCaptureError('Could not save. Your draft and previously saved thoughts are unchanged. Allow storage or free some space, then try again.');
      return;
    }
    const saved = await setLoops((current) => [
      {
        id: captureId,
        text: trimmed,
        status: 'do',
        createdAt: now.toISOString(),
      },
      ...current,
    ]);

    if (saved) { finishDraftCapture(draft); setDiscarding(false); }
  };

  const handleTransition = (id: number, status: TransitionStatus) => {
    return setLoops((current) =>
      current.map((loop) => {
        if (loop.id !== id) return loop;
        const now = new Date().toISOString();
        const next: LoopItem = { ...loop, status };
        if (status === 'doing') next.startedAt = now;
        if (status === 'done') next.doneAt = now;
        if (status === 'dropped') next.droppedAt = now;
        return next;
      })
    );
  };

  const handleDelay = (id: number, revisitAt: string) => {
    return setLoops((current) =>
      current.map((loop) =>
        loop.id === id
          ? { ...loop, status: 'delayed', revisitAt }
          : loop
      )
    );
  };

  const handleEdit = (id: number, newText: string) => {
    return setLoops((current) =>
      current.map((loop) =>
        loop.id === id ? { ...loop, text: newText } : loop
      )
    );
  };

  const handleEditNote = (id: number, note: string) => {
    return setLoops((current) =>
      current.map((loop) => {
        if (loop.id !== id) return loop;
        const trimmed = note.trim();
        const next: LoopItem = { ...loop };
        if (trimmed) next.note = trimmed;
        else delete next.note;
        return next;
      })
    );
  };

  const handleDelete = (id: number) => {
    return setLoops((current) => current.filter((loop) => loop.id !== id));
  };

  const handleDraftKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      addLoop();
    }
  };

  const appendVoiceTextToDraft = useCallback((text: string) => {
    setDraft((prev) => (prev ? `${prev.trimEnd()} ${text}` : text));
    captureRef.current?.focus({ preventScroll: true });
  }, [setDraft]);

  const speechSupported = isSpeechCaptureSupported();

  // The Cmd/Ctrl+Enter hint is only useful with a physical keyboard.
  // Hide it on coarse-pointer devices (phones/tablets) and inside a
  // Capacitor native wrapper, where it's noise.
  const showKeyboardHint = useMemo(() => {
    if (typeof window === 'undefined') return false;
    if ((window as { Capacitor?: unknown }).Capacitor) return false;
    return window.matchMedia?.('(pointer: fine)').matches ?? false;
  }, []);

  const canAddLoop = recovery.ready && !saving && draft.trim().length > 0;

  const doLoops = loops.filter((loop) => loop.status === 'do');

  return (
    <PageContainer>
      <StorageNotice error={captureError || error} saving={saving} onReload={reload} />
      <div className="relative mb-6">
        <DateEyebrow />
        <h1 className="mt-2 font-serif text-2xl font-semibold leading-tight tracking-tight text-charcoal sm:text-3xl">
          Dashboard
        </h1>
        <p className="mt-3 max-w-[18rem] font-serif italic text-sm leading-relaxed text-charcoal/70 sm:max-w-md sm:text-base">
          For thoughts that keep coming back. Capture
          now, decide later.
        </p>
        <SketchMountain className="pointer-events-none absolute -top-1 right-0 h-14 w-28 sm:h-16 sm:w-32" />
      </div>
      <div aria-hidden="true" className="mb-6 flex items-center gap-3">
        <span className="flex-1 border-t border-rule" />
        <DashDotDotMark className="h-3 w-12 text-charcoal/60" />
        <span className="flex-1 border-t border-rule" />
      </div>

      <div className="space-y-2">

        <div className="capture-surface rounded-sm border border-charcoal/25 bg-paper-light/40">
          <textarea
            id="loop-input"
            ref={captureRef}
            value={draft}
            readOnly={!recovery.ready}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={handleDraftKeyDown}
            rows={4}
            aria-label="New thought"
            placeholder="What's on your mind?"
            className="block w-full resize-none bg-transparent px-4 py-3 font-mono text-sm leading-relaxed text-charcoal placeholder:text-charcoal/70 focus:outline-none"
          />

          <div className="flex flex-wrap items-center justify-between gap-2 px-3 pb-2 pt-1">
            <div className="flex items-center">
              {speechSupported && (
                <MicButton
                  onText={appendVoiceTextToDraft}
                  label="Voice capture for new thought"
                />
              )}
            </div>

            <div className="flex items-center gap-2">
              {showKeyboardHint && (
                <span className="hidden font-mono text-xs sm:inline text-charcoal/70">
                  ⌘ Enter to add
                </span>
              )}
              <button
                type="button"
                onClick={addLoop}
                disabled={!canAddLoop}
                aria-label="Add thought"
                className={`inline-flex h-9 w-9 items-center justify-center rounded-sm bg-lavender-soft text-lavender-dark shadow-card ring-1 ring-charcoal/10 transition duration-200 active:scale-95 ${
                  canAddLoop
                    ? 'hover:bg-lavender-soft/80'
                    : 'cursor-not-allowed opacity-55'
                }`}
              >
                <svg
                  viewBox="0 0 16 16"
                  width="14"
                  height="14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <line x1="8" y1="3" x2="8" y2="13" />
                  <line x1="3" y1="8" x2="13" y2="8" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {recovery.limited && draft && !recovery.error && <p className="text-sm text-charcoal/70">Draft recovery is limited to this tab’s session in this browser.</p>}
        {recovery.restored && <p role="status" className="text-sm text-charcoal/70">Draft restored.</p>}
        {recovery.error && <div className="text-sm text-charcoal/80"><p role="status">{recovery.error}</p><button className="dots-link" onClick={retryCaptureDraft}>Retry draft storage</button></div>}
        {draft && <div className="text-sm">
          {discarding ? <div className="flex flex-wrap items-center gap-3"><span>Discard this unfinished thought?</span><button className="dots-link" onClick={() => setDiscarding(false)}>Keep draft</button><button className="dots-link" onClick={() => { setDraft(''); setDiscarding(false); setCaptureError(''); captureRef.current?.focus(); }}>Discard draft</button></div> : <button className="dots-link text-charcoal/70" onClick={() => setDiscarding(true)}>Discard draft</button>}
        </div>}
        {recovery.others.length > 0 && <details className="text-sm text-charcoal/70">
          <summary className="min-h-11 cursor-pointer py-3">Other saved drafts</summary>
          <p>Recover a draft from a closed tab. Save or discard this tab’s draft first. Open tabs keep their own drafts.</p>
          <ul className="divide-y divide-rule">{recovery.others.map(item => <li key={item.id} className="py-3"><p className="whitespace-pre-wrap break-words">{item.text.slice(0, 180)}{item.text.length > 180 ? '…' : ''}</p><button className="dots-link" disabled={Boolean(draft) || !recovery.ready} onClick={() => { void recoverCaptureDraft(item.id); }}>Recover draft</button></li>)}</ul>
        </details>}

        {!speechSupported && (
          <p className="font-mono text-xs italic text-charcoal/70">
            Voice capture isn't built into this browser. Try your
            keyboard's mic instead.
          </p>
        )}
      </div>

      {readyCount > 0 && (
        <Link to="/delayed" className="mt-5 flex min-h-11 flex-wrap items-center justify-between gap-2 rounded-md border border-lavender/50 bg-lavender/15 px-4 py-3 text-sm text-charcoal">
          <span className="font-semibold">Ready to revisit · {readyCount}</span>
          <span className="underline underline-offset-4">View {readyCount === 1 ? 'thought' : 'thoughts'} →</span>
        </Link>
      )}

      <p className="mt-8 max-w-md font-serif italic text-sm leading-relaxed text-charcoal/70 sm:text-base">
        <span className="font-semibold text-charcoal/90">Do</span> it now.{' '}
        <span className="font-semibold text-charcoal/90">Delay</span> it for later.{' '}
        <span className="font-semibold text-charcoal/90">Drop</span> it to let it go.
      </p>

      <div className="mt-6">
        {doLoops.length === 0 ? (
          <div className="border-t border-rule pt-6">
            <div className="space-y-2">
              <p className="relative inline-block pr-2 font-serif text-lg font-semibold text-charcoal">
                {readyCount > 0 ? 'Nothing new here' : 'Quiet for now'}
                <HandUnderline className="absolute -bottom-1 left-0 h-2 w-full" />
              </p>
              <p className="font-mono text-xs text-charcoal/70">
                Captured thoughts will appear here.
              </p>
            </div>

            <div className="mt-5 flex items-end justify-end gap-2">
              <div className="relative pr-2 text-right">
                <p className="font-serif italic text-sm leading-snug text-charcoal/70">
                  clear mind,
                  <br />
                  open space
                </p>
                {/* hand-drawn arrow */}
                <svg
                  className="absolute -bottom-3 -right-6 h-8 w-8 text-charcoal/70"
                  viewBox="0 0 30 30"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M 4 6 C 14 8, 22 14, 26 24"
                    stroke="currentColor"
                    strokeWidth="1.1"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <path
                    d="M 26 24 L 21 22 M 26 24 L 24 19"
                    stroke="currentColor"
                    strokeWidth="1.1"
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
              </div>
              <DashDotDotMark sketch className="h-24 w-28 shrink-0 text-charcoal/70" />
            </div>
          </div>
        ) : (
          <>
            <h2 className="relative mb-1 inline-block pr-1 font-mono text-xs tracking-[0.2em] text-charcoal/70">
              THOUGHTS
              <HandUnderline className="absolute -bottom-1 left-0 h-2 w-full" />
            </h2>
            <div className="divide-y divide-rule border-t border-rule">
              {doLoops.map((loop) => (
                <LoopCard saving={saving}
                  key={loop.id}
                  loop={loop}
                  onTransition={handleTransition}
                  onDelay={handleDelay}
                  onEdit={handleEdit}
                  onEditNote={handleEditNote}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </PageContainer>
  );
};

export default Home;
