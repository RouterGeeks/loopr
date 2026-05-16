import { useEffect, useState } from 'react';
import type { FC } from 'react';
import PageContainer from '../components/PageContainer';
import SectionCard from '../components/SectionCard';
import { clearLoops, loadLoops } from '../lib/loops';
import type { LoopItem } from '../lib/loops';

const Settings: FC = () => {
  const [loops, setLoops] = useState<LoopItem[]>([]);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    setLoops(loadLoops());
  }, [showConfirmation]);

  const doCount = loops.filter((loop) => loop.status === 'do').length;
  const doingCount = loops.filter((loop) => loop.status === 'doing').length;
  const delayedCount = loops.filter(
    (loop) => loop.status === 'delayed'
  ).length;
  const resolvedCount = loops.filter(
    (loop) => loop.status === 'done' || loop.status === 'dropped'
  ).length;

  const countTiles: Array<{ label: string; value: number }> = [
    { label: 'Do', value: doCount },
    { label: 'Doing', value: doingCount },
    { label: 'Delayed', value: delayedCount },
    { label: 'Resolved', value: resolvedCount },
  ];

  const handleClearData = () => {
    clearLoops();
    setLoops([]);
    setShowConfirmation(false);
  };

  return (
    <PageContainer>
      <div className="mb-8">
        <p className="mb-3 text-xs uppercase tracking-[0.3em] text-lavender-dark opacity-90">
          Loopr
        </p>

        <h1 className="mb-3 text-3xl font-bold leading-tight text-charcoal sm:text-4xl">
          Settings
        </h1>

        <p className="max-w-xl text-base leading-7 text-charcoal/70">
          A quiet place to adjust the basics.
        </p>
      </div>

      <SectionCard className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-charcoal">Your loops</h2>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {countTiles.map((tile) => (
              <div
                key={tile.label}
                className="rounded-2xl bg-white/60 p-4"
              >
                <p className="text-[2.25rem] font-semibold leading-none tracking-tight text-charcoal tabular-nums">
                  {tile.value}
                </p>

                <p className="mt-2.5 text-[0.65rem] font-medium uppercase tracking-[0.25em] text-charcoal/50">
                  {tile.label}
                </p>
              </div>
            ))}
          </div>
        </div>

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

      {showConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm">
          <div className="max-w-sm rounded-3xl bg-cream-surface p-6 shadow-card sm:p-8">
            <h3 className="mb-2 text-lg font-semibold text-charcoal">
              Clear all data?
            </h3>

            <p className="mb-6 text-charcoal/70">
              This will delete every loop on this device, across Do, Doing,
              Delayed, Done, and Dropped. This action cannot be undone.
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
