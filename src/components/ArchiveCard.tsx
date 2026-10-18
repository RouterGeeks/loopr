import ThoughtActions from './ThoughtActions';
import { useUpdateBlocker } from '../lib/updateSafety';
import { useState } from 'react';
import type { FC } from 'react';
import type { LoopItem } from '../lib/loops';
import NoteEditor from './NoteEditor';
import { useCardFocus } from '../lib/useCardFocus';

interface ArchiveCardProps {
  loop: LoopItem;
  saving?: boolean;
  onRestore: (id: number) => Promise<boolean>;
  onEditNote: (id: number, note: string) => Promise<boolean>;
  onDelete: (id: number) => Promise<boolean>;
}

type CardMode = 'view' | 'editing-note' | 'confirming-delete';

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

const ArchiveCard: FC<ArchiveCardProps> = ({
  loop,
  saving = false,
  onRestore,
  onEditNote,
  onDelete,
}) => {
  const [mode, setMode] = useState<CardMode>('view');
  useUpdateBlocker(saving || mode !== 'view');
  const cardRef = useCardFocus(mode);
  const contextId = `loop-context-${loop.id}`;

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

  const hasNote = Boolean(loop.note && loop.note.trim());
  const notePreview = hasNote ? loop.note!.split('\n')[0].trim() : '';

  const saveNote = async (value: string) => {
    if (!await onEditNote(loop.id, value)) return;
    setMode('view');
  };

  return (
    <div ref={cardRef} role="group" aria-labelledby={contextId} className="py-4">
      <p id={contextId} className="font-serif text-base leading-relaxed text-charcoal/85">
        {loop.text}
      </p>

      {hasNote && mode !== 'editing-note' && (
        <p className="mt-1.5 truncate border-l-2 border-rule pl-3 font-serif text-sm italic text-charcoal/70">
          {notePreview}
        </p>
      )}

      {metaParts.length > 0 && (
        <p className="mt-2 text-xs text-charcoal/70">
          {metaParts.join(' · ')}
        </p>
      )}

      {mode === 'editing-note' ? (
        <div className="mt-3">
          <NoteEditor
          saving={saving}
            loopId={loop.id}
            initialValue={loop.note ?? ''}
            onSave={saveNote}
            onCancel={() => setMode('view')}
          />
        </div>
      ) : mode === 'confirming-delete' ? (
        <div data-panel className="mt-3 rounded-md border border-rule bg-paper-light/60 p-3">
          <p className="mb-3 text-sm leading-6 text-charcoal/80">
            Permanently delete this thought?
          </p>

          <div className="flex flex-wrap items-center justify-end gap-2">
            <button aria-describedby={contextId}
              type="button"
              onClick={() => setMode('view')}
              className="rounded-full bg-paper-light/90 px-4 py-2 text-sm font-semibold text-charcoal/80 ring-1 ring-charcoal/10 hover:bg-cream-light"
            >
              Cancel
            </button>

            <button aria-describedby={contextId}
              type="button"
              onClick={() => onDelete(loop.id)}
              className="rounded-md bg-charcoal px-4 py-2 text-sm font-semibold text-cream-light transition duration-200 hover:bg-charcoal-soft"
            >
              Delete
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-3 flex flex-wrap items-center justify-end gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <button aria-describedby={contextId}
              type="button"
              onClick={() => onRestore(loop.id)}
              className="rounded-full bg-paper-light/90 px-4 py-1.5 text-xs font-semibold text-charcoal shadow-soft ring-1 ring-charcoal/10 hover:bg-cream-light"
            >
              Restore
            </button>

            <ThoughtActions id={loop.id} contextId={contextId} hasNote={hasNote} onNote={() => setMode('editing-note')} onDelete={() => setMode('confirming-delete')} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ArchiveCard;
