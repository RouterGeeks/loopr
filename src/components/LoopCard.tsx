import type { FC } from 'react';

type LoopStatus = 'pending' | 'do' | 'delay' | 'drop';

interface LoopItem {
  id: number;
  text: string;
  status: LoopStatus;
}

interface LoopCardProps {
  loop: LoopItem;
  onAction: (id: number, action: Exclude<LoopStatus, 'pending'>) => void;
}

const statusLabel: Record<LoopStatus, string> = {
  pending: 'Pending',
  do: 'Do',
  delay: 'Delay',
  drop: 'Drop',
};

const LoopCard: FC<LoopCardProps> = ({ loop, onAction }) => {
  return (
    <div className="rounded-[1.75rem] bg-cream-surface shadow-card p-5">
      <div className="mb-4">
        <p className="text-base leading-7 text-charcoal">{loop.text}</p>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="rounded-full bg-lavender-soft/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-lavender-dark">
          {statusLabel[loop.status]}
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onAction(loop.id, 'do')}
            className="rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-charcoal shadow-soft ring-1 ring-lavender-light/40 hover:bg-cream-light"
          >
            Do
          </button>
          <button
            type="button"
            onClick={() => onAction(loop.id, 'delay')}
            className="rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-charcoal shadow-soft ring-1 ring-lavender-light/40 hover:bg-cream-light"
          >
            Delay
          </button>
          <button
            type="button"
            onClick={() => onAction(loop.id, 'drop')}
            className="rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-charcoal shadow-soft ring-1 ring-lavender-light/40 hover:bg-cream-light"
          >
            Drop
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoopCard;
