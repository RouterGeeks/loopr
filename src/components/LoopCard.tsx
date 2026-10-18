import { useEffect, useRef, useState } from 'react';
import type { FC } from 'react';
import type { LoopItem, LoopStatus } from '../lib/loops';
import NoteEditor from './NoteEditor';
import { revisitLabel, revisitGroup, scheduledContext } from '../lib/resurfacing';
import { useCardFocus } from '../lib/useCardFocus';
import { readRevisitTime, presetDate, scheduledDate, localDate, timeLabel } from '../lib/scheduling';
import type { DelayPreset } from '../lib/scheduling';

type TransitionStatus = Exclude<LoopStatus, 'delayed'>;

interface LoopCardProps {
  loop: LoopItem;
  saving?: boolean;
  nowTime?: number;
  onTransition: (id: number, status: TransitionStatus) => Promise<boolean>;
  onDelay: (id: number, revisitAt: string) => Promise<boolean>;
  onEdit: (id: number, newText: string) => Promise<boolean>;
  onEditNote: (id: number, note: string) => Promise<boolean>;
  onDelete: (id: number) => Promise<boolean>;
}

type CardMode =
  | 'view'
  | 'editing'
  | 'editing-note'
  | 'choosing-delay'
  | 'confirming-delete'
  | 'menu';

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

const MoreIcon: FC = () => (
  <svg
    viewBox="0 0 16 16"
    width="14"
    height="14"
    fill="currentColor"
    aria-hidden="true"
  >
    <circle cx="3.5" cy="8" r="1.2" />
    <circle cx="8" cy="8" r="1.2" />
    <circle cx="12.5" cy="8" r="1.2" />
  </svg>
);

const CloseIcon: FC = () => (
  <svg
    viewBox="0 0 16 16"
    width="13"
    height="13"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    aria-hidden="true"
  >
    <line x1="4" y1="4" x2="12" y2="12" />
    <line x1="12" y1="4" x2="4" y2="12" />
  </svg>
);

