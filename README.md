# Portfolio

| Folder    | What it is                                                              | URL path   |
|-----------|-------------------------------------------------------------------------|------------|
| `front/`  | The public portfolio site (Vite + React)                                | `/`        |
| `admin/`  | Admin dashboard to edit profile, links, skills, experience and projects | `/admin`   |
| `server/` | Serves the site, the admin, and the content API                         | `/api`     |

All site content lives in **`front/src/data/content.json`**. The admin edits it through the server, or,
on Netlify and GitHub Pages, by committing to GitHub (see below).

## First-time setup

```bash
cd server && npm install && cp .env.example .env   # then set ADMIN_PASSWORD in server/.env
cd ../admin && npm install
cd ../front && npm install
```

## Production: one server, one domain

From the repo root:

```bash
npm run setup    # first time only: installs server, admin and front
npm run build    # builds front + admin (rerun after code changes)
npm start        # one server on http://localhost:4000 (set PORT in server/.env)
# or: npm run serve   (build + start)
```

- `https://your-domain/` serves the portfolio site
- `https://your-domain/admin` serves the admin dashboard (log in with `ADMIN_PASSWORD`)
- `https://your-domain/api/...` serves the content API

The server serves the site in live mode: it loads content from `/api/content`. Edits you save in the admin
appear after a page refresh, with no rebuild. Rebuild `front` only after code changes.
Point your domain at the machine running the server, ideally behind a reverse proxy with HTTPS (nginx, Caddy, IIS…).

Uploaded images are saved to `front/public/uploads/` and served at `/uploads/...`.
Every save backs up the previous content to `server/backups/` (the last 30 are kept).

## Development

Run these in three terminals:

```bash
cd server && npm run dev     # API on :4000
cd admin  && npm run dev     # admin dev server on :5174
cd front  && npm run dev     # site on :8080
```

Open http://localhost:8080 for the site and http://localhost:8080/admin for the admin, the same layout as production.
The site reloads automatically when you save in the admin.

## GitHub Pages and Netlify (online admin)

Both hosts publish the site and the admin as static files, rebuilt on every push to `main`:

- **Netlify:** the site at `/`, the admin at `/admin/`. `netlify.toml` holds the build settings and
  overrides the Netlify dashboard, so there is nothing to set there.
- **GitHub Pages:** `.github/workflows/deploy.yml` builds for the `/portfolio_site/` sub-path.
  Site: https://mightyeagle-1052.github.io/portfolio_site/ · admin: https://mightyeagle-1052.github.io/portfolio_site/admin/

These hosts can't run the server, so the online admin signs in with a **GitHub token** instead of the
password, and **Save** commits `front/src/data/content.json` (plus any new images, in `front/public/uploads/`)
straight to the repository. Netlify and GitHub Pages then rebuild, and the change is live in about
1–2 minutes. Each save is one commit and one build on each host.

To get a token, click **How do I get a token?** on the admin's sign-in page. It opens GitHub's new-token
page with the name, expiry and permission filled in; choose **Only select repositories** and this
repository, check that **Contents** is **Read and write**, and generate it. The token stays in your browser
(tick **Remember me on this device** to keep it after the tab closes) and is sent only to GitHub. If the
token expires or is deleted, the admin asks for a new one.

If you also edit with the admin on your own server (`npm start`), run `git pull` first so you start from
the latest online saves, then commit and push your local edits.

Build the static copy yourself with `npm run setup:static && npm run build:static` (output in `front/dist`,
admin in `front/dist/admin`). `BASE_PATH=/sub-path/` builds for a sub-path. The admin saves to the GitHub
repository and branch it was built from; set `ADMIN_GITHUB_REPO=owner/repo` and `ADMIN_GITHUB_BRANCH` to override.
