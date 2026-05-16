import { useEffect, useState } from 'react';
import type { FC } from 'react';
import PageContainer from '../components/PageContainer';
import SectionCard from '../components/SectionCard';
import LoopCard from '../components/LoopCard';
import { loadLoops, saveLoops } from '../lib/loops';
import type { LoopItem, LoopStatus } from '../lib/loops';

type TransitionStatus = Exclude<LoopStatus, 'delayed'>;

const Revisit: FC = () => {
  const [loops, setLoops] = useState<LoopItem[]>(() => loadLoops());

  useEffect(() => {
    saveLoops(loops);
  }, [loops]);

  const handleTransition = (id: number, status: TransitionStatus) => {
    setLoops((current) =>
      current.map((loop) => {
        if (loop.id !== id) return loop;
        const now = new Date().toISOString();
        const next: LoopItem = { ...loop, status };
        if (status === 'doing') next.startedAt = now;
        if (status === 'done') next.doneAt = now;
        if (status === 'dropped') next.droppedAt = now;
        return next;
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

        <h1 className="mb-3 text-3xl font-bold leading-tight text-charcoal sm:text-4xl">
          Delayed
        </h1>

        <p className="max-w-xl text-base leading-7 text-charcoal/70">
          Loops set aside to resurface later.
        </p>
      </div>

      {delayedLoops.length > 0 && (
        <div className="mb-8">
          <div className="inline-block min-w-[5.75rem] rounded-2xl bg-lavender-soft/30 px-4 py-3.5">
            <p className="text-3xl font-semibold leading-none tracking-tight text-charcoal tabular-nums">
              {delayedLoops.length}
            </p>
            <p className="mt-2 text-[0.6rem] font-medium uppercase tracking-[0.25em] text-charcoal/45">
              Delayed
            </p>
          </div>
        </div>
      )}

      {delayedLoops.length === 0 ? (
        <SectionCard className="space-y-2">
          <p className="text-charcoal/75">Nothing waiting right now.</p>

          <p className="text-sm text-charcoal/55">
            Delayed loops will resurface here.
          </p>
        </SectionCard>
      ) : (
        <div className="space-y-4">
          {delayedLoops.map((loop) => (
            <LoopCard
              key={loop.id}
              loop={loop}
              onTransition={handleTransition}
              onDelay={handleDelay}
              onEdit={handleEdit}
              onEditNote={handleEditNote}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </PageContainer>
  );
};

export default Revisit;
