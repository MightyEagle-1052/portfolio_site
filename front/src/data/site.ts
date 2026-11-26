/**
 * Site content for the portfolio.
 *
 * The values come from `content.json` (edited via the admin dashboard). Exports are
 * `let` bindings so `applySiteContent` can swap in live content before the app renders;
 * ES module live bindings make every importer see the updated values.
 */
import {
  BUNDLED_CONTENT,
  withBase,
  type SiteContent,
  type Tag,
  type Skill,
  type SkillCategory,
  type ExperienceItem,
  type Testimonial,
  type Capability,
} from './content';

export type { Tag, Skill, SkillCategory, ExperienceItem, Testimonial, Capability };

export const NAV_ITEMS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'expertise', label: 'Expertise' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
] as const;

/** Tailwind classes for an area's color. */
export interface Accent {
  text: string;
  bg: string;
  ring: string;
  gradient: string;
}

export interface Domain {
  key: string;
  tag: Tag;
  title: string;
  short: string;
  description: string;
  technologies: string[];
  visible: boolean;
  /** Short line on the floating hero badge. */
  highlight: string;
  /** Icon name, see AREA_ICONS in components/portfolio/Shared.tsx. */
  icon: string;
  accent: Accent;
}

/**
 * The colors an area can use, chosen in the admin. Same names as AREA_COLORS in shared/content-schema.mjs.
 * The full class names are written out here so Tailwind keeps them in the build.
 */
export const AREA_COLORS: Record<string, Accent> = {
  cyan: {
    text: 'text-sky-600 dark:text-cyan-300',
    bg: 'bg-sky-500/10 dark:bg-cyan-400/10',
    ring: 'ring-sky-500/30 dark:ring-cyan-400/30',
    gradient: 'from-sky-500 to-cyan-400',
  },
  violet: {
    text: 'text-violet-600 dark:text-violet-300',
    bg: 'bg-violet-500/10 dark:bg-violet-400/10',
    ring: 'ring-violet-500/30 dark:ring-violet-400/30',
    gradient: 'from-violet-500 to-fuchsia-500',
  },
  blue: {
    text: 'text-blue-600 dark:text-blue-300',
    bg: 'bg-blue-500/10 dark:bg-blue-400/10',
    ring: 'ring-blue-500/30 dark:ring-blue-400/30',
    gradient: 'from-blue-600 to-indigo-500',
  },
  green: {
    text: 'text-emerald-600 dark:text-emerald-300',
    bg: 'bg-emerald-500/10 dark:bg-emerald-400/10',
    ring: 'ring-emerald-500/30 dark:ring-emerald-400/30',
    gradient: 'from-emerald-500 to-teal-400',
  },
  amber: {
    text: 'text-amber-600 dark:text-amber-300',
    bg: 'bg-amber-500/10 dark:bg-amber-400/10',
    ring: 'ring-amber-500/30 dark:ring-amber-400/30',
    gradient: 'from-amber-500 to-yellow-400',
  },
  red: {
    text: 'text-rose-600 dark:text-rose-300',
    bg: 'bg-rose-500/10 dark:bg-rose-400/10',
    ring: 'ring-rose-500/30 dark:ring-rose-400/30',
    gradient: 'from-rose-500 to-red-400',
  },
  orange: {
    text: 'text-orange-600 dark:text-orange-300',
    bg: 'bg-orange-500/10 dark:bg-orange-400/10',
    ring: 'ring-orange-500/30 dark:ring-orange-400/30',
    gradient: 'from-orange-500 to-amber-400',
  },
  pink: {
    text: 'text-pink-600 dark:text-pink-300',
    bg: 'bg-pink-500/10 dark:bg-pink-400/10',
    ring: 'ring-pink-500/30 dark:ring-pink-400/30',
    gradient: 'from-pink-500 to-fuchsia-400',
  },
  teal: {
    text: 'text-teal-600 dark:text-teal-300',
    bg: 'bg-teal-500/10 dark:bg-teal-400/10',
    ring: 'ring-teal-500/30 dark:ring-teal-400/30',
    gradient: 'from-teal-500 to-cyan-400',
  },
  gray: {
    text: 'text-slate-600 dark:text-slate-300',
    bg: 'bg-slate-500/10 dark:bg-slate-400/10',
    ring: 'ring-slate-500/30 dark:ring-slate-400/30',
    gradient: 'from-slate-600 to-slate-400',
  },
};

