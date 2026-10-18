import EditorDrafts from '../components/EditorDrafts';
import { useUpdateBlocker } from '../lib/updateSafety';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import RevisitTimeSetting from '../components/RevisitTimeSetting';
import type { FC } from 'react';
import PageContainer from '../components/PageContainer';
import DateEyebrow from '../components/DateEyebrow';
import SectionCard from '../components/SectionCard';
import SketchKnob from '../components/SketchKnob';
import ClearDataDialog from '../components/ClearDataDialog';
import BackupControls from '../components/BackupControls';
import { writeLoops } from '../lib/loops';
import { useLoopData } from '../lib/useLoopData';
import StorageNotice from '../components/StorageNotice';

const Settings: FC = () => {
  const { loops, raw, readable, error, saving, reload } = useLoopData();
  const [clearError, setClearError] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  useUpdateBlocker(showConfirmation || saving);
  const [showAbout, setShowAbout] = useState(false);

  const handleConfirmationChange = (isOpen: boolean) => {
    setClearError('');
    setShowConfirmation(isOpen);
  };

  const doCount = loops.filter((loop) => loop.status === 'do').length;
  const doingCount = loops.filter((loop) => loop.status === 'doing').length;
  const delayedCount = loops.filter(
    (loop) => loop.status === 'delayed'
  ).length;
  const doneCount = loops.filter(
    (loop) => loop.status === 'done' || loop.status === 'dropped'
  ).length;

  const countTiles: Array<{ label: string; value: number; to: string }> = [
    { label: 'Do', value: doCount, to: '/' },
    { label: 'Doing', value: doingCount, to: '/doing' },
    { label: 'Delayed', value: delayedCount, to: '/delayed' },
    { label: 'Done', value: doneCount, to: '/done' },
  ];

  const handleClearData = async () => {
    try {
      await writeLoops(null, raw);
      reload();
      setShowConfirmation(false);
      setClearError('');
    } catch {
      setShowConfirmation(false);
      setClearError('Could not clear data. Saved thoughts are unchanged. Review the latest saved thoughts and try again.');
    }
  };

  return (
    <PageContainer>
      <StorageNotice error={clearError || error} saving={saving} onReload={reload} />
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
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => setShowAbout((v) => !v)}
            aria-expanded={showAbout}
            className="flex w-full items-baseline justify-between gap-3 text-left"
          >
            <h2 className="text-lg font-semibold text-charcoal">About Dash Dot Dot</h2>
            <span className="font-mono text-xs text-charcoal/70">
              {showAbout ? '— hide' : '+ read'}
            </span>
          </button>

          {showAbout && (
            <div className="space-y-3 font-serif text-[0.95rem] leading-relaxed text-charcoal/80">
              <p>
                Dash Dot Dot is for thoughts that keep coming back,
                ideas you haven't decided about, half-finished things you
                don't want to forget.
              </p>
              <p>
                Capture a thought, then choose:{' '}
                <span className="font-semibold text-charcoal">Do</span> it
                now,{' '}
                <span className="font-semibold text-charcoal">Delay</span>{' '}
                it, or{' '}
                <span className="font-semibold text-charcoal">Drop</span>{' '}
                it. Delayed thoughts resurface when you've asked them to.
                Dropped ones can be restored.
              </p>
              <p>
                The goal is cognitive clarity, not productivity. No streaks,
                no overdue red, no pressure.
              </p>
            </div>
          )}
        </div>

        <div className="space-y-4 border-t border-rule pt-6">
          <h2 className="text-lg font-semibold text-charcoal">Your thoughts</h2>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
            {countTiles.map((tile) => (
              <Link to={tile.to} aria-label={`${tile.value} ${tile.label} thoughts${tile.label === 'Done' ? ' (includes dropped)' : ''}`}
                key={tile.label}
                className="flex min-h-11 flex-wrap items-baseline gap-1.5 rounded-md border border-rule bg-paper-light/60 px-3 py-2.5"
              >
                <span className="text-base font-semibold leading-none text-charcoal tabular-nums">
                  {tile.value}
                </span>

                <span className="text-xs font-medium uppercase tracking-[0.25em] text-charcoal/70">
                  {tile.label}
                </span>
              </Link>
            ))}
          </div>
        </div>

        <RevisitTimeSetting />

        <div className="space-y-3 border-t border-rule pt-6">
          <h2 className="text-lg font-semibold text-charcoal">Data</h2>

          <p className="text-sm text-charcoal/70">
            All your thoughts are stored locally on this device. You can clear
            saved thoughts at any time. Unfinished drafts are separate from backups. Capture drafts can be discarded on Dashboard; note and thought-edit drafts are under Unfinished edits.
          </p>

          <BackupControls onRestore={reload} needsRecovery={!readable} />

          <button
            type="button"
            onClick={() => handleConfirmationChange(true)}
            className="inline-block rounded-md bg-paper-light/80 px-5 py-3 text-sm font-semibold text-charcoal ring-1 ring-charcoal/10 transition duration-200 hover:bg-paper-light hover:ring-charcoal/20"
          >
            Clear All Data
          </button>
        </div>
      </SectionCard>

      {showConfirmation && (
        <ClearDataDialog onCancel={() => handleConfirmationChange(false)} onConfirm={handleClearData} />
      )}
      <EditorDrafts />
    </PageContainer>
  );
};

export default Settings;
