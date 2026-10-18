import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import PageContainer from '../components/PageContainer';
import StorageNotice from '../components/StorageNotice';
import { useLoopData } from '../lib/useLoopData';
import { stateLabel } from '../lib/loops';
import { findThoughts, searchExcerpt } from '../lib/search';

export default function Find() {
  const data = useLoopData();
  const location = useLocation();
  const navigate = useNavigate();
  // Session history retains the query on Back without placing private text in URLs.
  const query = typeof location.state?.query === 'string' ? location.state.query : '';
  const [limit, setLimit] = useState(20);
  const heading = useRef<HTMLHeadingElement>(null);
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => { heading.current?.focus(); window.scrollTo(0, 0); }, []);
  const change = (value: string) => {
    setLimit(20);
    navigate('/find', { replace: true, state: { query: value } });
  };
  const results = findThoughts(data.loops, query);
  const searched = query.trim().length > 0;
  return <PageContainer>
    <h1 ref={heading} tabIndex={-1} className="font-serif text-3xl">Find a thought</h1>
    <p id="find-help" className="my-3 text-sm text-charcoal/70">Search saved thoughts and notes in every state. Your search stays on this device.</p>
    <label htmlFor="find-query" className="block mb-2 text-sm">Words to find</label>
    <input ref={input} id="find-query" type="search" value={query} onChange={event => change(event.target.value)} aria-describedby="find-help" autoComplete="off" className="w-full min-h-11 rounded-md border border-rule bg-paper-light p-3" />
    {query && <button className="dots-link text-sm" onClick={() => { change(''); input.current?.focus(); }}>Clear search</button>}
    <StorageNotice error={data.error} saving={data.saving} onReload={data.reload} />
    {data.readable && <>
      <p role="status" className="my-4 text-sm text-charcoal/70">{!searched ? 'Type a few words to find a saved thought.' : results.length ? `${results.length} ${results.length === 1 ? 'thought' : 'thoughts'} found.` : 'No matching thoughts. Try another word.'}</p>
      <ul aria-label="Search results" className="divide-y divide-rule">
        {results.slice(0, limit).map(thought => <li key={thought.id}>
          <Link to={`/thoughts/${thought.id}`} state={{ searchQuery: query }} className="block min-h-11 rounded-md py-4 break-words">
            <span className="block font-serif text-lg">{searchExcerpt(thought.text, query)}</span>
            {thought.note && <span className="mt-1 block text-sm text-charcoal/80">Note: {searchExcerpt(thought.note, query)}</span>}
            <span className="mt-2 block text-sm text-charcoal/70">{stateLabel[thought.status]} · Open thought →</span>
          </Link>
        </li>)}
      </ul>
      {results.length > limit && <button className="dots-button mt-4" onClick={() => setLimit(limit + 20)}>Show more thoughts</button>}
    </>}
  </PageContainer>;
}
