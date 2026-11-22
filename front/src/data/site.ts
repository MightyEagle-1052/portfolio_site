/**
 * Site content for the portfolio.
 *
 * The values come from `content.json` (edited via the admin dashboard). Exports are
 * `let` bindings so `applySiteContent` can swap in live content before the app renders;
 * ES module live bindings make every importer see the updated values.
 */
import {
  BUNDLED_CONTENT,
  TAGS,
  type SiteContent,
  type Tag,
  type DomainKey,
  type Skill,
  type SkillCategory,
  type ExperienceItem,
  type Testimonial,
  type Capability,
} from './content';

export { TAGS };
export type { Tag, DomainKey, Skill, SkillCategory, ExperienceItem, Testimonial, Capability };

export const NAV_ITEMS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'expertise', label: 'Expertise' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
] as const;

export interface Domain {
  key: DomainKey;
  tag: Tag;
  title: string;
  short: string;
  description: string;
  technologies: string[];
  /** Tailwind classes for the domain color identity */
  accent: { text: string; bg: string; ring: string; gradient: string };
}

/** Fixed per-domain identity (tag + Tailwind colors). Kept in code so Tailwind can see the classes. */
const DOMAIN_IDENTITY: Record<DomainKey, Pick<Domain, 'tag' | 'accent'>> = {
  ai: {
    tag: 'AI&CV',
    accent: {
      text: 'text-sky-600 dark:text-cyan-300',
      bg: 'bg-sky-500/10 dark:bg-cyan-400/10',
      ring: 'ring-sky-500/30 dark:ring-cyan-400/30',
      gradient: 'from-sky-500 to-cyan-400',
    },
  },
  cg: {
    tag: 'CG&3D',
    accent: {
      text: 'text-violet-600 dark:text-violet-300',
      bg: 'bg-violet-500/10 dark:bg-violet-400/10',
      ring: 'ring-violet-500/30 dark:ring-violet-400/30',
      gradient: 'from-violet-500 to-fuchsia-500',
    },
  },
  xr: {
    tag: 'AR/VR&XR',
    accent: {
      text: 'text-blue-600 dark:text-blue-300',
      bg: 'bg-blue-500/10 dark:bg-blue-400/10',
      ring: 'ring-blue-500/30 dark:ring-blue-400/30',
      gradient: 'from-blue-600 to-indigo-500',
    },
  },
  game: {
    tag: 'GameDev',
    accent: {
      text: 'text-emerald-600 dark:text-emerald-300',
      bg: 'bg-emerald-500/10 dark:bg-emerald-400/10',
      ring: 'ring-emerald-500/30 dark:ring-emerald-400/30',
      gradient: 'from-emerald-500 to-teal-400',
    },
  },
};

export let PROFILE: SiteContent['profile'];
/** External links. Empty links ('') are hidden automatically. */
export let LINKS: SiteContent['links'];
export let CRM_SUBSCRIBE_URL: string;
export let DOMAINS: Domain[];
export let SKILL_CATEGORIES: SkillCategory[];
/** Unique count of all technologies listed across skills and expertise. */
export let TECHNOLOGY_COUNT: number;
/** Verified employment records. While empty, the Experience section shows capabilities instead. */
export let EXPERIENCE: ExperienceItem[];
export let CAPABILITIES: Capability[];
/** Only authentic testimonials. The section is hidden while this list is empty. */
export let TESTIMONIALS: Testimonial[];
export let IMAGES: SiteContent['images'];

export const domainByTag = (tag: string) => DOMAINS.find((d) => d.tag === tag);

export function applySiteContent(content: SiteContent) {
  PROFILE = content.profile;
  LINKS = content.links;
  CRM_SUBSCRIBE_URL = content.crmSubscribeUrl;
  DOMAINS = content.domains
    .filter((d) => d.key in DOMAIN_IDENTITY)
    .map((d) => ({ ...d, ...DOMAIN_IDENTITY[d.key] }));
  SKILL_CATEGORIES = content.skillCategories;
  TECHNOLOGY_COUNT = new Set([
    ...SKILL_CATEGORIES.flatMap((c) => c.skills.map((s) => s.name)),
    ...DOMAINS.flatMap((d) => d.technologies),
  ]).size;
  EXPERIENCE = content.experience;
  CAPABILITIES = content.capabilities;
  TESTIMONIALS = content.testimonials;
  IMAGES = content.images;
}

applySiteContent(BUNDLED_CONTENT);
