import { useEffect, useState } from 'react';
import type { FC } from 'react';
import PageContainer from '../components/PageContainer';
import SectionCard from '../components/SectionCard';
import ArchiveCard from '../components/ArchiveCard';
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
        return restored;
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
      <div className="mb-8">
        <p className="mb-3 text-xs uppercase tracking-[0.3em] text-lavender-dark opacity-90">
          Loopr
        </p>

        <h1 className="mb-3 text-3xl font-bold leading-tight text-charcoal sm:text-4xl">
          Resolved
        </h1>

        <p className="max-w-xl text-base leading-7 text-charcoal/70">
          Loops you've completed or consciously released. Restore one any time.
        </p>
      </div>

      {isEmpty ? (
        <SectionCard className="space-y-2">
          <p className="text-charcoal/75">Nothing resolved yet.</p>

          <p className="text-sm text-charcoal/55">
            Completed and released loops will appear here.
          </p>
        </SectionCard>
      ) : (
        <div className="space-y-10">
          {doneLoops.length > 0 && (
            <div>
              <div className="mb-3 flex items-baseline gap-2.5">
                <h2 className="text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-charcoal/55">
                  Done
                </h2>
                <span className="text-sm font-semibold leading-none text-charcoal/65 tabular-nums">
                  {doneLoops.length}
                </span>
              </div>

              <div className="space-y-3">
                {doneLoops.map((loop) => (
                  <ArchiveCard
                    key={loop.id}
                    loop={loop}
                    onRestore={handleRestore}
                    onDelete={handlePermanentDelete}
                  />
                ))}
              </div>
            </div>
          )}

          {droppedLoops.length > 0 && (
            <div>
              <div className="mb-3 flex items-baseline gap-2.5">
                <h2 className="text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-charcoal/55">
                  Dropped
                </h2>
                <span className="text-sm font-semibold leading-none text-charcoal/65 tabular-nums">
                  {droppedLoops.length}
                </span>
              </div>

              <div className="space-y-3">
                {droppedLoops.map((loop) => (
                  <ArchiveCard
                    key={loop.id}
                    loop={loop}
                    onRestore={handleRestore}
                    onDelete={handlePermanentDelete}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </PageContainer>
  );
};

export default Archive;
