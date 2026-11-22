import { useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { DOMAINS, type Domain, type Tag } from '@/data/site';
import { countByTag } from '@/data/projects';
import { SectionHeading, Reveal, DOMAIN_ICONS } from './Shared';

function ExpertiseCard({ d, index, onView }: { d: Domain; index: number; onView: (t: Tag) => void }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const Icon = DOMAIN_ICONS[d.key];
  const count = countByTag(d.tag);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateX(${-y * 5}deg) rotateY(${x * 6}deg) translateY(-4px)`;
    el.style.setProperty('--mx', `${(x + 0.5) * 100}%`);
    el.style.setProperty('--my', `${(y + 0.5) * 100}%`);
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = '';
  };

  return (
    <Reveal delay={index * 90} className="h-full">
      <div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className="group card-surface relative flex h-full flex-col overflow-hidden p-7 hover:border-primary/40"
        style={{ transition: 'transform 0.25s ease, border-color 0.3s ease, box-shadow 0.3s ease' }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: 'radial-gradient(420px circle at var(--mx,50%) var(--my,50%), hsl(var(--primary) / 0.08), transparent 60%)' }}
        />
        <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${d.accent.gradient}`} />
        <div className="flex items-start justify-between">
          <span className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${d.accent.gradient} text-white shadow-lg`}>
            <Icon className="h-7 w-7" />
          </span>
          <span className={`rounded-full px-3 py-1 font-mono text-xs font-semibold ${d.accent.bg} ${d.accent.text}`}>{d.tag}</span>
        </div>
        <h3 className="mt-6 text-xl font-bold md:text-2xl">{d.title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-[15px]">{d.description}</p>
        <ul className="mt-6 flex flex-wrap gap-2">
          {d.technologies.map((t) => (
            <li key={t} className="rounded-lg border border-border bg-secondary/60 px-2.5 py-1 text-xs font-medium">
              {t}
            </li>
          ))}
        </ul>
        <button
          onClick={() => onView(d.tag)}
          className={`mt-auto inline-flex items-center gap-1.5 pt-7 text-sm font-semibold ${d.accent.text} hover:underline underline-offset-4`}
        >
          View {d.tag} projects ({count}) <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </button>
      </div>
    </Reveal>
  );
}

export default function Expertise({ onViewTag }: { onViewTag: (tag: Tag) => void }) {
  return (
    <section id="expertise" className="section-alt py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Technical Expertise"
          title={
            <>
              Four domains, <span className="text-gradient">one engineering mindset.</span>
            </>
          }
          description="From neural networks that understand images to real-time 3D worlds you can step into — these are the domains I build in every day."
        />
        <div className="grid gap-6 md:grid-cols-2">
          {DOMAINS.map((d, i) => (
            <ExpertiseCard key={d.key} d={d} index={i} onView={onViewTag} />
          ))}
        </div>
      </div>
    </section>
  );
}
