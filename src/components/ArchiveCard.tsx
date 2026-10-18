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

const NoteIcon: FC = () => (
  <svg
    viewBox="0 0 16 16"
    width="11"
    height="11"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <line x1="3" y1="5" x2="13" y2="5" />
    <line x1="3" y1="8" x2="10" y2="8" />
    <line x1="3" y1="11" x2="13" y2="11" />
  </svg>
);

const TrashIcon: FC = () => (
  <svg
    viewBox="0 0 16 16"
    width="13"
    height="13"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M3 4.5h10" />
    <path d="M6.5 4.5V3.25a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 .75.75V4.5" />
    <path d="M4.75 4.5l.55 8.3a1 1 0 0 0 1 .95h3.4a1 1 0 0 0 1-.95l.55-8.3" />
    <path d="M7 7v4" />
    <path d="M9 7v4" />
  </svg>
);

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
            Permanently delete this loop?
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
              onClick={() => setMode('editing-note')}
              data-focus="note"
                aria-label={hasNote ? 'Edit note' : 'Add note'}
              className="inline-flex items-center gap-1.5 rounded-full bg-paper-light/70 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-charcoal/85 ring-1 ring-charcoal/10 transition duration-200 hover:bg-paper-light hover:text-charcoal"
            >
              <NoteIcon />
              Note
              {hasNote && (
                <span
                  aria-hidden
                  className="ml-0.5 h-1.5 w-1.5 rounded-full bg-lavender-dark/70"
                />
              )}
            </button>

            <button aria-describedby={contextId}
              type="button"
              onClick={() => onRestore(loop.id)}
              className="rounded-full bg-paper-light/90 px-4 py-1.5 text-xs font-semibold text-charcoal shadow-soft ring-1 ring-charcoal/10 hover:bg-cream-light"
            >
              Restore
            </button>

            <button aria-describedby={contextId}
              type="button"
              onClick={() => setMode('confirming-delete')}
              data-focus="more" aria-label="Delete loop"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full text-charcoal/65 transition duration-200 hover:bg-paper-light/70 hover:text-charcoal"
            >
              <TrashIcon />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArchiveCard;
