// Utility for storing and retrieving JWT and username
export function saveAuth({ token, username }) {
  localStorage.setItem('token', token);
  localStorage.setItem('username', username);
  localStorage.setItem('loginTimestamp', Date.now().toString());
}

export function clearAuth() {
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  localStorage.removeItem('loginTimestamp');
}

export function getToken() {
  const token = localStorage.getItem('token');
  const ts = localStorage.getItem('loginTimestamp');
  if (token && ts) {
    const now = Date.now();
    const age = now - parseInt(ts, 10);
    if (age > 3600000) { // 1 hour in ms
      clearAuth();
      return null;
    }
  }
  return token;
}

export function getUsername() {
  return localStorage.getItem('username');
}

export function isAuthenticated() {
  return !!getToken();
}
