import { Navigate, Route, Routes } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { queryClient } from './lib/queryClient';
import { AppLayout } from './components/layout/AppLayout';
import { useAuth } from './hooks/useAuth';
import { LoginPage } from './pages/LoginPage';
import { HomePage } from './pages/HomePage';
import { ProfilePage } from './pages/ProfilePage';
import { PagamentsPage } from './pages/PagamentsPage';
import { RankingsPage } from './pages/RankingsPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { QuotesConfigPage } from './pages/QuotesConfigPage';
import { NotFoundPage } from './pages/NotFoundPage';
import type { ReactNode } from 'react';

function ProtectedRoute({ children, adminOnly = false }: { children: ReactNode; adminOnly?: boolean }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <p className="text-text-secondary">Carregant...</p>
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
