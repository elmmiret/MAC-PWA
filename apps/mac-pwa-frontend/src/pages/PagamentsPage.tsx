import { useQuery } from '@tanstack/react-query';
import type { MePagamentResponseDTO } from 'shared';
import { apiGet } from '../lib/api';
import { useAuth } from '../hooks/useAuth';
import { EmptyState, LoadingSkeleton, QueryError } from '../components/ui/QueryFeedback';
import { formatCurrency, formatDate } from '../lib/format';

function statusClasses(estat: string): string {
  switch (estat) {
    case 'PAGAT':
      return 'bg-green-100 text-green-800';
    case 'CANCELAT':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-amber-100 text-amber-900';
  }
}

function statusLabel(estat: string): string {
  switch (estat) {
    case 'PAGAT':
      return 'Pagat';
    case 'CANCELAT':
      return 'Cancel·lat';
    default:
      return 'Pendent';
  }
}

export function PagamentsPage() {
  const { user, isAdmin } = useAuth();

  const { data, isLoading, isError, isRefetching, refetch } = useQuery({
    queryKey: ['pagaments', 'me', user?.id],
    queryFn: () => apiGet<MePagamentResponseDTO[]>('/pagaments/me'),
    enabled: Boolean(user) && !isAdmin, // TODO: afegir endpoint per llistar tots els pagaments des d'admin
  });

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-balance text-2xl font-bold text-text md:text-3xl">Pagaments</h1>
        <p className="mt-1 text-sm text-text-secondary">Consulta els imports i les dates de venciment.</p>
      </header>

      {isAdmin && (
        <div role="status" className="rounded-2xl border border-accent-300 bg-accent-50 p-4 text-sm leading-6 text-brand-800">
          El llistat global de pagaments encara no està disponible. Pots consultar els rankings i la configuració del club des del menú.
        </div>
      )}

      {isLoading && <LoadingSkeleton label="Carregant els pagaments…" />}
      {isError && (
        <QueryError
          message="No s'han pogut carregar els pagaments. Comprova la connexió i torna-ho a provar."
          onRetry={() => void refetch()}
          isRetrying={isRefetching}
        />
      )}

      {data?.length === 0 && (
        <EmptyState title="No hi ha pagaments per mostrar" description="Quan hi hagi nous rebuts o quotes, apareixeran en aquesta llista." />
      )}

      {data && data.length > 0 && (
        <>
          <div className="hidden overflow-x-auto rounded-2xl border border-brand-100 bg-surface md:block">
            <table className="w-full min-w-[42rem] text-left text-sm">
              <caption className="sr-only">Els meus pagaments</caption>
              <thead className="bg-brand-50 text-xs font-semibold text-brand-800">
                <tr>
                  <th scope="col" className="px-5 py-3">Concepte</th>
                  <th scope="col" className="px-5 py-3">Venciment</th>
                  <th scope="col" className="px-5 py-3">Import</th>
                  <th scope="col" className="px-5 py-3">Estat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-muted">
                {data.map((pagament, index) => (
                  <tr key={`${pagament.motiu}-${pagament.dataLimit}-${index}`} className="hover:bg-brand-50/60">
                    <th scope="row" className="max-w-sm break-words px-5 py-4 font-semibold text-text">{pagament.motiu}</th>
                    <td className="px-5 py-4 tabular-nums text-text-secondary">{formatDate(pagament.dataLimit)}</td>
                    <td className="px-5 py-4 font-semibold tabular-nums text-text">{formatCurrency(pagament.preu)}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex min-h-7 items-center rounded-full px-3 text-xs font-semibold ${statusClasses(pagament.estat)}`}>
                        {statusLabel(pagament.estat)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ul className="space-y-3 md:hidden">
            {data.map((pagament, index) => (
              <li key={`${pagament.motiu}-${pagament.dataLimit}-${index}`} className="rounded-2xl border border-brand-100 bg-surface p-4">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="min-w-0 break-words font-semibold text-text">{pagament.motiu}</h2>
                  <span className={`inline-flex min-h-7 shrink-0 items-center rounded-full px-3 text-xs font-semibold ${statusClasses(pagament.estat)}`}>
                    {statusLabel(pagament.estat)}
                  </span>
                </div>
                <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-muted pt-3 text-sm">
                  <div>
                    <dt className="text-xs font-medium text-text-secondary">Venciment</dt>
                    <dd className="mt-1 tabular-nums text-text">{formatDate(pagament.dataLimit)}</dd>
                  </div>
                  <div className="text-right">
                    <dt className="text-xs font-medium text-text-secondary">Import</dt>
                    <dd className="mt-1 font-semibold tabular-nums text-text">{formatCurrency(pagament.preu)}</dd>
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
