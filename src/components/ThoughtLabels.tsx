import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { allLabels, cleanLabel, labelKey, type LoopItem } from '../lib/loops';
import { hasUpdateBlockers, useUpdateBlocked, useUpdateBlocker } from '../lib/updateSafety';

export function LabelEditor({ thought, thoughts, saving, onSave, onCancel }: {
  thought: LoopItem; thoughts: LoopItem[]; saving: boolean;
  onSave: (labels: string[]) => Promise<boolean>; onCancel: () => void;
}) {
  const [selected, setSelected] = useState(thought.labels ?? []);
  const [draft, setDraft] = useState('');
  const [error, setError] = useState('');
  const input = useRef<HTMLInputElement>(null);
  useUpdateBlocker(true);
  useEffect(() => { input.current?.focus(); }, []);
  const existing = allLabels(thoughts);
  const toggle = (label: string) => setSelected(values => values.some(value => labelKey(value) === labelKey(label)) ? values.filter(value => labelKey(value) !== labelKey(label)) : [...values, label]);
  const add = () => {
    const label = cleanLabel(draft);
    if (!label || label.length > 40) { setError('Use 1–40 characters for a label.'); return; }
    const canonical = existing.find(value => labelKey(value) === labelKey(label)) ?? label;
    setSelected(values => values.some(value => labelKey(value) === labelKey(canonical)) ? values : [...values, canonical]);
    setDraft(''); setError(''); input.current?.focus();
  };
  return <section aria-label="Edit labels" className="my-4 space-y-3 rounded-md border border-rule p-4" onKeyDown={event => {
    if (event.key === 'Escape' && !saving) { event.preventDefault(); onCancel(); }
  }}>
    <h2 className="font-serif text-xl">Edit labels</h2>
    <p className="text-sm text-charcoal/70">Optional themes, in your own words. Changes apply to this thought only.</p>
    <fieldset disabled={saving} className="space-y-3">
      <legend className="sr-only">Choose labels</legend>
      <div className="flex flex-wrap gap-2">{selected.map(label => <button key={labelKey(label)} type="button" className="dots-button break-all text-sm" aria-label={`Remove label ${label}`} onClick={() => toggle(label)}>{label} ×</button>)}</div>
      <label htmlFor="new-label" className="block text-sm">Find or create a label</label>
      <input ref={input} id="new-label" value={draft} onChange={event => { setDraft(event.target.value); setError(''); }} onKeyDown={event => {
        if (event.key === 'Enter') { event.preventDefault(); add(); }
      }} className="w-full min-w-0 rounded-md border border-rule p-3" autoComplete="off" />
      <button type="button" className="dots-button" onClick={add} disabled={!draft.trim()}>Add label</button>
      <div className="flex flex-wrap gap-2">{existing.filter(label => !selected.some(value => labelKey(value) === labelKey(label)) && labelKey(label).includes(labelKey(draft))).slice(0, 20).map(label =>
        <button key={labelKey(label)} type="button" className="dots-button break-all text-sm" onClick={() => { toggle(label); setDraft(''); }}>{label}</button>)}</div>
      {existing.length > 20 && <p className="text-sm">Type to narrow existing labels.</p>}
      {error && <p role="alert" className="text-sm">{error}</p>}
      <div className="flex flex-wrap gap-2">
        <button type="button" className="dots-button" onClick={onCancel}>Cancel labels</button>
        <button type="button" className="dots-button bg-lavender/40" onClick={async () => {
          if (draft.trim()) { setError('Add the typed label or clear the field before saving.'); return; }
          if (await onSave(selected)) onCancel();
        }}>Save labels</button>
      </div>
    </fieldset>
  </section>;
}

export function LabelChips({ labels }: { labels: string[] }) {
  const [warn, setWarn] = useState(false);
  const blocked = useUpdateBlocked();
  return <><div aria-label="Labels" className="my-3 flex flex-wrap gap-2">{labels.map(label =>
    <Link key={labelKey(label)} className="dots-button inline-flex items-center break-all text-sm" onClick={event => { if (hasUpdateBlockers()) { event.preventDefault(); setWarn(true); } }} to="/find" state={{ query: '', labels: [label] }}>{label}</Link>)}</div>{warn && blocked && <p role="status" className="text-sm">Save or close your open editor before filtering.</p>}</>;
}
