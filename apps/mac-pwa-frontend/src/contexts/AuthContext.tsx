import {
  createContext,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import type { UsuariResponseDTO } from 'shared';
import { firebaseAuth, googleProvider } from '../firebase';
import { apiPost } from '../lib/api';

type AuthUser = UsuariResponseDTO;

interface AuthContextValue {
  user: AuthUser | null;
  isAdmin: boolean;
  isLoading: boolean;
  error: string | null;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setIsLoading(false);
        return;
      }

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
  }, []);

  const loginWithGoogle = useCallback(async () => {
    setError(null);
    setIsLoading(true);

    try {
      const result = await signInWithPopup(firebaseAuth, googleProvider);
      const firebaseToken = await result.user.getIdToken(true);
      const loggedUser = await apiPost<AuthUser>('/auth/google', { firebaseToken });
      setUser(loggedUser);
    } catch (reason) {
      await signOut(firebaseAuth).catch(() => undefined);
      setUser(null);
      setError(reason instanceof Error ? reason.message : 'No s\'ha pogut iniciar sessió.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await signOut(firebaseAuth);
    setUser(null);
    setError(null);
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const isAdmin = user?.admin === true;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        isLoading,
        error,
        loginWithGoogle,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

