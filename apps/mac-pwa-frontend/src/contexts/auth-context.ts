import { createContext } from 'react';
import type { UsuariResponseDTO } from 'shared';

export type AuthUser = UsuariResponseDTO;

export interface AuthContextValue {
  user: AuthUser | null;
  isAdmin: boolean;
  isLoading: boolean;
  error: string | null;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
