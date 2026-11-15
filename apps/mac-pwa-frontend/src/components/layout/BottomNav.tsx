import { NavLink } from 'react-router-dom';
import type { ReactNode } from 'react';

interface BottomNavItem {
  to: string;
  icon: ReactNode;
  label: string;
}

interface BottomNavProps {
  items: BottomNavItem[];
}

export function BottomNav({ items }: BottomNavProps) {
  return (
    <nav
      aria-label="Navegació principal"
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-brand-700 bg-brand-500 pb-[env(safe-area-inset-bottom,0px)] md:hidden"
    >
      <ul className="grid" style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}>
        {items.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-1 py-2.5 text-xs font-medium transition-colors ${
                  isActive
                    ? 'text-accent-400'
                    : 'text-brand-100 hover:text-white'
                }`
              }
              end={item.to === '/'}
            >
              <span className="flex h-6 w-6 items-center justify-center">{item.icon}</span>
              <span className="truncate px-1">{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
