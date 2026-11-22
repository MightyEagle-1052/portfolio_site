import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { pathToFileURL } from 'node:url';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { config } from './config.js';
import { checkPassword, issueToken, requireAuth, loginLimiter, verifyToken } from './auth.js';
import { readContent, normalizeContent, saveContent, ValidationError } from './content.js';

const app = express();
app.disable('x-powered-by');
app.set('trust proxy', 'loopback');
app.use(express.json({ limit: '5mb' }));

const corsOptions = {
  origin: config.corsOrigin.includes('*') ? true : config.corsOrigin,
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use('/api', cors(corsOptions));

/* ---------- auth ---------- */

app.post('/api/login', loginLimiter, (req, res) => {
  if (!config.adminPassword) {
    return res.status(503).json({ error: 'ADMIN_PASSWORD is not set on the server. Add it to server/.env.' });
  }
  if (!checkPassword(req.body?.password)) return res.status(401).json({ error: 'Wrong password.' });
  res.json({ token: issueToken(), expiresInMs: config.tokenTtlMs });
});

app.get('/api/session', (req, res) => {
  const header = req.get('authorization') || '';
  res.json({ valid: verifyToken(header.replace(/^Bearer /, '')) });
});

/* ---------- content ---------- */

app.get('/api/content', async (_req, res, next) => {
  try {
    res.set('Cache-Control', 'no-store');
    res.json(await readContent());
  } catch (err) {
    next(err);
  }
});

app.put('/api/content', requireAuth, async (req, res, next) => {
  try {
    const content = normalizeContent(req.body);
    await saveContent(content);
    res.json({ ok: true, savedAt: new Date().toISOString(), content });
  } catch (err) {
    if (err instanceof ValidationError) return res.status(400).json({ error: err.message });
    next(err);
  }
});

/* ---------- image uploads ---------- */

const IMAGE_TYPES = {
  'image/png': '.png',
  'image/jpeg': '.jpg',
  'image/webp': '.webp',
  'image/gif': '.gif',
  'image/avif': '.avif',
};

const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => {
      fs.mkdirSync(config.uploadDir, { recursive: true });
      cb(null, config.uploadDir);
    },
    filename: (_req, file, cb) => {
      const base = path
        .parse(file.originalname)
        .name.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 40) || 'image';
      cb(null, `${base}-${crypto.randomBytes(4).toString('hex')}${IMAGE_TYPES[file.mimetype]}`);
    },
  }),
  limits: { fileSize: 15 * 1024 * 1024, files: 20 },
  fileFilter: (_req, file, cb) => {
    if (IMAGE_TYPES[file.mimetype]) cb(null, true);
    else cb(new ValidationError('Only PNG, JPG, WEBP, GIF or AVIF images are allowed.'));
  },
});

app.post('/api/upload', requireAuth, upload.array('files', 20), (req, res) => {
  const urls = (req.files || []).map((f) => `/uploads/${f.filename}`);
  res.json({ urls });
});

/* ---------- static files ---------- */

// The front-end's public folder (project images, uploads) — used for previews in the admin.
app.use('/site', express.static(config.publicDir, { fallthrough: false }));
// Uploaded images, also reachable directly (useful in live-content mode).
app.use('/uploads', express.static(config.uploadDir));

// Built admin dashboard at /admin.
const adminIndex = path.join(config.adminDist, 'index.html');
if (fs.existsSync(adminIndex)) {
  app.get('/admin', (req, res, next) => (req.path === '/admin' ? res.redirect(301, '/admin/') : next()));
  app.use('/admin', express.static(config.adminDist));
  app.get(/^\/admin(\/.*)?$/, (_req, res) => res.sendFile(adminIndex));
} else {
  app.get(/^\/admin(\/.*)?$/, (_req, res) =>
    res.status(503).type('text').send('Admin is not built yet. Run: cd admin && npm run build'),
  );
}

// Built portfolio site at /. Its index.html gets a small script that tells the site to
// load live content from this server, so saved edits show up without rebuilding.
// The <title> and meta tags are also rebuilt from the live content (front/site-meta.js),
// so the browser tab and link previews show the latest saved name and role.
const frontIndex = path.join(config.frontDist, 'index.html');
if (fs.existsSync(frontIndex)) {
  let applySiteMeta = (html) => html;
  const siteMetaModule = path.resolve(config.frontDist, '..', 'site-meta.js');
  if (fs.existsSync(siteMetaModule)) {
    ({ applySiteMeta } = await import(pathToFileURL(siteMetaModule).href));
  } else {
    console.warn(`  site-meta.js not found next to ${config.frontDist}; page titles won't follow content edits.`);
  }

  const sendFront = async (_req, res, next) => {
    try {
      let html = await fs.promises.readFile(frontIndex, 'utf8');
      try {
        html = applySiteMeta(html, await readContent());
      } catch (err) {
        console.warn('Could not apply page title/meta from content:', err.message);
      }
      const inject = `<script>window.__CONTENT_URL__ = '/api/content';</script>`;
      res.set('Cache-Control', 'no-cache').type('html').send(html.replace('<head>', `<head>${inject}`));
    } catch (err) {
      next(err);
    }
  };
  app.get('/', sendFront);
  app.use(express.static(config.frontDist, { index: false }));
  app.get(/^\/(?!api\/|admin\/|uploads\/|site\/).*/, sendFront);
} else {
  app.get('/', (_req, res) =>
    res.type('text').send('Portfolio API is running. Build the site (cd front && npm run build) to serve it here.'),
  );
}

/* ---------- errors ---------- */

app.use('/api', (_req, res) => res.status(404).json({ error: 'Not found' }));

app.use((err, _req, res, _next) => {
  if (err instanceof ValidationError) return res.status(400).json({ error: err.message });
  if (err instanceof multer.MulterError) return res.status(400).json({ error: err.message });
  if (err.status === 404 || err.statusCode === 404) return res.status(404).json({ error: 'Not found' });
  console.error(err);
  res.status(500).json({ error: 'Server error. Check the server logs.' });
});

app.listen(config.port, () => {
  console.log(`Portfolio server running on http://localhost:${config.port}`);
  console.log(`  content file: ${config.contentFile}`);
  console.log(`  uploads:      ${config.uploadDir}`);
  if (!config.adminPassword) console.warn('  WARNING: ADMIN_PASSWORD is not set — logins are disabled. See .env.example');
});
