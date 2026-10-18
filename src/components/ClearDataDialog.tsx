import { useEffect, useRef } from 'react';

export default function ClearDataDialog({ onCancel, onConfirm }: { onCancel: () => void; onConfirm: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const trigger = document.activeElement;
    const dialog = dialogRef.current;
    dialog?.showModal();
    cancelRef.current?.focus();
    return () => {
      dialog?.close();
      if (trigger instanceof HTMLElement && trigger.isConnected) trigger.focus();
    };
  }, []);
  return (
    <dialog ref={dialogRef} aria-labelledby="clear-title" aria-describedby="clear-description"
      onCancel={(event) => { event.preventDefault(); onCancel(); }}
      onKeyDown={(event) => {
        if (event.key !== 'Tab') return;
        const buttons = event.currentTarget.querySelectorAll<HTMLButtonElement>('button');
        const first = buttons[0];
        const last = buttons[buttons.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }}
      className="fixed inset-0 m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-sm overflow-y-auto rounded-lg border border-rule bg-paper-light p-6 text-charcoal shadow-card">
      <h2 id="clear-title" className="mb-2 text-lg font-semibold">Clear all data?</h2>
      <p id="clear-description" className="mb-6 text-charcoal/70">This will delete every thought on this device, across Do, Doing, Delayed, Done, and Dropped. This action cannot be undone. Unfinished capture drafts are separate; discard them on Dashboard.</p>
      <div className="flex flex-wrap gap-3">
        <button ref={cancelRef} type="button" onClick={onCancel} className="flex-1 rounded-md bg-paper-light px-4 py-3 font-semibold ring-1 ring-charcoal/20">Cancel</button>
        <button type="button" onClick={onConfirm} className="flex-1 rounded-md bg-charcoal px-4 py-3 font-semibold text-cream-light">Clear</button>
      </div>
    </dialog>
  );
}
