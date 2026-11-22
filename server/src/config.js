import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const SERVER_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const fromRoot = (p) => path.resolve(SERVER_ROOT, p);

export const config = {
  port: Number(process.env.PORT) || 4000,
  adminPassword: process.env.ADMIN_PASSWORD || '',
  tokenSecret: process.env.TOKEN_SECRET || crypto.randomBytes(32).toString('hex'),
  tokenTtlMs: (Number(process.env.TOKEN_TTL_HOURS) || 12) * 60 * 60 * 1000,
  contentFile: fromRoot(process.env.CONTENT_FILE || '../front/src/data/content.json'),
  publicDir: fromRoot(process.env.PUBLIC_DIR || '../front/public'),
  adminDist: fromRoot(process.env.ADMIN_DIST || '../admin/dist'),
  frontDist: fromRoot(process.env.FRONT_DIST || '../front/dist'),
  backupDir: fromRoot('backups'),
  maxBackups: 30,
  corsOrigin: (process.env.CORS_ORIGIN || '*').split(',').map((s) => s.trim()).filter(Boolean),
};

config.uploadDir = path.join(config.publicDir, 'uploads');
