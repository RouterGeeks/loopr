import { useEffect, useState } from 'react';
import type { FC } from 'react';
import PageContainer from '../components/PageContainer';
import SectionCard from '../components/SectionCard';
import LoopCard from '../components/LoopCard';

interface LoopItem {
  id: number;
  text: string;
  status: 'active' | 'delayed' | 'done' | 'dropped';
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
          status: item.status === 'pending' ? 'active' :
                  item.status === 'do' ? 'done' :
                  item.status === 'delay' ? 'delayed' :
                  item.status === 'drop' ? 'dropped' :
                  item.status as 'active' | 'delayed' | 'done' | 'dropped'
        }));
      }
    } catch {
      // Ignore invalid stored data and continue with empty state.
    }
    return [];
  });

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(loops));
  }, [loops]);

  const addLoop = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;

    setLoops((current) => [
      { id: Date.now(), text: trimmed, status: 'active' },
      ...current,
    ]);
    setDraft('');
  };

  const handleAction = (id: number, action: 'done' | 'delayed' | 'dropped') => {
    setLoops((current) =>
      current.map((loop) =>
        loop.id === id ? { ...loop, status: action } : loop
      )
    );
  };

  return (
    <PageContainer>
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.3em] text-lavender-dark opacity-90 mb-3">Loopr</p>
        <h1 className="text-4xl font-bold text-charcoal leading-tight mb-3">Capture your open loops</h1>
        <p className="max-w-xl text-charcoal text-opacity-70 text-base leading-7">Quickly add a thought, then choose what to do next. This space stays calm and focused as your loop list grows.</p>
      </div>

      <SectionCard className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-3">
            <label htmlFor="loop-input" className="block text-sm font-semibold text-charcoal/80">
              New loop
            </label>
            <textarea
              id="loop-input"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              rows={4}
              placeholder="Capture a task, idea, or note..."
              className="w-full rounded-3xl border border-lavender-soft/40 bg-white/90 p-4 text-base leading-7 text-charcoal shadow-soft focus:border-lavender focus:outline-none focus:ring-2 focus:ring-lavender-soft/40"
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-charcoal text-opacity-70">Add a loop to begin building your list.</p>
            <button
              type="button"
              onClick={addLoop}
              disabled={draft.trim().length === 0}
              className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition duration-200 enabled:bg-lavender enabled:text-white enabled:shadow-soft enabled:hover:bg-lavender-dark disabled:bg-lavender-soft/50 disabled:text-charcoal/50 disabled:cursor-not-allowed"
            >
              Add Loop
            </button>
          </div>
        </div>
      </SectionCard>

      <div className="mt-8 space-y-4">
        {loops.filter(loop => loop.status === 'active').length === 0 ? (
          <SectionCard>
            <p className="text-charcoal text-opacity-75 leading-relaxed">Your captured loops will appear here as cards below the input. Use the action buttons to mark each loop.</p>
          </SectionCard>
        ) : (
          loops.filter(loop => loop.status === 'active').map((loop) => (
            <LoopCard key={loop.id} loop={loop} onAction={handleAction} />
          ))
        )}
      </div>
    </PageContainer>
  );
};

export default Home;