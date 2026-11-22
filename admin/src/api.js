const TOKEN_KEY = 'portfolio_admin_token';

export const TAGS = ['AI&CV', 'CG&3D', 'AR/VR&XR', 'GameDev'];
export const DOMAINS = [
  { key: 'ai', label: 'AI & Computer Vision' },
  { key: 'cg', label: 'Computer Graphics & 3D' },
  { key: 'xr', label: 'AR/VR & XR' },
  { key: 'game', label: 'Game Development' },
];

export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* storage unavailable — token lives only in memory for this tab */
  }
}

export class AuthError extends Error {}

async function request(path, { method = 'GET', body, auth = false, raw = false } = {}) {
  const headers = {};
  if (auth) headers.Authorization = `Bearer ${getToken() || ''}`;
  if (body !== undefined && !raw) headers['Content-Type'] = 'application/json';
  let res;
  try {
    res = await fetch(path, { method, headers, body: raw ? body : body !== undefined ? JSON.stringify(body) : undefined });
  } catch {
    throw new Error('Cannot reach the server. Is it running?');
  }
  const data = await res.json().catch(() => ({}));
  if (res.status === 401 && auth) {
    setToken(null);
    throw new AuthError(data.error || 'Session expired. Please log in again.');
  }
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
}

export const api = {
  login: (password) => request('/api/login', { method: 'POST', body: { password } }),
  session: () => request('/api/session', { auth: true }),
  getContent: () => request('/api/content'),
  saveContent: (content) => request('/api/content', { method: 'PUT', body: content, auth: true }),
  upload: async (files) => {
    const form = new FormData();
    for (const f of files) form.append('files', f);
    const { urls } = await request('/api/upload', { method: 'POST', body: form, auth: true, raw: true });
    return urls;
  },
};

/** Resolve a site image path for preview. Site-relative paths are served by the API under /site. */
export function assetUrl(src) {
  if (!src) return '';
  if (src.startsWith('/')) return `/site${encodeURI(src)}`;
  return src;
}

export const slugify = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
