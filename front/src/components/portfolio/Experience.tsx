import { Briefcase, ArrowUpRight } from 'lucide-react';
import { EXPERIENCE, CAPABILITIES, DOMAINS, PROFILE, type Tag } from '@/data/site';
import { PROJECTS } from '@/data/projects';
import { SectionHeading, Reveal, DOMAIN_ICONS, TechChip } from './Shared';

function TimelineItem({ index, children, icon }: { index: number; children: React.ReactNode; icon: React.ReactNode }) {
  return (
    <Reveal delay={index * 80} className="relative pl-14 md:pl-16">
      <span className="absolute left-0 top-1 flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-primary shadow-sm md:h-11 md:w-11">
        {icon}
      </span>
      {children}
    </Reveal>
  );
}

export default function Experience({ onViewTag }: { onViewTag: (tag: Tag) => void }) {
  const hasJobs = EXPERIENCE.length > 0;

  return (
    <section id="experience" className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Experience"
          title="Professional Experience"
          description={`${PROFILE.yearsExperience}+ years of software development across intelligent visual systems, 3D and geospatial platforms, immersive technology and games.`}
        />

        <div className="grid gap-12 lg:grid-cols-5">
          <div className="relative lg:col-span-3">
            <div className="absolute bottom-2 left-5 top-2 w-px bg-gradient-to-b from-primary via-[hsl(var(--violet))] to-transparent md:left-[22px]" />
            <div className="space-y-8">
              {hasJobs
                ? EXPERIENCE.map((job, i) => (
                    <TimelineItem key={`${job.organization}-${i}`} index={i} icon={<Briefcase className="h-5 w-5" />}>
                      <div className="card-surface card-hover p-6">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h3 className="text-lg font-bold">{job.position}</h3>
                          <span className="rounded-full bg-primary/10 px-3 py-1 font-mono text-xs font-semibold text-primary">{job.period}</span>
                        </div>
                        <p className="mt-1 text-sm font-medium text-muted-foreground">{job.organization}</p>
                        <ul className="mt-4 list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
                          {job.responsibilities.map((r) => (
                            <li key={r}>{r}</li>
                          ))}
                        </ul>
                        <div className="mt-4 flex flex-wrap gap-1.5">
                          {job.technologies.map((t) => (
                            <TechChip key={t} name={t} />
                          ))}
                        </div>
                      </div>
                    </TimelineItem>
                  ))
                : CAPABILITIES.map((c, i) => {
                    const d = DOMAINS.find((x) => x.key === c.domain)!;
                    const Icon = DOMAIN_ICONS[c.domain];
                    return (
                      <TimelineItem key={c.title} index={i} icon={<Icon className={`h-5 w-5 ${d.accent.text}`} />}>
                        <div className="card-surface card-hover p-6">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <h3 className="text-lg font-bold">{c.title}</h3>
                            <span className={`rounded-full px-3 py-1 font-mono text-xs font-semibold ${d.accent.bg} ${d.accent.text}`}>{d.tag}</span>
                          </div>
                          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.text}</p>
                          <div className="mt-4 flex flex-wrap gap-1.5">
                            {d.technologies.slice(0, 5).map((t) => (
                              <TechChip key={t} name={t} />
                            ))}
                          </div>
                        </div>
                      </TimelineItem>
                    );
                  })}
            </div>
          </div>

          <Reveal className="lg:col-span-2" delay={120}>
            <div className="card-surface sticky top-28 p-6 md:p-7">
              <h3 className="text-lg font-bold">Selected Project Experience</h3>
              <p className="mt-1 text-sm text-muted-foreground">Projects by technical domain — select a domain to filter the portfolio.</p>
              <div className="mt-6 space-y-5">
                {DOMAINS.map((d) => {
                  const list = PROJECTS.filter((p) => p.tags.includes(d.tag));
                  return (
                    <div key={d.key}>
                      <button
                        onClick={() => onViewTag(d.tag)}
                        className={`group flex w-full items-center justify-between text-left text-sm font-bold ${d.accent.text}`}
                      >
                        {d.title}
                        <span className="inline-flex items-center gap-1 text-xs font-semibold">
                          {list.length} <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                        </span>
                      </button>
                      <ul className="mt-2 space-y-1.5">
                        {list.slice(0, 4).map((p) => (
                          <li key={p.id} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span className={`h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-r ${d.accent.gradient}`} />
                            <span className="truncate">{p.title}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
