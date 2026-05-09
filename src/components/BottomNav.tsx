import { FC } from 'react';
import { NavLink } from 'react-router-dom';

const BottomNav: FC = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-lavender-light shadow-card">
      <div className="flex justify-around py-3 px-2 safe">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex flex-col items-center py-3 px-6 rounded-xl transition-all duration-200 ${
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
            `flex flex-col items-center py-3 px-6 rounded-xl transition-all duration-200 ${
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
            `flex flex-col items-center py-3 px-6 rounded-xl transition-all duration-200 ${
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