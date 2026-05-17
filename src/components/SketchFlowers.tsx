import type { FC } from 'react';

interface SketchFlowersProps {
  className?: string;
}

// A small clump of wildflowers + grass. Pencil-line, lavender + sage.
// Used in the Dashboard empty state alongside a handwritten note.
const SketchFlowers: FC<SketchFlowersProps> = ({ className = '' }) => (
  <svg
    className={className}
    viewBox="0 0 80 80"
    fill="none"
    aria-hidden="true"
  >
    {/* ground hint */}
    <g stroke="#5B5B55" strokeWidth="0.7" strokeLinecap="round" opacity="0.45">
      <path d="M 6 70 Q 30 68, 50 70 Q 65 71, 74 69" />
    </g>

    {/* grass tufts */}
    <g
      stroke="#7B8F66"
      strokeWidth="1"
      strokeLinecap="round"
      opacity="0.85"
    >
      <path d="M 12 70 L 12 62" />
      <path d="M 15 70 L 16 60" />
      <path d="M 18 70 L 17 63" />
      <path d="M 60 70 L 60 64" />
      <path d="M 63 70 L 64 62" />
      <path d="M 66 70 L 65 64" />
    </g>

    {/* stems */}
    <g
      stroke="#7B8F66"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      opacity="0.85"
    >
      <path d="M 28 70 C 27 60, 30 50, 28 38" />
      <path d="M 40 70 C 41 60, 38 48, 40 32" />
      <path d="M 50 70 C 51 62, 48 54, 51 44" />

      {/* leaf */}
      <path d="M 28 56 C 22 54, 19 50, 21 46 C 25 49, 28 52, 28 54" />
      <path d="M 40 50 C 46 48, 49 44, 47 40 C 43 43, 40 46, 40 48" />
    </g>

    {/* flower heads */}
    <g
      stroke="#6B5891"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      opacity="0.85"
    >
      {/* daisy 1 (small) */}
      <g transform="translate(28 36)">
        <circle cx="0" cy="0" r="1.6" fill="#6B5891" stroke="none" opacity="0.55" />
        <path d="M 0 -5 L 0 -2.5" />
        <path d="M 0 5 L 0 2.5" />
        <path d="M -5 0 L -2.5 0" />
        <path d="M 5 0 L 2.5 0" />
        <path d="M -3.5 -3.5 L -1.8 -1.8" />
        <path d="M 3.5 3.5 L 1.8 1.8" />
        <path d="M -3.5 3.5 L -1.8 1.8" />
        <path d="M 3.5 -3.5 L 1.8 -1.8" />
      </g>

      {/* daisy 2 (tallest) */}
      <g transform="translate(40 30)">
        <circle cx="0" cy="0" r="2" fill="#6B5891" stroke="none" opacity="0.6" />
        <path d="M 0 -6 L 0 -3" />
        <path d="M 0 6 L 0 3" />
        <path d="M -6 0 L -3 0" />
        <path d="M 6 0 L 3 0" />
        <path d="M -4.5 -4.5 L -2 -2" />
        <path d="M 4.5 4.5 L 2 2" />
        <path d="M -4.5 4.5 L -2 2" />
        <path d="M 4.5 -4.5 L 2 -2" />
      </g>

      {/* daisy 3 (smaller) */}
      <g transform="translate(50 42)">
        <circle cx="0" cy="0" r="1.6" fill="#6B5891" stroke="none" opacity="0.55" />
        <path d="M 0 -5 L 0 -2.5" />
        <path d="M 0 5 L 0 2.5" />
        <path d="M -5 0 L -2.5 0" />
        <path d="M 5 0 L 2.5 0" />
        <path d="M -3.5 -3.5 L -1.8 -1.8" />
        <path d="M 3.5 3.5 L 1.8 1.8" />
      </g>
    </g>
  </svg>
);

export default SketchFlowers;