const LoopCard: FC<LoopCardProps> = ({
  loop,
  saving = false,
  nowTime,
  onTransition,
  onDelay,
  onEdit,
  onEditNote,
  onDelete,
}) => {
  const [mode, setMode] = useState<CardMode>('view');
  const cardRef = useCardFocus(mode);
  const contextId = `loop-context-${loop.id}`;
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
    departTimerRef.current = window.setTimeout(async () => {
      departTimerRef.current = null;
      if (!await onTransition(loop.id, 'doing')) setDeparting(false);
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

  const saveEdit = async () => {
    const trimmed = draft.trim();
    if (!trimmed || trimmed === loop.text) {
      setMode('view');
      return;
    }
    if (!await onEdit(loop.id, trimmed)) return;
    setMode('view');
  };

  const startNote = () => setMode('editing-note');
  const cancelNote = () => setMode('view');
  const saveNote = async (value: string) => {
    if (!await onEditNote(loop.id, value)) return;
    setMode('view');
  };

  const [delayTime, setDelayTime] = useState('09:00');
  const [delayDate, setDelayDate] = useState('');
  const [defaultTime, setDefaultTime] = useState('09:00');
  const [delayError, setDelayError] = useState('');
  const startDelay = () => {
    const preference = readRevisitTime();
    const existing = loop.status === 'delayed' && loop.revisitAt ? new Date(loop.revisitAt) : null;
    const valid = existing && Number.isFinite(existing.getTime());
    setDefaultTime(preference.time);
    setDelayTime(valid ? `${String(existing.getHours()).padStart(2, '0')}:${String(existing.getMinutes()).padStart(2, '0')}` : preference.time);
    setDelayDate(valid ? localDate(existing) : '');
    setDelayError(preference.error);
    setMode('choosing-delay');
  };
  const cancelDelay = () => setMode('view');
  const applyPreset = async (preset: DelayPreset) => {
    try {
      const date = presetDate(preset, defaultTime);
      if (!await onDelay(loop.id, date.toISOString())) return;
      setMode('view');
    } catch (cause) { setDelayError((cause as Error).message); }
  };
  const applyCustomDate = async () => {
    try {
      const date = scheduledDate(delayDate, delayTime);
      if (date.getTime() <= Date.now()) throw new Error('Choose a future date and time.');
      if (!await onDelay(loop.id, date.toISOString())) return;
      setMode('view');
    } catch (cause) { setDelayError((cause as Error).message); }
  };

  const startDelete = () => setMode('confirming-delete');
  const cancelDelete = () => setMode('view');
  const confirmDelete = () => onDelete(loop.id);

  const canSaveEdit = draft.trim().length > 0;
  const hasNote = Boolean(loop.note && loop.note.trim());
  const notePreview = hasNote ? loop.note!.split('\n')[0].trim() : '';

  const now = nowTime === undefined ? new Date() : new Date(nowTime);

  const revisitSublabel = loop.status === 'delayed' ? {
    text: revisitLabel(loop, now.getTime()),
    ready: revisitGroup(loop, now.getTime()) === 'ready',
  } : null;

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
      <div ref={cardRef} className="py-5">
        <span id={contextId} className="sr-only">{loop.text}</span>
        <label htmlFor={`loop-edit-${loop.id}`} className="sr-only">
          Edit loop
        </label>

        <textarea
          id={`loop-edit-${loop.id}`}
          ref={textareaRef}
          readOnly={saving}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          rows={3}
          className="edit-field mb-4 block w-full rounded-md border border-rule bg-transparent p-3 font-serif text-lg leading-relaxed text-charcoal placeholder:text-charcoal/70"
        />

        <div className="flex flex-wrap items-center justify-end gap-2">
          <button aria-describedby={contextId}
            type="button"
            onClick={cancelEdit}
            className="rounded-full bg-paper-light/90 px-4 py-2 text-sm font-semibold text-charcoal/80 ring-1 ring-charcoal/10 hover:bg-cream-light"
          >
            Cancel
          </button>

          <button aria-describedby={contextId}
            type="button"
            onClick={saveEdit}
            disabled={!canSaveEdit}
            className={`rounded-md px-5 py-2 text-sm font-semibold transition duration-200 ${
              canSaveEdit
                ? 'bg-charcoal text-cream-light shadow-soft hover:bg-charcoal-soft'
                : 'cursor-not-allowed bg-paper-edge text-charcoal/35'
            }`}
          >
            Save
          </button>
        </div>
      </div>
    );
  }

  return (
    <div ref={cardRef} role="group" aria-labelledby={contextId}
      className={`py-5 transition-all duration-200 ease-out motion-reduce:transition-none ${
        departing ? 'pointer-events-none -translate-y-1 opacity-0' : ''
      }`}
    >
      <div className="mb-4">
        <p id={contextId} className="font-serif text-lg leading-relaxed text-charcoal">
          {loop.text}
        </p>

        {hasNote && mode !== 'editing-note' && (
          <p className="mt-1.5 truncate border-l-2 border-rule pl-3 font-serif text-sm italic text-charcoal/70">
            {notePreview}
          </p>
        )}

        {revisitSublabel && (
          <p
            className={`mt-2 text-xs font-semibold uppercase tracking-[0.2em] ${
              revisitSublabel.ready
                ? 'text-lavender-dark'
                : 'text-charcoal/70'
            }`}
          >
            {revisitSublabel.text}
          </p>
        )}
      </div>

      {revisitSublabel?.ready && (
        <p className="mb-3 text-xs text-charcoal/70">{scheduledContext(loop)}</p>
      )}

      {mode === 'editing-note' ? (
        <NoteEditor
          saving={saving}
          loopId={loop.id}
          initialValue={loop.note ?? ''}
          onSave={saveNote}
          onCancel={cancelNote}
        />
      ) : mode === 'choosing-delay' ? (
        <div data-panel className="space-y-3 rounded-md border border-rule bg-paper-light/60 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-charcoal/70">
            When should we revisit?
          </p>

          <div className="flex flex-wrap gap-2">
            <button aria-describedby={contextId}
              type="button"
              onClick={() => applyPreset('tomorrow')}
              className="rounded-full bg-paper-light/90 px-4 py-2 text-sm font-semibold text-charcoal shadow-soft ring-1 ring-charcoal/10 hover:bg-cream-light"
            >
              Tomorrow · {timeLabel(defaultTime)}
            </button>

            <button aria-describedby={contextId}
              type="button"
              onClick={() => applyPreset('weekend')}
              className="rounded-full bg-paper-light/90 px-4 py-2 text-sm font-semibold text-charcoal shadow-soft ring-1 ring-charcoal/10 hover:bg-cream-light"
            >
              This weekend · {timeLabel(defaultTime)}
            </button>

            <button aria-describedby={contextId}
              type="button"
              onClick={() => applyPreset('nextWeek')}
              className="rounded-full bg-paper-light/90 px-4 py-2 text-sm font-semibold text-charcoal shadow-soft ring-1 ring-charcoal/10 hover:bg-cream-light"
            >
              Next week · {timeLabel(defaultTime)}
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
              min={localDate(new Date())}
              value={delayDate}
              onChange={(event) => setDelayDate(event.target.value)}
              className="min-h-11 min-w-0 max-w-full rounded-md border border-rule bg-paper-light/90 px-3 py-1.5 text-sm text-charcoal shadow-soft focus:border-lavender/60 focus:outline-none focus:ring-2 focus:ring-lavender-soft/40"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <label htmlFor={`delay-time-${loop.id}`} className="text-sm">Time</label>
            <input id={`delay-time-${loop.id}`} type="time" value={delayTime} onChange={event => setDelayTime(event.target.value)} className="min-h-11 max-w-full rounded-md border border-rule bg-paper-light px-3 text-base" />
          </div>
          <p className="text-sm text-charcoal/70">Times use your local timezone. Quick choices use your default time.</p>
          {delayError && <p role="alert" className="text-sm text-charcoal">{delayError}</p>}
          <div className="flex flex-wrap justify-end gap-2 pt-1">
            <button type="button" disabled={saving || !delayDate || !delayTime} onClick={applyCustomDate} className="min-h-11 rounded-md bg-lavender/25 px-4 text-sm font-semibold disabled:opacity-50">Schedule revisit</button>
            <button aria-describedby={contextId}
              type="button"
              onClick={cancelDelay}
              className="rounded-full bg-paper-light/90 px-4 py-2 text-sm font-semibold text-charcoal/80 ring-1 ring-charcoal/10 hover:bg-cream-light"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : mode === 'confirming-delete' ? (
        <div data-panel className="rounded-md border border-rule bg-paper-light/60 p-4">
          <p className="mb-3 text-sm leading-6 text-charcoal/80">
            Delete this loop? This can't be undone.
          </p>

          <div className="flex flex-wrap items-center justify-end gap-2">
            <button aria-describedby={contextId}
              type="button"
              onClick={cancelDelete}
              className="rounded-full bg-paper-light/90 px-4 py-2 text-sm font-semibold text-charcoal/80 ring-1 ring-charcoal/10 hover:bg-cream-light"
            >
              Cancel
            </button>

            <button aria-describedby={contextId}
              type="button"
              onClick={confirmDelete}
              className="rounded-md bg-charcoal px-4 py-2 text-sm font-semibold text-cream-light transition duration-200 hover:bg-charcoal-soft"
            >
              Delete
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-end gap-3">
            <div className="flex flex-wrap gap-2">
              <button aria-describedby={contextId}
                type="button"
                onClick={primaryAction.onClick}
                aria-label={primaryAction.ariaLabel}
                className="rounded-full bg-paper-light/90 px-4 py-2 text-sm font-semibold text-charcoal shadow-soft ring-1 ring-charcoal/10 hover:bg-cream-light"
              >
                {primaryAction.label}
              </button>

              <button aria-describedby={contextId}
                type="button"
                data-focus="delay" onClick={startDelay}
                className="rounded-full bg-paper-light/90 px-4 py-2 text-sm font-semibold text-charcoal shadow-soft ring-1 ring-charcoal/10 hover:bg-cream-light"
              >
                Delay
              </button>

              <button aria-describedby={contextId}
                type="button"
                onClick={() => onTransition(loop.id, 'dropped')}
                className="rounded-full bg-paper-light/90 px-4 py-2 text-sm font-semibold text-charcoal shadow-soft ring-1 ring-charcoal/10 hover:bg-cream-light"
              >
                Drop
              </button>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
            {footerLabel ? (
              <p className="text-xs text-charcoal/70">{footerLabel}</p>
            ) : (
              <span aria-hidden />
            )}

            <div className="flex flex-wrap items-center gap-1.5">
              <button aria-describedby={contextId}
                type="button"
                onClick={startNote}
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

              {mode === 'menu' ? (
                <div id={`loop-actions-${loop.id}`} className="contents">
                  <button aria-describedby={contextId}
                    type="button"
                    onClick={startEdit}
                    aria-label="Edit loop"
                    className="inline-flex items-center gap-1.5 rounded-full bg-paper-light/70 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-charcoal/85 ring-1 ring-charcoal/10 transition duration-200 hover:bg-paper-light hover:text-charcoal"
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

                  <button aria-describedby={contextId}
                    type="button"
                    onClick={startDelete}
                    aria-label="Delete loop"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full text-charcoal/70 transition duration-200 hover:bg-paper-light hover:text-charcoal"
                  >
                    <TrashIcon />
                  </button>

                </div>
              ) : null}
              <button aria-describedby={contextId}
                data-focus="more"
                type="button"
                onClick={() => setMode(mode === 'menu' ? 'view' : 'menu')}
                aria-label={mode === 'menu' ? 'Close actions' : 'More actions'}
                aria-expanded={mode === 'menu'}
                aria-controls={mode === 'menu' ? `loop-actions-${loop.id}` : undefined}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full text-charcoal/70 hover:bg-paper-light"
              >
                {mode === 'menu' ? <CloseIcon /> : <MoreIcon />}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LoopCard;
