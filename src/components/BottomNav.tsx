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

const HomeIcon = (): ReactNode => (
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

const RevisitIcon = (): ReactNode => (
  <svg {...iconProps}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </svg>
);

const ResolvedIcon = (): ReactNode => (
  <svg {...iconProps}>
    <rect x="3.5" y="5" width="17" height="3.5" rx="0.8" />
    <path d="M5 8.5V19h14V8.5" />
    <line x1="10" y1="13" x2="14" y2="13" />
  </svg>
);

const SettingsIcon = (): ReactNode => (
  <svg {...iconProps}>
    <circle cx="12" cy="12" r="3" />
    <path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.2 5.2l2.1 2.1M16.7 16.7l2.1 2.1M5.2 18.8l2.1-2.1M16.7 7.3l2.1-2.1" />
  </svg>
);

const BottomNav: FC = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-cream shadow-nav border-t border-lavender-light/30 backdrop-blur-sm">
      <div className="flex justify-around py-3 px-1 pb-safe">
        <NavLink to="/" className={({ isActive }) => linkClass(isActive)} end>
          <HomeIcon />
          <span className="text-xs font-semibold">Home</span>
        </NavLink>

        <NavLink
          to="/doing"
          className={({ isActive }) => linkClass(isActive)}
        >
          <DoingIcon />
          <span className="text-xs font-semibold">Doing</span>
        </NavLink>

        <NavLink
          to="/revisit"
          className={({ isActive }) => linkClass(isActive)}
        >
          <RevisitIcon />
          <span className="text-xs font-semibold">Revisit</span>
        </NavLink>

        <NavLink
          to="/archive"
          className={({ isActive }) => linkClass(isActive)}
        >
          <ResolvedIcon />
          <span className="text-xs font-semibold">Resolved</span>
        </NavLink>

        <NavLink
          to="/settings"
          className={({ isActive }) => linkClass(isActive)}
        >
          <SettingsIcon />
          <span className="text-xs font-semibold">Settings</span>
        </NavLink>
      </div>
    </nav>
  );
};

export default BottomNav;
