import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';

export function LoginPage() {
  const { user, loginWithGoogle, isLoading, error } = useAuth();

  if (user && !isLoading) {
    return (
      <Navigate
        to={user.admin ? '/' : '/perfil'}
        replace
        state={{ successMessage: 'Sessió iniciada correctament.' }}
      />
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-500 px-4 py-12">
      <div className="w-full max-w-sm rounded-2xl bg-surface p-8 shadow-xl">
        <div className="mb-6 flex items-center justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-500 text-2xl font-black text-brand-500">
            M
          </div>
        </div>

        <h1 className="mb-2 text-center text-2xl font-bold text-text">Benvingut al MAC</h1>
        <p className="mb-8 text-center text-sm text-text-secondary">
          Inicia sessió amb el teu compte de Google per accedir al portal del club.
        </p>

        <button
          type="button"
          onClick={loginWithGoogle}
          disabled={isLoading}
          aria-busy={isLoading}
          className="flex min-h-12 w-full items-center justify-center gap-3 rounded-xl bg-brand-500 px-4 py-3 font-medium text-white shadow-md transition-colors hover:bg-brand-600 focus-visible:ring-2 focus-visible:ring-accent-500 disabled:cursor-wait disabled:opacity-60"
        >
          <span aria-hidden="true" className="flex h-6 w-6 items-center justify-center rounded-full bg-white font-bold text-brand-500">
            G
          </span>
          {isLoading ? 'Connectant…' : 'Accedir amb Google'}
        </button>

        {error && (
          <p role="alert" aria-live="polite" className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-center text-sm leading-6 text-red-800">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
