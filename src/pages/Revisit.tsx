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

  const handleAction = (id: number, action: 'done' | 'delayed' | 'dropped') => {
    setLoops((current) =>
      current.map((loop) =>
        loop.id === id ? { ...loop, status: action } : loop
      )
    );
  };

  const delayedLoops = loops.filter(loop => loop.status === 'delayed');

  return (
    <PageContainer>
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.3em] text-lavender-dark opacity-90 mb-3">Loopr</p>
        <h1 className="text-4xl font-bold text-charcoal leading-tight mb-3">Revisit</h1>
        <p className="max-w-xl text-charcoal text-opacity-70 text-base leading-7">A quiet place to look back on loops that need a second look later.</p>
      </div>
      <SectionCard className="space-y-4">
        {delayedLoops.length === 0 ? (
          <div className="rounded-3xl bg-white/80 p-5 shadow-soft border border-lavender-light/40">
            <p className="text-lg font-semibold text-charcoal">Ready when you are</p>
            <p className="text-charcoal text-opacity-75 leading-relaxed">Delayed loops will appear here. This view is designed to feel calm and gentle, so you can revisit your notes without pressure.</p>
          </div>
        ) : (
          delayedLoops.map((loop) => (
            <LoopCard key={loop.id} loop={loop} onAction={handleAction} />
          ))
        )}
      </SectionCard>
    </PageContainer>
  );
};

export default Revisit;