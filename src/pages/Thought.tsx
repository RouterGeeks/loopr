import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useParams, useNavigate } from 'react-router-dom';
import { hasUpdateBlockers, useUpdateBlocked } from '../lib/updateSafety';
import { LabelEditor, LabelChips } from '../components/ThoughtLabels';
import FindThoughtLink from '../components/FindThoughtLink';
import PageContainer from '../components/PageContainer';
import LoopCard from '../components/LoopCard';
import ArchiveCard from '../components/ArchiveCard';
import StorageNotice from '../components/StorageNotice';
import { useLoopData } from '../lib/useLoopData';
import { stateLabel, type LoopItem, type LoopStatus } from '../lib/loops';


export default function Thought() {
  const { id } = useParams();
  const { state, pathname } = useLocation();
  const navigate = useNavigate();
  const editingLabels = pathname.endsWith('/labels');
  const fromSearch = typeof state?.searchQuery === 'string';
  const [labelWarning, setLabelWarning] = useState(false);
  const blocked = useUpdateBlocked();
  const data = useLoopData();
  const thought = data.loops.find(item => String(item.id) === id);
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => { if (!editingLabels) heading.current?.focus(); window.scrollTo(0, 0); }, [id, editingLabels]);
  const edit = (id: number, change: Partial<LoopItem>) => data.setLoops(items => items.map(item => item.id === id ? { ...item, ...change } : item));
  const note = (id: number, value: string) => edit(id, { note: value.trim() || undefined });
  const remove = (id: number) => data.setLoops(items => items.filter(item => item.id !== id));
  const transition = (id: number, status: Exclude<LoopStatus, 'delayed'>) => {
    const now = new Date().toISOString();
    return edit(id, { status, ...(status === 'doing' ? { startedAt: now } : status === 'done' ? { doneAt: now } : status === 'dropped' ? { droppedAt: now } : {}) });
  };
  return <PageContainer>
    {fromSearch ? <FindThoughtLink query={state.searchQuery} filters={state.searchFilters} /> : <Link className="dots-link" to={typeof state?.connectionOrigin === 'number' ? `/thoughts/${state.connectionOrigin}/connections` : '/'}>
      {typeof state?.connectionOrigin === 'number' ? '← Back to connections' : '← Dashboard'}
    </Link>}
    <h1 ref={heading} tabIndex={-1} className="mt-4 font-serif text-3xl">{thought ? 'Thought' : 'Thought unavailable'}</h1>
    <StorageNotice error={data.error} saving={data.saving} onReload={data.reload} />
    {thought ? <>
      <p className="mt-3 text-sm text-charcoal/70">{stateLabel[thought.status]}</p>
      {!editingLabels && <>
        {labelWarning && blocked && <p role="status" className="text-sm">Save or close your open editor before editing labels.</p>}
        <LabelChips labels={thought.labels ?? []} />
        <Link className="dots-link mr-4" to={`/thoughts/${thought.id}/labels`} state={state} onClick={event => { if (hasUpdateBlockers()) { event.preventDefault(); setLabelWarning(true); } }}>Edit labels</Link>
      </>}
      {editingLabels && <p className="mt-3 break-words font-serif text-lg">{thought.text}</p>}
      {editingLabels ? <LabelEditor key={thought.id} thought={thought} thoughts={data.loops} saving={data.saving}
        onSave={labels => edit(thought.id, { labels: labels.length ? labels : undefined })}
        onCancel={() => navigate(`/thoughts/${thought.id}`, { replace: true, state })} /> : <>
      <Link className="dots-link" to={`/thoughts/${thought.id}/connections`}>Connect the dots →</Link>
      {thought.status === 'done' || thought.status === 'dropped' ?
        <ArchiveCard key={`${id}-${thought.status}`} loop={thought} saving={data.saving} onRestore={id => edit(id, { status: 'do', doneAt: undefined, droppedAt: undefined })} onEditNote={note} onDelete={remove} /> :
        <LoopCard key={`${id}-${thought.status}`} loop={thought} saving={data.saving} onTransition={transition} onDelay={(id, revisitAt) => edit(id, { status: 'delayed', revisitAt })} onEdit={(id, text) => edit(id, { text })} onEditNote={note} onDelete={remove} />}
      </>}
    </> : <p className="mt-4">This thought may have been deleted or replaced by a restored backup.</p>}
  </PageContainer>;
}
