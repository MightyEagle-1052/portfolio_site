import fs from 'node:fs/promises';
import path from 'node:path';
import { config } from './config.js';
import { serializeContent } from '../../shared/content-schema.mjs';

// Validation is shared with the admin's GitHub mode, which saves without this server.
export { ValidationError, normalizeContent } from '../../shared/content-schema.mjs';

export async function readContent() {
  return JSON.parse(await fs.readFile(config.contentFile, 'utf8'));
}

/* ---------- saving with backups ---------- */

async function backupCurrent() {
  try {
    const current = await fs.readFile(config.contentFile, 'utf8');
    await fs.mkdir(config.backupDir, { recursive: true });
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    await fs.writeFile(path.join(config.backupDir, `content-${stamp}.json`), current);
    const files = (await fs.readdir(config.backupDir)).filter((f) => f.startsWith('content-')).sort();
    for (const old of files.slice(0, Math.max(0, files.length - config.maxBackups))) {
      await fs.unlink(path.join(config.backupDir, old));
    }
  } catch (err) {
    if (err.code !== 'ENOENT') throw err;
  }
}

let writing = Promise.resolve();

export function saveContent(content) {
  // Serialize writes so two quick saves can't interleave.
  writing = writing.catch(() => {}).then(async () => {
    await backupCurrent();
    const tmp = `${config.contentFile}.tmp`;
    await fs.writeFile(tmp, serializeContent(content));
    await fs.rename(tmp, config.contentFile);
  });
  return writing;
}
