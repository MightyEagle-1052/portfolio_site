import { ArrowRight, Linkedin, CheckCircle2 } from 'lucide-react';
import { PROFILE, LINKS, DOMAINS } from '@/data/site';
import { scrollToId } from '@/hooks/useInView';
import { SectionHeading, Reveal } from './Shared';

export default function About() {
  return (
    <section id="about" className="relative py-20 md:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <Reveal className="relative order-2 lg:order-1">
          <div className="absolute -left-6 -top-6 h-32 w-32 rounded-3xl bg-gradient-brand opacity-20 blur-2xl" />
          <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-2 shadow-xl">
            <svg
              viewBox="0 0 800 600"
              role="img"
              aria-labelledby="about-visual-title about-visual-description"
              className="aspect-[4/3] w-full rounded-[1.25rem]"
            >
              <title id="about-visual-title">An intelligent digital world</title>
              <desc id="about-visual-description">
                A connected 3D city combines AI vision, geospatial data, immersive XR, games,
                science, sports, interior design, fitness, and mobility.
              </desc>
              <defs>
                <linearGradient id="world-background" x1="0" y1="0" x2="1" y2="1">
                  <stop stopColor="hsl(var(--primary) / 0.18)" />
                  <stop offset="0.55" stopColor="hsl(var(--background))" />
                  <stop offset="1" stopColor="hsl(var(--violet) / 0.2)" />
                </linearGradient>
                <linearGradient id="city-front" x1="0" y1="0" x2="0.9" y2="1">
                  <stop stopColor="hsl(var(--primary) / 0.7)" />
                  <stop offset="1" stopColor="hsl(var(--primary) / 0.22)" />
                </linearGradient>
                <linearGradient id="city-side" x1="0" y1="0" x2="1" y2="1">
                  <stop stopColor="hsl(var(--violet) / 0.55)" />
                  <stop offset="1" stopColor="hsl(var(--violet) / 0.18)" />
                </linearGradient>
                <pattern id="world-grid" width="32" height="32" patternUnits="userSpaceOnUse">
                  <path d="M32 0H0V32" fill="none" stroke="hsl(var(--foreground) / 0.06)" />
                </pattern>
              </defs>
              <rect width="800" height="600" fill="url(#world-background)" />
              <rect width="800" height="600" fill="url(#world-grid)" />

              <g fill="none" stroke="hsl(var(--primary) / 0.34)" strokeDasharray="5 8" strokeWidth="2">
                <path d="M210 155 330 242M590 150 489 238M190 430 322 357M610 430 488 361" />
                <circle cx="400" cy="300" r="205" />
                <circle cx="400" cy="300" r="164" strokeDasharray="2 10" />
              </g>

              <g stroke="hsl(var(--primary) / 0.55)" strokeLinejoin="round" strokeWidth="2">
                <path d="m203 365 195-112 199 114-197 116Z" fill="hsl(var(--primary) / 0.09)" />
                <path d="m257 331 58-34v-88l-58 34Z" fill="url(#city-side)" />
                <path d="m315 297 64 36v-94l-64-30Z" fill="url(#city-front)" />
                <path d="m327 263 28-16 29 17-28 17Z" fill="hsl(var(--primary) / 0.38)" />
                <path d="m355 281 29 17v-34l-29-17Z" fill="url(#city-side)" />
                <path d="m384 298 48-28v-125l-48 28Z" fill="url(#city-side)" />
                <path d="m432 270 57 32V174l-57-29Z" fill="url(#city-front)" />
                <path d="m391 173 47-28 56 31-47 27Z" fill="hsl(var(--violet) / 0.4)" />
                <path d="m438 203 9 5v-37l-9-5Z" fill="hsl(var(--primary) / 0.8)" />
                <path d="m454 212 9 5v-31l-9-5Z" fill="hsl(var(--primary) / 0.8)" />
                <path d="m470 221 9 5v-25l-9-5Z" fill="hsl(var(--primary) / 0.8)" />
                <path d="m322 334 47 27v-87l-47-27Z" fill="url(#city-front)" />
                <path d="m369 361 58-33v-86l-58 32Z" fill="url(#city-side)" />
                <path d="m434 329 48 28v-91l-48-27Z" fill="url(#city-front)" />
                <path d="m482 357 44-25v-86l-44 25Z" fill="url(#city-side)" />
              </g>

              <g fill="none" stroke="hsl(var(--primary) / 0.45)" strokeWidth="1.5">
                <path d="M273 273v-35m12 28v-39m12 32v-39m-36 17 58-34" />
                <path d="M402 230v-45m12 38v-44m12 37v-44" />
                <path d="M343 343v-42m13 49v-42m27 48v-43m67 16v-43m16 53v-42m27 48v-44" />
              </g>

              <g fontFamily="Inter, sans-serif">
                <g transform="translate(78 94)">
                  <rect width="190" height="76" rx="18" fill="hsl(var(--card) / 0.94)" stroke="hsl(var(--border))" />
                  <circle cx="38" cy="38" r="19" fill="hsl(var(--primary) / 0.14)" />
                  <path d="M31 38h14m-7-7v14m-11-3-3 3m24-14 3-3" stroke="hsl(var(--primary))" strokeLinecap="round" strokeWidth="2.5" />
                  <text x="68" y="33" fill="hsl(var(--muted-foreground))" fontSize="12" fontWeight="600">AI &amp; COMPUTER VISION</text>
                  <text x="68" y="53" fill="hsl(var(--foreground))" fontSize="15" fontWeight="700">See · Understand · Predict</text>
                </g>
                <g transform="translate(534 94)">
                  <rect width="188" height="76" rx="18" fill="hsl(var(--card) / 0.94)" stroke="hsl(var(--border))" />
                  <circle cx="38" cy="38" r="19" fill="hsl(var(--violet) / 0.14)" />
                  <path d="m28 44 10-17 12 17Zm4-6h13m-7-11v17" fill="none" stroke="hsl(var(--violet))" strokeLinejoin="round" strokeWidth="2" />
                  <text x="68" y="33" fill="hsl(var(--muted-foreground))" fontSize="12" fontWeight="600">3D GIS &amp; DIGITAL TWINS</text>
                  <text x="68" y="53" fill="hsl(var(--foreground))" fontSize="15" fontWeight="700">Map · Model · Explore</text>
                </g>
                <g transform="translate(78 430)">
                  <rect width="190" height="76" rx="18" fill="hsl(var(--card) / 0.94)" stroke="hsl(var(--border))" />
                  <circle cx="38" cy="38" r="19" fill="hsl(var(--primary) / 0.14)" />
                  <path d="M26 37a12 12 0 0 1 24 0v9h-5v-9a7 7 0 0 0-14 0v9h-5Zm12-4v12" fill="none" stroke="hsl(var(--primary))" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  <text x="68" y="33" fill="hsl(var(--muted-foreground))" fontSize="12" fontWeight="600">XR &amp; INTERACTIVE WORLDS</text>
                  <text x="68" y="53" fill="hsl(var(--foreground))" fontSize="15" fontWeight="700">Step Into the Experience</text>
                </g>
                <g transform="translate(534 430)">
                  <rect width="188" height="76" rx="18" fill="hsl(var(--card) / 0.94)" stroke="hsl(var(--border))" />
                  <circle cx="38" cy="38" r="19" fill="hsl(var(--violet) / 0.14)" />
                  <path d="M27 42v-9l11-6 11 6v9l-11 6Zm0-9 11 6 11-6m-11 6v9" fill="none" stroke="hsl(var(--violet))" strokeLinejoin="round" strokeWidth="2" />
                  <text x="68" y="33" fill="hsl(var(--muted-foreground))" fontSize="11" fontWeight="600">GAMES · SPORT · DESIGN</text>
                  <text x="68" y="53" fill="hsl(var(--foreground))" fontSize="15" fontWeight="700">Ideas Made Interactive</text>
                </g>
              </g>

              <g fill="hsl(var(--primary))">
                <circle cx="330" cy="242" r="5" />
                <circle cx="489" cy="238" r="5" />
                <circle cx="322" cy="357" r="5" />
                <circle cx="488" cy="361" r="5" />
              </g>
            </svg>
          </div>
          <div className="absolute -bottom-6 right-4 rounded-2xl border border-border bg-card px-5 py-4 shadow-xl sm:right-8">
            <p className="text-3xl font-bold text-gradient" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              {PROFILE.yearsExperience}+
            </p>
            <p className="text-xs font-medium text-muted-foreground">Years building software</p>
          </div>
        </Reveal>

        <div className="order-1 lg:order-2">
          <SectionHeading
            align="left"
            eyebrow="About Me"
            title={
              <>
                Building Intelligent Systems & <span className="text-gradient">Immersive Digital Experiences.</span>
              </>
            }
          />
          <Reveal className="-mt-6 space-y-4 text-base leading-relaxed text-muted-foreground md:text-lg">
            <p>
              I am a software developer specializing in Artificial Intelligence, Computer Vision, Computer Graphics, 3D GIS, AR/VR, and
              Game Development.
            </p>
            <p>
              With over eight years of experience, I develop intelligent visual systems, advanced 3D environments, interactive applications,
              and immersive digital solutions.
            </p>
            <p>
              My focus is combining AI innovation, visual computing, and interactive technologies to create practical and engaging software
              experiences.
            </p>
          </Reveal>

          <Reveal className="mt-8 grid gap-3 sm:grid-cols-2" delay={100}>
            {DOMAINS.map((d) => (
              <div key={d.key} className="flex items-start gap-2.5 text-sm font-medium">
                <CheckCircle2 className={`mt-0.5 h-4 w-4 shrink-0 ${d.accent.text}`} />
                {d.short}
              </div>
            ))}
          </Reveal>

          <Reveal className="mt-10 flex flex-wrap gap-3" delay={160}>
            <button
              onClick={() => scrollToId('expertise')}
              className="group inline-flex items-center gap-2 rounded-xl bg-foreground px-5 py-3 text-sm font-semibold text-background transition-opacity hover:opacity-90"
            >
              View My Expertise <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
            <a
              href={LINKS.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-border px-5 py-3 text-sm font-semibold transition-colors hover:border-primary/50 hover:text-primary"
            >
              <Linkedin className="h-4 w-4" /> Connect on LinkedIn
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
