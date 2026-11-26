import { execFileSync } from 'node:child_process';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The admin lives at <site>/admin on the same domain as the site.
// In development it runs on :5174 (reachable via the site's dev server at :8080/admin)
// and forwards API / image requests to the server.
const API = process.env.ADMIN_API_URL || 'http://localhost:4000';

// Where the public site is served: '/' or a sub-path such as '/portfolio_site/' on GitHub Pages.
const SITE_BASE = (process.env.BASE_PATH || '/').replace(/\/?$/, '/');

export default defineConfig(({ mode }) => ({
  base: `${SITE_BASE}admin/`,
  plugins: [react()],
  define: {
    // Mode "static" (npm run build:static) builds the admin for Netlify / GitHub Pages, where it saves by
    // committing to this GitHub repository. Other builds talk to the portfolio server instead.
    __GITHUB_TARGET__: JSON.stringify(mode === 'static' ? githubTarget() : null),
  },
  server: {
    port: 5174,
    strictPort: true,
    hmr: { clientPort: 5174 },
    proxy: {
      '/api': API,
      '/site': API,
      '/uploads': API,
    },
    // The content rules are shared with the server (../shared).
    fs: { allow: ['.', '../shared'] },
  },
}));

/** The GitHub repository and branch the static admin saves to, from the build environment. */
function githubTarget() {
  const env = process.env;
  const repo =
    parseRepo(env.ADMIN_GITHUB_REPO) || // set by hand: owner/repo
    parseRepo(env.GITHUB_REPOSITORY) || // GitHub Actions
    parseRepo(env.REPOSITORY_URL) || // Netlify
    parseRepo(git('remote', 'get-url', 'origin'));
  if (!repo) {
    console.warn('\n[admin] GitHub repository not found: set ADMIN_GITHUB_REPO=owner/repo. Saving will be disabled.\n');
    return null;
  }
  const branch =
    env.ADMIN_GITHUB_BRANCH ||
    (env.GITHUB_REF_TYPE === 'branch' && env.GITHUB_REF_NAME) || // GitHub Actions
    env.BRANCH || // Netlify
    git('rev-parse', '--abbrev-ref', 'HEAD').replace(/^HEAD$/, '') ||
    'main';
  console.log(`[admin] Static admin saves to github.com/${repo.owner}/${repo.repo} (branch ${branch})`);
  return { ...repo, branch };
}

function parseRepo(value) {
  const s = String(value || '').trim();
  const m = s.match(/^([\w.-]+)\/([\w.-]+)$/) || s.match(/github\.com[/:]([\w.-]+)\/([\w.-]+?)(?:\.git)?\/?$/);
  return m ? { owner: m[1], repo: m[2] } : null;
}

function git(...args) {
  try {
    return execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return '';
  }
}
