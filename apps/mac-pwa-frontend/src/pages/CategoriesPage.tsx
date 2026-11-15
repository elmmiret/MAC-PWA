import { useQuery } from '@tanstack/react-query';
import type { CategoriaResponseDTO } from 'shared';
import { apiGet } from '../lib/api';
import { EmptyState, LoadingSkeleton, QueryError } from '../components/ui/QueryFeedback';
import { formatTime } from '../lib/format';
import { useAuth } from '../hooks/useAuth';

export function CategoriesPage() {
  const { user } = useAuth();
  const { data, isLoading, isError, isRefetching, refetch } = useQuery({
    queryKey: ['categories', user?.id],
    queryFn: () => apiGet<CategoriaResponseDTO[]>('/categories'),
    enabled: Boolean(user),
  });

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-balance text-2xl font-bold text-text md:text-3xl">Categories</h1>
        <p className="mt-1 text-sm text-text-secondary">Consulta les categories i els seus horaris d’activitat.</p>
      </header>

      {isLoading && <LoadingSkeleton label="Carregant les categories…" />}
      {isError && (
        <QueryError
          message="No s'han pogut carregar les categories. Comprova la connexió i torna-ho a provar."
          onRetry={() => void refetch()}
          isRetrying={isRefetching}
        />
      )}

      {data?.length === 0 && (
        <EmptyState title="No hi ha categories" description="Quan s’afegeixin categories al club, apareixeran en aquesta llista." />
      )}

      {data && data.length > 0 && (
        <>
          <div className="hidden overflow-x-auto rounded-2xl border border-brand-100 bg-surface md:block">
            <table className="w-full min-w-[44rem] text-left text-sm">
              <caption className="sr-only">Categories del club</caption>
              <thead className="bg-brand-50 text-xs font-semibold text-brand-800">
                <tr>
                  <th scope="col" className="px-5 py-3">Categoria</th>
                  <th scope="col" className="px-5 py-3">Anys de naixement</th>
                  <th scope="col" className="px-5 py-3">Dies</th>
                  <th scope="col" className="px-5 py-3">Horari</th>
                  <th scope="col" className="px-5 py-3">Usuaris</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-muted">
                {data.map((categoria) => (
                  <tr key={categoria.id} className="hover:bg-brand-50/60">
                    <th scope="row" className="px-5 py-4 font-semibold text-text">{categoria.tipus}</th>
                    <td className="px-5 py-4 tabular-nums text-text-secondary">{categoria.anyNaixement.join(', ') || '—'}</td>
                    <td className="px-5 py-4 text-text-secondary">{categoria.diesActivitat.join(', ') || '—'}</td>
                    <td className="px-5 py-4 tabular-nums text-text-secondary">
                      {categoria.horaEntrada && categoria.horaSortida ? `${formatTime(categoria.horaEntrada)}–${formatTime(categoria.horaSortida)}` : '—'}
                    </td>
                    <td className="px-5 py-4 tabular-nums text-text-secondary">{categoria.usuaris.length}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ul className="space-y-3 md:hidden">
            {data.map((categoria) => (
              <li key={categoria.id} className="rounded-2xl border border-brand-100 bg-surface p-4">
                <h2 className="break-words font-semibold text-text">{categoria.tipus}</h2>
                <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                  <div>
                    <dt className="text-xs font-medium text-text-secondary">Anys de naixement</dt>
                    <dd className="mt-1 tabular-nums text-text">{categoria.anyNaixement.join(', ') || '—'}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-text-secondary">Usuaris</dt>
                    <dd className="mt-1 tabular-nums text-text">{categoria.usuaris.length}</dd>
                  </div>
                  <div className="col-span-2">
                    <dt className="text-xs font-medium text-text-secondary">Dies i horari</dt>
                    <dd className="mt-1 break-words text-text">
                      {categoria.diesActivitat.join(', ') || 'Sense dies definits'}
                      {categoria.horaEntrada && categoria.horaSortida ? ` · ${formatTime(categoria.horaEntrada)}–${formatTime(categoria.horaSortida)}` : ''}
                    </dd>
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
