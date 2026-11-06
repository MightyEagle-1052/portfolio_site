import {
  ArrowRight,
  Mail,
  Linkedin,
  Github,
  Box,
  Glasses,
  Gamepad2,
  Brain,
  ScanLine,
} from "lucide-react";
import { PROFILE, LINKS, DOMAINS } from "@/data/site";
import { PROJECTS } from "@/data/projects";
import { scrollToId } from "@/hooks/useInView";
import NeuralCanvas from "./NeuralCanvas";
import { DOMAIN_ICONS } from "./Shared";

export default function Hero() {
  return (
    <section id="home" className="relative isolate overflow-hidden pt-[72px]">
      {/* Background layers */}
      <div className="absolute inset-0 -z-10 grid-pattern [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
      <div className="absolute -left-32 top-20 -z-10 h-[420px] w-[420px] rounded-full bg-primary/20 blur-[110px] animate-float-slow" />
      <div className="absolute -right-24 bottom-0 -z-10 h-[380px] w-[380px] rounded-full bg-[hsl(var(--violet)/0.18)] blur-[110px] animate-float-slow [animation-delay:-6s]" />
      <div className="absolute inset-0 -z-10 opacity-70">
        <NeuralCanvas />
      </div>

      <div className="mx-auto grid min-h-[calc(100vh-72px)] max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-12 lg:gap-8 lg:px-8 lg:py-20">
        <div className="lg:col-span-7 animate-slide-in">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1.5 text-xs font-semibold text-muted-foreground shadow-sm backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            {PROFILE.yearsExperience}+ Years of Experience · {PROFILE.hireNote}
          </span>

          <h1 className="mt-6 text-4xl font-bold leading-[1.05] sm:text-5xl md:text-6xl xl:text-7xl">
            Welcome.
          </h1>
          <p className="mt-5 font-mono text-base font-semibold text-primary sm:text-lg">
            {PROFILE.role}
          </p>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {PROFILE.heroDescription}
          </p>

          <ul className="mt-8 flex flex-wrap gap-2.5" aria-label="Highlights">
            {DOMAINS.map((d) => {
              const Icon = DOMAIN_ICONS[d.key];
              return (
                <li
                  key={d.key}
                  className={`inline-flex items-center gap-2 rounded-xl border border-border bg-card/80 px-3 py-2 text-sm font-medium shadow-sm backdrop-blur`}
                >
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-md ${d.accent.bg} ${d.accent.text}`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  {d.title}
                </li>
              );
            })}
          </ul>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <button
              onClick={() => scrollToId("projects")}
              className="group inline-flex items-center gap-2 rounded-xl bg-gradient-brand px-6 py-3.5 text-sm font-semibold text-white shadow-xl shadow-primary/25 transition-all hover:shadow-primary/40 hover:brightness-110"
            >
              Explore My Projects
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
            <button
              onClick={() => scrollToId("contact")}
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-3.5 text-sm font-semibold transition-colors hover:border-primary/50 hover:text-primary"
            >
              <Mail className="h-4 w-4" /> Contact Me
            </button>
          </div>

          <div className="mt-8 flex items-center gap-5 text-sm">
            <a
              href={LINKS.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              <Linkedin className="h-4 w-4" /> LinkedIn Profile
            </a>
            {LINKS.github && (
              <a
                href={LINKS.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                <Github className="h-4 w-4" /> GitHub
              </a>
            )}
          </div>
        </div>

        {/* Visual */}
        <div className="relative mx-auto w-full max-w-md lg:col-span-5 lg:max-w-none">
          <div className="absolute -inset-4 rounded-[2rem] bg-gradient-brand opacity-20 blur-2xl" />
          <div className="relative overflow-hidden rounded-[1.75rem] border border-border bg-card p-2 shadow-2xl">
            <div className="relative overflow-hidden rounded-[1.35rem]">
              <div className="relative aspect-[4/5] overflow-hidden bg-slate-950">
                <img
                  src="/ai-vision-hero.png"
                  alt="A person exploring a futuristic digital world filled with AI, virtual reality, and 3D landscapes"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
              {/* CV corner brackets */}
              <div className="pointer-events-none absolute inset-6">
                {[
                  "left-0 top-0 border-l-2 border-t-2",
                  "right-0 top-0 border-r-2 border-t-2",
                  "left-0 bottom-0 border-l-2 border-b-2",
                  "right-0 bottom-0 border-r-2 border-b-2",
                ].map((c) => (
                  <span
                    key={c}
                    className={`absolute h-6 w-6 border-cyan-400/80 ${c}`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div
            style={{ left: "-6rem" }}
            className="absolute top-10 hidden rounded-2xl border border-border glass px-4 py-3 shadow-xl animate-float-y sm:block"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-500/15 text-sky-600 dark:text-cyan-300">
                <Brain className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs text-muted-foreground">AR &amp; Computer Vision</p>
                <p className="text-sm font-semibold">YOLO · OpenCV · PyTorch</p>
              </div>
            </div>
          </div>
          <div
            style={{ top: "9rem", right: "-6rem" }}
            className="absolute hidden rounded-2xl border border-border glass px-4 py-3 shadow-xl animate-float-y [animation-delay:-3s] sm:block"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500/15 text-violet-600 dark:text-violet-300">
                <Box className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs text-muted-foreground">
                  Computer Graphics & 3D GIS
                </p>
                <p className="text-sm font-semibold">
                  3D Worlds · GIS · Visualization
                </p>
              </div>
            </div>
          </div>
          <div
            style={{ top: "16rem", left: "-8rem" }}
            className="absolute hidden rounded-2xl border border-border glass px-4 py-3 shadow-xl animate-float-y sm:block"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-500/15 text-sky-600 dark:text-cyan-300">
                <Glasses className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs text-muted-foreground">
                  AR/VR & XR Development
                </p>
                <p className="text-sm font-semibold">
                  WebXR · OpenXR · AR Foundation
                </p>
              </div>
            </div>
          </div>
          <div
            style={{ top: "23rem", right: "-6rem" }}
            className="absolute hidden rounded-2xl border border-border glass px-4 py-3 shadow-xl animate-float-y [animation-delay:-3s] sm:block"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500/15 text-violet-600 dark:text-violet-300">
                <Gamepad2 className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs text-muted-foreground">
                  Game Development
                </p>
                <p className="text-sm font-semibold">
                  Unity · C# · Unreal Engine
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
