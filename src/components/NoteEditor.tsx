import { useEffect, useRef, useState } from 'react';
import type { FC, KeyboardEvent } from 'react';

interface NoteEditorProps {
  loopId: number;
  initialValue: string;
  onSave: (value: string) => void;
  onCancel: () => void;
}

const NoteEditor: FC<NoteEditorProps> = ({
  loopId,
  initialValue,
  onSave,
  onCancel,
}) => {
  const [draft, setDraft] = useState(initialValue);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.focus();
    el.setSelectionRange(el.value.length, el.value.length);
  }, []);

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      onSave(draft);
    }
    if (event.key === 'Escape') {
      event.preventDefault();
      onCancel();
    }
  };

  return (
    <div className="space-y-3 rounded-2xl bg-white/60 p-4">
      <label
        htmlFor={`loop-note-${loopId}`}
        className="block text-xs font-semibold uppercase tracking-[0.2em] text-charcoal/70"
      >
        Note
      </label>

      <textarea
        id={`loop-note-${loopId}`}
        ref={textareaRef}
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={handleKeyDown}
        rows={3}
        placeholder="A small breadcrumb for later..."
        className="w-full rounded-2xl border border-lavender-soft/40 bg-white/90 p-3 text-sm leading-6 text-charcoal shadow-soft focus:border-lavender focus:outline-none focus:ring-2 focus:ring-lavender-soft/40"
      />

      <div className="flex flex-wrap items-center justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-charcoal/80 ring-1 ring-lavender-light/40 hover:bg-cream-light"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={() => onSave(draft)}
          className="rounded-full bg-[#3A3347] px-5 py-2 text-sm font-semibold text-[#F7EFE3] shadow-soft transition duration-200 hover:bg-[#2E2938]"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default NoteEditor;
