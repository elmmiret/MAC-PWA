import { useQuery } from '@tanstack/react-query';
import type { RankingResponseDTO } from 'shared';
import { apiGet } from '../lib/api';
import { EmptyState, LoadingSkeleton, QueryError } from '../components/ui/QueryFeedback';
import { useAuth } from '../hooks/useAuth';

export function RankingsPage() {
  const { user } = useAuth();
  const { data, isLoading, isError, isRefetching, refetch } = useQuery({
    queryKey: ['rankings', user?.id],
    queryFn: () => apiGet<RankingResponseDTO[]>('/rankings'),
    enabled: Boolean(user),
  });

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-balance text-2xl font-bold text-text md:text-3xl">Rankings</h1>
        <p className="mt-1 text-sm text-text-secondary">Consulta les classificacions del club.</p>
      </header>

      {isLoading && <LoadingSkeleton label="Carregant els rankings…" />}
      {isError && (
        <QueryError
          message="No s'han pogut carregar els rankings. Comprova la connexió i torna-ho a provar."
          onRetry={() => void refetch()}
          isRetrying={isRefetching}
        />
      )}

      {data?.length === 0 && (
        <EmptyState title="Encara no hi ha rankings" description="Quan es publiquin classificacions, les trobaràs aquí." />
      )}

      {data && data.length > 0 && (
        <>
          <div className="hidden overflow-x-auto rounded-2xl border border-brand-100 bg-surface md:block">
            <table className="w-full min-w-[40rem] text-left text-sm">
              <caption className="sr-only">Rankings del club</caption>
              <thead className="bg-brand-50 text-xs font-semibold text-brand-800">
                <tr>
                  <th scope="col" className="px-5 py-3">Ranking</th>
                  <th scope="col" className="px-5 py-3">Sexe</th>
                  <th scope="col" className="px-5 py-3">Categoria (ref.)</th>
                  <th scope="col" className="px-5 py-3">Prova (ref.)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-muted">
                {data.map((ranking) => (
                  <tr key={ranking.id} className="hover:bg-brand-50/60">
                    <th scope="row" className="max-w-xs px-5 py-4 font-semibold text-text">{ranking.nom}</th>
                    <td className="px-5 py-4 text-text-secondary">{ranking.sexe}</td>
                    <td className="px-5 py-4 font-mono text-xs text-text-secondary">{ranking.categoriaId.slice(0, 8)}</td>
                    <td className="px-5 py-4 font-mono text-xs text-text-secondary">{ranking.provaId.slice(0, 8)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ul className="space-y-3 md:hidden">
            {data.map((ranking) => (
              <li key={ranking.id} className="rounded-2xl border border-brand-100 bg-surface p-4">
                <h2 className="break-words font-semibold text-text">{ranking.nom}</h2>
                <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                  <div>
                    <dt className="text-xs font-medium text-text-secondary">Sexe</dt>
                    <dd className="mt-1 text-text">{ranking.sexe}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-text-secondary">Categoria (ref.)</dt>
                    <dd className="mt-1 font-mono text-xs text-text">{ranking.categoriaId.slice(0, 8)}</dd>
                  </div>
                  <div className="col-span-2">
                    <dt className="text-xs font-medium text-text-secondary">Prova (ref.)</dt>
                    <dd className="mt-1 font-mono text-xs text-text">{ranking.provaId.slice(0, 8)}</dd>
                  </div>
                </dl>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
