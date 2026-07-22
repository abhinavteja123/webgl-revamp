import React, { useEffect, useState } from 'react';
import { CALENDLY_URL, navLinks } from '../../lib/constants';

/** Fractal-noise grain as an inline SVG data URI (no external asset). */
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

/**
 * Immersive Spatial 3D shell (REDESIGN-PLAN.md §1). Dark full-bleed stage with a fixed
 * grain + vignette overlay, a FLOATING GLASS NAV DOCK (not a bar), and a left-edge
 * scroll-progress spine. Forces dark so the whole page reads as one cinematic surface.
 */
const ImmersiveLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [progress, setProgress] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Immersive home is dark-only. ponytail: force dark here rather than threading theme state.
    document.documentElement.classList.add('dark');
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      setProgress(max > 0 ? el.scrollTop / max : 0);
      setScrolled(el.scrollTop > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="relative min-h-[100dvh] bg-[#0B0B0B] text-white overflow-x-hidden">
      {/* grain */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[1] opacity-[0.05]"
        style={{ backgroundImage: GRAIN, backgroundSize: '180px 180px' }}
      />
      {/* vignette + top accent bloom */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[1]"
        style={{
          background:
            'radial-gradient(120% 80% at 50% -10%, rgba(226,117,51,0.12), transparent 55%),' +
            'radial-gradient(100% 100% at 50% 120%, rgba(0,0,0,0.65), transparent 45%)',
        }}
      />

      {/* scroll-progress spine */}
      <div aria-hidden className="fixed left-4 top-1/2 -translate-y-1/2 z-40 hidden h-44 w-px bg-white/10 md:block">
        <div className="w-px bg-accent transition-[height] duration-150" style={{ height: `${progress * 100}%` }} />
      </div>

      {/* floating glass nav dock */}
      <header className={`fixed left-1/2 top-4 z-50 -translate-x-1/2 transition-transform duration-300 ${scrolled ? 'scale-[0.97]' : ''}`}>
        <nav className="flex items-center gap-5 rounded-full bg-white/[0.05] px-5 py-2.5 ring-1 ring-inset ring-white/10 backdrop-blur-xl shadow-[0_12px_40px_-12px_rgba(0,0,0,0.7)]">
          <a href="/" className="focus-ring rounded font-outfit text-lg font-semibold tracking-tight" aria-label="BetterSwitch home">
            <span className="text-white">better</span>
            <span className="text-accent">switch</span>
          </a>
          <div className="hidden items-center gap-4 text-sm text-white/70 lg:flex">
            {navLinks.map((l) => (
              <a key={l.label} href={l.href} className="focus-ring rounded px-0.5 transition-colors hover:text-white">
                {l.label}
              </a>
            ))}
          </div>
          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring rounded-full bg-accent px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
          >
            Contact Us
          </a>
        </nav>
      </header>

      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default ImmersiveLayout;
