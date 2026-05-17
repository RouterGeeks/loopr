import type { FC } from 'react';

interface SketchMountainProps {
  className?: string;
}

// Pencil-line mountain landscape: back range, front peak, a couple of
// trees on the foothills, three birds overhead, soft ground line.
// Used as the Dashboard's marginalia.
const SketchMountain: FC<SketchMountainProps> = ({ className = '' }) => (
  <svg
    className={className}
    viewBox="0 0 140 80"
    fill="none"
    aria-hidden="true"
  >
    <g
      stroke="#5B5B55"
      strokeWidth="1.1"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity="0.78"
    >
      {/* birds */}
      <g strokeWidth="0.9" opacity="0.75">
        <path d="M 18 14 Q 22 10, 26 14" />
        <path d="M 36 9 Q 41 5, 46 9" />
        <path d="M 56 16 Q 60 12, 64 16" />
      </g>

      {/* back mountain range */}
      <path d="M 4 50 L 22 38 L 38 46 L 50 35 L 68 47 L 82 32 L 100 50 L 118 40 L 135 48" />

      {/* front peak highlight (a couple of shading lines) */}
      <path d="M 82 32 L 87 39" strokeWidth="0.8" opacity="0.55" />
      <path d="M 50 35 L 54 41" strokeWidth="0.8" opacity="0.55" />

      {/* trees on foothills */}
      <g>
        {/* tree 1 */}
        <path d="M 96 60 L 96 53" />
        <path d="M 96 58 L 99 55 M 96 58 L 93 55" />
        <path d="M 96 55 L 98 53 M 96 55 L 94 53" />

        {/* tree 2 (smaller) */}
        <path d="M 104 60 L 104 55" />
        <path d="M 104 58 L 106 56 M 104 58 L 102 56" />

        {/* tree 3 (tiny) */}
        <path d="M 110 60 L 110 57" />
        <path d="M 110 59 L 111.5 58 M 110 59 L 108.5 58" />
      </g>

      {/* ground line */}
      <path
        d="M 4 65 Q 35 63, 70 65 Q 105 67, 135 64"
        strokeWidth="0.7"
        opacity="0.55"
      />

      {/* grass tufts */}
      <g strokeWidth="0.9" opacity="0.7">
        <path d="M 28 65 L 28 60" />
        <path d="M 31 65 L 32 61" />
        <path d="M 60 66 L 60 62" />
        <path d="M 75 66 L 75 62" />
        <path d="M 77 66 L 78 62" />
      </g>
    </g>
  </svg>
);

export default SketchMountain;
