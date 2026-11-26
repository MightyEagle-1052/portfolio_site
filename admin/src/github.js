// GitHub mode: the admin as built by `npm run build:static` for static hosts (Netlify, GitHub Pages).
// No server runs there, so the admin reads front/src/data/content.json from the GitHub repository and
// saves by committing to it, using the user's own fine-grained token. Each save is one commit with the
// new content.json plus any images it uses; the hosts then rebuild the site from that commit.
import { normalizeContent, serializeContent } from '../../shared/content-schema.mjs';
import { AuthError, ConflictError } from './errors.js';

/** { owner, repo, branch } this copy of the admin saves to. Set at build time in vite.config.js. */
export const TARGET = __GITHUB_TARGET__;
export const REPO_NAME = TARGET ? `${TARGET.owner}/${TARGET.repo}` : '';

const API = 'https://api.github.com';
const CONTENT_PATH = 'front/src/data/content.json';
const CONTENT_DIR = 'front/src/data';
const PUBLIC_DIR = 'front/public'; // the site serves this folder at its root: /uploads/x.png is front/public/uploads/x.png
const TOKEN_KEY = 'portfolio_admin_github_token';
const MAX_UPLOAD_BYTES = 15 * 1024 * 1024;
const IMAGE_TYPES = {
  'image/png': '.png',
  'image/jpeg': '.jpg',
  'image/webp': '.webp',
  'image/gif': '.gif',
  'image/avif': '.avif',
};

const repoApi = TARGET ? `/repos/${TARGET.owner}/${TARGET.repo}` : '';
const branchRef = TARGET ? TARGET.branch.split('/').map(encodeURIComponent).join('/') : '';
// The public site, next to the admin (which lives at <site>/admin/).
const SITE_BASE = import.meta.env.BASE_URL.replace(/admin\/$/, '');

/** GitHub's new-token page with the name, expiry and permission filled in (the repository is picked by hand). */
export const TOKEN_HELP_URL = `https://github.com/settings/personal-access-tokens/new?${new URLSearchParams({
  name: 'Portfolio admin',
  description: `Lets the portfolio admin page save content to ${REPO_NAME || 'the site repository'}.`,
  ...(TARGET && { target_name: TARGET.owner }),
  expires_in: '366',
  contents: 'write',
})}`;

export const NOT_CONNECTED =
  'This copy of the admin is not connected to a GitHub repository. Rebuild it with ADMIN_GITHUB_REPO=owner/repo.';

/* ---------- token storage ---------- */

let memoryToken = null;

export function getToken() {
  try {
    return sessionStorage.getItem(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY) || memoryToken;
  } catch {
    return memoryToken;
  }
}

/** Keep the token for this tab only, or on this device when `remember` is set. */
export function setToken(token, { remember = false } = {}) {
  memoryToken = token || null;
  try {
    sessionStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_KEY);
    if (token) (remember ? localStorage : sessionStorage).setItem(TOKEN_KEY, token);
  } catch {
    /* storage unavailable: the token lives only in memory for this tab */
  }
}

/* ---------- GitHub REST API ---------- */

