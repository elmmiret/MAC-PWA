interface LoadingSkeletonProps {
  rows?: number;
  label?: string;
}

export function LoadingSkeleton({ rows = 3, label = 'Carregant…' }: LoadingSkeletonProps) {
  return (
    <div role="status" aria-label={label} className="space-y-3">
      <span className="sr-only">{label}</span>
      {Array.from({ length: rows }, (_, index) => (
        <div
          key={index}
          aria-hidden="true"
          className="flex min-h-20 items-center gap-4 rounded-2xl border border-brand-100 bg-surface p-4"
        >
          <div className="h-10 w-10 shrink-0 rounded-full bg-muted motion-safe:animate-pulse" />
          <div className="min-w-0 flex-1 space-y-2">
            <div className="h-4 w-2/5 rounded bg-muted motion-safe:animate-pulse" />
            <div className="h-3 w-3/5 rounded bg-muted motion-safe:animate-pulse" />
          </div>
          <div className="h-6 w-16 rounded bg-muted motion-safe:animate-pulse" />
        </div>
      ))}
    </div>
  );
}

interface EmptyStateProps {
  title: string;
  description: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-brand-200 bg-surface px-5 py-10 text-center">
      <h2 className="text-pretty text-lg font-semibold text-text">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-text-secondary">{description}</p>
    </div>
  );
}

interface QueryErrorProps {
  message: string;
  onRetry: () => void;
  isRetrying?: boolean;
}

export function QueryError({ message, onRetry, isRetrying = false }: QueryErrorProps) {
  return (
    <div role="alert" className="flex flex-col gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm leading-6 text-red-800">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        disabled={isRetrying}
        className="min-h-11 shrink-0 rounded-xl border border-red-300 bg-surface px-4 text-sm font-semibold text-red-800 transition-colors hover:bg-red-100 disabled:cursor-wait disabled:opacity-60"
      >
        {isRetrying ? 'Tornant a provar…' : 'Torna-ho a provar'}
      </button>
    </div>
  );
}
