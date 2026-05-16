import type { FC } from 'react';

interface SketchCoffeeProps {
  className?: string;
}

// Small mug with three rising steam curls — for the Doing page.
const SketchCoffee: FC<SketchCoffeeProps> = ({ className = '' }) => (
  <svg
    className={className}
    viewBox="0 0 60 72"
    fill="none"
    aria-hidden="true"
  >
    <g
      stroke="#7B8F66"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity="0.85"
    >
      {/* steam curls */}
      <path d="M 19 24 C 17 20, 21 18, 19 14 C 17 10, 21 8, 20 4" opacity="0.6" />
      <path d="M 30 24 C 32 20, 28 18, 30 14 C 32 10, 28 8, 29 4" opacity="0.6" />
      <path d="M 41 24 C 39 20, 43 18, 41 14 C 39 10, 43 8, 42 4" opacity="0.6" />

      {/* mug top rim */}
      <path d="M 13 30 Q 30 27, 47 30" />

      {/* mug body */}
      <path d="M 14 30 L 16 58 Q 17 64, 23 64 L 37 64 Q 43 64, 44 58 L 46 30" />

      {/* handle */}
      <path d="M 46 36 Q 56 38, 55 46 Q 54 52, 45 51" />

      {/* faint surface line */}
      <path d="M 18 35 Q 30 33, 42 35" opacity="0.4" strokeWidth="0.7" />
    </g>
  </svg>
);

export default SketchCoffee;
