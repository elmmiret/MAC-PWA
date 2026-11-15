import { Outlet } from 'react-router-dom';
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

export function AppLayout() {
  const { isAdmin } = useAuth();

  const items = ALL_NAV_ITEMS.filter((item) => !item.adminOnly || isAdmin);

  return (
    <div className="min-h-screen bg-cream pb-20 md:pb-0 md:pl-64">
      <Sidebar items={items} />
      <BottomNav items={items} />

      <main className="min-h-screen p-4 md:p-6 lg:p-8">
        <div className="mx-auto max-w-6xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
