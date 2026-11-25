/**
 * Editable site content.
 *
 * All text, links, skills, experience and projects live in `content.json`, which is
 * edited through the admin dashboard (see /admin and /server in the repo root).
 * The JSON is bundled at build time, so the static GitHub Pages build always works.
 *
 * Live mode: when the portfolio server serves this site it injects window.__CONTENT_URL__,
 * and the site fetches the latest content on load (falling back to the bundled copy if the
 * server is unreachable). A separately hosted build can use VITE_CONTENT_URL instead.
 */
import bundled from './content.json';

export const TAGS = ['AI&CV', 'CG&3D', 'AR/VR&XR', 'GameDev'] as const;
export type Tag = (typeof TAGS)[number];
export type DomainKey = 'ai' | 'cg' | 'xr' | 'game';

export interface Profile {
  name: string;
  firstName: string;
  monogram: string;
  role: string;
  yearsExperience: number;
  heroDescription: string;
  shortBio: string;
  hireNote: string;
}

export interface Links {
  linkedin: string;
  telegram: string;
  whatsapp: string;
  email: string;
  github: string;
  booking: string;
}

/** An area of expertise. The array order in content.json is the display priority. */
export interface DomainContent {
  key: DomainKey;
  title: string;
  short: string;
  description: string;
  technologies: string[];
  /** Shown in the site's area listings. Missing means visible. */
  visible?: boolean;
  /** Short line on the floating hero badge (e.g. "Unity · C# · Unreal Engine"). Empty uses the default. */
  highlight?: string;
}

export interface Skill {
  name: string;
  /** Optional logo URL (devicon). Skills without logos render a monogram badge. */
  logo?: string;
}

export interface SkillCategory {
  title: string;
  domain: DomainKey | 'web';
  skills: Skill[];
}

export interface Capability {
  domain: DomainKey;
  title: string;
  text: string;
}

export interface ExperienceItem {
  position: string;
  organization: string;
  period: string;
  responsibilities: string[];
  technologies: string[];
}

export interface Testimonial {
  name: string;
  position: string;
  company: string;
  quote: string;
  image?: string;
}

export interface Project {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  overview?: string;
  role?: string;
  image: string;
  imageIsConcept?: boolean;
  screenshots?: string[];
  technologies: string[];
  tags: Tag[];
  features?: string[];
  liveDemo?: string;
  github?: string;
  featuredRank?: number;
}

export interface SiteContent {
  profile: Profile;
  links: Links;
  crmSubscribeUrl: string;
  images: { hero: string; about: string };
  domains: DomainContent[];
  skillCategories: SkillCategory[];
  capabilities: Capability[];
  experience: ExperienceItem[];
  testimonials: Testimonial[];
  projects: Project[];
}

export const BUNDLED_CONTENT = bundled as SiteContent;

/**
 * Prefix a site-relative path ("/project_images/…", "/uploads/…") with the base path the
 * site is deployed under, e.g. "/portfolio_site/" on GitHub Pages ("/" on the own server).
 * Full URLs and empty values are returned unchanged. Content keeps plain "/…" paths.
 */
export function withBase(path: string): string;
export function withBase(path: string | undefined): string | undefined;
export function withBase(path?: string): string | undefined {
  if (!path || !path.startsWith('/') || path.startsWith('//')) return path;
  return import.meta.env.BASE_URL.replace(/\/$/, '') + path;
}

/** Fetch live content when VITE_CONTENT_URL is configured; otherwise resolve to null. */
export async function fetchLiveContent(timeoutMs = 4000): Promise<SiteContent | null> {
  // Set by the portfolio server when it serves this site; otherwise taken from the build env.
  const url =
    ((window as unknown as { __CONTENT_URL__?: string }).__CONTENT_URL__) ||
    (import.meta.env.VITE_CONTENT_URL as string | undefined);
  if (!url) return null;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal, cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = (await res.json()) as SiteContent;
    if (!data || !data.profile || !Array.isArray(data.projects)) throw new Error('Invalid content');
    console.info(`Portfolio content loaded from server: ${url}`);
    return data;
  } catch (err) {
    console.warn('Live content unavailable, using bundled content.', err);
    return null;
  } finally {
    clearTimeout(timer);
  }
}
