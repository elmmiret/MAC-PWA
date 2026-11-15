import { useQuery } from '@tanstack/react-query';
import type { QuotaConfigResponseDTO } from 'shared';
import { apiGet } from '../lib/api';

export function QuotesConfigPage() {
  const { data, isLoading, error } = useQuery<QuotaConfigResponseDTO[]>({
    queryKey: ['quotaConfigs'],
    queryFn: () => apiGet('/quotaConfigs'),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text">Configuració de quotes</h1>
        <button
          type="button"
          className="rounded-xl bg-accent-500 px-4 py-2 text-sm font-medium text-brand-500 shadow-sm transition-colors hover:bg-accent-400"
        >
          Nova quota
        </button>
      </div>

      {isLoading && <p className="text-text-secondary">Carregant...</p>}
      {error && <p role="alert" className="text-red-600">No s'han pogut carregar les quotes.</p>}

      {data && (
        <div className="overflow-hidden rounded-2xl bg-surface shadow-sm ring-1 ring-brand-100">
          <ul className="divide-y divide-muted">
            {data.map((quota) => (
              <li key={quota.id} className="flex items-center justify-between px-6 py-4">
                <div>
                  <p className="font-medium text-text">{quota.nom}</p>
                  <p className="text-sm text-text-secondary">
                    {quota.tipus} · {quota.preuBase.toFixed(2)} € · {quota.activa ? 'Activa' : 'Inactiva'}
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
