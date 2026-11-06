import { useEffect, useState } from 'react';
import { CalendarClock, Layers, FolderKanban, Cpu } from 'lucide-react';
import { PROFILE, DOMAINS, TECHNOLOGY_COUNT } from '@/data/site';
import { PROJECTS, EXPECTED_PROJECT_COUNT } from '@/data/projects';
import { useInView } from '@/hooks/useInView';

function Counter({ to, start, suffix = '' }: { to: number; start: boolean; suffix?: string }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!start) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setVal(to);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const dur = 1400;
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / dur);
      setVal(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, start]);
  return (
    <span>
      {val}
      {suffix}
    </span>
  );
}

export default function Stats() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.3 });
  const projectCount = PROJECTS.length;
  const allLoaded = projectCount >= EXPECTED_PROJECT_COUNT;

  const stats = [
    { icon: CalendarClock, value: PROFILE.yearsExperience, suffix: '+', label: 'Years of Experience', note: 'Professional software development' },
    { icon: Layers, value: DOMAINS.length, suffix: '', label: 'Technical Domains', note: 'AI&CV · CG&3D · AR/VR&XR · GameDev' },
    {
      icon: FolderKanban,
      value: projectCount,
      suffix: '',
      label: 'Portfolio Projects',
      note: allLoaded ? 'Complete project gallery' : `${projectCount} of ${EXPECTED_PROJECT_COUNT} published in the gallery`,
    },
    { icon: Cpu, value: TECHNOLOGY_COUNT, suffix: '+', label: 'Technologies & Frameworks', note: 'Across AI, 3D, XR and games' },
  ];

  return (
    <section aria-label="Professional statistics" className="relative border-y border-border section-alt">
      <div ref={ref} className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-12 sm:px-6 md:py-16 lg:grid-cols-4 lg:gap-6 lg:px-8">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className={`card-surface card-hover reveal ${inView ? 'is-visible' : ''} p-5 md:p-7`}
            style={{ transitionDelay: `${i * 90}ms` }}
          >
            <div className="flex items-center justify-between">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <s.icon className="h-5 w-5" />
              </span>
              <span className="font-mono text-[11px] text-muted-foreground">0{i + 1}</span>
            </div>
            <p className="mt-5 text-4xl font-bold md:text-5xl" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              <span className="text-gradient">
                <Counter to={s.value} start={inView} suffix={s.suffix} />
              </span>
            </p>
            <p className="mt-2 text-sm font-semibold md:text-base">{s.label}</p>
            <p className="mt-1 text-xs text-muted-foreground">{s.note}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
