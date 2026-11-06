import { ArrowUpRight, Star } from 'lucide-react';
import type { Project } from '@/data/projects';
import { TagBadge, TechChip } from './Shared';

export default function ProjectCard({ project, onOpen, index = 0 }: { project: Project; onOpen: (p: Project) => void; index?: number }) {
  const techs = project.technologies.slice(0, 4);
  const extra = project.technologies.length - techs.length;

  return (
    <article
      className="group card-surface card-hover flex h-full flex-col overflow-hidden animate-card-in"
      style={{ animationDelay: `${Math.min(index, 8) * 50}ms` }}
    >
      <button
        type="button"
        onClick={() => onOpen(project)}
        className="relative block aspect-[16/10] overflow-hidden bg-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label={`Open details for ${project.title}`}
      >
        <img
          src={project.image}
          alt={`${project.title} cover`}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-black/0 opacity-80 transition-opacity group-hover:opacity-100" />
        {project.featuredRank && (
          <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold text-slate-900 shadow">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" /> Featured
          </span>
        )}
        <span className="absolute bottom-3 right-3 inline-flex translate-y-2 items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-900 opacity-0 shadow-lg transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          Quick view <ArrowUpRight className="h-3.5 w-3.5" />
        </span>
      </button>

      <div className="flex flex-1 flex-col p-5 md:p-6">
        <div className="flex flex-wrap gap-1.5">
          {project.tags.map((t) => (
            <TagBadge key={t} tag={t} size="xs" />
          ))}
        </div>
        <h3 className="mt-3 text-lg font-bold leading-snug">{project.title}</h3>
        {project.subtitle && <p className="mt-0.5 text-sm font-medium text-primary">{project.subtitle}</p>}
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
          {project.overview ?? project.description}
        </p>

        {techs.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {techs.map((t) => (
              <TechChip key={t} name={t} />
            ))}
            {extra > 0 && <TechChip name={`+${extra}`} />}
          </div>
        )}

        <div className="mt-auto pt-5">
          <button
            onClick={() => onOpen(project)}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-semibold transition-all hover:border-transparent hover:bg-gradient-brand hover:text-white"
          >
            View Project <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  );
}
