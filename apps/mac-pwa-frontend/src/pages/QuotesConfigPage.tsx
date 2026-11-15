import { useQuery } from '@tanstack/react-query';
import type { QuotaConfigResponseDTO } from 'shared';
import { apiGet } from '../lib/api';
import { EmptyState, LoadingSkeleton, QueryError } from '../components/ui/QueryFeedback';
import { formatCurrency } from '../lib/format';
import { useAuth } from '../hooks/useAuth';

export function QuotesConfigPage() {
  const { user } = useAuth();
  const { data, isLoading, isError, isRefetching, refetch } = useQuery({
    queryKey: ['quotaConfigs', user?.id],
    queryFn: () => apiGet<QuotaConfigResponseDTO[]>('/quotaConfigs'),
    enabled: Boolean(user),
  });

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-balance text-2xl font-bold text-text md:text-3xl">Configuració de quotes</h1>
        <p className="mt-1 text-sm text-text-secondary">Consulta imports, temporades i estat de cada quota.</p>
      </header>

      {isLoading && <LoadingSkeleton label="Carregant la configuració de quotes…" />}
      {isError && (
        <QueryError
          message="No s'ha pogut carregar la configuració de quotes. Comprova la connexió i torna-ho a provar."
          onRetry={() => void refetch()}
          isRetrying={isRefetching}
        />
      )}

      {data?.length === 0 && (
        <EmptyState title="No hi ha quotes configurades" description="Les quotes s’afegiran aquí quan estiguin configurades per al club." />
      )}

      {data && data.length > 0 && (
        <>
          <div className="hidden overflow-x-auto rounded-2xl border border-brand-100 bg-surface md:block">
            <table className="w-full min-w-[42rem] text-left text-sm">
              <caption className="sr-only">Configuració de quotes</caption>
              <thead className="bg-brand-50 text-xs font-semibold text-brand-800">
                <tr>
                  <th scope="col" className="px-5 py-3">Quota</th>
                  <th scope="col" className="px-5 py-3">Tipus</th>
                  <th scope="col" className="px-5 py-3">Import</th>
                  <th scope="col" className="px-5 py-3">Temporades</th>
                  <th scope="col" className="px-5 py-3">Estat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-muted">
                {data.map((quota) => (
                  <tr key={quota.id} className="hover:bg-brand-50/60">
                    <th scope="row" className="max-w-sm break-words px-5 py-4 font-semibold text-text">{quota.nom}</th>
                    <td className="px-5 py-4 text-text-secondary">{quota.tipus}</td>
                    <td className="px-5 py-4 font-semibold tabular-nums text-text">{formatCurrency(quota.preuBase)}</td>
                    <td className="max-w-xs break-words px-5 py-4 text-text-secondary">{quota.temporadesAplicada.join(', ') || '—'}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex min-h-7 items-center rounded-full px-3 text-xs font-semibold ${quota.activa ? 'bg-green-100 text-green-800' : 'bg-muted text-text-secondary'}`}>
                        {quota.activa ? 'Activa' : 'Inactiva'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ul className="space-y-3 md:hidden">
            {data.map((quota) => (
              <li key={quota.id} className="rounded-2xl border border-brand-100 bg-surface p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="break-words font-semibold text-text">{quota.nom}</h2>
                    <p className="mt-1 text-sm text-text-secondary">{quota.tipus}</p>
                  </div>
                  <span className={`inline-flex min-h-7 shrink-0 items-center rounded-full px-3 text-xs font-semibold ${quota.activa ? 'bg-green-100 text-green-800' : 'bg-muted text-text-secondary'}`}>
                    {quota.activa ? 'Activa' : 'Inactiva'}
                  </span>
                </div>
                <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-muted pt-3 text-sm">
                  <div>
                    <dt className="text-xs font-medium text-text-secondary">Import</dt>
                    <dd className="mt-1 font-semibold tabular-nums text-text">{formatCurrency(quota.preuBase)}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-text-secondary">Temporades</dt>
                    <dd className="mt-1 break-words text-text">{quota.temporadesAplicada.join(', ') || '—'}</dd>
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
