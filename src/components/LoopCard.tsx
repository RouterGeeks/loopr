import { useEffect, useRef, useState } from 'react';
import type { FC } from 'react';

type LoopStatus = 'active' | 'delayed' | 'done' | 'dropped';

interface LoopItem {
  id: number;
  text: string;
  status: LoopStatus;
}

interface LoopCardProps {
  loop: LoopItem;
  onAction: (id: number, action: 'done' | 'delayed' | 'dropped') => void;
  onEdit: (id: number, newText: string) => void;
  onDelete: (id: number) => void;
}

type CardMode = 'view' | 'editing' | 'confirming-delete';

const statusLabel: Record<LoopStatus, string> = {
  active: 'Active',
  delayed: 'Delayed',
  done: 'Done',
  dropped: 'Dropped',
};

const LoopCard: FC<LoopCardProps> = ({
  loop,
  onAction,
  onEdit,
  onDelete,
}) => {
  const [mode, setMode] = useState<CardMode>('view');
  const [draft, setDraft] = useState(loop.text);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (mode === 'editing' && textareaRef.current) {
      const el = textareaRef.current;
      el.focus();
      el.setSelectionRange(el.value.length, el.value.length);
    }
  }, [mode]);

  const startEdit = () => {
    setDraft(loop.text);
    setMode('editing');
  };

  const cancelEdit = () => {
    setDraft(loop.text);
    setMode('view');
  };

  const saveEdit = () => {
    const trimmed = draft.trim();
    if (!trimmed || trimmed === loop.text) {
      setMode('view');
      return;
    }
    onEdit(loop.id, trimmed);
    setMode('view');
  };

  const startDelete = () => setMode('confirming-delete');
  const cancelDelete = () => setMode('view');
  const confirmDelete = () => onDelete(loop.id);

  const canSaveEdit = draft.trim().length > 0;

  if (mode === 'editing') {
    return (
      <div className="rounded-[1.75rem] bg-cream-surface shadow-card p-5">
        <label htmlFor={`loop-edit-${loop.id}`} className="sr-only">
          Edit loop
        </label>

        <textarea
          id={`loop-edit-${loop.id}`}
          ref={textareaRef}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          rows={3}
          className="mb-4 w-full rounded-2xl border border-lavender-soft/40 bg-white/90 p-4 text-base leading-7 text-charcoal shadow-soft focus:border-lavender focus:outline-none focus:ring-2 focus:ring-lavender-soft/40"
        />

        <div className="flex flex-wrap items-center justify-end gap-2">
          <button
            type="button"
            onClick={cancelEdit}
            className="rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-charcoal/80 ring-1 ring-lavender-light/40 hover:bg-cream-light"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={saveEdit}
            disabled={!canSaveEdit}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition duration-200 ${
              canSaveEdit
                ? 'bg-[#3A3347] text-[#F7EFE3] shadow-soft hover:bg-[#2E2938]'
                : 'cursor-not-allowed bg-[#D8D0C4] text-[#8A8175] opacity-60'
            }`}
          >
            Save
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[1.75rem] bg-cream-surface shadow-card p-5">
      <div className="mb-4">
        <p className="text-base leading-7 text-charcoal">{loop.text}</p>
      </div>

      {mode === 'confirming-delete' ? (
        <div className="rounded-2xl bg-white/60 p-4">
          <p className="mb-3 text-sm leading-6 text-charcoal/80">
            Delete this loop? This can't be undone.
          </p>

          <div className="flex flex-wrap items-center justify-end gap-2">
            <button
              type="button"
              onClick={cancelDelete}
              className="rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-charcoal/80 ring-1 ring-lavender-light/40 hover:bg-cream-light"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={confirmDelete}
              className="rounded-full bg-charcoal px-4 py-2 text-sm font-semibold text-white transition duration-200 hover:bg-charcoal-soft"
            >
              Delete
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="rounded-full bg-lavender-soft/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-lavender-dark">
              {statusLabel[loop.status]}
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => onAction(loop.id, 'done')}
                className="rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-charcoal shadow-soft ring-1 ring-lavender-light/40 hover:bg-cream-light"
              >
                Do
              </button>

              <button
                type="button"
                onClick={() => onAction(loop.id, 'delayed')}
                className="rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-charcoal shadow-soft ring-1 ring-lavender-light/40 hover:bg-cream-light"
              >
                Delay
              </button>

              <button
                type="button"
                onClick={() => onAction(loop.id, 'dropped')}
                className="rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-charcoal shadow-soft ring-1 ring-lavender-light/40 hover:bg-cream-light"
              >
                Drop
              </button>
            </div>
          </div>

          <div className="mt-4 flex justify-end gap-2 border-t border-lavender-light/30 pt-3">
            <button
              type="button"
              onClick={startEdit}
              className="rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-charcoal/85 transition duration-200 hover:bg-white/70 hover:text-charcoal"
            >
              Edit
            </button>

            <button
              type="button"
              onClick={startDelete}
              className="rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-charcoal/85 transition duration-200 hover:bg-white/70 hover:text-charcoal"
            >
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default LoopCard;
