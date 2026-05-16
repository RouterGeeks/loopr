import { NavLink } from 'react-router-dom';
import type { FC, ReactNode } from 'react';

const linkClass = (isActive: boolean) =>
  `flex flex-col items-center gap-1 rounded-3xl px-2 py-2.5 transition-all duration-200 ${
    isActive
      ? 'bg-lavender-soft text-lavender-dark shadow-soft'
      : 'text-charcoal hover:bg-cream-light hover:text-lavender-dark/80'
  }`;

const iconProps = {
  width: 22,
  height: 22,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
};

const DashboardIcon = (): ReactNode => (
  <svg {...iconProps}>
    <path d="M3.5 11L12 4l8.5 7" />
    <path d="M5.5 9.5V20h13V9.5" />
  </svg>
);

const DoingIcon = (): ReactNode => (
  <svg {...iconProps}>
    <circle cx="12" cy="12" r="8.5" />
    <circle cx="12" cy="12" r="2.75" fill="currentColor" stroke="none" />
  </svg>
);

const DelayedIcon = (): ReactNode => (
  <svg {...iconProps}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </svg>
);

const DoneIcon = (): ReactNode => (
  <svg {...iconProps}>
    <rect x="3.5" y="5" width="17" height="3.5" rx="0.8" />
    <path d="M5 8.5V19h14V8.5" />
    <line x1="10" y1="13" x2="14" y2="13" />
  </svg>
);

const DialsIcon = (): ReactNode => (
  <svg {...iconProps}>
    <line x1="3.5" y1="7" x2="20.5" y2="7" />
    <circle cx="16" cy="7" r="2.2" fill="currentColor" stroke="none" />
    <line x1="3.5" y1="12" x2="20.5" y2="12" />
    <circle cx="8" cy="12" r="2.2" fill="currentColor" stroke="none" />
    <line x1="3.5" y1="17" x2="20.5" y2="17" />
    <circle cx="14" cy="17" r="2.2" fill="currentColor" stroke="none" />
  </svg>
);

const BottomNav: FC = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-cream shadow-nav border-t border-lavender-light/30 backdrop-blur-sm">
      <div className="flex justify-around py-3 px-1 pb-safe">
        <NavLink to="/" className={({ isActive }) => linkClass(isActive)} end>
          <DashboardIcon />
          <span className="text-xs font-semibold">Dashboard</span>
        </NavLink>

        <NavLink
          to="/doing"
          className={({ isActive }) => linkClass(isActive)}
        >
          <DoingIcon />
          <span className="text-xs font-semibold">Doing</span>
        </NavLink>

        <NavLink
          to="/delayed"
          className={({ isActive }) => linkClass(isActive)}
        >
          <DelayedIcon />
          <span className="text-xs font-semibold">Delayed</span>
        </NavLink>

        <NavLink
          to="/done"
          className={({ isActive }) => linkClass(isActive)}
        >
          <DoneIcon />
          <span className="text-xs font-semibold">Done</span>
        </NavLink>

        <NavLink
          to="/dials"
          className={({ isActive }) => linkClass(isActive)}
        >
          <DialsIcon />
          <span className="text-xs font-semibold">Dials</span>
        </NavLink>
      </div>
    </nav>
  );
};

export default BottomNav;
