import { useEffect, useState } from 'react';
import type { FC } from 'react';
import PageContainer from '../components/PageContainer';
import ArchiveCard from '../components/ArchiveCard';
import DateEyebrow from '../components/DateEyebrow';
import HandUnderline from '../components/HandUnderline';
import SketchPaperStack from '../components/SketchPaperStack';
import { loadLoops, saveLoops } from '../lib/loops';
import type { LoopItem } from '../lib/loops';

const Archive: FC = () => {
  const [loops, setLoops] = useState<LoopItem[]>(() => loadLoops());

  useEffect(() => {
    saveLoops(loops);
  }, [loops]);

  const handleRestore = (id: number) => {
    setLoops((current) =>
      current.map((loop) => {
        if (loop.id !== id) return loop;
        const restored: LoopItem = {
          id: loop.id,
          text: loop.text,
          status: 'do',
          createdAt: loop.createdAt,
        };
        if (loop.revisitAt) restored.revisitAt = loop.revisitAt;
        if (loop.startedAt) restored.startedAt = loop.startedAt;
        if (loop.note) restored.note = loop.note;
        return restored;
      })
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

  const handlePermanentDelete = (id: number) => {
    setLoops((current) => current.filter((loop) => loop.id !== id));
  };

  const sortKey = (loop: LoopItem): number => {
    const stamp =
      loop.status === 'done'
        ? loop.doneAt
        : loop.status === 'dropped'
        ? loop.droppedAt
        : undefined;
    if (stamp) return new Date(stamp).getTime();
    if (loop.createdAt) return new Date(loop.createdAt).getTime();
    return loop.id;
  };

  const doneLoops = loops
    .filter((loop) => loop.status === 'done')
    .slice()
    .sort((a, b) => sortKey(b) - sortKey(a));

  const droppedLoops = loops
    .filter((loop) => loop.status === 'dropped')
    .slice()
    .sort((a, b) => sortKey(b) - sortKey(a));

  const isEmpty = doneLoops.length === 0 && droppedLoops.length === 0;

  return (
    <PageContainer>
      <div className="relative mb-8">
        <DateEyebrow />
        <h1 className="mt-2 font-serif text-4xl font-semibold leading-tight tracking-tight text-charcoal sm:text-5xl">
          Done
        </h1>
        <p className="mt-2 text-sm text-charcoal/65">
          Loops you've completed or consciously released. Restore one any time.
        </p>
        <SketchPaperStack className="pointer-events-none absolute -top-1 right-0 h-20 w-16" />
      </div>

      {isEmpty ? (
        <div className="border-t border-rule py-6">
          <div className="space-y-2">
            <p className="relative inline-block pr-2 font-serif text-lg font-semibold text-charcoal">
              Nothing here yet
              <HandUnderline className="absolute -bottom-1 left-0 h-2 w-full" color="ink" />
            </p>
            <p className="font-mono text-xs text-charcoal/55">
              Completed and released loops will appear here.
            </p>
          </div>
          <p className="mt-6 text-right font-serif italic text-sm text-charcoal/55">
            set down gently
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {doneLoops.length > 0 && (
            <section>
              <div className="mb-2 flex items-baseline gap-2.5">
                <h2 className="text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-charcoal/55">
                  Done
                </h2>
                <span className="text-sm font-semibold leading-none text-charcoal/65 tabular-nums">
                  {doneLoops.length}
                </span>
              </div>

              <div className="divide-y divide-rule border-t border-rule">
                {doneLoops.map((loop) => (
                  <ArchiveCard
                    key={loop.id}
                    loop={loop}
                    onRestore={handleRestore}
                    onEditNote={handleEditNote}
                    onDelete={handlePermanentDelete}
                  />
                ))}
              </div>
            </section>
          )}

          {droppedLoops.length > 0 && (
            <section>
              <div className="mb-2 flex items-baseline gap-2.5">
                <h2 className="text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-charcoal/55">
                  Dropped
                </h2>
                <span className="text-sm font-semibold leading-none text-charcoal/65 tabular-nums">
                  {droppedLoops.length}
                </span>
              </div>

              <div className="divide-y divide-rule border-t border-rule">
                {droppedLoops.map((loop) => (
                  <ArchiveCard
                    key={loop.id}
                    loop={loop}
                    onRestore={handleRestore}
                    onEditNote={handleEditNote}
                    onDelete={handlePermanentDelete}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </PageContainer>
  );
};

export default Archive;
