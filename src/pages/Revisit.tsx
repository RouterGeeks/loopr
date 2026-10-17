import { useEffect, useState } from 'react';
import { revisitGroup, revisitTime } from '../lib/resurfacing';
import { useRevisitClock } from '../lib/useRevisitClock';
import type { FC } from 'react';
import PageContainer from '../components/PageContainer';
import DateEyebrow from '../components/DateEyebrow';
import HandUnderline from '../components/HandUnderline';
import LoopCard from '../components/LoopCard';
import SketchMoon from '../components/SketchMoon';
import { loadLoops, saveLoops } from '../lib/loops';
import type { LoopItem, LoopStatus } from '../lib/loops';

type TransitionStatus = Exclude<LoopStatus, 'delayed'>;

const Revisit: FC = () => {
  const [loops, setLoops] = useState<LoopItem[]>(() => loadLoops());
  const now = useRevisitClock(loops);

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
    .sort((a, b) => (revisitTime(a) ?? Infinity) - (revisitTime(b) ?? Infinity));
  const groups = [
    { key: 'ready', title: 'Ready to revisit' },
    { key: 'later', title: 'Later' },
    { key: 'undated', title: 'Choose a date' },
  ] as const;


  return (
    <PageContainer>
      <div className="relative mb-8">
        <DateEyebrow />
        <h1 className="mt-2 font-serif text-2xl font-semibold leading-tight tracking-tight text-charcoal sm:text-3xl">
          Delayed
        </h1>
        <p className="mt-2 text-sm text-charcoal/65">
          Loops set aside to resurface later.
        </p>
        <SketchMoon className="pointer-events-none absolute -top-1 right-0 h-16 w-16" />
      </div>

      <div className="border-t border-rule">
        {delayedLoops.length === 0 ? (
          <div className="py-6">
            <div className="space-y-2">
              <p className="relative inline-block pr-2 font-serif text-lg font-semibold text-charcoal">
                Nothing waiting
                <HandUnderline className="absolute -bottom-1 left-0 h-2 w-full" />
              </p>
              <p className="font-mono text-xs text-charcoal/70">
                Delayed loops will resurface here.
              </p>
            </div>
            <p className="mt-6 text-right font-serif italic text-sm text-charcoal/70">
              back when ready
            </p>
          </div>
        ) : (
          <div className="divide-y divide-rule">
            {groups.flatMap(group => {
              const items = delayedLoops.filter(loop => revisitGroup(loop, now) === group.key);
              if (items.length === 0) return [];
              // Keep cards as stable siblings when the clock changes their group:
              // moving between nested sections would remount an open editor.
              return [
                <h2 key={`heading-${group.key}`} className="pt-6 pb-3 font-serif text-lg font-semibold text-charcoal">{group.title}</h2>,
                ...items.map(loop => (
                  <LoopCard key={loop.id} loop={loop} nowTime={now}
                    onTransition={handleTransition} onDelay={handleDelay}
                    onEdit={handleEdit} onEditNote={handleEditNote} onDelete={handleDelete} />
                )),
              ];
            })}
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default Revisit;
