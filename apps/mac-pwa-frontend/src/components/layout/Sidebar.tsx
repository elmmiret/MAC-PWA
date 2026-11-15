import type { ReactNode } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { NavItem } from './NavItem';
import { LogoutIcon } from '../icons';

interface SidebarItem {
  to: string;
  icon: ReactNode;
  label: string;
}

interface SidebarProps {
  items: SidebarItem[];
}

export function Sidebar({ items }: SidebarProps) {
  const { user, isAdmin, logout } = useAuth();

  return (
    <aside className="fixed left-0 top-0 hidden h-screen w-64 flex-col bg-brand-500 text-white md:flex">
      <div className="flex h-16 items-center gap-3 border-b border-brand-600 px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-500 text-brand-500">
          <span className="text-lg font-black">M</span>
        </div>
        <div>
          <p className="text-sm font-bold leading-tight">MAC</p>
          <p className="text-xs text-brand-200">Portal del club</p>
        </div>
      </div>

      <nav aria-label="Navegació principal" className="flex-1 overflow-y-auto px-4 py-6">
        <ul className="space-y-1">
          {items.map((item) => (
            <li key={item.to}>
              <NavItem to={item.to} icon={item.icon} label={item.label} />
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t border-brand-600 p-4">
        <div className="mb-3 rounded-xl bg-brand-600 p-3">
          <p className="truncate text-sm font-medium">{user?.nom ?? user?.emailPrincipal}</p>
          <p className="text-xs text-brand-200">{isAdmin ? 'Administrador' : 'Atleta'}</p>
        </div>
        <button
          type="button"
          onClick={logout}
          className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-brand-100 transition-colors hover:bg-brand-600 hover:text-white"
        >
          <span aria-hidden="true" className="flex h-6 w-6 items-center justify-center">
            <LogoutIcon className="h-5 w-5" />
          </span>
          Tancar sessió
        </button>
      </div>
    </aside>
  );
}
