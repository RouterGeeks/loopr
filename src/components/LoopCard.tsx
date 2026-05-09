import { useEffect, useRef, useState } from 'react';
import type { FC } from 'react';

type LoopStatus = 'active' | 'delayed' | 'done' | 'dropped';

interface LoopItem {
  id: number;
  text: string;
  status: LoopStatus;
  revisitAt?: string;
}

interface LoopCardProps {
  loop: LoopItem;
  onAction: (id: number, action: 'done' | 'dropped') => void;
  onDelay: (id: number, revisitAt: string) => void;
  onEdit: (id: number, newText: string) => void;
  onDelete: (id: number) => void;
}

type CardMode = 'view' | 'editing' | 'choosing-delay' | 'confirming-delete';

type DelayPreset = 'tomorrow' | 'weekend' | 'nextWeek';

const statusLabel: Record<LoopStatus, string> = {
  active: 'Active',
  delayed: 'Delayed',
  done: 'Done',
  dropped: 'Dropped',
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

const relativeRevisitLabel = (iso: string, now: Date): string | null => {
  const target = new Date(iso);
  if (Number.isNaN(target.getTime())) return null;
  if (target.getTime() <= now.getTime()) return 'Due now';

  const daysDiff = Math.round(
    (startOfDay(target).getTime() - startOfDay(now).getTime()) / 86400000
  );
  if (daysDiff === 1) return 'Tomorrow';

  const todayDow = now.getDay();
  const targetDow = target.getDay();

  // "This weekend" mirrors the preset logic: Sun targets next Sat (+6);
  // Mon–Fri target upcoming Sat or Sun. Saturday's only future weekend day
  // is Sunday, which is already covered by "Tomorrow".
  const isThisWeekend = (() => {
    if (todayDow === 0) return daysDiff === 6 && targetDow === 6;
    if (todayDow === 6) return false;
    return (
      (daysDiff === 6 - todayDow && targetDow === 6) ||
      (daysDiff === 7 - todayDow && targetDow === 0)
    );
  })();
  if (isThisWeekend) return 'This weekend';

  // "Next week" = the upcoming Monday.
  const daysToNextMonday =
    todayDow === 1 ? 7 : (8 - todayDow) % 7 || 7;
  if (daysDiff === daysToNextMonday && targetDow === 1) return 'Next week';

  return `Scheduled for ${formatScheduledDate(iso)}`;
};

const LoopCard: FC<LoopCardProps> = ({
  loop,
  onAction,
  onDelay,
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

  const revisitSublabel = (() => {
    if (loop.status !== 'delayed' || !loop.revisitAt) return null;
    const text = relativeRevisitLabel(loop.revisitAt, new Date());
    if (!text) return null;
    return {
      text,
      tone: text === 'Due now' ? ('due' as const) : ('scheduled' as const),
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
    <div className="rounded-[1.75rem] bg-cream-surface shadow-card p-5">
      <div className="mb-4">
        <p className="text-base leading-7 text-charcoal">{loop.text}</p>

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

      {mode === 'choosing-delay' ? (
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
                onClick={startDelay}
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
