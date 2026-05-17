import { useEffect, useState } from 'react';
import type { FC } from 'react';
import PageContainer from '../components/PageContainer';
import DateEyebrow from '../components/DateEyebrow';
import SectionCard from '../components/SectionCard';
import SketchKnob from '../components/SketchKnob';
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
  const doneCount = loops.filter(
    (loop) => loop.status === 'done' || loop.status === 'dropped'
  ).length;

  const countTiles: Array<{ label: string; value: number }> = [
    { label: 'Do', value: doCount },
    { label: 'Doing', value: doingCount },
    { label: 'Delayed', value: delayedCount },
    { label: 'Done', value: doneCount },
  ];

  const handleClearData = () => {
    clearLoops();
    setLoops([]);
    setShowConfirmation(false);
  };

  return (
    <PageContainer>
      <div className="relative mb-8">
        <DateEyebrow />
        <h1 className="mt-2 font-serif text-2xl font-semibold leading-tight tracking-tight text-charcoal sm:text-3xl">
          Dials
        </h1>
        <p className="mt-2 text-sm text-charcoal/65">
          A quiet place to adjust the basics.
        </p>
        <SketchKnob className="pointer-events-none absolute -top-1 right-0 h-16 w-16" />
      </div>

      <SectionCard className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-charcoal">Your loops</h2>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
            {countTiles.map((tile) => (
              <div
                key={tile.label}
                className="flex items-baseline gap-1.5 rounded-md border border-rule bg-paper-light/60 px-3 py-2.5"
              >
                <span className="text-base font-semibold leading-none text-charcoal tabular-nums">
                  {tile.value}
                </span>

                <span className="text-[0.65rem] font-medium uppercase tracking-[0.25em] text-charcoal/50">
                  {tile.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3 border-t border-rule pt-6">
          <h2 className="text-lg font-semibold text-charcoal">Data</h2>

          <p className="text-sm text-charcoal/70">
            All your loops are stored locally on this device. You can clear
            everything at any time.
          </p>

          <button
            type="button"
            onClick={() => setShowConfirmation(true)}
            className="inline-block rounded-md bg-paper-light/80 px-5 py-3 text-sm font-semibold text-charcoal ring-1 ring-charcoal/10 transition duration-200 hover:bg-paper-light hover:ring-charcoal/20"
          >
            Clear All Data
          </button>
        </div>
      </SectionCard>

      {showConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm">
          <div className="max-w-sm rounded-lg border border-rule bg-cream-surface p-6 shadow-card sm:p-8">
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
                className="flex-1 rounded-md bg-paper-light/80 px-4 py-3 text-sm font-semibold text-charcoal ring-1 ring-charcoal/10 transition duration-200 hover:bg-paper-light"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleClearData}
                className="flex-1 rounded-md bg-charcoal px-4 py-3 text-sm font-semibold text-cream-light transition duration-200 hover:bg-charcoal-soft"
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
