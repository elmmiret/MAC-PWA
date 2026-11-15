import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <h1 className="mb-2 text-6xl font-black text-brand-500">404</h1>
      <p className="mb-6 text-lg text-text-secondary">Pàgina no trobada</p>
      <Link
        to="/"
        className="rounded-xl bg-accent-500 px-6 py-3 font-medium text-brand-500 shadow-sm transition-colors hover:bg-accent-400"
      >
        Tornar a l'inici
      </Link>
    </div>
  );
}
