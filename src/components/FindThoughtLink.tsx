import type { SearchFilters } from '../lib/search';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { hasUpdateBlockers, useUpdateBlocked } from '../lib/updateSafety';

export default function FindThoughtLink({ query, filters, iconOnly = false, className = '' }: { query?: string; filters?: SearchFilters; iconOnly?: boolean; className?: string }) {
  const [warn, setWarn] = useState(false);
  const blocked = useUpdateBlocked();
  return <>
    <Link to="/find" state={query === undefined ? undefined : { query, ...filters }} aria-label={iconOnly ? 'Find a thought' : undefined} title={iconOnly ? 'Find a thought' : undefined} className={`${iconOnly ? 'inline-flex h-11 w-11 items-center justify-center rounded-md hover:bg-paper-light/60' : 'dots-link text-sm'} text-charcoal/70 ${className}`} onClick={event => {
      if (hasUpdateBlockers()) { event.preventDefault(); setWarn(true); }
      else setWarn(false);
    }}>{iconOnly ? <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m15.5 15.5 5 5" />
    </svg> : query === undefined ? 'Find a thought' : '← Back to search'}</Link>
    {warn && blocked && <p role="status" className="text-sm text-charcoal/80">Save your draft or close the open editor before searching.</p>}
  </>;
}
