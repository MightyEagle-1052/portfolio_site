import React from 'react';
import {
  BarChart3,
  Bot,
  Box,
  Brain,
  Camera,
  Car,
  Cloud,
  Code2,
  Cpu,
  Database,
  Factory,
  Gamepad2,
  Github,
  Glasses,
  Globe,
  GraduationCap,
  Layers,
  Leaf,
  Linkedin,
  Map as MapIcon,
  Microscope,
  Music,
  Palette,
  Plane,
  Rocket,
  Server,
  Shield,
  Smartphone,
  Sparkles,
  Stethoscope,
  Wrench,
} from 'lucide-react';
import { domainByKey, domainByTag, PROFILE } from '@/data/site';

/** Logo letters: the saved monogram, or the name's initials when it's empty. */
const monogramText = () =>
  PROFILE.monogram ||
  PROFILE.name
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0])
    .join('')
    .slice(0, 3)
    .toUpperCase();
import { useInView } from '@/hooks/useInView';

type IconComponent = React.ComponentType<{ className?: string }>;

/** The icons an area can use, chosen in the admin. Same names as AREA_ICONS in shared/content-schema.mjs. */
const AREA_ICONS: Record<string, IconComponent> = {
  brain: Brain,
  box: Box,
  glasses: Glasses,
  gamepad: Gamepad2,
  code: Code2,
  cpu: Cpu,
  database: Database,
  cloud: Cloud,
  phone: Smartphone,
  globe: Globe,
  shield: Shield,
  chart: BarChart3,
  palette: Palette,
  bot: Bot,
  layers: Layers,
  rocket: Rocket,
  wrench: Wrench,
  server: Server,
  camera: Camera,
  map: MapIcon,
  microscope: Microscope,
  stethoscope: Stethoscope,
  car: Car,
  plane: Plane,
  factory: Factory,
  leaf: Leaf,
  music: Music,
  graduation: GraduationCap,
  sparkles: Sparkles,
};

/** Icon component for an area's icon name. */
export const iconFor = (name?: string): IconComponent => (name && AREA_ICONS[name]) || Sparkles;

/** Icon for a skill category: its area's icon, or a code icon for the Web Development style. */
export const categoryIcon = (domain: string): IconComponent => (domain === 'web' ? Code2 : iconFor(domainByKey(domain)?.icon));

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
}: {
  eyebrow: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: 'center' | 'left';
}) {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`reveal ${inView ? 'is-visible' : ''} ${align === 'center' ? 'mx-auto text-center' : ''} max-w-3xl mb-12 md:mb-16`}
    >
      <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/5 px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
        {eyebrow}
      </span>
      <h2 className="mt-5 text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">{title}</h2>
      {description && <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">{description}</p>}
    </div>
  );
}

export function Reveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <div ref={ref} className={`reveal ${inView ? 'is-visible' : ''} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

export function TagBadge({ tag, size = 'sm' }: { tag: string; size?: 'sm' | 'xs' }) {
  const d = domainByTag(tag);
  const Icon = d ? iconFor(d.icon) : Code2;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-semibold ring-1 ring-inset ${d?.accent.bg} ${d?.accent.text} ${d?.accent.ring} ${
        size === 'xs' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs'
      }`}
    >
      <Icon className="h-3 w-3" />
      {tag}
    </span>
  );
}

export function TechChip({ name }: { name: string }) {
  return (
    <span className="inline-flex items-center rounded-md border border-border bg-secondary/60 px-2 py-0.5 font-mono text-[11px] font-medium text-secondary-foreground">
      {name}
    </span>
  );
}

export function SocialIcon({ type }: { type: 'linkedin' | 'github' }) {
  return type === 'linkedin' ? <Linkedin className="h-4 w-4" /> : <Github className="h-4 w-4" />;
}

export function Monogram({ className = '' }: { className?: string }) {
  return (
    <span
      className={`relative inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-brand font-bold text-white shadow-lg shadow-primary/25 ${className}`}
      style={{ fontFamily: 'Space Grotesk, sans-serif' }}
      aria-hidden
    >
      {monogramText()}
    </span>
  );
}
