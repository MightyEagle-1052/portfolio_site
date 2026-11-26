// Validation for front/src/data/content.json, shared by the server (server/src/content.js) and by the
// admin's GitHub mode (admin/src/github.js), which saves without a server. Plain JavaScript with no
// imports, so it runs in Node and in the browser.

/** Color themes an area of expertise can use. The site maps each name to Tailwind classes (front/src/data/site.ts). */
export const AREA_COLORS = ['cyan', 'violet', 'blue', 'green', 'amber', 'red', 'orange', 'pink', 'teal', 'gray'];
/** Icons an area can use. The site maps each name to an icon (front/src/components/portfolio/Shared.tsx). */
export const AREA_ICONS = [
  'brain', 'box', 'glasses', 'gamepad', 'code', 'cpu', 'database', 'cloud', 'phone', 'globe',
  'shield', 'chart', 'palette', 'bot', 'layers', 'rocket', 'wrench', 'server', 'camera', 'map',
  'microscope', 'stethoscope', 'car', 'plane', 'factory', 'leaf', 'music', 'graduation', 'sparkles',
];
/** The original four areas: the tag, color, icon and hero badge text they use when the content leaves them out. */
export const BUILTIN_AREAS = {
  ai: { tag: 'AI&CV', color: 'cyan', icon: 'brain', highlight: 'YOLO · OpenCV · PyTorch' },
  cg: { tag: 'CG&3D', color: 'violet', icon: 'box', highlight: '3D Worlds · GIS · Visualization' },
  xr: { tag: 'AR/VR&XR', color: 'blue', icon: 'glasses', highlight: 'WebXR · OpenXR · AR Foundation' },
  game: { tag: 'GameDev', color: 'green', icon: 'gamepad', highlight: 'Unity · C# · Unreal Engine' },
};
/** Skill categories can also use this style, which belongs to no area. */
const SKILLS_ONLY_DOMAIN = 'web';
const MAX_TAG_LENGTH = 24;

/** Hero badge text used when an area's own is empty. */
export const defaultHighlight = (area) =>
  BUILTIN_AREAS[area.key]?.highlight || (area.technologies || []).slice(0, 3).join(' · ');

/** Content with every area's tag, color and icon filled in (older content leaves them out). Does not validate. */
export function withAreaDefaults(content) {
  if (!content || !Array.isArray(content.domains)) return content;
  return {
    ...content,
    domains: content.domains.map((d) => {
      const builtin = BUILTIN_AREAS[d?.key] || {};
      return { ...d, tag: d.tag || builtin.tag || d.title || d.key, color: d.color || builtin.color || 'gray', icon: d.icon || builtin.icon || 'sparkles' };
    }),
  };
}

export class ValidationError extends Error {}

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

  // Areas of expertise come first: skill categories and capabilities point to an area by its key,
  // and projects by its tag.
  const domains = list(input.domains, 'domains', (d, w) => {
    const key = str(d.key, `${w}.key`, { required: true });
    if (!/^[a-z0-9][a-z0-9-]*$/.test(key)) fail(`${w}.key`, 'use lowercase letters, numbers and dashes only');
    const builtin = BUILTIN_AREAS[key] || {};
    const tag = str(d.tag, `${w}.tag`) || builtin.tag;
    if (!tag) fail(`${w}.tag`, 'is required');
    if (tag.length > MAX_TAG_LENGTH) fail(`${w}.tag`, `must be ${MAX_TAG_LENGTH} characters or fewer`);
    return {
      key,
      tag,
      color: oneOf(str(d.color, `${w}.color`) || builtin.color || 'gray', AREA_COLORS, `${w}.color`),
      icon: oneOf(str(d.icon, `${w}.icon`) || builtin.icon || 'sparkles', AREA_ICONS, `${w}.icon`),
      title: str(d.title, `${w}.title`, { required: true }),
      short: str(d.short, `${w}.short`),
      description: str(d.description, `${w}.description`),
      technologies: strList(d.technologies, `${w}.technologies`),
      visible: d.visible !== false,
      highlight: str(d.highlight, `${w}.highlight`),
    };
  });
  if (domains.length === 0) fail('domains', 'keep at least one area of expertise');
  const areaKeys = [];
  const areaTags = [];
  for (const d of domains) {
    if (areaKeys.includes(d.key)) fail('domains', `area "${d.key}" is listed twice`);
    if (areaTags.some((t) => t.toLowerCase() === d.tag.toLowerCase())) fail('domains', `two areas use the tag "${d.tag}"`);
    areaKeys.push(d.key);
    areaTags.push(d.tag);
  }

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
    domains,
    skillCategories: list(input.skillCategories, 'skillCategories', (c, w) => ({
      title: str(c.title, `${w}.title`, { required: true }),
      domain: oneOf(c.domain, [...areaKeys, SKILLS_ONLY_DOMAIN], `${w}.domain`),
      skills: list(c.skills, `${w}.skills`, (s, sw) =>
        compact({ name: str(s.name, `${sw}.name`, { required: true }), logo: str(s.logo, `${sw}.logo`) }, ['logo']),
      ),
    })),
    capabilities: list(input.capabilities, 'capabilities', (c, w) => ({
      domain: oneOf(c.domain, areaKeys, `${w}.domain`),
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
      const tags = strList(pr.tags, `${w}.tags`).map((t, i) => oneOf(t, areaTags, `${w}.tags[${i}]`));
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

/** The exact text written to content.json (the server and the GitHub mode write the same format). */
export const serializeContent = (content) => JSON.stringify(content, null, 2) + '\n';
