import { useQuery } from '@tanstack/react-query';
import type { RankingResponseDTO } from 'shared';
import { apiGet } from '../lib/api';

export function RankingsPage() {
  const { data, isLoading, error } = useQuery<RankingResponseDTO[]>({
    queryKey: ['rankings'],
    queryFn: () => apiGet('/rankings'),
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-text">Rankings</h1>

      {isLoading && <p className="text-text-secondary">Carregant...</p>}
      {error && <p role="alert" className="text-red-600">No s'han pogut carregar els rankings.</p>}

      {data && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((ranking) => (
            <div
              key={ranking.id}
              className="rounded-2xl bg-surface p-5 shadow-sm ring-1 ring-brand-100"
            >
              <p className="font-semibold text-text">{ranking.nom}</p>
              <p className="text-sm text-text-secondary">
                Sexe: {ranking.sexe} · Categoria: {ranking.categoriaId.slice(0, 8)}...
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
