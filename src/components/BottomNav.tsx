import { NavLink } from 'react-router-dom';
import type { FC, ReactNode } from 'react';
import HandUnderline from './HandUnderline';

const linkClass = (isActive: boolean) =>
  `relative flex min-w-0 flex-col items-center gap-1 px-1 pt-3 pb-3 transition-colors duration-200 ${
    isActive ? 'text-charcoal' : 'text-charcoal/55 hover:text-charcoal'
  }`;

const iconProps = {
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
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

const ActiveMark: FC = () => (
  <HandUnderline
    className="absolute bottom-1.5 left-1/2 h-1.5 w-10 -translate-x-1/2"
  />
);

interface NavItem {
  to: string;
  end?: boolean;
  label: string;
  Icon: FC;
}

const items: NavItem[] = [
  { to: '/', end: true, label: 'Dashboard', Icon: DashboardIcon },
  { to: '/doing', label: 'Doing', Icon: DoingIcon },
  { to: '/delayed', label: 'Delayed', Icon: DelayedIcon },
  { to: '/done', label: 'Done', Icon: DoneIcon },
  { to: '/dials', label: 'Dials', Icon: DialsIcon },
];

const BottomNav: FC = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-paper-shell/95 backdrop-blur-md">
      <div className="grid grid-cols-5 gap-1 px-2 pb-safe">
        {items.map(({ to, end, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => linkClass(isActive)}
          >
            {({ isActive }) => (
              <>
                {isActive && <ActiveMark />}
                <Icon />
                <span className="text-[11px] font-medium tracking-tight sm:text-xs">
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
