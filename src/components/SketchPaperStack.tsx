import type { FC } from 'react';

interface SketchPaperStackProps {
  className?: string;
}

// Two slightly-rotated paper rectangles with a check mark — for Done.
const SketchPaperStack: FC<SketchPaperStackProps> = ({ className = '' }) => (
  <svg
    className={className}
    viewBox="0 0 60 64"
    fill="none"
    aria-hidden="true"
  >
    <g
      stroke="#232220"
      strokeWidth="1.1"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity="0.75"
    >
      {/* back sheet, slightly rotated left */}
      <g transform="rotate(-4 30 32)">
        <path d="M 12 12 L 42 12 L 42 50 L 12 50 Z" />
        <path d="M 17 21 L 36 21" opacity="0.55" strokeWidth="0.9" />
        <path d="M 17 27 L 36 27" opacity="0.55" strokeWidth="0.9" />
        <path d="M 17 33 L 30 33" opacity="0.55" strokeWidth="0.9" />
      </g>

      {/* front sheet, slightly rotated right with check mark */}
      <g transform="rotate(3 30 32)">
        <path d="M 14 18 L 46 18 L 46 56 L 14 56 Z" fill="#F7F5F0" />
        <path d="M 14 18 L 46 18 L 46 56 L 14 56 Z" />
        <path
          d="M 22 38 L 28 44 L 40 30"
          stroke="#7B8F66"
          strokeWidth="1.6"
        />
      </g>
    </g>
  </svg>
);

export default SketchPaperStack;
