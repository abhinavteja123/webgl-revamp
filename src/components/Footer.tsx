import React, { useEffect, useRef } from 'react';
import { Twitter, Linkedin } from 'lucide-react';
import Logo from './shared/Logo';
import { colors, fonts, footerLinks } from '../lib/constants';

const FooterAmbientBg: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    let time = 0;
    const render = () => {
      time += 0.003;
      ctx.clearRect(0, 0, width, height);

      // First moving radial glow
      const grad1X = width / 2 + Math.sin(time) * (width * 0.18);
      const grad1Y = height * 0.95 + Math.cos(time * 0.8) * (height * 0.08);
      const grad1R = Math.max(250, width * 0.35);

      const gradient1 = ctx.createRadialGradient(grad1X, grad1Y, 0, grad1X, grad1Y, grad1R);
      gradient1.addColorStop(0, 'rgba(226, 117, 51, 0.16)');
      gradient1.addColorStop(0.5, 'rgba(226, 117, 51, 0.04)');
      gradient1.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = gradient1;
      ctx.fillRect(0, 0, width, height);

      // Second moving radial glow (overlapping)
      const grad2X = width / 2.3 + Math.cos(time * 1.1) * (width * 0.22);
      const grad2Y = height * 0.9 + Math.sin(time * 1.3) * (height * 0.06);
      const grad2R = Math.max(300, width * 0.4);

      const gradient2 = ctx.createRadialGradient(grad2X, grad2Y, 0, grad2X, grad2Y, grad2R);
      gradient2.addColorStop(0, 'rgba(226, 117, 51, 0.1)');
      gradient2.addColorStop(0.5, 'rgba(226, 117, 51, 0.03)');
      gradient2.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = gradient2;
      ctx.fillRect(0, 0, width, height);

      animationId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none opacity-80"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};

const Footer: React.FC = () => {
  return (
    <footer 
      style={{ backgroundColor: colors.obsidian }} 
      className="py-20 px-6 md:px-12 lg:px-20 relative z-10 overflow-hidden border-t border-white/5"
    >
      {/* Dynamic ambient orange glow in the footer bottom */}
      <FooterAmbientBg />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-12 border-b border-white/10">
          <a href="/" className="focus-ring flex items-center gap-2.5 rounded group" aria-label="BetterSwitch home">
            <Logo size="small" />
            <span className="text-xl tracking-tight" style={{ fontFamily: fonts.outfit, fontWeight: 600 }}>
              <span className="text-white">better</span>
              <span className="text-accent">switch</span>
            </span>
          </a>

          <nav className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3" aria-label="Footer navigation">
            {footerLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="focus-ring text-sm hover:text-white transition-colors rounded px-1.5 py-0.5 font-medium"
                style={{ color: 'rgba(255,255,255,0.6)' }}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <a
              href="https://twitter.com/betterswitch"
              aria-label="Follow us on Twitter"
              className="focus-ring w-9 h-9 rounded-lg flex items-center justify-center transition-all hover:bg-white/10 hover:text-white hover:scale-105 active:scale-95 duration-200"
              style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)' }}
            >
              <Twitter size={15} />
            </a>
            <a
              href="https://www.linkedin.com/company/betterswitch/"
              aria-label="Follow us on LinkedIn"
              className="focus-ring w-9 h-9 rounded-lg flex items-center justify-center transition-all hover:bg-white/10 hover:text-white hover:scale-105 active:scale-95 duration-200"
              style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)' }}
            >
              <Linkedin size={15} />
            </a>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8">
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>
            <span>© 2026 betterswitch</span>
            <a href="/about" className="focus-ring hover:text-white/80 transition-colors rounded">About</a>
            <a href="https://betterswitch.io/privacy" className="focus-ring hover:text-white/80 transition-colors rounded">Privacy</a>
            <a href="https://betterswitch.io/terms" className="focus-ring hover:text-white/80 transition-colors rounded">Terms</a>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.5)' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
