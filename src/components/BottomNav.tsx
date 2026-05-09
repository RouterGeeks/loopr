import React from 'react';
import { NavLink } from 'react-router-dom';

const BottomNav: React.FC = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-lavender shadow-soft">
      <div className="flex justify-around py-2">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex flex-col items-center py-2 px-4 rounded-lg transition-colors ${
              isActive ? 'bg-lavender text-white' : 'text-charcoal hover:bg-lavender-light'
            }`
          }
        >
          <span className="text-sm font-medium">Home</span>
        </NavLink>
        <NavLink
          to="/revisit"
          className={({ isActive }) =>
            `flex flex-col items-center py-2 px-4 rounded-lg transition-colors ${
              isActive ? 'bg-lavender text-white' : 'text-charcoal hover:bg-lavender-light'
            }`
          }
        >
          <span className="text-sm font-medium">Revisit</span>
        </NavLink>
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex flex-col items-center py-2 px-4 rounded-lg transition-colors ${
              isActive ? 'bg-lavender text-white' : 'text-charcoal hover:bg-lavender-light'
            }`
          }
        >
          <span className="text-sm font-medium">Settings</span>
        </NavLink>
      </div>
    </nav>
  );
};

export default BottomNav;