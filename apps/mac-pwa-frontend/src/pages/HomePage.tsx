import { useAuth } from '../hooks/useAuth';
import { UserIcon, CardIcon, TrophyIcon, GridIcon, GearIcon } from '../components/icons';
import { Link } from 'react-router-dom';

const dashboardItems = [
  { to: '/usuaris', label: 'Usuaris', icon: UserIcon, description: 'Gestiona els usuaris del club' },
  { to: '/pagaments', label: 'Pagaments', icon: CardIcon, description: 'Revisa i gestiona pagaments' },
  { to: '/rankings', label: 'Rankings', icon: TrophyIcon, description: 'Consulta els rankings' },
  { to: '/categories', label: 'Categories', icon: GridIcon, description: 'Configura categories' },
  { to: '/quotes-config', label: 'Quotes', icon: GearIcon, description: 'Configura quotes i temporades' },
];

export function HomePage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-text">Hola, {user?.nom ?? user?.emailPrincipal}</h1>
        <p className="text-text-secondary">Panell d'administració del Martorell Atlètic Club</p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {dashboardItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="group block min-h-28 rounded-2xl bg-surface p-5 shadow-sm ring-1 ring-brand-100 transition-colors hover:bg-brand-50 hover:ring-accent-500"
          >
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-accent-100 text-accent-700 group-hover:bg-accent-500 group-hover:text-white">
              <item.icon aria-hidden="true" className="h-5 w-5" />
            </div>
            <h2 className="font-semibold text-text">{item.label}</h2>
            <p className="text-sm text-text-secondary">{item.description}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
