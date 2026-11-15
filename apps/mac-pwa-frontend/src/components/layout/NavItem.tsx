import { NavLink } from 'react-router-dom';
import type { ReactNode } from 'react';

interface NavItemProps {
  to: string;
  icon: ReactNode;
  label: string;
  collapsed?: boolean;
}

export function NavItem({ to, icon, label, collapsed = false }: NavItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
          isActive
            ? 'bg-accent-500/10 text-accent-600'
            : 'text-brand-100 hover:bg-brand-600 hover:text-white'
        }`
      }
      end={to === '/'}
    >
      <span className="flex h-6 w-6 shrink-0 items-center justify-center">{icon}</span>
      {!collapsed && <span>{label}</span>}
    </NavLink>
  );
}