/**
 * Tag, color, icon and hero badge text of the original four areas, for content saved before
 * areas had their own. Same values as BUILTIN_AREAS in shared/content-schema.mjs.
 */
const BUILTIN_AREAS: Record<string, { tag: string; color: string; icon: string; highlight: string }> = {
  ai: { tag: 'AI&CV', color: 'cyan', icon: 'brain', highlight: 'YOLO · OpenCV · PyTorch' },
  cg: { tag: 'CG&3D', color: 'violet', icon: 'box', highlight: '3D Worlds · GIS · Visualization' },
  xr: { tag: 'AR/VR&XR', color: 'blue', icon: 'glasses', highlight: 'WebXR · OpenXR · AR Foundation' },
  game: { tag: 'GameDev', color: 'green', icon: 'gamepad', highlight: 'Unity · C# · Unreal Engine' },
};

export let PROFILE: SiteContent['profile'];
/** External links. Empty links ('') are hidden automatically. */
export let LINKS: SiteContent['links'];
export let CRM_SUBSCRIBE_URL: string;
/** All areas of expertise in priority order, including hidden ones. Use for lookups (tag colors, icons). */
export let ALL_DOMAINS: Domain[];
/** Visible areas of expertise in priority order. Use for anything the site lists. */
export let DOMAINS: Domain[];
/** Project tags in area priority order (all tags, since projects keep their tags when an area is hidden). */
export let ORDERED_TAGS: Tag[];
export let SKILL_CATEGORIES: SkillCategory[];
/** Unique count of all technologies listed across skills and expertise. */
export let TECHNOLOGY_COUNT: number;
/** Verified employment records. While empty, the Experience section shows capabilities instead. */
export let EXPERIENCE: ExperienceItem[];
export let CAPABILITIES: Capability[];
/** Only authentic testimonials. The section is hidden while this list is empty. */
export let TESTIMONIALS: Testimonial[];
export let IMAGES: SiteContent['images'];

export const domainByTag = (tag: string) => ALL_DOMAINS.find((d) => d.tag === tag);
export const domainByKey = (key: string) => ALL_DOMAINS.find((d) => d.key === key);

export function applySiteContent(content: SiteContent) {
  PROFILE = content.profile;
  LINKS = content.links;
  CRM_SUBSCRIBE_URL = content.crmSubscribeUrl;
  const seenKeys = new Set<string>();
  const seenTags = new Set<string>();
  ALL_DOMAINS = content.domains
    .filter((d) => d.key && !seenKeys.has(d.key) && seenKeys.add(d.key))
    .map((d) => {
      const builtin = BUILTIN_AREAS[d.key];
      const technologies = d.technologies ?? [];
      return {
        ...d,
        technologies,
        tag: d.tag || builtin?.tag || d.title,
        icon: d.icon || builtin?.icon || 'sparkles',
        accent: AREA_COLORS[d.color || builtin?.color || ''] ?? AREA_COLORS.gray,
        visible: d.visible !== false,
        highlight: d.highlight || builtin?.highlight || technologies.slice(0, 3).join(' · '),
      };
    })
    .filter((d) => !seenTags.has(d.tag) && seenTags.add(d.tag));
  DOMAINS = ALL_DOMAINS.filter((d) => d.visible);
  ORDERED_TAGS = ALL_DOMAINS.map((d) => d.tag);
  SKILL_CATEGORIES = content.skillCategories.map((c) => ({
    ...c,
    skills: c.skills.map((s) => (s.logo ? { ...s, logo: withBase(s.logo) } : s)),
  }));
  TECHNOLOGY_COUNT = new Set([
    ...SKILL_CATEGORIES.flatMap((c) => c.skills.map((s) => s.name)),
    ...DOMAINS.flatMap((d) => d.technologies),
  ]).size;
  EXPERIENCE = content.experience;
  CAPABILITIES = content.capabilities;
  TESTIMONIALS = content.testimonials.map((t) => (t.image ? { ...t, image: withBase(t.image) } : t));
  IMAGES = { ...content.images, hero: withBase(content.images.hero) };
}

applySiteContent(BUNDLED_CONTENT);
