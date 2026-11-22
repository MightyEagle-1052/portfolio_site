import { useEffect, useRef, useState } from "react";
import {
  X,
  ExternalLink,
  Github,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Mail,
} from "lucide-react";
import type { Project } from "@/data/projects";
import { DOMAINS } from "@/data/site";
import { TagBadge, TechChip } from "./Shared";

export default function ProjectModal({
  project,
  onClose,
  onPrev,
  onNext,
  onContact,
}: {
  project: Project | null;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  onContact: () => void;
}) {
  const [shot, setShot] = useState(0);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const handlers = useRef({ onClose, onPrev, onNext });
  handlers.current = { onClose, onPrev, onNext };
  const isOpen = !!project;

  useEffect(() => {
    setShot(0);
  }, [project?.id]);

  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const lastFocused = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handlers.current.onClose();
      if (e.key === "ArrowLeft") handlers.current.onPrev?.();
      if (e.key === "ArrowRight") handlers.current.onNext?.();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
      lastFocused?.focus?.({ preventScroll: true });
    };
  }, [isOpen]);

  if (!project) return null;

  const images = [
    project.detailImage ?? project.image,
    ...(project.screenshots ?? []),
  ];
  const skills = project.technologies.length > 0
    ? project.technologies
    : [...new Set(
        DOMAINS
          .filter((domain) => project.tags.includes(domain.tag))
          .flatMap((domain) => domain.technologies),
      )];
  const showPreviousImage = () =>
    setShot((current) => (current - 1 + images.length) % images.length);
  const showNextImage = () =>
    setShot((current) => (current + 1) % images.length);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-title"
    >
      <div
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div className="relative flex max-h-[94vh] w-full max-w-4xl flex-col overflow-hidden rounded-t-3xl border border-border bg-card shadow-2xl animate-slide-in sm:rounded-3xl">
        <div className="relative shrink-0 bg-secondary">
          <img
            src={images[shot]}
            alt={`${project.title} screenshot ${shot + 1}`}
            className="aspect-[16/7] w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={showPreviousImage}
                aria-label="Show previous screenshot"
                className="absolute left-4 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-lg transition hover:bg-white"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={showNextImage}
                aria-label="Show next screenshot"
                className="absolute right-4 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-lg transition hover:bg-white"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label="Close project details"
            className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-lg transition hover:bg-white"
          >
            <X className="h-5 w-5" />
          </button>
          {project.imageIsConcept && (
            <span className="absolute bottom-4 left-4 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur">
              Concept cover image
            </span>
          )}
        </div>

        <div className="scrollbar-none overflow-y-auto p-6 sm:p-8">
          <div className="flex flex-wrap gap-1.5">
            {project.tags.map((t) => (
              <TagBadge key={t} tag={t} />
            ))}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: "1rem",
            }}
          >
            <h2 id="project-title" className="text-2xl font-bold sm:text-3xl">
              {project.title}
            </h2>
            {project.subtitle && (
              <p className="mt-1 font-medium text-primary">
                {project.subtitle}
              </p>
            )}
            <div className="space-y-2">
              {project.liveDemo && (
                <a
                  href={project.liveDemo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-xl bg-gradient-brand px-4 py-2.5 text-sm font-semibold text-white"
                >
                  <ExternalLink className="h-4 w-4" /> Live Demo
                </a>
              )}
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold hover:border-primary/50"
                >
                  <Github className="h-4 w-4" /> GitHub
                </a>
              )}
              <button
                onClick={onContact}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold transition-colors hover:border-primary/50 hover:text-primary"
              >
                <Mail className="h-4 w-4" /> Ask about this project
              </button>
            </div>
          </div>

          {skills.length > 0 && (
            <div className="mt-4">
              <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
                Skills
              </h3>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {skills.map((skill) => (
                  <TechChip key={skill} name={skill} />
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 grid gap-8 md:grid-cols-3">
            <div className={`space-y-6 ${project.role ? 'md:col-span-2' : 'md:col-span-3'}`}>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
                  Overview
                </h3>
                <p className="mt-2 leading-relaxed">
                  {project.overview ?? project.description}
                </p>
              </div>
              {project.features && project.features.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
                    Key Features
                  </h3>
                  <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                    {project.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{" "}
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {project.role && (
              <aside className="space-y-6">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
                    My Role
                  </h3>
                  <p className="mt-2 text-sm font-medium">{project.role}</p>
                </div>
              </aside>
            )}
          </div>

          {(onPrev || onNext) && (
            <div className="mt-8 flex items-center justify-between border-t border-border pt-5">
              <button
                onClick={onPrev}
                disabled={!onPrev}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-primary disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" /> Previous
              </button>
              <button
                onClick={onNext}
                disabled={!onNext}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-primary disabled:opacity-40"
              >
                Next <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
