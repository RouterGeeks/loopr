import type { FC } from 'react';

interface HandUnderlineProps {
  className?: string;
  color?: 'lavender' | 'seafoam' | 'red' | 'ink';
}

const stroke: Record<NonNullable<HandUnderlineProps['color']>, string> = {
  lavender: '#6B5891',
  seafoam: '#7B8F66',
  red: '#B3604F',
  ink: '#232220',
};

const HandUnderline: FC<HandUnderlineProps> = ({
  className = '',
  color = 'lavender',
}) => (
  <svg
    className={className}
    viewBox="0 0 200 8"
    preserveAspectRatio="none"
    aria-hidden="true"
  >
    <path
      d="M 2 4.6 C 32 3.1, 64 5.3, 98 4.1 S 156 5.7, 198 3.9"
      stroke={stroke[color]}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      opacity="0.7"
    />
  </svg>
);

export default HandUnderline;
