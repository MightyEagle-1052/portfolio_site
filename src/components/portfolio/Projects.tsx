import { useCallback, useEffect, useMemo, useState } from 'react';
import { Search, X, LayoutGrid, SearchX, RotateCcw, ArrowUpRight, Star, ChevronDown } from 'lucide-react';
import { TAGS, type Tag } from '@/data/site';
import { ORDERED_PROJECTS, FEATURED_PROJECTS, PROJECTS, countByTag, filterProjects, type Project } from '@/data/projects';
import { scrollToId } from '@/hooks/useInView';
import { SectionHeading, Reveal, TagBadge, DOMAIN_ICONS } from './Shared';
import { domainByTag } from '@/data/site';
import ProjectCard from './ProjectCard';
import ProjectModal from './ProjectModal';

const PAGE_SIZE = 9;

function FeaturedSpotlight({ onOpen }: { onOpen: (p: Project) => void }) {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const p = FEATURED_PROJECTS[idx];

  useEffect(() => {
    if (paused || FEATURED_PROJECTS.length < 2) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % FEATURED_PROJECTS.length), 6000);
    return () => clearInterval(t);
  }, [paused]);

  if (!p) return null;

  return (
    <Reveal className="mb-16">
      <div
        className="card-surface overflow-hidden"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        <div className="grid lg:grid-cols-5">
          <button
            onClick={() => onOpen(p)}
            className="group relative block overflow-hidden lg:col-span-3"
            aria-label={`Open details for ${p.title}`}
          >
            <img key={p.id} src={p.image} alt={`${p.title} cover`} className="aspect-[16/10] h-full w-full object-cover animate-fade-in transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-tr from-black/40 to-transparent" />
            <span className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-slate-900">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> Featured {String(idx + 1).padStart(2, '0')}
            </span>
          </button>
          <div className="flex flex-col p-6 sm:p-8 lg:col-span-2">
            <div key={p.id} className="animate-slide-in">
              <div className="flex flex-wrap gap-1.5">
                {p.tags.map((t) => (
                  <TagBadge key={t} tag={t} />
                ))}
              </div>
              <h3 className="mt-4 text-2xl font-bold leading-tight md:text-3xl">{p.title}</h3>
              {p.subtitle && <p className="mt-1 font-medium text-primary">{p.subtitle}</p>}
              <p className="mt-3 text-muted-foreground">{p.description}</p>
              <button
                onClick={() => onOpen(p)}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-brand px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/20"
              >
                View Project <ArrowUpRight className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-auto pt-8">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">Featured work</p>
              <div className="grid grid-cols-9 items-center gap-1">
                {FEATURED_PROJECTS.map((fp, i) => (
                  <button
                    key={fp.id}
                    onClick={() => setIdx(i)}
                    aria-label={`Show featured project: ${fp.title}`}
                    aria-pressed={i === idx}
                    className={`relative min-w-0 overflow-hidden rounded-lg ring-2 transition-all duration-200 ${
                      i === idx
                        ? 'z-10 scale-110 ring-primary opacity-100'
                        : 'ring-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={fp.image} alt="" loading="lazy" className="aspect-square w-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

export default function Projects({
  selectedTags,
  setSelectedTags,
}: {
  selectedTags: Tag[];
  setSelectedTags: (tags: Tag[]) => void;
}) {
  const [query, setQuery] = useState('');
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered = useMemo(() => filterProjects(ORDERED_PROJECTS, selectedTags, query), [selectedTags, query]);
  const shown = filtered.slice(0, visible);
  const filterKey = `${selectedTags.join('|')}::${query}`;

  useEffect(() => setVisible(PAGE_SIZE), [filterKey]);

  const toggleTag = (t: Tag) => {
    setSelectedTags(selectedTags.includes(t) ? selectedTags.filter((x) => x !== t) : [...selectedTags, t]);
  };
  const resetAll = () => {
    setSelectedTags([]);
    setQuery('');
  };

  // Modal navigation follows the current filtered list
  const openIndex = filtered.findIndex((p) => p.id === openId);
  const openProject = openIndex >= 0 ? filtered[openIndex] : PROJECTS.find((p) => p.id === openId) ?? null;
  const onOpen = useCallback((p: Project) => setOpenId(p.id), []);
  const onClose = useCallback(() => setOpenId(null), []);
  const onPrev = openIndex > 0 ? () => setOpenId(filtered[openIndex - 1].id) : undefined;
  const onNext = openIndex >= 0 && openIndex < filtered.length - 1 ? () => setOpenId(filtered[openIndex + 1].id) : undefined;

  const allActive = selectedTags.length === 0;

  return (
    <section id="projects" className="section-alt py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Projects"
          title={
            <>
              My <span className="text-gradient">Portfolio</span>
            </>
          }
          description="Explore my work across Artificial Intelligence, Computer Vision, 3D Visualization, Immersive Technologies, and Game Development."
        />

        <FeaturedSpotlight onOpen={onOpen} />

        {/* Controls */}
        <div className="sticky top-[72px] z-30 -mx-4 mb-8 border-y border-border/60 glass px-4 py-4 sm:mx-0 sm:rounded-2xl sm:border">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 lg:pb-0" role="group" aria-label="Filter projects by tag">
              <button
                onClick={() => setSelectedTags([])}
                aria-pressed={allActive}
                className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                  allActive ? 'bg-foreground text-background shadow-md' : 'border border-border bg-card hover:border-primary/50'
                }`}
              >
                <LayoutGrid className="h-4 w-4" /> All Projects
                <span className={`rounded-md px-1.5 text-xs ${allActive ? 'bg-background/20' : 'bg-secondary'}`}>{PROJECTS.length}</span>
              </button>
              {TAGS.map((t) => {
                const active = selectedTags.includes(t);
                const d = domainByTag(t)!;
                const Icon = DOMAIN_ICONS[d.key];
                return (
                  <button
                    key={t}
                    onClick={() => toggleTag(t)}
                    aria-pressed={active}
                    className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                      active
                        ? `bg-gradient-to-r ${d.accent.gradient} text-white shadow-md`
                        : 'border border-border bg-card hover:border-primary/50'
                    }`}
                  >
                    <Icon className="h-4 w-4" /> {t}
                    <span className={`rounded-md px-1.5 text-xs ${active ? 'bg-white/20' : 'bg-secondary'}`}>{countByTag(t)}</span>
                  </button>
                );
              })}
            </div>

            <div className="relative w-full lg:w-80">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search name, tech, tag..."
                aria-label="Search projects"
                className="w-full rounded-xl border border-input bg-card py-2.5 pl-10 pr-10 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  aria-label="Clear search"
                  className="absolute right-2 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted-foreground" aria-live="polite">
            <span>
              Showing <strong className="text-foreground">{filtered.length}</strong> of {PROJECTS.length} projects
            </span>
            {selectedTags.length > 1 && <span className="text-xs">· matching any selected tag</span>}
            {(selectedTags.length > 0 || query) && (
              <button onClick={resetAll} className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
                <RotateCcw className="h-3 w-3" /> Reset filters
              </button>
            )}
          </div>
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <>
            <div key={filterKey} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {shown.map((p, i) => (
                <ProjectCard key={p.id} project={p} onOpen={onOpen} index={i} />
              ))}
            </div>
            {visible < filtered.length && (
              <div className="mt-12 text-center">
                <button
                  onClick={() => setVisible((v) => v + PAGE_SIZE)}
                  className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-3 text-sm font-semibold shadow-sm transition-colors hover:border-primary/50 hover:text-primary"
                >
                  Load More Projects <ChevronDown className="h-4 w-4" />
                  <span className="text-muted-foreground">({filtered.length - visible} remaining)</span>
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="card-surface mx-auto flex max-w-lg flex-col items-center px-6 py-14 text-center animate-fade-in">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <SearchX className="h-7 w-7" />
            </span>
            <h3 className="mt-5 text-xl font-bold">No matching projects</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              No projects match {query ? <>“{query}”</> : 'the selected filters'}
              {selectedTags.length > 0 && <> in {selectedTags.join(', ')}</>}. Try a different keyword or reset the filters.
            </p>
            <button onClick={resetAll} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-brand px-5 py-2.5 text-sm font-semibold text-white">
              <RotateCcw className="h-4 w-4" /> Show All Projects
            </button>
          </div>
        )}
      </div>

      <ProjectModal
        project={openProject}
        onClose={onClose}
        onPrev={onPrev}
        onNext={onNext}
        onContact={() => {
          const title = openProject?.title;
          setOpenId(null);
          window.dispatchEvent(new CustomEvent('prefill-contact', { detail: { subject: title ? `Inquiry about ${title}` : '' } }));
          setTimeout(() => scrollToId('contact'), 50);
        }}
      />
    </section>
  );
}
