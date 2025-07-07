// api.js - Centralized API fetch utility for handling base URL

// In production, use relative paths so Vercel rewrites work
const isProd = import.meta.env.MODE === 'production';
const API_BASE_URL = isProd ? '' : (import.meta.env.VITE_API_BASE_URL || '');

export function apiFetch(path, options = {}) {
  // If path is already absolute (starts with http), don't prepend
  const url = path.startsWith('http') ? path : `${API_BASE_URL}${path}`;
  return fetch(url, options);
}
