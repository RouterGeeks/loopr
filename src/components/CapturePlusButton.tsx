import type { FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const PlusIcon: FC = () => (
  <svg
    viewBox="0 0 16 16"
    width="18"
    height="18"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    aria-hidden="true"
  >
    <line x1="8" y1="3" x2="8" y2="13" />
    <line x1="3" y1="8" x2="13" y2="8" />
  </svg>
);

const CapturePlusButton: FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  // Hide on Dashboard — capture lives there already.
  if (pathname === '/') return null;

  return (
    <button
      type="button"
      onClick={() => navigate('/')}
      aria-label="Capture a thought"
      className="fixed bottom-24 right-5 z-30 inline-flex h-12 w-12 items-center justify-center rounded-sm bg-lavender-soft text-lavender-dark shadow-card ring-1 ring-charcoal/10 transition duration-200 hover:bg-lavender-soft/80 hover:shadow-card active:scale-95"
    >
      <PlusIcon />
    </button>
  );
};

export default CapturePlusButton;
