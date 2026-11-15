import { useAuth } from '../hooks/useAuth';

export function LoginPage() {
  const { loginWithGoogle, isLoading, error } = useAuth();

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
          className="flex w-full items-center justify-center gap-3 rounded-xl bg-brand-500 px-4 py-3 font-medium text-white shadow-md transition-colors hover:bg-brand-600 focus-visible:ring-2 focus-visible:ring-accent-500 disabled:opacity-60"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white font-bold text-brand-500">
            G
          </span>
          {isLoading ? 'Connectant...' : 'Accedir amb Google'}
        </button>

        {error && (
          <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-center text-sm text-red-700">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
