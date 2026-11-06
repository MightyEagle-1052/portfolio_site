import { useState } from 'react';
import { SKILL_CATEGORIES, DOMAINS, type Skill } from '@/data/site';
import { SectionHeading, Reveal, DOMAIN_ICONS } from './Shared';

function SkillLogo({ skill, size = 'md' }: { skill: Skill; size?: 'md' | 'lg' }) {
  const [failed, setFailed] = useState(false);
  const dim = size === 'lg' ? 'h-9 w-9' : 'h-6 w-6';
  if (skill.logo && !failed) {
    return (
      <img
        src={skill.logo}
        alt=""
        loading="lazy"
        onError={() => setFailed(true)}
        className={`${dim} object-contain dark:[filter:drop-shadow(0_0_1px_rgba(255,255,255,0.5))]`}
      />
    );
  }
  const initials = skill.name
    .replace(/[^A-Za-z0-9+# ]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
  return (
    <span className={`${dim} inline-flex items-center justify-center rounded-md bg-gradient-brand font-mono text-[10px] font-bold text-white`}>
      {initials}
    </span>
  );
}

const domainAccent = (key: string) => DOMAINS.find((d) => d.key === key)?.accent;

export default function Skills() {
  const marquee = Array.from(
    new Map(SKILL_CATEGORIES.flatMap((c) => c.skills).filter((s) => s.logo).map((s) => [s.name, s])).values()
  );

  return (
    <section id="skills" className="relative overflow-hidden py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Technical Skills"
          title={
            <>
              The toolkit behind <span className="text-gradient">the work.</span>
            </>
          }
          description="Languages, frameworks, engines and libraries I use across AI, computer vision, graphics, geospatial, XR and game development."
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SKILL_CATEGORIES.map((cat, i) => {
            const Icon = DOMAIN_ICONS[cat.domain];
            const accent = domainAccent(cat.domain);
            return (
              <Reveal key={cat.title} delay={(i % 4) * 80} className="h-full">
                <div className="card-surface card-hover group flex h-full flex-col p-6">
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-10 w-10 items-center justify-center rounded-xl ${accent ? `${accent.bg} ${accent.text}` : 'bg-primary/10 text-primary'}`}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="text-base font-bold leading-snug">{cat.title}</h3>
                  </div>
                  <ul className="mt-5 space-y-2">
                    {cat.skills.map((s) => (
                      <li
                        key={s.name}
                        className="flex items-center gap-3 rounded-xl border border-transparent bg-secondary/50 px-3 py-2 text-sm font-medium transition-colors group-hover:border-border"
                      >
                        <SkillLogo skill={s} />
                        {s.name}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>

      {/* Logo marquee */}
      <div className="relative mt-16 [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]" aria-hidden>
        <div className="flex w-max animate-marquee gap-4 hover:[animation-play-state:paused]">
          {[...marquee, ...marquee].map((s, i) => (
            <div key={`${s.name}-${i}`} className="flex items-center gap-3 rounded-2xl border border-border bg-card px-5 py-3 shadow-sm">
              <SkillLogo skill={s} size="lg" />
              <span className="whitespace-nowrap text-sm font-semibold">{s.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
