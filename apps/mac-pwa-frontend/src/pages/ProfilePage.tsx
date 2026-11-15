import { useAuth } from '../hooks/useAuth';

export function ProfilePage() {
  const { user, isAdmin } = useAuth();

  if (!user) return null;

  const fields = [
    { label: 'Nom', value: [user.nom, user.cognom1, user.cognom2].filter(Boolean).join(' ') || '-' },
    { label: 'Email principal', value: user.emailPrincipal },
    { label: 'Email secundari', value: user.emailSecundari ?? '-' },
    { label: 'Telèfon', value: user.telefonPrincipal ?? '-' },
    { label: 'Data de naixement', value: user.dataNaixement ? new Date(user.dataNaixement).toLocaleDateString('ca-ES') : '-' },
    { label: 'Document', value: user.numeroDocument ? `${user.tipusDocument} ${user.numeroDocument}` : '-' },
    { label: 'Llicència', value: user.numeroLlicencia ?? '-' },
    { label: 'Rol', value: isAdmin ? 'Administrador' : 'Atleta' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-text">El meu perfil</h1>

      <div className="overflow-hidden rounded-2xl bg-surface shadow-sm ring-1 ring-brand-100">
        <div className="border-b border-muted bg-brand-50 px-6 py-4">
          <p className="font-semibold text-text">{user.nom ?? user.emailPrincipal}</p>
          <p className="text-sm text-text-secondary">{user.emailPrincipal}</p>
        </div>
        <dl className="divide-y divide-muted">
          {fields.map((field) => (
            <div key={field.label} className="px-6 py-4 sm:flex sm:items-center">
              <dt className="text-sm font-medium text-text-secondary sm:w-1/3">{field.label}</dt>
              <dd className="mt-1 text-sm text-text sm:mt-0 sm:w-2/3">{field.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
