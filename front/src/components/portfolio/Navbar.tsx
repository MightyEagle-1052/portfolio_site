import { useEffect, useState } from 'react';
import { Menu, X, Sun, Moon, ArrowUpRight, Linkedin } from 'lucide-react';
import { NAV_ITEMS, LINKS } from '@/data/site';
import { useActiveSection, scrollToId } from '@/hooks/useInView';
import { useTheme } from '@/components/theme-provider';
import { Monogram } from './Shared';

const IDS = NAV_ITEMS.map((n) => n.id);

export function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Light mode' : 'Dark mode'}
      className={`relative inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-border bg-card text-foreground transition-colors hover:border-primary/50 hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring ${className}`}
    >
      <Sun className={`absolute h-[18px] w-[18px] transition-all duration-300 ${isDark ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'}`} />
      <Moon className={`absolute h-[18px] w-[18px] transition-all duration-300 ${isDark ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'}`} />
    </button>
  );
}

export default function Navbar() {
  const active = useActiveSection(IDS);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const go = (id: string) => {
    if (open) {
      setOpen(false);
      document.body.style.overflow = '';
      setTimeout(() => scrollToId(id), 20);
    } else {
      scrollToId(id);
    }
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled ? 'glass border-b border-border/70 shadow-sm' : 'border-b border-transparent bg-transparent'
        }`}
      >
        <nav className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8" aria-label="Main">
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              go('home');
            }}
            className="group flex items-center gap-3"
          >
            <Monogram className="transition-transform group-hover:rotate-[-6deg]" />
          </a>

          <div className="hidden items-center gap-1 lg:flex">
            {NAV_ITEMS.map((item) => {
              const isActive = active === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    go(item.id);
                  }}
                  aria-current={isActive ? 'page' : undefined}
                  className={`relative rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {item.label}
                  <span
                    className={`absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-gradient-brand transition-transform duration-300 ${
                      isActive ? 'scale-x-100' : 'scale-x-0'
                    }`}
                  />
                </a>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => go('contact')}
              className="hidden items-center gap-1.5 rounded-xl bg-gradient-brand px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:shadow-primary/40 hover:brightness-110 sm:inline-flex"
            >
              Contact Me <ArrowUpRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => setOpen(true)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card lg:hidden"
              aria-label="Open menu"
              aria-expanded={open}
              aria-controls="mobile-nav"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile drawer — rendered outside the header so the header's backdrop-filter doesn't trap fixed positioning */}
      <div
        id="mobile-nav"
        className={`fixed inset-0 z-[55] transition-[visibility] lg:hidden ${open ? 'visible' : 'invisible delay-300'}`}
        aria-hidden={!open}
      >
        <div
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`}
        />
        <aside
          className={`absolute right-0 top-0 flex h-full w-[84%] max-w-sm flex-col border-l border-border bg-background p-6 shadow-2xl transition-transform duration-300 ${
            open ? 'translate-x-0' : 'translate-x-full'
          }`}
          role="dialog"
          aria-label="Mobile navigation"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Monogram />
            </div>
            <button
              onClick={() => setOpen(false)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <ul className="mt-8 space-y-1">
            {NAV_ITEMS.map((item, i) => (
              <li key={item.id}>
                <button
                  onClick={() => go(item.id)}
                  className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-base font-medium transition-colors ${
                    active === item.id ? 'bg-primary/10 text-primary' : 'hover:bg-secondary'
                  }`}
                >
                  <span>
                    <span className="mr-3 font-mono text-xs text-muted-foreground">0{i + 1}</span>
                    {item.label}
                  </span>
                  {active === item.id && <span className="h-2 w-2 rounded-full bg-primary" />}
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-auto space-y-3">
            <div className="flex items-center justify-between rounded-xl border border-border px-4 py-3">
              <span className="text-sm font-medium">Theme</span>
              <ThemeToggle />
            </div>
            <button
              onClick={() => go('contact')}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-brand px-4 py-3 font-semibold text-white"
            >
              Contact Me <ArrowUpRight className="h-4 w-4" />
            </button>
            <a
              href={LINKS.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-border px-4 py-3 font-medium hover:border-primary/50"
            >
              <Linkedin className="h-4 w-4" /> LinkedIn
            </a>
          </div>
        </aside>
      </div>
    </>
  );
}