async function gh(path, { method = 'GET', body, token = getToken() } = {}) {
  let res;
  try {
    res = await fetch(API + path, {
      method,
      cache: 'no-store',
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${token}`,
        ...(body !== undefined && { 'Content-Type': 'application/json' }),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new Error('Cannot reach GitHub. Check your internet connection and try again.');
  }
  const data = await res.json().catch(() => ({}));
  if (res.ok) return data;
  throw githubError(res, data, method);
}

function githubError(res, data, method) {
  const message = typeof data?.message === 'string' ? data.message : '';
  let err;
  if (res.status === 401) {
    setToken(null);
    err = new AuthError('GitHub did not accept the token. It may be mistyped, expired or deleted. Sign in with a new token.');
  } else if ((res.status === 403 || res.status === 429) && (res.headers.get('x-ratelimit-remaining') === '0' || /rate limit/i.test(message))) {
    err = new Error('GitHub is limiting requests right now. Wait a few minutes, then try again.');
  } else if (res.status === 403 || (res.status === 404 && method !== 'GET')) {
    err = new Error(
      `This token can't save to ${REPO_NAME}. Create a token that has access to that repository with "Contents: Read and write".`,
    );
  } else if (res.status === 404) {
    err = new Error(`GitHub can't find ${REPO_NAME} (branch ${TARGET.branch}), or this token can't read it.`);
  } else {
    err = new Error(`GitHub request failed (${res.status}${message ? `: ${message}` : ''}).`);
  }
  err.status = res.status;
  return err;
}

const decodeBase64Utf8 = (b64) =>
  new TextDecoder().decode(Uint8Array.from(atob(b64.replace(/\s/g, '')), (c) => c.charCodeAt(0)));

/* ---------- sign in ---------- */

export async function login(rawToken, { remember = false } = {}) {
  if (!TARGET) throw new Error(NOT_CONNECTED);
  const token = rawToken.trim();
  await gh('/user', { token }); // is the token valid?
  await gh(repoApi, { token }); // can it see the repository?
  // Can it write? Creating a blob needs "Contents: write" but changes nothing: a blob that no commit
  // points to never shows up in the repository.
  await gh(`${repoApi}/git/blobs`, { method: 'POST', token, body: { content: 'portfolio admin access check\n', encoding: 'utf-8' } });
  setToken(token, { remember });
}

export async function session() {
  if (!getToken()) return { valid: false };
  try {
    await gh('/user');
    return { valid: true };
  } catch (err) {
    if (err instanceof AuthError) return { valid: false };
    throw err;
  }
}

/* ---------- content ---------- */

// Blob id of content.json as last loaded or saved here. If GitHub has a different one at save time,
// someone saved or pushed in between, and the user is asked before that change is replaced.
let baseSha = null;

export async function getContent() {
  const file = await gh(`${repoApi}/contents/${CONTENT_PATH}?ref=${encodeURIComponent(TARGET.branch)}`);
  // Files over 1 MB come without content from this endpoint; fetch those by blob id.
  const base64 = file.content || (await gh(`${repoApi}/git/blobs/${file.sha}`)).content;
  baseSha = file.sha;
  return JSON.parse(decodeBase64Utf8(base64));
}

async function contentShaAt(commitSha) {
  const entries = await gh(`${repoApi}/contents/${CONTENT_DIR}?ref=${commitSha}`);
  return entries.find((e) => e.path === CONTENT_PATH)?.sha ?? null;
}

export async function saveContent(draft, { force = false } = {}) {
  const content = normalizeContent(draft);
  const text = serializeContent(content);
  // Images uploaded in this session go into the same commit, but only the ones the content uses.
  const uploads = [...pendingUploads].filter(([path]) => text.includes(JSON.stringify(path)));
  const blob = await gh(`${repoApi}/git/blobs`, { method: 'POST', body: { content: text, encoding: 'utf-8' } });

  for (let attempt = 1; ; attempt++) {
    const head = (await gh(`${repoApi}/git/ref/heads/${branchRef}`)).object.sha;
    const current = await contentShaAt(head);
    if (!force && baseSha && current !== baseSha && current !== blob.sha) {
      throw new ConflictError(
        'The content on GitHub changed after you opened the admin (for example, a save from another device). Saving now will replace that change.',
      );
    }
    if (current === blob.sha && uploads.length === 0) {
      baseSha = blob.sha;
      return { content, message: 'Nothing to save: GitHub already has this content.' };
    }

    const baseTree = (await gh(`${repoApi}/git/commits/${head}`)).tree.sha;
    const tree = await gh(`${repoApi}/git/trees`, {
      method: 'POST',
      body: {
        base_tree: baseTree,
        tree: [
          { path: CONTENT_PATH, mode: '100644', type: 'blob', sha: blob.sha },
          ...uploads.map(([path, sha]) => ({ path: PUBLIC_DIR + path, mode: '100644', type: 'blob', sha })),
        ],
      },
    });
    const commit = await gh(`${repoApi}/git/commits`, {
      method: 'POST',
      body: { message: 'Update site content from the admin', tree: tree.sha, parents: [head] },
    });
    try {
      await gh(`${repoApi}/git/refs/heads/${branchRef}`, { method: 'PATCH', body: { sha: commit.sha, force: false } });
    } catch (err) {
      // 422: the branch moved while this save was running (a push or another save). Redo it on top.
      if (err.status === 422 && attempt < 3) continue;
      throw err;
    }
    baseSha = blob.sha;
    for (const [path] of uploads) pendingUploads.delete(path);
    return { content, message: 'Saved to GitHub. Your site will update in about 1–2 minutes.' };
  }
}

/* ---------- images ---------- */

const pendingUploads = new Map(); // site path -> blob id, committed by the next save that uses it
const previews = new Map(); // site path -> local copy of an uploaded image, shown until the site has it

const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).slice(String(reader.result).indexOf(',') + 1));
    reader.onerror = () => reject(new Error(`Could not read "${file.name}".`));
    reader.readAsDataURL(file);
  });

const fileStem = (name) =>
  name
    .replace(/\.[^.]*$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40) || 'image';

const randomHex = () => [...crypto.getRandomValues(new Uint8Array(4))].map((b) => b.toString(16).padStart(2, '0')).join('');

export async function upload(files) {
  for (const f of files) {
    if (!IMAGE_TYPES[f.type]) throw new Error('Only PNG, JPG, WEBP, GIF or AVIF images are allowed.');
    if (f.size > MAX_UPLOAD_BYTES) throw new Error(`"${f.name}" is larger than 15 MB.`);
  }
  const urls = [];
  for (const f of files) {
    // Upload the file now; it is added to the site with the next save.
    const { sha } = await gh(`${repoApi}/git/blobs`, { method: 'POST', body: { content: await toBase64(f), encoding: 'base64' } });
    const path = `/uploads/${fileStem(f.name)}-${randomHex()}${IMAGE_TYPES[f.type]}`;
    pendingUploads.set(path, sha);
    previews.set(path, URL.createObjectURL(f));
    urls.push(path);
  }
  return urls;
}

/**
 * Where to load a content image from for previews, best first: the local copy of a fresh upload,
 * the published site, then the file on GitHub (for images saved but not yet on the rebuilt site).
 */
export function assetUrls(src) {
  if (!src) return [];
  if (!src.startsWith('/') || src.startsWith('//')) return [src];
  return [
    previews.get(src),
    SITE_BASE + encodeURI(src.slice(1)),
    TARGET && `https://raw.githubusercontent.com/${TARGET.owner}/${TARGET.repo}/${TARGET.branch}/${PUBLIC_DIR}${encodeURI(src)}`,
  ].filter(Boolean);
}
