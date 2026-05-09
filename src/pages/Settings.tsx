import { useState } from 'react';
import type { FC } from 'react';
import PageContainer from '../components/PageContainer';
import SectionCard from '../components/SectionCard';

interface LoopItem {
  id: number;
  text: string;
  status: 'active' | 'delayed' | 'done' | 'dropped';
}

const STORAGE_KEY = 'loopr.loops';

const Settings: FC = () => {
  const [loops, setLoops] = useState<LoopItem[]>(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return [];

    try {
      const parsed = JSON.parse(saved) as any[];
      if (Array.isArray(parsed)) {
        return parsed.map((item) => ({
          ...item,
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
      return [];
    }
    return [];
  });

  const [showConfirmation, setShowConfirmation] = useState(false);

  const activeCount = loops.filter((loop) => loop.status === 'active')
    .length;
  const delayedCount = loops.filter((loop) => loop.status === 'delayed')
    .length;

  const handleClearData = () => {
    window.localStorage.removeItem(STORAGE_KEY);
    setLoops([]);
    setShowConfirmation(false);
  };

  return (
    <PageContainer>
      <div className="mb-8">
        <p className="mb-3 text-xs uppercase tracking-[0.3em] text-lavender-dark opacity-90">
          Loopr
        </p>

        <h1 className="mb-3 text-4xl font-bold leading-tight text-charcoal">
          Settings
        </h1>

        <p className="max-w-xl text-base leading-7 text-charcoal/70">
          A gentle space to adjust the app at your pace — simple, warm,
          and clean.
        </p>
      </div>

      <SectionCard className="space-y-6">
        {/* Loop Counts */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-charcoal">Your Loops</h2>

          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
            <div className="flex-1 rounded-2xl bg-white/60 p-4">
              <p className="text-sm font-semibold text-lavender-dark">
                Active Loops
              </p>

              <p className="mt-1 text-3xl font-bold text-charcoal">
                {activeCount}
              </p>
            </div>

            <div className="flex-1 rounded-2xl bg-white/60 p-4">
              <p className="text-sm font-semibold text-lavender-dark">
                Delayed Loops
              </p>

              <p className="mt-1 text-3xl font-bold text-charcoal">
                {delayedCount}
              </p>
            </div>
          </div>
        </div>

        {/* Clear Data Section */}
        <div className="space-y-3 border-t border-lavender-light/30 pt-6">
          <h2 className="text-lg font-semibold text-charcoal">Data</h2>

          <p className="text-sm text-charcoal/70">
            All your loops are stored locally on this device. You can clear
            everything at any time.
          </p>

          <button
            type="button"
            onClick={() => setShowConfirmation(true)}
            className="inline-block rounded-full bg-white/80 px-5 py-3 text-sm font-semibold text-charcoal ring-1 ring-lavender-light/50 transition duration-200 hover:bg-white/90 hover:ring-lavender-light/70"
          >
            Clear All Data
          </button>
        </div>
      </SectionCard>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm">
          <div className="max-w-sm rounded-3xl bg-cream-surface p-6 shadow-card sm:p-8">
            <h3 className="mb-2 text-lg font-semibold text-charcoal">
              Clear all data?
            </h3>

            <p className="mb-6 text-charcoal/70">
              This will delete all your active, delayed, done, and dropped
              loops. This action cannot be undone.
            </p>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowConfirmation(false)}
                className="flex-1 rounded-full bg-lavender-soft/50 px-4 py-3 text-sm font-semibold text-charcoal transition duration-200 hover:bg-lavender-soft/70"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleClearData}
                className="flex-1 rounded-full bg-charcoal px-4 py-3 text-sm font-semibold text-white transition duration-200 hover:bg-charcoal-soft"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
};

export default Settings;