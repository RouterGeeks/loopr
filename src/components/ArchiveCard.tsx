import { useState } from 'react';
import type { FC } from 'react';

type LoopStatus = 'active' | 'delayed' | 'done' | 'dropped';

interface LoopItem {
  id: number;
  text: string;
  status: LoopStatus;
  revisitAt?: string;
  createdAt?: string;
  doneAt?: string;
  droppedAt?: string;
}

interface ArchiveCardProps {
  loop: LoopItem;
  onRestore: (id: number) => void;
  onDelete: (id: number) => void;
}

const startOfDay = (d: Date): Date =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate());

const relativeAgoLabel = (iso: string, now: Date): string | null => {
  const stamp = new Date(iso);
  if (Number.isNaN(stamp.getTime())) return null;

  const daysAgo = Math.round(
    (startOfDay(now).getTime() - startOfDay(stamp).getTime()) / 86400000
  );

  if (daysAgo <= 0) return 'today';
  if (daysAgo === 1) return 'yesterday';
  if (daysAgo < 7) return `${daysAgo} days ago`;
  if (daysAgo < 30) {
    const weeks = Math.floor(daysAgo / 7);
    return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
  }
  return stamp.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });
};

const ArchiveCard: FC<ArchiveCardProps> = ({ loop, onRestore, onDelete }) => {
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const now = new Date();

  const addedRelative = loop.createdAt
    ? relativeAgoLabel(loop.createdAt, now)
    : null;

  const stateRelative = (() => {
    if (loop.status === 'done') {
      const stamp = loop.doneAt ?? loop.createdAt;
      const rel = stamp ? relativeAgoLabel(stamp, now) : null;
      return rel ? `Completed ${rel}` : null;
    }
    if (loop.status === 'dropped') {
      const stamp = loop.droppedAt ?? loop.createdAt;
      const rel = stamp ? relativeAgoLabel(stamp, now) : null;
      return rel ? `Dropped ${rel}` : null;
    }
    return null;
  })();

  const metaParts = [
    addedRelative ? `Added ${addedRelative}` : null,
    stateRelative,
  ].filter((part): part is string => Boolean(part));

  const statusLabel = loop.status === 'done' ? 'Done' : 'Dropped';

  return (
    <div className="rounded-3xl bg-cream-surface shadow-soft p-4">
      <p className="text-base leading-7 text-charcoal/85">{loop.text}</p>

      {metaParts.length > 0 && (
        <p className="mt-2 text-[0.7rem] text-charcoal/50">
          {metaParts.join(' · ')}
        </p>
      )}

      {confirmingDelete ? (
        <div className="mt-3 rounded-2xl bg-white/60 p-3">
          <p className="mb-3 text-sm leading-6 text-charcoal/80">
            Permanently delete this loop?
          </p>

          <div className="flex flex-wrap items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setConfirmingDelete(false)}
              className="rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-charcoal/80 ring-1 ring-lavender-light/40 hover:bg-cream-light"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={() => onDelete(loop.id)}
              className="rounded-full bg-charcoal px-4 py-2 text-sm font-semibold text-white transition duration-200 hover:bg-charcoal-soft"
            >
              Delete
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-lavender-light/30 pt-3">
          <div className="rounded-full bg-lavender-soft/60 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-lavender-dark">
            {statusLabel}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => onRestore(loop.id)}
              className="rounded-full bg-white/90 px-4 py-1.5 text-xs font-semibold text-charcoal shadow-soft ring-1 ring-lavender-light/40 hover:bg-cream-light"
            >
              Restore
            </button>

            <button
              type="button"
              onClick={() => setConfirmingDelete(true)}
              className="rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-charcoal/65 transition duration-200 hover:bg-white/70 hover:text-charcoal"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArchiveCard;
