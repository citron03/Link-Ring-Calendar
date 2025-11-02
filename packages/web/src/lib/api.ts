const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

async function refreshToken(): Promise<string | null> {
  try {
    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include', // send HttpOnly cookie
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) return null;
    const data = await res.json();
    const { accessToken } = data;
    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
      return accessToken;
    }
  } catch (e) {
    console.error('refreshToken error', e);
  }
  return null;
}

export async function fetchWithAuth(input: RequestInfo, init: RequestInit = {}) {
  let token = localStorage.getItem('accessToken');

  const headers: Record<string, string> = { ...(init.headers as Record<string, string> || {}) };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (!headers['Content-Type'] && !(init.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(input, { ...init, headers, credentials: 'include' });
  if (res.status !== 401) return res;

  // Try refresh
  const newToken = await refreshToken();
  if (!newToken) return res;

  // Retry original request with new token
  headers['Authorization'] = `Bearer ${newToken}`;
  const retry = await fetch(input, { ...init, headers, credentials: 'include' });
  return retry;
}

export default API_URL;
