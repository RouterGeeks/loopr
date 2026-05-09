import { FC } from 'react';
import { NavLink } from 'react-router-dom';

const BottomNav: FC = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-cream shadow-nav border-t border-lavender-light/30 backdrop-blur-sm">
      <div className="flex justify-around py-4 px-4 pb-safe">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 rounded-3xl px-5 py-3 transition-all duration-200 ${
              isActive
                ? 'bg-lavender-soft text-lavender-dark shadow-soft'
                : 'text-charcoal hover:bg-cream-light hover:text-lavender-dark/80'
            }`
          }
        >
          <span className="text-sm font-semibold">Home</span>
        </NavLink>
        <NavLink
          to="/revisit"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 rounded-3xl px-5 py-3 transition-all duration-200 ${
              isActive
                ? 'bg-lavender-soft text-lavender-dark shadow-soft'
                : 'text-charcoal hover:bg-cream-light hover:text-lavender-dark/80'
            }`
          }
        >
          <span className="text-sm font-semibold">Revisit</span>
        </NavLink>
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 rounded-3xl px-5 py-3 transition-all duration-200 ${
              isActive
                ? 'bg-lavender-soft text-lavender-dark shadow-soft'
                : 'text-charcoal hover:bg-cream-light hover:text-lavender-dark/80'
            }`
          }
        >
          <span className="text-sm font-semibold">Settings</span>
        </NavLink>
      </div>
    </nav>
  );
};

export default BottomNav;