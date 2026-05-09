import { useEffect, useState } from 'react';
import type { FC } from 'react';
import PageContainer from '../components/PageContainer';
import SectionCard from '../components/SectionCard';
import LoopCard from '../components/LoopCard';

interface LoopItem {
  id: number;
  text: string;
  status: 'active' | 'delayed' | 'done' | 'dropped';
  revisitAt?: string;
}

const STORAGE_KEY = 'loopr.loops';

const Revisit: FC = () => {
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
      return [];
    }
    return [];
  });

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(loops));
  }, [loops]);

  const handleAction = (id: number, action: 'done' | 'dropped') => {
    setLoops((current) =>
      current.map((loop) =>
        loop.id === id ? { ...loop, status: action } : loop
      )
    );
  };

  const handleDelay = (id: number, revisitAt: string) => {
    setLoops((current) =>
      current.map((loop) =>
        loop.id === id ? { ...loop, status: 'delayed', revisitAt } : loop
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

  const delayedLoops = loops
    .filter((loop) => loop.status === 'delayed')
    .slice()
    .sort((a, b) => {
      const aTime = a.revisitAt ? new Date(a.revisitAt).getTime() : Infinity;
      const bTime = b.revisitAt ? new Date(b.revisitAt).getTime() : Infinity;
      return aTime - bTime;
    });

  return (
    <PageContainer>
      <div className="mb-8">
        <p className="mb-3 text-xs uppercase tracking-[0.3em] text-lavender-dark opacity-90">
          Loopr
        </p>

        <h1 className="mb-3 text-4xl font-bold leading-tight text-charcoal">
          Revisit
        </h1>

        <p className="max-w-xl text-base leading-7 text-charcoal/70">
          A quiet place to look back on loops that need a second look
          later.
        </p>
      </div>

      {/* Delayed Count */}
      {delayedLoops.length > 0 && (
        <div className="mb-8">
          <div className="inline-block rounded-full bg-lavender-soft/40 px-4 py-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-lavender-dark">
              Delayed: {delayedLoops.length}
            </p>
          </div>
        </div>
      )}
      <SectionCard className="space-y-4">
        {delayedLoops.length === 0 ? (
          <div className="space-y-3">
            <p className="text-lg font-semibold text-charcoal">
              Nothing to revisit yet
            </p>

            <p className="text-charcoal/70">
              When you delay a loop from home, it will appear here. Take
              your time—there's no rush.
            </p>
          </div>
        ) : (
          delayedLoops.map((loop) => (
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
      </SectionCard>
    </PageContainer>
  );
};

export default Revisit;