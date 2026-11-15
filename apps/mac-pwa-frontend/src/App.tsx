import { Navigate, Route, Routes } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { lazy, Suspense } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { queryClient } from './lib/queryClient';
import { AppLayout } from './components/layout/AppLayout';
import { useAuth } from './hooks/useAuth';
import { LoadingSkeleton } from './components/ui/QueryFeedback';
import type { ReactNode } from 'react';

const LoginPage = lazy(() => import('./pages/LoginPage').then(({ LoginPage }) => ({ default: LoginPage })));
const HomePage = lazy(() => import('./pages/HomePage').then(({ HomePage }) => ({ default: HomePage })));
const ProfilePage = lazy(() => import('./pages/ProfilePage').then(({ ProfilePage }) => ({ default: ProfilePage })));
const PagamentsPage = lazy(() => import('./pages/PagamentsPage').then(({ PagamentsPage }) => ({ default: PagamentsPage })));
const RankingsPage = lazy(() => import('./pages/RankingsPage').then(({ RankingsPage }) => ({ default: RankingsPage })));
const CategoriesPage = lazy(() => import('./pages/CategoriesPage').then(({ CategoriesPage }) => ({ default: CategoriesPage })));
const QuotesConfigPage = lazy(() => import('./pages/QuotesConfigPage').then(({ QuotesConfigPage }) => ({ default: QuotesConfigPage })));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then(({ NotFoundPage }) => ({ default: NotFoundPage })));

function ProtectedRoute({ children, adminOnly = false }: { children: ReactNode; adminOnly?: boolean }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="mx-auto flex min-h-screen max-w-3xl items-center px-4">
        <div className="w-full">
          <LoadingSkeleton label="Comprovant la sessió…" />
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !user.admin) {
    return <Navigate to="/perfil" replace />;
  }

  return children;
}

function HomeRedirect() {
  const { user, isAdmin } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return isAdmin ? <HomePage /> : <Navigate to="/perfil" replace />;
}

function AppRouter() {
  return (
    <Suspense fallback={<div className="mx-auto flex min-h-screen max-w-3xl items-center px-4"><div className="w-full"><LoadingSkeleton label="Carregant la pàgina…" /></div></div>}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomeRedirect />} />
          <Route path="/perfil" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/pagaments" element={<ProtectedRoute><PagamentsPage /></ProtectedRoute>} />
          <Route path="/rankings" element={<ProtectedRoute><RankingsPage /></ProtectedRoute>} />
          <Route path="/categories" element={<ProtectedRoute adminOnly><CategoriesPage /></ProtectedRoute>} />
          <Route path="/quotes-config" element={<ProtectedRoute adminOnly><QuotesConfigPage /></ProtectedRoute>} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
