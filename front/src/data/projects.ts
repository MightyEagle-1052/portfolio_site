/**
 * Project gallery data. Projects are edited in the admin dashboard and stored in
 * `content.json`. `featuredRank` (1 = first) places a project in the Featured area.
 * Optional fields (role, overview, features, screenshots, liveDemo, github) are hidden when empty.
 */
import { BUNDLED_CONTENT, withBase, type Project, type SiteContent, type Tag } from './content';

export type { Project };

export let PROJECTS: Project[];
/** Total number of projects in the portfolio. */
export let EXPECTED_PROJECT_COUNT: number;
export let FEATURED_PROJECTS: Project[];
/** Featured projects first in rank order, then the remaining projects in their saved order. */
export let ORDERED_PROJECTS: Project[];

export function applyProjectContent(content: SiteContent) {
  PROJECTS = content.projects.map((p) => ({
    ...p,
    image: withBase(p.image),
    screenshots: p.screenshots?.map((s) => withBase(s)),
  }));
  EXPECTED_PROJECT_COUNT = PROJECTS.length;
  FEATURED_PROJECTS = PROJECTS.filter((p) => p.featuredRank).sort(
    (a, b) => (a.featuredRank ?? 99) - (b.featuredRank ?? 99),
  );
  ORDERED_PROJECTS = [...PROJECTS].sort(
    (a, b) => (a.featuredRank || Number.POSITIVE_INFINITY) - (b.featuredRank || Number.POSITIVE_INFINITY),
  );
}

applyProjectContent(BUNDLED_CONTENT);

export const countByTag = (tag: Tag) => PROJECTS.filter((p) => p.tags.includes(tag)).length;

/** Combined filter: OR across selected tags + free-text search over title, description, technologies and tags. */
export function filterProjects(list: Project[], selectedTags: Tag[], query: string): Project[] {
  const q = query.trim().toLowerCase();
  return list.filter((p) => {
    const tagMatch = selectedTags.length === 0 || p.tags.some((t) => selectedTags.includes(t));
    if (!tagMatch) return false;
    if (!q) return true;
    const haystack = [p.title, p.subtitle ?? '', p.description, p.overview ?? '', ...p.technologies, ...p.tags]
      .join(' ')
      .toLowerCase();
    return q.split(/\s+/).every((word) => haystack.includes(word));
  });
}
