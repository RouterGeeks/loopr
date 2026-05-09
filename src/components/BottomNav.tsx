import { FC } from 'react';
import { NavLink } from 'react-router-dom';

const BottomNav: FC = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-cream shadow-card border-t border-lavender-light/50 backdrop-blur-sm">
      <div className="flex justify-around py-4 px-3 pb-safe">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 py-3 px-5 rounded-2xl transition-all duration-200 ${
              isActive
                ? 'bg-lavender text-white shadow-soft scale-105'
                : 'text-charcoal hover:bg-cream-light hover:text-lavender-dark'
            }`
          }
        >
          <span className="text-sm font-semibold">Home</span>
        </NavLink>
        <NavLink
          to="/revisit"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 py-3 px-5 rounded-2xl transition-all duration-200 ${
              isActive
                ? 'bg-lavender text-white shadow-soft scale-105'
                : 'text-charcoal hover:bg-cream-light hover:text-lavender-dark'
            }`
          }
        >
          <span className="text-sm font-semibold">Revisit</span>
        </NavLink>
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 py-3 px-5 rounded-2xl transition-all duration-200 ${
              isActive
                ? 'bg-lavender text-white shadow-soft scale-105'
                : 'text-charcoal hover:bg-cream-light hover:text-lavender-dark'
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