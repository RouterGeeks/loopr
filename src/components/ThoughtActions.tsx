import { useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useUpdateBlocker } from '../lib/updateSafety';

// A disclosure with ordinary links/buttons: Tab follows document order.
// Keeping it out of card mode avoids moving focus back on outside dismissal.
export default function ThoughtActions({ id, contextId, hasNote, onNote, onEdit, onDelete }: {
  id: number; contextId: string; hasNote: boolean; onNote: () => void; onEdit?: () => void; onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const root = useRef<HTMLDivElement>(null);
  const panelId = `thought-actions-${id}`;
  useUpdateBlocker(open);

  useLayoutEffect(() => {
    if (!open) return;
    const place = () => {
      if (!panel.current || !trigger.current) return;
      const viewport = window.visualViewport;
      const left = viewport?.offsetLeft ?? 0;
      const top = viewport?.offsetTop ?? 0;
      const width = viewport?.width ?? window.innerWidth;
      const bottom = top + (viewport?.height ?? window.innerHeight);
      const navTop = document.querySelector('nav[aria-label="Main navigation"]')?.getBoundingClientRect().top ?? bottom;
      const limit = Math.min(bottom, navTop) - 8;
      const anchor = trigger.current.getBoundingClientRect();
      const el = panel.current;
      el.style.maxWidth = `${width - 24}px`;
      el.style.maxHeight = `${Math.max(44, limit - top - 8)}px`;
      const rect = el.getBoundingClientRect();
      el.style.left = `${Math.max(left + 12, Math.min(anchor.right - rect.width, left + width - rect.width - 12))}px`;
      const preferred = anchor.top - rect.height - 6;
      el.style.top = `${Math.max(top + 8, Math.min(preferred >= top + 8 ? preferred : anchor.bottom + 6, limit - rect.height))}px`;
    };
    place();
    panel.current?.querySelector<HTMLElement>('a, button')?.focus({ preventScroll: true });
    const outside = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    const focusAway = (event: FocusEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    const scroll = (event: Event) => {
      if (!panel.current?.contains(event.target as Node)) place();
    };
    document.addEventListener('pointerdown', outside, true);
    document.addEventListener('focusin', focusAway);
    window.addEventListener('scroll', scroll, true);
    window.addEventListener('resize', place);
    window.visualViewport?.addEventListener('resize', place);
    return () => {
      document.removeEventListener('pointerdown', outside, true);
      document.removeEventListener('focusin', focusAway);
      window.removeEventListener('scroll', scroll, true);
      window.removeEventListener('resize', place);
      window.visualViewport?.removeEventListener('resize', place);
    };
  }, [open]);

  return <div ref={root} onKeyDown={event => {
    if (event.key === 'Escape' && open) {
      event.preventDefault(); event.stopPropagation(); setOpen(false); trigger.current?.focus();
    }
  }}>
    <button ref={trigger} type="button" data-focus="more" aria-label="More actions"
      aria-describedby={contextId} aria-expanded={open} aria-controls={open ? panelId : undefined}
      onClick={() => setOpen(value => !value)} className="inline-flex h-11 w-11 items-center justify-center rounded-full text-charcoal/70 hover:bg-paper-light">
      <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true">
        <circle cx="3.5" cy="8" r="1.2" /><circle cx="8" cy="8" r="1.2" /><circle cx="12.5" cy="8" r="1.2" />
      </svg>
    </button>
    {open && <div ref={panel} id={panelId} role="group" aria-label="Thought actions" aria-describedby={contextId} className="thought-actions">
      <button type="button" onClick={() => { setOpen(false); onNote(); }}>{hasNote ? 'Edit note' : 'Add note'}</button>
      <Link to={`/thoughts/${id}/connections`} onClick={() => setOpen(false)}>Connect the dots</Link>
      <Link to={`/thoughts/${id}/labels`} onClick={() => setOpen(false)}>Edit labels</Link>
      {onEdit && <button type="button" onClick={() => { setOpen(false); onEdit(); }}>Edit thought</button>}
      <button type="button" onClick={() => { setOpen(false); onDelete(); }}>Delete thought</button>
    </div>}
  </div>;
}
