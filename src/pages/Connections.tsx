import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ThoughtConstellation from '../components/ThoughtConstellation';
import PageContainer from '../components/PageContainer';
import StorageNotice from '../components/StorageNotice';
import { connectedThoughts, setConnection, sharedLabels, stateLabel, type LoopItem } from '../lib/loops';
import { useLoopData } from '../lib/useLoopData';
import { useUpdateBlocker } from '../lib/updateSafety';

export default function Connections() {
  const { id } = useParams();
  // Reset view/search when moving to another thought's neighborhood.
  return <ConnectionView key={id} id={id ?? ''} />;
}

function ConnectionView({ id }: { id: string }) {
  const data = useLoopData();
  const thought = data.loops.find(item => String(item.id) === id);
  const [view, setView] = useState<'graph' | 'list'>('graph');
  const [adding, setAdding] = useState(false);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(0);
  const [suggestionLimit, setSuggestionLimit] = useState(10);
  const [message, setMessage] = useState('');
  const heading = useRef<HTMLHeadingElement>(null);
  const listButton = useRef<HTMLButtonElement>(null);
  const search = useRef<HTMLInputElement>(null);
  const sharedSummary = useRef<HTMLElement>(null);
  const addButton = useRef<HTMLButtonElement>(null);
  useUpdateBlocker(adding);
  useEffect(() => { heading.current?.focus(); window.scrollTo(0, 0); }, []);
  useEffect(() => { if (adding) search.current?.focus(); }, [adding]);
  const linked = thought ? connectedThoughts(data.loops, thought.id) : [];
  const suggestions = thought ? data.loops.filter(item => item.id !== thought.id && sharedLabels(thought, item).length && !linked.some(link => link.id === item.id)) : [];
  const candidates = data.loops.filter(item => item.id !== thought?.id && !linked.some(other => other.id === item.id) && item.text.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()));
  const currentPage = Math.min(page, Math.max(0, Math.ceil(linked.length / 4) - 1));
  const shown = linked.slice(currentPage * 4, currentPage * 4 + 4);
  const close = () => { setAdding(false); setQuery(''); addButton.current?.focus(); };
  const connect = async (item: LoopItem, value: boolean) => {
    if (!thought) return;
    if (await data.setLoops(items => setConnection(items, thought.id, item.id, value))) {
      setMessage(value ? 'Connection saved.' : 'Connection removed. Both thoughts are kept.');
      if (value) { if (adding) close(); else sharedSummary.current?.focus(); } else listButton.current?.focus();
    }
  };

  return <PageContainer>
    <Link className="dots-link" to={thought ? `/thoughts/${thought.id}` : '/'}>{thought ? '← Back to thought' : '← Dashboard'}</Link>
    <h1 ref={heading} tabIndex={-1} className="mt-3 font-serif text-3xl">Connect the dots</h1>
    <StorageNotice error={data.error} saving={data.saving} onReload={data.reload} />
    {!thought ? <p className="mt-5">This thought is no longer available. Its connections may have changed in another tab or backup.</p> : <>
      <p className="mt-3 font-serif text-lg">{thought.text}</p>
      <p className="mt-2 text-sm text-charcoal/70">Connections you choose. Tap a dot to open its thought.</p>
      <div className="my-5 flex gap-2" role="group" aria-label="Connection view">
        {(['graph', 'list'] as const).map(option => <button key={option} ref={option === 'list' ? listButton : undefined} aria-pressed={view === option} onClick={() => setView(option)} className={`dots-button flex-1 ${view === option ? 'bg-lavender/40' : ''}`}>{option === 'graph' ? 'Graph' : 'List'}</button>)}
      </div>
      {view === 'graph' ? <ThoughtConstellation thought={thought} neighbors={shown} /> : <ul className="divide-y divide-rule">
        {linked.map(item => <li key={item.id} className="py-3">
          <Link className="dots-link font-serif" to={`/thoughts/${item.id}`} state={{ connectionOrigin: thought.id }}>{item.text} →</Link>
          <div className="flex flex-wrap items-center justify-between gap-2"><span className="text-sm text-charcoal/70">{stateLabel[item.status]}</span><button className="dots-button text-sm" disabled={data.saving} aria-label={`Remove connection: ${item.text}`} onClick={() => connect(item, false)}>Remove connection</button></div>
        </li>)}
      </ul>}
      {view === 'graph' && linked.length > 4 && <div className="my-4 flex flex-wrap items-center justify-center gap-2">
        <button className="dots-button" disabled={currentPage === 0} onClick={() => setPage(currentPage - 1)}>Previous</button>
        <span className="text-sm" aria-live="polite">{currentPage * 4 + 1}–{Math.min(currentPage * 4 + 4, linked.length)} of {linked.length}</span>
        <button className="dots-button" disabled={(currentPage + 1) * 4 >= linked.length} onClick={() => setPage(currentPage + 1)}>Next</button>
      </div>}
      {linked.length === 0 && <p className="my-5 text-sm text-charcoal/70">No connections yet. Choose another thought that belongs with this one.</p>}
      {view === 'graph' && linked.length > 0 && <p className="my-4 text-sm text-charcoal/70">Each line connects directly to this thought. Use List for full text or to remove a connection.</p>}
      <details className="my-4 border-t border-rule pt-3">
        <summary ref={sharedSummary} className="min-h-11 cursor-pointer py-3 text-sm">Shared labels</summary>
        <p className="text-sm text-charcoal/70">Related themes, not saved connections. Choose Connect to add a line.</p>
        {!thought.labels?.length ? <p className="my-3 text-sm">Add labels to this thought to find others with shared themes.</p> : !suggestions.length ? <p className="my-3 text-sm">No unconnected thoughts share these labels yet.</p> : <ul className="divide-y divide-rule">
          {suggestions.slice(0, suggestionLimit).map(item => <li key={item.id} className="py-3">
            <Link className="dots-link break-words font-serif" to={`/thoughts/${item.id}`} state={{ connectionOrigin: thought.id }}>{item.text}</Link>
            <p className="break-words text-sm text-charcoal/70">Also labeled {sharedLabels(thought, item).join(', ')} · {stateLabel[item.status]}</p>
            <button className="dots-button mt-2 text-sm" disabled={data.saving} aria-label={`Connect shared thought: ${item.text}`} onClick={() => connect(item, true)}>Connect</button>
          </li>)}
        </ul>}
        {suggestions.length > suggestionLimit && <button className="dots-button" onClick={() => setSuggestionLimit(value => value + 10)}>Show more suggestions</button>}
      </details>
      <p role="status" className="my-3 text-sm">{message}</p>
      <button ref={addButton} className="dots-button bg-lavender/40 w-full" disabled={adding || data.saving} onClick={() => setAdding(true)}>Connect a thought</button>
      {adding && <section aria-label="Choose a thought" className="mt-5 border-t border-rule pt-4" onKeyDown={event => { if (event.key === 'Escape') close(); }}>
        <label htmlFor="connection-search" className="block text-sm mb-2">Find a thought</label>
        <input ref={search} id="connection-search" value={query} onChange={event => setQuery(event.target.value)} type="search" className="w-full rounded-md border border-rule p-3" />
        <p className="my-3 text-sm text-charcoal/70">Choose one to connect. Thoughts in every state are included.</p>
        <button className="dots-button" onClick={close}>Cancel</button>
        <ul className="divide-y divide-rule mt-3">
          {candidates.slice(0, 20).map(item => <li key={item.id}><button disabled={data.saving} className="w-full text-left py-4 px-2" aria-label={`Connect: ${item.text}`} onClick={() => connect(item, true)}><span className="block font-serif break-words">{item.text}</span><span className="text-xs text-charcoal/70">{stateLabel[item.status]}</span></button></li>)}
        </ul>
        {candidates.length > 20 && <p className="text-sm">Showing 20 thoughts. Search to narrow the list.</p>}
        {candidates.length === 0 && <p className="my-4 text-sm">No matching unconnected thoughts. Try another search or capture a new thought on Dashboard.</p>}
      </section>}
    </>}
  </PageContainer>;
}
