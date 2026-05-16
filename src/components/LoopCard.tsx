import { useEffect, useRef, useState } from 'react';
import type { FC } from 'react';
import type { LoopItem, LoopStatus } from '../lib/loops';
import NoteEditor from './NoteEditor';

type TransitionStatus = Exclude<LoopStatus, 'delayed'>;

interface LoopCardProps {
  loop: LoopItem;
  onTransition: (id: number, status: TransitionStatus) => void;
  onDelay: (id: number, revisitAt: string) => void;
  onEdit: (id: number, newText: string) => void;
  onEditNote: (id: number, note: string) => void;
  onDelete: (id: number) => void;
}

type CardMode =
  | 'view'
  | 'editing'
  | 'editing-note'
  | 'choosing-delay'
  | 'confirming-delete';

type DelayPreset = 'tomorrow' | 'weekend' | 'nextWeek';

const statusLabel: Record<LoopStatus, string> = {
  do: 'Do',
  doing: 'Doing',
  delayed: 'Delayed',
  done: 'Done',
  dropped: 'Dropped',
};

const statusPillClass: Record<LoopStatus, string> = {
  do: 'bg-lavender-soft/70 text-lavender-dark',
  doing: 'bg-seafoam/40 text-charcoal/80',
  delayed: 'bg-lavender-soft/70 text-lavender-dark',
  done: 'bg-cream-light text-charcoal/65',
  dropped: 'bg-cream-light text-charcoal/65',
};

const at9amLocal = (d: Date): Date => {
  d.setHours(9, 0, 0, 0);
  return d;
};

const computePresetDate = (preset: DelayPreset): Date => {
  const d = new Date();
  switch (preset) {
    case 'tomorrow':
      d.setDate(d.getDate() + 1);
      return at9amLocal(d);
    case 'weekend': {
      const day = d.getDay();
      let add: number;
      if (day === 6) add = 1; // Saturday → Sunday (still this weekend)
      else if (day === 0) add = 6; // Sunday → next Saturday
      else add = 6 - day; // Mon–Fri → upcoming Saturday
      d.setDate(d.getDate() + add);
      return at9amLocal(d);
    }
    case 'nextWeek': {
      const day = d.getDay();
      const add = day === 1 ? 7 : (8 - day) % 7 || 7;
      d.setDate(d.getDate() + add);
      return at9amLocal(d);
    }
  }
};

const localTodayString = (): string => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const formatScheduledDate = (iso: string): string => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
};

const startOfDay = (d: Date): Date =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate());

