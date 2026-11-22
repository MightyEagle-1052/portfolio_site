import fs from 'node:fs/promises';
import path from 'node:path';
import { config } from './config.js';

export const TAGS = ['AI&CV', 'CG&3D', 'AR/VR&XR', 'GameDev'];
export const DOMAIN_KEYS = ['ai', 'cg', 'xr', 'game'];
const SKILL_DOMAINS = [...DOMAIN_KEYS, 'web'];

export async function readContent() {
  return JSON.parse(await fs.readFile(config.contentFile, 'utf8'));
}

/* ---------- validation / normalization ---------- */

class ValidationError extends Error {}
export { ValidationError };

const fail = (where, msg) => {
  throw new ValidationError(`${where}: ${msg}`);
};

function str(v, where, { required = false } = {}) {
  if (v === undefined || v === null) v = '';
  if (typeof v !== 'string') fail(where, 'must be text');
  const s = v.trim();
  if (required && !s) fail(where, 'is required');
  return s;
}

function strList(v, where) {
  if (v === undefined || v === null) return [];
  if (!Array.isArray(v)) fail(where, 'must be a list');
  return v.map((x, i) => str(x, `${where}[${i}]`)).filter(Boolean);
}

function list(v, where, fn) {
  if (v === undefined || v === null) return [];
  if (!Array.isArray(v)) fail(where, 'must be a list');
  return v.map((item, i) => {
    if (!item || typeof item !== 'object') fail(`${where}[${i}]`, 'must be an object');
    return fn(item, `${where}[${i}]`);
  });
}

function oneOf(v, allowed, where) {
  if (!allowed.includes(v)) fail(where, `must be one of ${allowed.join(', ')}`);
  return v;
}

/** Copy an object, dropping optional keys whose value is empty. */
function compact(obj, optionalKeys) {
  const out = { ...obj };
  for (const k of optionalKeys) {
    const v = out[k];
    if (v === undefined || v === '' || (Array.isArray(v) && v.length === 0)) delete out[k];
  }
  return out;
}

export function normalizeContent(input) {
  if (!input || typeof input !== 'object') fail('content', 'must be an object');
  const p = input.profile || {};
  const l = input.links || {};
  const img = input.images || {};

  const years = Number(p.yearsExperience);
  if (!Number.isFinite(years) || years < 0) fail('profile.yearsExperience', 'must be a positive number');

  const content = {
    profile: {
      name: str(p.name, 'profile.name', { required: true }),
      firstName: str(p.firstName, 'profile.firstName'),
      monogram: str(p.monogram, 'profile.monogram'),
      role: str(p.role, 'profile.role'),
      yearsExperience: years,
      heroDescription: str(p.heroDescription, 'profile.heroDescription'),
      shortBio: str(p.shortBio, 'profile.shortBio'),
      hireNote: str(p.hireNote, 'profile.hireNote'),
    },
    links: {
      linkedin: str(l.linkedin, 'links.linkedin'),
      telegram: str(l.telegram, 'links.telegram'),
      whatsapp: str(l.whatsapp, 'links.whatsapp'),
      email: str(l.email, 'links.email'),
      github: str(l.github, 'links.github'),
      booking: str(l.booking, 'links.booking'),
    },
    crmSubscribeUrl: str(input.crmSubscribeUrl, 'crmSubscribeUrl'),
    images: {
      hero: str(img.hero, 'images.hero'),
      about: str(img.about, 'images.about'),
    },
    domains: list(input.domains, 'domains', (d, w) => ({
      key: oneOf(d.key, DOMAIN_KEYS, `${w}.key`),
      title: str(d.title, `${w}.title`, { required: true }),
      short: str(d.short, `${w}.short`),
      description: str(d.description, `${w}.description`),
      technologies: strList(d.technologies, `${w}.technologies`),
    })),
    skillCategories: list(input.skillCategories, 'skillCategories', (c, w) => ({
      title: str(c.title, `${w}.title`, { required: true }),
      domain: oneOf(c.domain, SKILL_DOMAINS, `${w}.domain`),
      skills: list(c.skills, `${w}.skills`, (s, sw) =>
        compact({ name: str(s.name, `${sw}.name`, { required: true }), logo: str(s.logo, `${sw}.logo`) }, ['logo']),
      ),
    })),
    capabilities: list(input.capabilities, 'capabilities', (c, w) => ({
      domain: oneOf(c.domain, DOMAIN_KEYS, `${w}.domain`),
      title: str(c.title, `${w}.title`, { required: true }),
      text: str(c.text, `${w}.text`),
    })),
    experience: list(input.experience, 'experience', (e, w) => ({
      position: str(e.position, `${w}.position`, { required: true }),
      organization: str(e.organization, `${w}.organization`),
      period: str(e.period, `${w}.period`),
      responsibilities: strList(e.responsibilities, `${w}.responsibilities`),
      technologies: strList(e.technologies, `${w}.technologies`),
    })),
    testimonials: list(input.testimonials, 'testimonials', (t, w) =>
      compact(
        {
          name: str(t.name, `${w}.name`, { required: true }),
          position: str(t.position, `${w}.position`),
          company: str(t.company, `${w}.company`),
          quote: str(t.quote, `${w}.quote`, { required: true }),
          image: str(t.image, `${w}.image`),
        },
        ['image'],
      ),
    ),
    projects: list(input.projects, 'projects', (pr, w) => {
      const id = str(pr.id, `${w}.id`, { required: true });
      if (!/^[a-z0-9][a-z0-9-]*$/.test(id)) fail(`${w}.id`, 'use lowercase letters, numbers and dashes only');
      const tags = strList(pr.tags, `${w}.tags`).map((t, i) => oneOf(t, TAGS, `${w}.tags[${i}]`));
      let featuredRank;
      if (pr.featuredRank !== undefined && pr.featuredRank !== null && pr.featuredRank !== '') {
        featuredRank = Number(pr.featuredRank);
        if (!Number.isInteger(featuredRank) || featuredRank < 1) fail(`${w}.featuredRank`, 'must be a whole number ≥ 1');
      }
      return compact(
        {
          id,
          title: str(pr.title, `${w}.title`, { required: true }),
          subtitle: str(pr.subtitle, `${w}.subtitle`),
          description: str(pr.description, `${w}.description`),
          overview: str(pr.overview, `${w}.overview`),
          role: str(pr.role, `${w}.role`),
          image: str(pr.image, `${w}.image`, { required: true }),
          screenshots: strList(pr.screenshots, `${w}.screenshots`),
          technologies: strList(pr.technologies, `${w}.technologies`),
          tags: [...new Set(tags)],
          features: strList(pr.features, `${w}.features`),
          liveDemo: str(pr.liveDemo, `${w}.liveDemo`),
          github: str(pr.github, `${w}.github`),
          featuredRank,
        },
        ['subtitle', 'overview', 'role', 'screenshots', 'features', 'liveDemo', 'github', 'featuredRank'],
      );
    }),
  };

  const ids = new Set();
  for (const pr of content.projects) {
    if (ids.has(pr.id)) fail('projects', `duplicate project id "${pr.id}"`);
    ids.add(pr.id);
  }
  return content;
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
    await fs.writeFile(tmp, JSON.stringify(content, null, 2) + '\n');
    await fs.rename(tmp, config.contentFile);
  });
  return writing;
}
