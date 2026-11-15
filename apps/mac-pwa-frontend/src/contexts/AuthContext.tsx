import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { useQueryClient } from '@tanstack/react-query';
import { firebaseAuth, googleProvider } from '../firebase';
import { apiPost } from '../lib/api';
import { AuthContext, type AuthUser } from './auth-context';

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const activeFirebaseUid = useRef<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (firebaseUser) => {
      const nextUid = firebaseUser?.uid ?? null;
      if (activeFirebaseUid.current !== nextUid) {
        activeFirebaseUid.current = nextUid;
        queryClient.clear();
      }

      if (!firebaseUser) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const token = await firebaseUser.getIdToken(true);
        const loggedUser = await apiPost<AuthUser>('/auth/google', { firebaseToken: token });
        setUser(loggedUser);
        setError(null);
      } catch (reason) {
        await signOut(firebaseAuth).catch(() => undefined);
        setUser(null);
        setError(reason instanceof Error ? reason.message : 'Error d\'autenticació.');
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, [queryClient]);

  const loginWithGoogle = useCallback(async () => {
    setError(null);
    setIsLoading(true);

    try {
      // The auth-state listener performs the single backend token exchange.
      await signInWithPopup(firebaseAuth, googleProvider);
    } catch (reason) {
      await signOut(firebaseAuth).catch(() => undefined);
      setUser(null);
      setError(reason instanceof Error ? reason.message : 'No s\'ha pogut iniciar sessió.');
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await signOut(firebaseAuth);
    queryClient.clear();
    setUser(null);
    setError(null);
  }, [queryClient]);

  const clearError = useCallback(() => setError(null), []);

  const isAdmin = user?.admin === true;
  const value = useMemo(() => ({
    user,
    isAdmin,
    isLoading,
    error,
    loginWithGoogle,
    logout,
    clearError,
  }), [user, isAdmin, isLoading, error, loginWithGoogle, logout, clearError]);

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}
