export default function StorageNotice({ error, saving, onReload }: { error: string; saving: boolean; onReload: () => void }) {
  return <div aria-live="polite" className="text-sm text-charcoal/80">
    {error && <div className="my-4 space-y-2 rounded-md border border-rule p-3">
      <p role="alert">{error}</p>
      <button type="button" onClick={onReload} disabled={saving} className="rounded-md px-3 py-2 underline">Review latest saved thoughts</button>
      <p>Keep this page open to retain an unsaved draft. If a thought was removed elsewhere, copy its draft before reviewing.</p>
    </div>}
  </div>;
}
