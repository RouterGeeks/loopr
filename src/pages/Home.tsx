import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { FC, KeyboardEvent } from 'react';
import PageContainer from '../components/PageContainer';
import SectionCard from '../components/SectionCard';
import LoopCard from '../components/LoopCard';
import MicButton from '../components/MicButton';
import { loadLoops, saveLoops } from '../lib/loops';
import type { LoopItem, LoopStatus } from '../lib/loops';
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
      <div className="mb-8">
        <p className="mb-3 text-xs uppercase tracking-[0.3em] text-lavender-dark opacity-90">
          Loopr
        </p>

        <h1 className="mb-3 text-3xl font-bold leading-tight text-charcoal sm:text-4xl">
          Dashboard
        </h1>

        <p className="max-w-xl text-base leading-7 text-charcoal/70">
          Capture a loop, then decide what to do with it later.
        </p>
      </div>

      {hasAnyOpenWork && (
        <div className="mb-8 flex flex-wrap gap-3">
          <div className="min-w-[5.5rem] rounded-2xl bg-lavender-soft/30 px-4 py-3.5">
            <p className="text-3xl font-semibold leading-none tracking-tight text-charcoal tabular-nums">
              {doCount}
            </p>
            <p className="mt-2 text-[0.6rem] font-medium uppercase tracking-[0.25em] text-charcoal/45">
              Do
            </p>
          </div>

          <div className="min-w-[5.5rem] rounded-2xl bg-seafoam/25 px-4 py-3.5">
            <p className="text-3xl font-semibold leading-none tracking-tight text-charcoal tabular-nums">
              {doingCount}
            </p>
            <p className="mt-2 text-[0.6rem] font-medium uppercase tracking-[0.25em] text-charcoal/45">
              Doing
            </p>
          </div>

          <div className="min-w-[5.5rem] rounded-2xl bg-lavender-soft/30 px-4 py-3.5">
            <p className="text-3xl font-semibold leading-none tracking-tight text-charcoal tabular-nums">
              {delayedCount}
            </p>
            <p className="mt-2 text-[0.6rem] font-medium uppercase tracking-[0.25em] text-charcoal/45">
              Delayed
            </p>
          </div>
        </div>
      )}

      <SectionCard className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-3">
            <label
              htmlFor="loop-input"
              className="block text-sm font-semibold text-charcoal/80"
            >
              New loop
            </label>

            <textarea
              id="loop-input"
              ref={captureRef}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={handleDraftKeyDown}
              rows={4}
              placeholder="Capture a task, idea, or note..."
              className="w-full rounded-3xl border border-lavender-soft/40 bg-white/90 p-4 text-base leading-7 text-charcoal shadow-soft focus:border-lavender focus:outline-none focus:ring-2 focus:ring-lavender-soft/40"
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-1.5">
              <div className="flex flex-wrap items-center gap-3">
                {speechSupported && (
                  <MicButton
                    onText={appendVoiceTextToDraft}
                    label="Voice capture for new loop"
                  />
                )}
                {showKeyboardHint && (
                  <p className="text-xs text-charcoal/45">
                    Cmd or Ctrl + Enter to capture.
                  </p>
                )}
              </div>

              {!speechSupported && (
                <p className="text-xs italic text-charcoal/45">
                  Voice capture isn't available in this browser yet.
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={addLoop}
              disabled={!canAddLoop}
              className={`inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition duration-200 ${
                canAddLoop
                  ? 'bg-[#3A3347] text-[#F7EFE3] shadow-soft hover:bg-[#2E2938]'
                  : 'cursor-not-allowed bg-[#D8D0C4] text-[#8A8175] opacity-60'
              }`}
            >
              Add Loop
            </button>
          </div>
        </div>
      </SectionCard>

      <div className="mt-8 space-y-4">
        {doLoops.length === 0 ? (
          <SectionCard className="space-y-2">
            <p className="text-charcoal/75">Quiet for now.</p>

            <p className="text-sm text-charcoal/55">
              Captured loops will appear here.
            </p>
          </SectionCard>
        ) : (
          doLoops.map((loop) => (
            <LoopCard
              key={loop.id}
              loop={loop}
              onTransition={handleTransition}
              onDelay={handleDelay}
              onEdit={handleEdit}
              onEditNote={handleEditNote}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </PageContainer>
  );
};

export default Home;
