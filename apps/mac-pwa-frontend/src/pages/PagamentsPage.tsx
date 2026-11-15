import { useQuery } from '@tanstack/react-query';
import type { MePagamentResponseDTO } from 'shared';
import { apiGet } from '../lib/api';
import { useAuth } from '../hooks/useAuth';

function statusColor(estat: string): string {
  switch (estat) {
    case 'PAGAT':
      return 'bg-green-100 text-green-700';
    case 'CANCELAT':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-amber-100 text-amber-700';
  }
}

export function PagamentsPage() {
  const { isAdmin } = useAuth();

  const { data, isLoading, error } = useQuery<MePagamentResponseDTO[]>({
    queryKey: ['pagaments', 'me'],
    queryFn: () => apiGet('/pagaments/me'),
    enabled: !isAdmin, // TODO: afegir endpoint per llistar tots els pagaments des d'admin
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-text">Pagaments</h1>

      {isAdmin && (
        <div className="rounded-xl bg-accent-50 p-4 text-sm text-accent-800">
          Mode administrador: aquí es mostrarien tots els pagaments del club. Endpoint pendent.
        </div>
      )}

      {isLoading && <p className="text-text-secondary">Carregant...</p>}
      {error && <p role="alert" className="text-red-600">No s'han pogut carregar els pagaments.</p>}

      {data && (
        <div className="overflow-hidden rounded-2xl bg-surface shadow-sm ring-1 ring-brand-100">
          <ul className="divide-y divide-muted">
            {data.map((pagament, index) => (
              <li key={index} className="flex items-center justify-between px-6 py-4">
                <div>
                  <p className="font-medium text-text">{pagament.motiu}</p>
                  <p className="text-sm text-text-secondary">
                    Venciment: {new Date(pagament.dataLimit).toLocaleDateString('ca-ES')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-text">{pagament.preu.toFixed(2)} €</p>
                  <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor(pagament.estat)}`}>
                    {pagament.estat}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
