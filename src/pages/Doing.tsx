import { useEffect, useState } from 'react';
import type { FC } from 'react';
import PageContainer from '../components/PageContainer';
import DateEyebrow from '../components/DateEyebrow';
import HandUnderline from '../components/HandUnderline';
import LoopCard from '../components/LoopCard';
import SketchCoffee from '../components/SketchCoffee';
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
      <div className="relative mb-8">
        <DateEyebrow />
        <h1 className="mt-2 font-serif text-2xl font-semibold leading-tight tracking-tight text-charcoal sm:text-3xl">
          Doing
        </h1>
        <p className="mt-2 text-sm text-charcoal/65">
          What you're actively engaging with right now.
        </p>
        <SketchCoffee className="pointer-events-none absolute -top-1 right-0 h-20 w-14" />
      </div>

      <div className="border-t border-rule">
        {doingLoops.length === 0 ? (
          <div className="py-6">
            <div className="space-y-2">
              <p className="relative inline-block pr-2 font-serif text-lg font-semibold text-charcoal">
                Nothing in motion
                <HandUnderline className="absolute -bottom-1 left-0 h-2 w-full" color="seafoam" />
              </p>
              <p className="font-mono text-xs text-charcoal/55">
                Loops you start working on will appear here.
              </p>
            </div>
            <p className="mt-6 text-right font-serif italic text-sm text-charcoal/55">
              in your hands
            </p>
          </div>
        ) : (
          <div className="divide-y divide-rule">
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
      </div>
    </PageContainer>
  );
};

export default Doing;
