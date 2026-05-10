import { useEffect, useState } from 'react';
import type { FC, KeyboardEvent } from 'react';
import PageContainer from '../components/PageContainer';
import SectionCard from '../components/SectionCard';
import LoopCard from '../components/LoopCard';

interface LoopItem {
  id: number;
  text: string;
  status: 'active' | 'delayed' | 'done' | 'dropped';
  revisitAt?: string;
  createdAt?: string;
  doneAt?: string;
  droppedAt?: string;
}

const STORAGE_KEY = 'loopr.loops';

const Home: FC = () => {
  const [draft, setDraft] = useState('');
  const [loops, setLoops] = useState<LoopItem[]>(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);

    if (!saved) return [];

    try {
      const parsed = JSON.parse(saved) as any[];

      if (Array.isArray(parsed)) {
        return parsed.map((item) => ({
          ...item,
          createdAt:
            item.createdAt ??
            (typeof item.id === 'number'
              ? new Date(item.id).toISOString()
              : new Date().toISOString()),
          status:
            item.status === 'pending'
              ? 'active'
              : item.status === 'do'
              ? 'done'
              : item.status === 'delay'
              ? 'delayed'
              : item.status === 'drop'
              ? 'dropped'
              : (item.status as
                  | 'active'
                  | 'delayed'
                  | 'done'
                  | 'dropped'),
        }));
      }
    } catch {
      // Ignore invalid stored data
    }

    return [];
  });

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(loops));
  }, [loops]);

  const addLoop = () => {
    const trimmed = draft.trim();

    if (!trimmed) return;

    const now = new Date();

    setLoops((current) => [
      {
        id: now.getTime(),
        text: trimmed,
        status: 'active',
        createdAt: now.toISOString(),
      },
      ...current,
    ]);

    setDraft('');
  };

  const handleAction = (
    id: number,
    action: 'done' | 'dropped'
  ) => {
    setLoops((current) =>
      current.map((loop) => {
        if (loop.id !== id) return loop;
        const now = new Date().toISOString();
        return {
          ...loop,
          status: action,
          ...(action === 'done' ? { doneAt: now } : {}),
          ...(action === 'dropped' ? { droppedAt: now } : {}),
        };
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

  const handleDelete = (id: number) => {
    setLoops((current) => current.filter((loop) => loop.id !== id));
  };

  const handleDraftKeyDown = (
    event: KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      addLoop();
    }
  };

  const canAddLoop = draft.trim().length > 0;

  const activeLoops = loops.filter(
    (loop) => loop.status === 'active'
  );

  const activeCount = activeLoops.length;
  const delayedCount = loops.filter((l) => l.status === 'delayed').length;

  return (
    <PageContainer>
      <div className="mb-8">
        <p className="mb-3 text-xs uppercase tracking-[0.3em] text-lavender-dark opacity-90">
          Loopr
        </p>

        <h1 className="mb-3 text-4xl font-bold leading-tight text-charcoal">
          Capture your open loops
        </h1>

        <p className="max-w-xl text-base leading-7 text-charcoal/70">
          Quickly add a thought, then choose what to do next.
          This space stays calm and focused as your loop list grows.
        </p>
      </div>

      {/* Loop Counts */}
      {loops.length > 0 && (
        <div className="mb-8 flex gap-3">
          <div className="min-w-[5.5rem] rounded-2xl bg-lavender-soft/40 px-4 py-3">
            <p className="text-2xl font-bold leading-none text-charcoal">
              {activeCount}
            </p>
            <p className="mt-1.5 text-[0.65rem] font-medium uppercase tracking-[0.2em] text-charcoal/55">
              Active
            </p>
          </div>

          <div className="min-w-[5.5rem] rounded-2xl bg-lavender-soft/40 px-4 py-3">
            <p className="text-2xl font-bold leading-none text-charcoal">
              {delayedCount}
            </p>
            <p className="mt-1.5 text-[0.65rem] font-medium uppercase tracking-[0.2em] text-charcoal/55">
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
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={handleDraftKeyDown}
              rows={4}
              placeholder="Capture a task, idea, or note..."
              className="w-full rounded-3xl border border-lavender-soft/40 bg-white/90 p-4 text-base leading-7 text-charcoal shadow-soft focus:border-lavender focus:outline-none focus:ring-2 focus:ring-lavender-soft/40"
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-charcoal/70">
              Add a loop to begin building your list.
            </p>

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
        {activeLoops.length === 0 ? (
          <SectionCard>
            <p className="text-charcoal/70">Quiet for now.</p>
          </SectionCard>
        ) : (
          activeLoops.map((loop) => (
            <LoopCard
              key={loop.id}
              loop={loop}
              onAction={handleAction}
              onDelay={handleDelay}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </PageContainer>
  );
};

export default Home;