const relativeDaysAgoPhrase = (iso: string, now: Date): string | null => {
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

const relativeRevisitLabel = (iso: string, now: Date): string | null => {
  const target = new Date(iso);
  if (Number.isNaN(target.getTime())) return null;
  if (target.getTime() <= now.getTime()) return 'Back today';

  const daysDiff = Math.round(
    (startOfDay(target).getTime() - startOfDay(now).getTime()) / 86400000
  );
  if (daysDiff === 1) return 'Tomorrow';

  const todayDow = now.getDay();
  const targetDow = target.getDay();

  const isThisWeekend = (() => {
    if (todayDow === 0) return daysDiff === 6 && targetDow === 6;
    if (todayDow === 6) return false;
    return (
      (daysDiff === 6 - todayDow && targetDow === 6) ||
      (daysDiff === 7 - todayDow && targetDow === 0)
    );
  })();
  if (isThisWeekend) return 'This weekend';

  const daysToNextMonday =
    todayDow === 1 ? 7 : (8 - todayDow) % 7 || 7;
  if (daysDiff === daysToNextMonday && targetDow === 1) return 'Next week';

  return `Scheduled for ${formatScheduledDate(iso)}`;
};

const NoteIcon: FC = () => (
  <svg
    viewBox="0 0 16 16"
    width="12"
    height="12"
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

const LoopCard: FC<LoopCardProps> = ({
  loop,
  onTransition,
  onDelay,
  onEdit,
  onEditNote,
  onDelete,
}) => {
  const [mode, setMode] = useState<CardMode>('view');
  const [draft, setDraft] = useState(loop.text);
  const [departing, setDeparting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const departTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (mode === 'editing' && textareaRef.current) {
      const el = textareaRef.current;
      el.focus();
      el.setSelectionRange(el.value.length, el.value.length);
    }
  }, [mode]);

  useEffect(
    () => () => {
      if (departTimerRef.current !== null) {
        window.clearTimeout(departTimerRef.current);
      }
    },
    []
  );

  const triggerDo = () => {
    if (departing) return;

    // Gentle haptic on devices that support it (Android / some PWAs).
    // iOS Safari ignores this silently, which is fine.
    if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
      try {
        navigator.vibrate(10);
      } catch {
        /* ignore */
      }
    }

    const motionReduced =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    if (motionReduced) {
      onTransition(loop.id, 'doing');
      return;
    }

    setDeparting(true);
    departTimerRef.current = window.setTimeout(() => {
      departTimerRef.current = null;
      onTransition(loop.id, 'doing');
    }, 180);
  };

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

  const startNote = () => setMode('editing-note');
  const cancelNote = () => setMode('view');
  const saveNote = (value: string) => {
    onEditNote(loop.id, value);
    setMode('view');
  };

  const startDelay = () => setMode('choosing-delay');
  const cancelDelay = () => setMode('view');

  const applyPreset = (preset: DelayPreset) => {
    onDelay(loop.id, computePresetDate(preset).toISOString());
    setMode('view');
  };

  const applyCustomDate = (yyyymmdd: string) => {
    if (!yyyymmdd) return;
    const [y, m, d] = yyyymmdd.split('-').map(Number);
    if (!y || !m || !d) return;
    const date = new Date(y, m - 1, d, 9, 0, 0, 0);
    onDelay(loop.id, date.toISOString());
    setMode('view');
  };

  const startDelete = () => setMode('confirming-delete');
  const cancelDelete = () => setMode('view');
  const confirmDelete = () => onDelete(loop.id);

  const canSaveEdit = draft.trim().length > 0;
  const hasNote = Boolean(loop.note && loop.note.trim());
  const notePreview = hasNote ? loop.note!.split('\n')[0].trim() : '';

  const now = new Date();

  const revisitSublabel = (() => {
    if (loop.status !== 'delayed' || !loop.revisitAt) return null;
    const text = relativeRevisitLabel(loop.revisitAt, now);
    if (!text) return null;
    return {
      text,
      tone: text === 'Back today' ? ('due' as const) : ('scheduled' as const),
    };
  })();

  const footerLabel = (() => {
    if (loop.status === 'doing' && loop.startedAt) {
      const rel = relativeDaysAgoPhrase(loop.startedAt, now);
      return rel ? `Started ${rel}` : null;
    }
    if (loop.createdAt) {
      const rel = relativeDaysAgoPhrase(loop.createdAt, now);
      return rel ? `Added ${rel}` : null;
    }
    return null;
  })();

  const primaryAction = (() => {
    if (loop.status === 'doing') {
      return {
        label: 'Done',
        onClick: () => onTransition(loop.id, 'done'),
        ariaLabel: 'Mark loop done',
      };
    }
    // Both 'do' and 'delayed' surface "Do" to start engaging.
    return {
      label: 'Do',
      onClick: triggerDo,
      ariaLabel: 'Start doing this loop',
    };
  })();

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
    <div
      className={`rounded-[1.75rem] bg-cream-surface shadow-card p-5 transition-all duration-200 ease-out motion-reduce:transition-none ${
        departing ? 'pointer-events-none -translate-y-1 opacity-0' : ''
      }`}
    >
      <div className="mb-4">
        <p className="text-base leading-7 text-charcoal">{loop.text}</p>

        {hasNote && mode !== 'editing-note' && (
          <p className="mt-1.5 truncate text-sm italic text-charcoal/55">
            {notePreview}
          </p>
        )}

        {revisitSublabel && (
          <p
            className={`mt-2 text-xs font-semibold uppercase tracking-[0.2em] ${
              revisitSublabel.tone === 'due'
                ? 'text-lavender-dark'
                : 'text-charcoal/60'
            }`}
          >
            {revisitSublabel.text}
          </p>
        )}
      </div>

      {mode === 'editing-note' ? (
        <NoteEditor
          loopId={loop.id}
          initialValue={loop.note ?? ''}
          onSave={saveNote}
          onCancel={cancelNote}
        />
      ) : mode === 'choosing-delay' ? (
        <div className="space-y-3 rounded-2xl bg-white/60 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-charcoal/70">
            When should we revisit?
          </p>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => applyPreset('tomorrow')}
              className="rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-charcoal shadow-soft ring-1 ring-lavender-light/40 hover:bg-cream-light"
            >
              Tomorrow
            </button>

            <button
              type="button"
              onClick={() => applyPreset('weekend')}
              className="rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-charcoal shadow-soft ring-1 ring-lavender-light/40 hover:bg-cream-light"
            >
              This weekend
            </button>

            <button
              type="button"
              onClick={() => applyPreset('nextWeek')}
              className="rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-charcoal shadow-soft ring-1 ring-lavender-light/40 hover:bg-cream-light"
            >
              Next week
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <label
              htmlFor={`delay-date-${loop.id}`}
              className="text-xs font-semibold uppercase tracking-[0.2em] text-charcoal/70"
            >
              Pick date
            </label>

            <input
              id={`delay-date-${loop.id}`}
              type="date"
              min={localTodayString()}
              onChange={(event) => applyCustomDate(event.target.value)}
              className="rounded-full border border-lavender-soft/40 bg-white/90 px-3 py-1.5 text-sm text-charcoal shadow-soft focus:border-lavender focus:outline-none focus:ring-2 focus:ring-lavender-soft/40"
            />
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={cancelDelay}
              className="rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-charcoal/80 ring-1 ring-lavender-light/40 hover:bg-cream-light"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : mode === 'confirming-delete' ? (
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
            <div
              className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${statusPillClass[loop.status]}`}
            >
              {statusLabel[loop.status]}
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={primaryAction.onClick}
                aria-label={primaryAction.ariaLabel}
                className="rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-charcoal shadow-soft ring-1 ring-lavender-light/40 hover:bg-cream-light"
              >
                {primaryAction.label}
              </button>

              <button
                type="button"
                onClick={startDelay}
                className="rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-charcoal shadow-soft ring-1 ring-lavender-light/40 hover:bg-cream-light"
              >
                Delay
              </button>

              <button
                type="button"
                onClick={() => onTransition(loop.id, 'dropped')}
                className="rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-charcoal shadow-soft ring-1 ring-lavender-light/40 hover:bg-cream-light"
              >
                Drop
              </button>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-t border-lavender-light/30 pt-3">
            {footerLabel ? (
              <p className="text-[0.7rem] text-charcoal/45">{footerLabel}</p>
            ) : (
              <span aria-hidden />
            )}

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={startNote}
                aria-label={hasNote ? 'Edit note' : 'Add note'}
                className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-charcoal/85 ring-1 ring-lavender-light/40 transition duration-200 hover:bg-white hover:text-charcoal"
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

              <button
                type="button"
                onClick={startEdit}
                aria-label="Edit loop"
                className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-charcoal/85 ring-1 ring-lavender-light/40 transition duration-200 hover:bg-white hover:text-charcoal"
              >
                <svg
                  viewBox="0 0 16 16"
                  width="12"
                  height="12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M10.5 2.5l3 3L5 14H2v-3z" />
                  <path d="M9.5 3.5l3 3" />
                </svg>
                Edit
              </button>

              <button
                type="button"
                onClick={startDelete}
                aria-label="Delete loop"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-charcoal/55 transition duration-200 hover:bg-white/70 hover:text-charcoal"
              >
                <TrashIcon />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LoopCard;
