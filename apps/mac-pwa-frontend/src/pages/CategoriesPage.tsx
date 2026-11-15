import { useQuery } from '@tanstack/react-query';
import type { CategoriaResponseDTO } from 'shared';
import { apiGet } from '../lib/api';

export function CategoriesPage() {
  const { data, isLoading, error } = useQuery<CategoriaResponseDTO[]>({
    queryKey: ['categories'],
    queryFn: () => apiGet('/categories'),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text">Categories</h1>
        <button
          type="button"
          className="rounded-xl bg-accent-500 px-4 py-2 text-sm font-medium text-brand-500 shadow-sm transition-colors hover:bg-accent-400"
        >
          Nova categoria
        </button>
      </div>

      {isLoading && <p className="text-text-secondary">Carregant...</p>}
      {error && <p role="alert" className="text-red-600">No s'han pogut carregar les categories.</p>}

      {data && (
        <div className="overflow-hidden rounded-2xl bg-surface shadow-sm ring-1 ring-brand-100">
          <ul className="divide-y divide-muted">
            {data.map((categoria) => (
              <li key={categoria.id} className="flex items-center justify-between px-6 py-4">
                <div>
                  <p className="font-medium text-text">{categoria.tipus}</p>
                  <p className="text-sm text-text-secondary">
                    Dies: {categoria.diesActivitat.join(', ') || '—'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="rounded-lg px-3 py-1.5 text-sm font-medium text-brand-500 ring-1 ring-brand-200 hover:bg-brand-50"
                  >
                    Editar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
