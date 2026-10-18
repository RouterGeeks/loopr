// Decorative Morse D: one dash followed by two dots. Never a status/control.
export default function DashDotDotMark({ className = '', sketch = false }: { className?: string; sketch?: boolean }) {
  return <svg className={className} viewBox={sketch ? '0 0 120 60' : '0 0 72 16'} fill="none" aria-hidden="true" focusable="false">
    {sketch ? <>
      <path d="M10 43 Q32 45 58 29" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <circle cx="79" cy="25" r="3.5" className="fill-lavender" />
      <circle cx="101" cy="21" r="3.5" className="fill-lavender" />
    </> : <>
      <path d="M2 8 H28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="46" cy="8" r="3" className="fill-lavender" />
      <circle cx="64" cy="8" r="3" className="fill-lavender" />
    </>}
  </svg>;
}
