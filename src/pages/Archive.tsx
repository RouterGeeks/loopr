import { useEffect, useState } from 'react';
import type { FC } from 'react';
import PageContainer from '../components/PageContainer';
import SectionCard from '../components/SectionCard';
import ArchiveCard from '../components/ArchiveCard';

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

const Archive: FC = () => {
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

  const handleRestore = (id: number) => {
    setLoops((current) =>
      current.map((loop) =>
        loop.id === id ? { ...loop, status: 'active' } : loop
      )
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

        <h1 className="mb-3 text-4xl font-bold leading-tight text-charcoal">
          Archive
        </h1>

        <p className="max-w-xl text-base leading-7 text-charcoal/70">
          Resolved and released loops live here, in case you want to find
          them again.
        </p>
      </div>

      {isEmpty ? (
        <SectionCard className="space-y-2">
          <p className="text-charcoal/75">Nothing archived right now.</p>

          <p className="text-sm text-charcoal/55">
            Resolved and released loops will appear here.
          </p>
        </SectionCard>
      ) : (
        <div className="space-y-10">
          {doneLoops.length > 0 && (
            <div>
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-charcoal/55">
                Done
              </h2>

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
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-charcoal/55">
                Dropped
              </h2>

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
