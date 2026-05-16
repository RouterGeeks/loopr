import type { FC } from 'react';
import { useSpeechCapture } from '../lib/useSpeechCapture';

interface MicButtonProps {
  onText: (text: string) => void;
  label?: string;
}

const MicIcon: FC = () => (
  <svg
    viewBox="0 0 24 24"
    width="14"
    height="14"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="9" y="3" width="6" height="11" rx="3" />
    <path d="M5 11v1a7 7 0 0 0 14 0v-1" />
    <line x1="12" y1="19" x2="12" y2="22" />
  </svg>
);

const MicButton: FC<MicButtonProps> = ({ onText, label = 'Voice capture' }) => {
  const { status, errorMessage, start, stop, supported } = useSpeechCapture({
    onFinalText: onText,
  });

  if (!supported) return null;

  const listening = status === 'listening';

  const handleClick = () => {
    if (listening) stop();
    else start();
  };

  return (
    <span className="inline-flex items-center gap-2">
      <button
        type="button"
        onClick={handleClick}
        aria-label={label}
        aria-pressed={listening}
        className={`inline-flex items-center justify-center rounded-full p-2 ring-1 transition duration-200 ${
          listening
            ? 'bg-lavender-soft text-lavender-dark ring-lavender shadow-soft'
            : 'bg-white/70 text-charcoal/85 ring-lavender-light/40 hover:bg-white hover:text-charcoal'
        }`}
      >
        <MicIcon />
      </button>

      {listening && (
        <span
          aria-live="polite"
          className="text-xs text-charcoal/55"
        >
          Listening…
        </span>
      )}

      {!listening && errorMessage && (
        <span
          aria-live="polite"
          className="text-xs text-charcoal/55"
        >
          {errorMessage}
        </span>
      )}
    </span>
  );
};

export default MicButton;
