import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { FC, KeyboardEvent } from 'react';
import PageContainer from '../components/PageContainer';
import LoopCard from '../components/LoopCard';
import MicButton from '../components/MicButton';
import { loadLoops, saveLoops } from '../lib/loops';
import type { LoopItem, LoopStatus } from '../lib/loops';
import DateEyebrow from '../components/DateEyebrow';
import HandUnderline from '../components/HandUnderline';
import SketchFlowers from '../components/SketchFlowers';
import SketchMountain from '../components/SketchMountain';
import { isSpeechCaptureSupported } from '../lib/useSpeechCapture';

type TransitionStatus = Exclude<LoopStatus, 'delayed'>;

const Home: FC = () => {
  const [draft, setDraft] = useState('');
  const [loops, setLoops] = useState<LoopItem[]>(() => loadLoops());
  const captureRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    saveLoops(loops);
  }, [loops]);

  // Focus the capture field on mount and when navigating back to Home.
  // useEffect is more reliable than the HTML autofocus attribute under
  // React hydration in an SPA.
  useEffect(() => {
    captureRef.current?.focus({ preventScroll: true });
  }, []);

  const addLoop = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;

    const now = new Date();

    setLoops((current) => [
      {
        id: now.getTime(),
        text: trimmed,
        status: 'do',
        createdAt: now.toISOString(),
      },
      ...current,
    ]);

    setDraft('');
  };

  const handleTransition = (id: number, status: TransitionStatus) => {
    setLoops((current) =>
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
    setLoops((current) =>
      current.map((loop) =>
        loop.id === id
          ? { ...loop, status: 'delayed', revisitAt }
          : loop
      )
    );
  };

  const handleEdit = (id: number, newText: string) => {
    setLoops((current) =>
      current.map((loop) =>
        loop.id === id ? { ...loop, text: newText } : loop
      )
    );
  };

  const handleEditNote = (id: number, note: string) => {
    setLoops((current) =>
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
    setLoops((current) => current.filter((loop) => loop.id !== id));
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
  }, []);

  const speechSupported = isSpeechCaptureSupported();

  // The Cmd/Ctrl+Enter hint is only useful with a physical keyboard.
  // Hide it on coarse-pointer devices (phones/tablets) and inside a
  // Capacitor native wrapper, where it's noise.
  const showKeyboardHint = useMemo(() => {
    if (typeof window === 'undefined') return false;
    if ((window as { Capacitor?: unknown }).Capacitor) return false;
    return window.matchMedia?.('(pointer: fine)').matches ?? false;
  }, []);

  const canAddLoop = draft.trim().length > 0;

  const doLoops = loops.filter((loop) => loop.status === 'do');

  const doCount = doLoops.length;
  const doingCount = loops.filter((l) => l.status === 'doing').length;
  const delayedCount = loops.filter((l) => l.status === 'delayed').length;

  const hasAnyOpenWork = doCount + doingCount + delayedCount > 0;

  return (
    <PageContainer>
      <div className="relative mb-6">
        <DateEyebrow />
        <h1 className="mt-2 font-serif text-4xl font-semibold leading-tight tracking-tight text-charcoal sm:text-5xl">
          Dashboard
        </h1>
        <SketchMountain className="pointer-events-none absolute -top-2 right-0 h-20 w-40 sm:w-48" />
      </div>

      {hasAnyOpenWork && (
        <div className="mb-5 flex flex-wrap items-baseline gap-x-4 gap-y-1.5 text-[0.65rem] font-medium uppercase tracking-[0.25em] text-charcoal/50">
          <span className="inline-flex items-baseline gap-1.5">
            <span className="text-base font-semibold leading-none text-charcoal tabular-nums">
              {doCount}
            </span>
            Do
          </span>
          <span className="inline-flex items-baseline gap-1.5">
            <span className="text-base font-semibold leading-none text-charcoal tabular-nums">
              {doingCount}
            </span>
            Doing
          </span>
          <span className="inline-flex items-baseline gap-1.5">
            <span className="text-base font-semibold leading-none text-charcoal tabular-nums">
              {delayedCount}
            </span>
            Delayed
          </span>
        </div>
      )}

      <div className="space-y-2">
        <label
          htmlFor="loop-input"
          className="block font-mono text-sm text-charcoal/75"
        >
          Capture a thought...
        </label>

        <div className="rounded-sm border border-charcoal/25 bg-paper-light/40">
          <textarea
            id="loop-input"
            ref={captureRef}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={handleDraftKeyDown}
            rows={4}
            aria-label="New loop"
            placeholder="What's on your mind?"
            className="block w-full resize-none bg-transparent px-4 pt-4 pb-2 font-mono text-sm text-charcoal placeholder:text-charcoal/40 focus:outline-none"
            style={{
              lineHeight: '28px',
              backgroundImage:
                'repeating-linear-gradient(to bottom, transparent 0, transparent 27px, rgba(31, 27, 22, 0.18) 27px, rgba(31, 27, 22, 0.18) 28px)',
            }}
          />

          <div className="flex items-center justify-between gap-2 px-3 pb-2 pt-1">
            <div className="flex items-center">
              {speechSupported && (
                <MicButton
                  onText={appendVoiceTextToDraft}
                  label="Voice capture for new loop"
                />
              )}
            </div>

            <div className="flex items-center gap-2">
              {showKeyboardHint && (
                <span className="font-mono text-xs text-charcoal/55">
                  ⌘ Enter to add
                </span>
              )}
              <button
                type="button"
                onClick={addLoop}
                disabled={!canAddLoop}
                aria-label="Add loop"
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

        {!speechSupported && (
          <p className="font-mono text-xs italic text-charcoal/45">
            Voice capture isn't built into this browser. Try your
            keyboard's mic instead.
          </p>
        )}
      </div>

      <div className="mt-8">
        {doLoops.length === 0 ? (
          <div className="border-t border-rule pt-6">
            <div className="space-y-2">
              <p className="relative inline-block pr-2 font-serif text-lg font-semibold text-charcoal">
                Quiet for now
                <HandUnderline className="absolute -bottom-1 left-0 h-2 w-full" />
              </p>
              <p className="font-mono text-xs text-charcoal/55">
                Captured loops will appear here.
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
                  className="absolute -bottom-3 -right-6 h-8 w-8 text-charcoal/55"
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
              <SketchFlowers className="h-24 w-24 shrink-0" />
            </div>
          </div>
        ) : (
          <>
            <h2 className="relative mb-1 inline-block pr-1 font-mono text-[0.7rem] tracking-[0.2em] text-charcoal/70">
              RECENTLY CAPTURED
              <HandUnderline className="absolute -bottom-1 left-0 h-2 w-full" />
            </h2>
            <div className="divide-y divide-rule border-t border-rule">
              {doLoops.map((loop) => (
                <LoopCard
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
