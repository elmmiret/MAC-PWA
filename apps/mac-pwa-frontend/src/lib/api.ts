import { signOut } from 'firebase/auth';
import { firebaseAuth } from '../firebase';

export const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';

export async function getFirebaseToken(forceRefresh = false): Promise<string | null> {
  const user = firebaseAuth.currentUser;
  if (!user) return null;
  return user.getIdToken(forceRefresh);
}

export class ApiError extends Error {
  status: number;
  body?: unknown;

  constructor(message: string, status: number, body?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}

export async function apiFetch(
  input: RequestInfo | URL,
  init: RequestInit = {},
): Promise<Response> {
  const url = typeof input === 'string' && !input.startsWith('http')
    ? `${API_BASE_URL.replace(/\/$/, '')}/${input.replace(/^\//, '')}`
    : input;

  const token = await getFirebaseToken();
  const headers = new Headers(init.headers);

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  if (!headers.has('Content-Type') && init.body && typeof init.body === 'string') {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(url, {
    ...init,
    headers,
  });

  if (response.status === 401) {
    await signOut(firebaseAuth).catch(() => undefined);
    throw new ApiError('Sessió caducada. Torna a iniciar sessió.', 401);
  }

  return response;
}

async function parseJson<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new ApiError(body.message ?? `Error ${response.status}`, response.status, body);
  }
  return response.json() as Promise<T>;
}

export async function apiGet<T>(input: RequestInfo | URL): Promise<T> {
  const response = await apiFetch(input, { method: 'GET' });
  return parseJson<T>(response);
}

export async function apiPost<T>(input: RequestInfo | URL, body: unknown): Promise<T> {
  const response = await apiFetch(input, {
    method: 'POST',
    body: JSON.stringify(body),
  });
  return parseJson<T>(response);
}

export async function apiPatch<T>(input: RequestInfo | URL, body: unknown): Promise<T> {
  const response = await apiFetch(input, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
  return parseJson<T>(response);
}

export async function apiPut<T>(input: RequestInfo | URL, body: unknown): Promise<T> {
  const response = await apiFetch(input, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
  return parseJson<T>(response);
}

export async function apiDelete<T>(input: RequestInfo | URL): Promise<T> {
  const response = await apiFetch(input, { method: 'DELETE' });
  return parseJson<T>(response);
}
