import type { FC } from 'react';

interface SketchKnobProps {
  className?: string;
}

// A small dial knob with tick marks — for the Dials page.
const SketchKnob: FC<SketchKnobProps> = ({ className = '' }) => (
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
      {/* outer dial */}
      <circle cx="32" cy="32" r="18" />

      {/* inner notch / indicator pointing up-right */}
      <line x1="32" y1="32" x2="42" y2="22" strokeWidth="1.6" />

      {/* indicator dot */}
      <circle cx="42" cy="22" r="1.8" fill="#6B5891" stroke="none" />

      {/* tick marks around the dial */}
      <g strokeWidth="1" opacity="0.65">
        <line x1="32" y1="6" x2="32" y2="10" />
        <line x1="32" y1="54" x2="32" y2="58" />
        <line x1="6" y1="32" x2="10" y2="32" />
        <line x1="54" y1="32" x2="58" y2="32" />

        <line x1="14" y1="14" x2="17" y2="17" />
        <line x1="50" y1="14" x2="47" y2="17" />
        <line x1="14" y1="50" x2="17" y2="47" />
        <line x1="50" y1="50" x2="47" y2="47" />
      </g>
    </g>
  </svg>
);

export default SketchKnob;
