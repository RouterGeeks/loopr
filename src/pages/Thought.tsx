import { useEffect, useRef } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import FindThoughtLink from '../components/FindThoughtLink';
import PageContainer from '../components/PageContainer';
import LoopCard from '../components/LoopCard';
import ArchiveCard from '../components/ArchiveCard';
import StorageNotice from '../components/StorageNotice';
import { useLoopData } from '../lib/useLoopData';
import { stateLabel, type LoopItem, type LoopStatus } from '../lib/loops';


export default function Thought() {
  const { id } = useParams();
  const { state } = useLocation();
  const fromSearch = typeof state?.searchQuery === 'string';
  const data = useLoopData();
  const thought = data.loops.find(item => String(item.id) === id);
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => { heading.current?.focus(); window.scrollTo(0, 0); }, [id]);
  const edit = (id: number, change: Partial<LoopItem>) => data.setLoops(items => items.map(item => item.id === id ? { ...item, ...change } : item));
  const note = (id: number, value: string) => edit(id, { note: value.trim() || undefined });
  const remove = (id: number) => data.setLoops(items => items.filter(item => item.id !== id));
  const transition = (id: number, status: Exclude<LoopStatus, 'delayed'>) => {
    const now = new Date().toISOString();
    return edit(id, { status, ...(status === 'doing' ? { startedAt: now } : status === 'done' ? { doneAt: now } : status === 'dropped' ? { droppedAt: now } : {}) });
  };
  return <PageContainer>
    {fromSearch ? <FindThoughtLink query={state.searchQuery} /> : <Link className="dots-link" to={typeof state?.connectionOrigin === 'number' ? `/thoughts/${state.connectionOrigin}/connections` : '/'}>
      {typeof state?.connectionOrigin === 'number' ? '← Back to connections' : '← Dashboard'}
    </Link>}
    <h1 ref={heading} tabIndex={-1} className="mt-4 font-serif text-3xl">{thought ? 'Thought' : 'Thought unavailable'}</h1>
    <StorageNotice error={data.error} saving={data.saving} onReload={data.reload} />
    {thought ? <>
      <p className="mt-3 text-sm text-charcoal/70">{stateLabel[thought.status]}</p>
      <Link className="dots-link" to={`/thoughts/${thought.id}/connections`}>Connect the dots →</Link>
      {thought.status === 'done' || thought.status === 'dropped' ?
        <ArchiveCard key={`${id}-${thought.status}`} loop={thought} saving={data.saving} onRestore={id => edit(id, { status: 'do', doneAt: undefined, droppedAt: undefined })} onEditNote={note} onDelete={remove} /> :
        <LoopCard key={`${id}-${thought.status}`} loop={thought} saving={data.saving} onTransition={transition} onDelay={(id, revisitAt) => edit(id, { status: 'delayed', revisitAt })} onEdit={(id, text) => edit(id, { text })} onEditNote={note} onDelete={remove} />}
    </> : <p className="mt-4">This thought may have been deleted or replaced by a restored backup.</p>}
  </PageContainer>;
}
