import { ArrowUp, Linkedin, Github, CalendarDays } from 'lucide-react';
import { PROFILE, LINKS, NAV_ITEMS, DOMAINS, type Tag } from '@/data/site';
import { scrollToId } from '@/hooks/useInView';
import { Monogram, DOMAIN_ICONS } from './Shared';

export default function Footer({ onViewTag }: { onViewTag: (tag: Tag) => void }) {
  return (
    <footer className="relative border-t border-border bg-background">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3">
              <Monogram />
              <div>
                <p className="text-lg font-bold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{PROFILE.name}</p>
                <p className="text-xs font-medium text-muted-foreground">{PROFILE.role}</p>
              </div>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground">{PROFILE.shortBio}</p>
            <div className="mt-6 flex gap-2">
              <a
                href={LINKS.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border transition-colors hover:border-primary/50 hover:text-primary"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              {LINKS.github && (
                <a
                  href={LINKS.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border transition-colors hover:border-primary/50 hover:text-primary"
                >
                  <Github className="h-4 w-4" />
                </a>
              )}
              <a
                href={LINKS.booking}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Book a call"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border transition-colors hover:border-primary/50 hover:text-primary"
              >
                <CalendarDays className="h-4 w-4" />
              </a>
            </div>
          </div>

          <nav className="lg:col-span-3" aria-label="Footer">
            <p className="text-sm font-bold">Navigation</p>
            <ul className="mt-4 grid grid-cols-2 gap-2.5 text-sm">
              {NAV_ITEMS.map((n) => (
                <li key={n.id}>
                  <a
                    href={`#${n.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToId(n.id);
                    }}
                    className="text-muted-foreground transition-colors hover:text-primary"
                  >
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-4">
            <p className="text-sm font-bold">Technical Domains</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {DOMAINS.map((d) => {
                const Icon = DOMAIN_ICONS[d.key];
                return (
                  <li key={d.key}>
                    <button onClick={() => onViewTag(d.tag)} className="group inline-flex items-center gap-2.5 text-muted-foreground transition-colors hover:text-foreground">
                      <span className={`flex h-7 w-7 items-center justify-center rounded-lg ${d.accent.bg} ${d.accent.text}`}>
                        <Icon className="h-3.5 w-3.5" />
                      </span>
                      <span>
                        <span className="font-mono text-xs font-semibold">{d.tag}</span> — {d.title}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-sm text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} {PROFILE.name}. All rights reserved.</p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 font-medium transition-colors hover:border-primary/50 hover:text-primary"
          >
            Back to top <ArrowUp className="h-4 w-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}
