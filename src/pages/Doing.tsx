import { useEffect, useState } from 'react';
import type { FC } from 'react';
import PageContainer from '../components/PageContainer';
import SectionCard from '../components/SectionCard';
import LoopCard from '../components/LoopCard';
import { loadLoops, saveLoops } from '../lib/loops';
import type { LoopItem, LoopStatus } from '../lib/loops';

type TransitionStatus = Exclude<LoopStatus, 'delayed'>;

const Doing: FC = () => {
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
        loop.id === id
          ? { ...loop, status: 'delayed', revisitAt }
          : loop
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

  const doingLoops = loops
    .filter((loop) => loop.status === 'doing')
    .slice()
    .sort((a, b) => {
      const aTime = a.startedAt
        ? new Date(a.startedAt).getTime()
        : a.id;
      const bTime = b.startedAt
        ? new Date(b.startedAt).getTime()
        : b.id;
      return bTime - aTime;
    });

  return (
    <PageContainer>
      <div className="mb-8">
        <p className="mb-3 text-xs uppercase tracking-[0.3em] text-lavender-dark opacity-90">
          Loopr
        </p>

        <h1 className="mb-3 text-3xl font-bold leading-tight text-charcoal sm:text-4xl">
          Doing
        </h1>

        <p className="max-w-xl text-base leading-7 text-charcoal/70">
          What you're actively engaging with right now.
        </p>
      </div>

      {doingLoops.length > 0 && (
        <div className="mb-8">
          <div className="inline-block min-w-[5.5rem] rounded-2xl bg-seafoam/25 px-4 py-3.5">
            <p className="text-3xl font-semibold leading-none tracking-tight text-charcoal tabular-nums">
              {doingLoops.length}
            </p>
            <p className="mt-2 text-[0.6rem] font-medium uppercase tracking-[0.25em] text-charcoal/45">
              Doing
            </p>
          </div>
        </div>
      )}

      {doingLoops.length === 0 ? (
        <SectionCard className="space-y-2">
          <p className="text-charcoal/75">Nothing in motion right now.</p>

          <p className="text-sm text-charcoal/55">
            Loops you start working on will appear here.
          </p>
        </SectionCard>
      ) : (
        <div className="space-y-4">
          {doingLoops.map((loop) => (
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

export default Doing;
