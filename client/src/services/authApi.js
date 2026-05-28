import { API_BASE } from './apiConfig';

async function requestAuth(endpoint, payload) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || data.error || 'Authentication failed');
  }

  return data;
}

export function loginUser(payload) {
  return requestAuth('/api/auth/login', payload);
}

export function signupUser(payload) {
  return requestAuth('/api/auth/signup', payload);
}

export function saveAuthSession({ user, token }) {
  localStorage.setItem('isUserAuthenticated', 'true');
  localStorage.setItem('userData', JSON.stringify(user));
  localStorage.setItem('authToken', token);
}

export function clearAuthSession() {
  localStorage.removeItem('isUserAuthenticated');
  localStorage.removeItem('userData');
  localStorage.removeItem('authToken');
}
