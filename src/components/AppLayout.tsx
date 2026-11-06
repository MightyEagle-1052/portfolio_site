import { useCallback, useState } from 'react';
import type { Tag } from '@/data/site';
import { TESTIMONIALS } from '@/data/site';
import { scrollToId } from '@/hooks/useInView';
import Navbar from './portfolio/Navbar';
import Hero from './portfolio/Hero';
import Stats from './portfolio/Stats';
import About from './portfolio/About';
import Expertise from './portfolio/Expertise';
import Skills from './portfolio/Skills';
import Projects from './portfolio/Projects';
import Experience from './portfolio/Experience';
import Contact from './portfolio/Contact';
import Footer from './portfolio/Footer';
import { SectionHeading } from './portfolio/Shared';

export default function AppLayout() {
  // Project tag filters are lifted here so Expertise / Experience / Footer can deep-link into the gallery.
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);

  const viewTag = useCallback((tag: Tag) => {
    setSelectedTags([tag]);
    setTimeout(() => scrollToId('projects'), 30);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main">
        <Hero />
        <Stats />
        <About />
        <Expertise onViewTag={viewTag} />
        <Skills />
        <Projects selectedTags={selectedTags} setSelectedTags={setSelectedTags} />
        <Experience onViewTag={viewTag} />
        {TESTIMONIALS.length > 0 && (
          <section aria-label="Testimonials" className="py-20 md:py-28">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <SectionHeading eyebrow="Testimonials" title="What clients say" />
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {TESTIMONIALS.map((t) => (
                  <figure key={t.name} className="card-surface p-6">
                    <blockquote className="text-sm leading-relaxed text-muted-foreground">“{t.quote}”</blockquote>
                    <figcaption className="mt-5 flex items-center gap-3">
                      {t.image && <img src={t.image} alt={t.name} loading="lazy" className="h-10 w-10 rounded-full object-cover" />}
                      <div>
                        <p className="text-sm font-semibold">{t.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {t.position}, {t.company}
                        </p>
                      </div>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </section>
        )}
        <Contact />
      </main>
      <Footer onViewTag={viewTag} />
    </div>
  );
}
