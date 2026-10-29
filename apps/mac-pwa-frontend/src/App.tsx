import { useState } from 'react';
import { signInWithPopup, signOut } from 'firebase/auth';
import { firebaseAuth, googleProvider } from './firebase';
import './App.css';

const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';

type UserResponse = {
  id: string;
  firebaseUid: string | null;
  emailPrincipal: string;
  nom: string | null;
  cognom1: string | null;
  cognom2: string | null;
  perfilCompletat: boolean;
};

function App() {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [idToken, setIdToken] = useState('');
  const [tokenMessage, setTokenMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const loginWithGoogle = async () => {
    setBusy(true);
    setError('');

    try {
      const result = await signInWithPopup(firebaseAuth, googleProvider);
      const firebaseToken = await result.user.getIdToken();
      setIdToken(firebaseToken);
      const response = await fetch(`${apiUrl}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firebaseToken }),
      });

      const body = await response.json() as UserResponse | { message?: string };
      if (!response.ok) {
        throw new Error('message' in body && body.message ? body.message : 'No s\'ha pogut iniciar sessio.');
      }

      setUser(body as UserResponse);
    } catch (reason) {
      await signOut(firebaseAuth).catch(() => undefined);
      setError(reason instanceof Error ? reason.message : 'Error desconegut.');
    } finally {
      setBusy(false);
    }
  };

  const logout = async () => {
    await signOut(firebaseAuth);
    setUser(null);
    setIdToken('');
    setTokenMessage('');
    setError('');
  };

  const refreshToken = async () => {
    if (!firebaseAuth.currentUser) return;

    const token = await firebaseAuth.currentUser.getIdToken(true);
    setIdToken(token);
    setTokenMessage('Token renovat. Ja el pots copiar a Swagger.');
  };

  const copyToken = async () => {
    await navigator.clipboard.writeText(idToken);
    setTokenMessage('Token copiat al porta-retalls.');
  };

  return (
    <main className="auth-shell">
      <section className="auth-card" aria-labelledby="page-title">
        <div className="brand-mark">MAC</div>
        <p className="eyebrow">Martorell Athletic Club</p>
        <h1 id="page-title">Acces provisional</h1>
        <p className="intro">
          Prova el registre i l&apos;inici de sessio amb Google mentre construim el portal del club.
        </p>

        {!user ? (
          <>
            <button className="google-button" type="button" onClick={loginWithGoogle} disabled={busy}>
              <span className="google-icon" aria-hidden="true">G</span>
              {busy ? 'Connectant...' : 'Accedir amb Google'}
            </button>
            <p className="hint">
              El compte ha d&apos;haver estat pre-registrat per un administrador.
            </p>
          </>
        ) : (
          <div className="profile-panel">
            <p className="status">Sessio iniciada</p>
            <h2>{user.nom || user.emailPrincipal}</h2>
            <dl>
              <div><dt>Email</dt><dd>{user.emailPrincipal}</dd></div>
              <div><dt>PostgreSQL Id</dt><dd className="id-value">{user.id}</dd></div>
              <div><dt>FirebaseUid</dt><dd className="id-value">{user.firebaseUid}</dd></div>
              <div><dt>Perfil</dt><dd>{user.perfilCompletat ? 'Complet' : 'Pendent'}</dd></div>
            </dl>
            <button className="secondary-button" type="button" onClick={logout}>
              Tancar sessio
            </button>
            <div className="token-panel">
              <p className="token-title">Token temporal per Swagger</p>
              <p className="token-warning">
                No el comparteixis ni el pugis al repositori.
              </p>
              <textarea
                readOnly
                value={idToken}
                aria-label="Firebase ID token"
                rows={5}
              />
              <div className="token-actions">
                <button className="secondary-button" type="button" onClick={refreshToken}>
                  Renovar token
                </button>
                <button className="secondary-button" type="button" onClick={copyToken} disabled={!idToken}>
                  Copiar token
                </button>
              </div>
              {tokenMessage && <p className="token-message">{tokenMessage}</p>}
            </div>
          </div>
        )}

        {error && <p className="error" role="alert">{error}</p>}
      </section>
    </main>
  );
}

export default App;
