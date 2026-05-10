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
  createdAt?: string;
  doneAt?: string;
  droppedAt?: string;
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
          createdAt:
            item.createdAt ??
            (typeof item.id === 'number'
              ? new Date(item.id).toISOString()
              : new Date().toISOString()),
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
          <div className="inline-block min-w-[5.5rem] rounded-2xl bg-lavender-soft/40 px-4 py-3">
            <p className="text-2xl font-bold leading-none text-charcoal">
              {delayedLoops.length}
            </p>
            <p className="mt-1.5 text-[0.65rem] font-medium uppercase tracking-[0.2em] text-charcoal/55">
              Delayed
            </p>
          </div>
        </div>
      )}
      {delayedLoops.length === 0 ? (
        <SectionCard>
          <p className="text-charcoal/70">Nothing waiting right now.</p>
        </SectionCard>
      ) : (
        <div className="space-y-4">
          {delayedLoops.map((loop) => (
            <LoopCard
              key={loop.id}
              loop={loop}
              onAction={handleAction}
              onDelay={handleDelay}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </PageContainer>
  );
};

export default Revisit;
