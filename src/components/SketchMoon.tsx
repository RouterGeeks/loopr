import type { FC } from 'react';

interface SketchMoonProps {
  className?: string;
}

// Crescent moon with a couple of small stars — for the Delayed page.
const SketchMoon: FC<SketchMoonProps> = ({ className = '' }) => (
  <svg
    className={className}
    viewBox="0 0 64 64"
    fill="none"
    aria-hidden="true"
  >
    <g
      stroke="#6B5891"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity="0.85"
    >
      {/* crescent moon (open to the right) */}
      <path d="M 40 12 C 28 14, 20 23, 20 33 C 20 44, 28 53, 40 55 C 31 49, 26 42, 26 33 C 26 24, 31 17, 40 12 Z" />

      {/* stars */}
      <g strokeWidth="1.1" opacity="0.75">
        <path d="M 12 18 L 12 24 M 9 21 L 15 21" />
        <path d="M 52 22 L 52 27 M 49.5 24.5 L 54.5 24.5" />
        <path d="M 48 46 L 48 50 M 46 48 L 50 48" />
      </g>
    </g>
  </svg>
);

export default SketchMoon;
