# Portfolio

| Folder    | What it is                                                              | URL path   |
|-----------|-------------------------------------------------------------------------|------------|
| `front/`  | The public portfolio site (Vite + React)                                | `/`        |
| `admin/`  | Admin dashboard to edit profile, links, skills, experience and projects | `/admin`   |
| `server/` | Serves the site, the admin, and the content API                         | `/api`     |

All site content lives in **`front/src/data/content.json`**. The admin edits it through the server.

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

## GitHub Pages and Netlify (static copies)

Both hosts publish only the public site (`front/`), built with the bundled `content.json`. They can't run
the server, so `/admin` only works on your own server. To update them, commit `front/src/data/content.json`
(and `front/public/uploads`) and push to `main`. Each host rebuilds on every push.

- **GitHub Pages:** `.github/workflows/deploy.yml` builds the site for the `/portfolio_site/` sub-path.
  Live at https://mightyeagle-1052.github.io/portfolio_site/
- **Netlify:** `netlify.toml` tells Netlify to install and build inside `front/` and publish `front/dist`.
  It overrides the build settings in the Netlify dashboard, so you don't need to set those yourself.
