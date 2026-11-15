import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth ha de ser utilitzat dins d'un AuthProvider");
  }
  return context;
}
