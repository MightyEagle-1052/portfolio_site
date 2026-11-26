import * as github from './github.js';
import { AuthError, ConflictError } from './errors.js';

export { AuthError, ConflictError };
export { REPO_NAME, TOKEN_HELP_URL, NOT_CONNECTED, TARGET as GITHUB_TARGET } from './github.js';

/**
 * 'server': served by the portfolio server (npm start), which saves content.json on its disk.
 * 'github': built for a static host with `npm run build:static`; saves by committing to GitHub.
 */
export const MODE = import.meta.env.MODE === 'static' ? 'github' : 'server';

/** The public site's address. The admin lives at <site>/admin/. */
export const SITE_URL = import.meta.env.BASE_URL.replace(/admin\/$/, '');

export const TAGS = ['AI&CV', 'CG&3D', 'AR/VR&XR', 'GameDev'];
// defaultHighlight mirrors the site's default hero badge text (front/src/data/site.ts).
export const DOMAINS = [
  { key: 'ai', label: 'AI & Computer Vision', defaultHighlight: 'YOLO · OpenCV · PyTorch' },
  { key: 'cg', label: 'Computer Graphics & 3D', defaultHighlight: '3D Worlds · GIS · Visualization' },
  { key: 'xr', label: 'AR/VR & XR', defaultHighlight: 'WebXR · OpenXR · AR Foundation' },
  { key: 'game', label: 'Game Development', defaultHighlight: 'Unity · C# · Unreal Engine' },
];

/* ---------- server mode ---------- */

const TOKEN_KEY = 'portfolio_admin_token';

function getServerToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

function setServerToken(token) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* storage unavailable — token lives only in memory for this tab */
  }
}

async function request(path, { method = 'GET', body, auth = false, raw = false } = {}) {
  const headers = {};
  if (auth) headers.Authorization = `Bearer ${getServerToken() || ''}`;
  if (body !== undefined && !raw) headers['Content-Type'] = 'application/json';
  let res;
  try {
    res = await fetch(path, { method, headers, body: raw ? body : body !== undefined ? JSON.stringify(body) : undefined });
  } catch {
    throw new Error('Cannot reach the server. Is it running?');
  }
  const data = await res.json().catch(() => ({}));
  if (res.status === 401 && auth) {
    setServerToken(null);
    throw new AuthError(data.error || 'Session expired. Please log in again.');
  }
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
}

const serverApi = {
  login: async (password) => {
    const { token } = await request('/api/login', { method: 'POST', body: { password } });
    setServerToken(token);
  },
  session: () => request('/api/session', { auth: true }),
  getContent: () => request('/api/content'),
  saveContent: (content) => request('/api/content', { method: 'PUT', body: content, auth: true }),
  upload: async (files) => {
    const form = new FormData();
    for (const f of files) form.append('files', f);
    const { urls } = await request('/api/upload', { method: 'POST', body: form, auth: true, raw: true });
    return urls;
  },
  // Site-relative image paths are previewed from the site's public folder, which the server serves at /site.
  assetUrls: (src) => (!src ? [] : src.startsWith('/') && !src.startsWith('//') ? [`/site${encodeURI(src)}`] : [src]),
};

/* ---------- the active mode ---------- */

/**
 * login(secret, { remember }) · session() · getContent() · saveContent(content, { force }) ·
 * upload(files) -> site paths · assetUrls(src) -> preview URLs to try in order.
 * saveContent resolves to { content, message? }.
 */
export const api = MODE === 'github' ? github : serverApi;
export const getToken = MODE === 'github' ? github.getToken : getServerToken;
export const setToken = MODE === 'github' ? github.setToken : setServerToken;

export const slugify = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
