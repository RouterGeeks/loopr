import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import PageContainer from '../components/PageContainer';
import StorageNotice from '../components/StorageNotice';
import { useLoopData } from '../lib/useLoopData';
import { allLabels, labelKey, stateLabel } from '../lib/loops';
import { findThoughts, searchExcerpt, filterError, type SearchFilters } from '../lib/search';

export default function Find() {
  const data = useLoopData();
  const location = useLocation();
  const navigate = useNavigate();
  // Session history retains the query on Back without placing private text in URLs.
  const query = typeof location.state?.query === 'string' ? location.state.query : '';
  const filters: SearchFilters = {
    labels: Array.isArray(location.state?.labels) ? location.state.labels.filter((label: unknown): label is string => typeof label === 'string') : [],
    from: typeof location.state?.from === 'string' ? location.state.from : '',
    to: typeof location.state?.to === 'string' ? location.state.to : '',
  };
  const [filtersOpen, setFiltersOpen] = useState(false);
  const availableLabels = allLabels(data.loops);
  const dateError = filterError(filters);
  const hasFilters = Boolean(filters.labels?.length || filters.from || filters.to);
  const [limit, setLimit] = useState(20);
  const heading = useRef<HTMLHeadingElement>(null);
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => { heading.current?.focus(); window.scrollTo(0, 0); }, []);
  const change = (value: string, nextFilters = filters) => {
    setLimit(20);
    navigate('/find', { replace: true, state: { query: value, ...nextFilters } });
  };
  const results = findThoughts(data.loops, query, filters);
  const searched = query.trim().length > 0 || hasFilters;
  return <PageContainer>
    <h1 ref={heading} tabIndex={-1} className="font-serif text-3xl">Find a thought</h1>
    <p id="find-help" className="my-3 text-sm text-charcoal/70">Search saved thoughts and notes in every state. Your search stays on this device.</p>
    <label htmlFor="find-query" className="block mb-2 text-sm">Words to find</label>
    <input ref={input} id="find-query" type="search" value={query} onChange={event => change(event.target.value)} aria-describedby="find-help" autoComplete="off" className="w-full min-h-11 rounded-md border border-rule bg-paper-light p-3" />
    <div className="my-2 flex flex-wrap gap-3">
      {query && <button className="dots-link text-sm" onClick={() => { change(''); input.current?.focus(); }}>Clear search</button>}
      <button className="dots-link text-sm" aria-expanded={filtersOpen} aria-controls="find-filters" onClick={() => setFiltersOpen(value => !value)}>Filters</button>
      {hasFilters && <button className="dots-link text-sm" onClick={() => change(query, {})}>Clear filters</button>}
    </div>
    {filtersOpen && <section id="find-filters" aria-label="Search filters" className="my-3 space-y-4 rounded-md border border-rule p-3">
      <fieldset>
        <legend className="text-sm">Labels — match any selected label</legend>
        <div className="mt-2 max-h-56 overflow-y-auto">{availableLabels.map(label => <label key={labelKey(label)} className="label-filter flex min-h-11 items-center gap-3 break-all py-2 text-sm">
          <input type="checkbox" checked={filters.labels?.some(value => labelKey(value) === labelKey(label)) ?? false} onChange={() => {
            const selected = filters.labels ?? [];
            change(query, { ...filters, labels: selected.some(value => labelKey(value) === labelKey(label)) ? selected.filter(value => labelKey(value) !== labelKey(label)) : [...selected, label] });
          }} />{label}
        </label>)}</div>
        {!availableLabels.length && <p className="mt-2 text-sm text-charcoal/70">No labels yet. Add one from a thought’s More menu.</p>}
      </fieldset>
      <fieldset className="min-w-0 space-y-2">
        <legend className="text-sm">Captured date</legend>
        <p id="date-help" className="text-sm text-charcoal/70">Includes both dates, using this device’s time zone. Leave either end blank for an open range.</p>
        <label className="block text-sm">From<input type="date" value={filters.from} onChange={event => change(query, { ...filters, from: event.target.value })} aria-describedby="date-help date-error" aria-invalid={Boolean(dateError)} className="mt-1 block min-h-11 w-full min-w-0 rounded-md border border-rule p-2" /></label>
        <label className="block text-sm">To<input type="date" value={filters.to} onChange={event => change(query, { ...filters, to: event.target.value })} aria-describedby="date-help date-error" aria-invalid={Boolean(dateError)} className="mt-1 block min-h-11 w-full min-w-0 rounded-md border border-rule p-2" /></label>
      </fieldset>
    </section>}
    <div aria-label="Active filters" className="flex flex-wrap gap-2">
      {filters.labels?.map(label => <button key={label} className="dots-button break-all text-sm" aria-label={`Remove label filter ${label}`} onClick={() => change(query, { ...filters, labels: filters.labels?.filter(value => value !== label) })}>{label} ×</button>)}
      {filters.from && <button className="dots-button text-sm" onClick={() => change(query, { ...filters, from: '' })}>From {filters.from} ×</button>}
      {filters.to && <button className="dots-button text-sm" onClick={() => change(query, { ...filters, to: '' })}>To {filters.to} ×</button>}
    </div>
    <p id="date-error" role="status" className="text-sm">{dateError}</p>
    <StorageNotice error={data.error} saving={data.saving} onReload={data.reload} />
    {data.readable && !dateError && <>
      <p role="status" className="my-4 text-sm text-charcoal/70">{!searched ? 'Type a few words to find a saved thought.' : results.length ? `${results.length} ${results.length === 1 ? 'thought' : 'thoughts'} found.` : hasFilters ? 'No matching thoughts. Try another word or adjust your filters.' : 'No matching thoughts. Try another word.'}</p>
      <ul aria-label="Search results" className="divide-y divide-rule">
        {results.slice(0, limit).map(thought => <li key={thought.id}>
          <Link to={`/thoughts/${thought.id}`} state={{ searchQuery: query, searchFilters: filters }} className="block min-h-11 rounded-md py-4 break-words">
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
