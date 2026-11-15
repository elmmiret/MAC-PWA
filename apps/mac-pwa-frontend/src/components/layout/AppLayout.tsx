import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { BottomNav } from './BottomNav';
import { Sidebar } from './Sidebar';
import {
  CardIcon,
  GearIcon,
  GridIcon,
  HomeIcon,
  TrophyIcon,
  UserIcon,
} from '../icons';
import type { ReactNode } from 'react';

interface NavItemDef {
  to: string;
  label: string;
  icon: ReactNode;
  adminOnly?: boolean;
}

const ALL_NAV_ITEMS: NavItemDef[] = [
  { to: '/', label: 'Inici', icon: <HomeIcon className="h-5 w-5" />, adminOnly: true },
  { to: '/perfil', label: 'Perfil', icon: <UserIcon className="h-5 w-5" /> },
  { to: '/pagaments', label: 'Pagaments', icon: <CardIcon className="h-5 w-5" /> },
  { to: '/rankings', label: 'Rankings', icon: <TrophyIcon className="h-5 w-5" /> },
  { to: '/categories', label: 'Categories', icon: <GridIcon className="h-5 w-5" />, adminOnly: true },
  { to: '/quotes-config', label: 'Quotes', icon: <GearIcon className="h-5 w-5" />, adminOnly: true },
];

function readSuccessMessage(state: unknown): string | null {
  if (typeof state !== 'object' || state === null || !('successMessage' in state)) return null;
  return typeof state.successMessage === 'string' ? state.successMessage : null;
}

export function AppLayout() {
  const { isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const successMessage = readSuccessMessage(location.state);

  const items = useMemo(
    () => ALL_NAV_ITEMS.filter((item) => !item.adminOnly || isAdmin),
    [isAdmin],
  );

  return (
    <div className="min-h-screen bg-cream pb-20 md:pb-0 md:pl-64">
      <Sidebar items={items} />
      <BottomNav items={items} />

      <a
        href="#main-content"
        className="sr-only z-[60] rounded-lg bg-surface px-4 py-3 font-semibold text-brand-700 shadow-lg focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Ves a contingut
      </a>

      <main id="main-content" tabIndex={-1} className="min-h-screen p-4 md:p-6 lg:p-8">
        <div className="mx-auto max-w-6xl">
          {successMessage && (
            <div role="status" aria-live="polite" className="mb-6 flex min-h-12 items-center justify-between gap-3 rounded-xl border border-green-300 bg-green-50 px-4 py-2 text-sm font-medium text-green-900">
              <span>{successMessage}</span>
              <button
                type="button"
                aria-label="Tanca l’avís"
                onClick={() => navigate(
                  { pathname: location.pathname, search: location.search, hash: location.hash },
                  { replace: true, state: null },
                )}
                className="min-h-11 min-w-11 rounded-lg text-lg leading-none text-green-900 hover:bg-green-100"
              >
                ×
              </button>
            </div>
          )}
          <Outlet />
        </div>
      </main>
    </div>
  );
}
