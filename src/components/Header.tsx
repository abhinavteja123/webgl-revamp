import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'motion/react';
import Logo from './shared/Logo';
import { ChevronDown, Menu, X, Sun, Moon } from 'lucide-react';
import { useDropdown } from '../hooks/useDropdown';
import { platformLinks, companyLinks, CALENDLY_URL } from '../lib/constants';
import { useTheme } from '../context/ThemeContext';

const Header: React.FC = () => {
  const platform = useDropdown();
  const company = useDropdown();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredNav, setHoveredNav] = useState<number | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  // Magnetic Button Motion State
  const magX = useMotionValue(0);
  const magY = useMotionValue(0);
  const springX = useSpring(magX, { stiffness: 120, damping: 15 });
  const springY = useSpring(magY, { stiffness: 120, damping: 15 });

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;
    magX.set(mouseX * 0.35);
    magY.set(mouseY * 0.35);
  };

  const handleMouseLeave = () => {
    magX.set(0);
    magY.set(0);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        platform.closeImmediate();
        company.closeImmediate();
        setMobileOpen(false);
      }
    };
    const onClickOutside = () => {
      platform.handleClickOutside();
      company.handleClickOutside();
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('click', onClickOutside);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('click', onClickOutside);
    };
  }, [platform, company]);

  return (
    <header
      className={`w-full px-6 md:px-12 lg:px-20 sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'py-3.5 bg-white/80 dark:bg-[#111111]/80 backdrop-blur-md border-b border-gray-200/50 dark:border-white/5 shadow-[0_2px_30px_rgba(0,0,0,0.02)]'
          : 'py-5 bg-white dark:bg-[#111111] border-b border-transparent shadow-none'
      }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <a href="/" className="focus-ring flex items-center gap-2.5 rounded group" aria-label="BetterSwitch home">
          <Logo size="medium" className="transition-transform duration-300 group-hover:scale-105" />
          <span className="text-2xl tracking-tight font-outfit font-semibold transition-colors duration-300">
            <span className="text-obsidian dark:text-white">better</span>
            <span className="text-accent">switch</span>
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-2 relative z-10" aria-label="Main navigation" onMouseLeave={() => setHoveredNav(null)}>
          {/* Platform Link / Dropdown */}
          <div
            ref={platform.ref}
            className="relative"
            onMouseEnter={() => { platform.open(); setHoveredNav(0); }}
            onMouseLeave={platform.close}
          >
            <button
              onClick={platform.toggle}
              aria-expanded={platform.isOpen}
              aria-haspopup="true"
              aria-controls="platform-menu"
              className="focus-ring relative font-sans text-[14px] font-semibold text-gray-700 dark:text-gray-200 hover:text-obsidian dark:hover:text-white flex items-center gap-1 rounded-lg px-3.5 py-2 transition-colors z-10"
            >
              {hoveredNav === 0 && (
                <motion.div
                  layoutId="headerHoverPill"
                  className="absolute inset-0 bg-gray-100/70 dark:bg-white/5 rounded-lg -z-10"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              Platform
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 opacity-60 ${platform.isOpen ? 'rotate-180' : ''}`}
              />
            </button>
            <AnimatePresence>
              {platform.isOpen && (
                <motion.div
                  id="platform-menu"
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
                  className="absolute top-full left-0 mt-2 w-72 bg-white dark:bg-[#181818] border border-gray-200/80 dark:border-white/10 rounded-xl shadow-xl p-2.5 z-50 origin-top-left"
                  role="menu"
                >
                  {platformLinks.map((link) => {
                    const descriptions: Record<string, string> = {
                      'Overview': 'Our core payment orchestrator architecture',
                      'Solutions': 'Orchestrator, Gateway, Facilitator & MOR',
                      'Connectors': 'Explore 200+ global payment integrations',
                    };
                    return (
                      <a
                        key={link.label}
                        href={link.href}
                        role="menuitem"
                        className="focus-ring flex flex-col gap-0.5 px-4 py-3 text-sm font-bold text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-colors"
                      >
                        <span className="hover:text-accent dark:hover:text-accent transition-colors">{link.label}</span>
                        <span className="text-[11px] font-normal text-gray-500 dark:text-gray-400">{descriptions[link.label]}</span>
                      </a>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <a
            href="/#pricing"
            onMouseEnter={() => setHoveredNav(1)}
            className="focus-ring relative font-sans text-[14px] font-semibold text-gray-700 dark:text-gray-200 hover:text-obsidian dark:hover:text-white flex items-center rounded-lg px-3.5 py-2 transition-colors z-10"
          >
            {hoveredNav === 1 && (
              <motion.div
                layoutId="headerHoverPill"
                className="absolute inset-0 bg-gray-100/70 dark:bg-white/5 rounded-lg -z-10"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            Pricing
          </a>

          <a
            href="/#customers"
            onMouseEnter={() => setHoveredNav(2)}
            className="focus-ring relative font-sans text-[14px] font-semibold text-gray-700 dark:text-gray-200 hover:text-obsidian dark:hover:text-white flex items-center rounded-lg px-3.5 py-2 transition-colors z-10"
          >
            {hoveredNav === 2 && (
              <motion.div
                layoutId="headerHoverPill"
                className="absolute inset-0 bg-gray-100/70 dark:bg-white/5 rounded-lg -z-10"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            Customers
          </a>

          {/* Company Link / Dropdown */}
          <div
            ref={company.ref}
            className="relative"
            onMouseEnter={() => { company.open(); setHoveredNav(3); }}
            onMouseLeave={company.close}
          >
            <button
              onClick={company.toggle}
              aria-expanded={company.isOpen}
              aria-haspopup="true"
              aria-controls="company-menu"
              className="focus-ring relative font-sans text-[14px] font-semibold text-gray-700 dark:text-gray-200 hover:text-obsidian dark:hover:text-white flex items-center gap-1 rounded-lg px-3.5 py-2 transition-colors z-10"
            >
              {hoveredNav === 3 && (
                <motion.div
                  layoutId="headerHoverPill"
                  className="absolute inset-0 bg-gray-100/70 dark:bg-white/5 rounded-lg -z-10"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              Company
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 opacity-60 ${company.isOpen ? 'rotate-180' : ''}`}
              />
            </button>
            <AnimatePresence>
              {company.isOpen && (
                <motion.div
                  id="company-menu"
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
                  className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-[#181818] border border-gray-200/80 dark:border-white/10 rounded-xl shadow-xl p-2.5 z-50 origin-top-left"
                  role="menu"
                >
                  {companyLinks.map((link) => {
                    const descriptions: Record<string, string> = {
                      'Blog': 'Thought leadership and updates',
                      'Careers': 'Join our infrastructure team',
                      'About': 'Our mission and story',
                    };
                    return (
                      <a
                        key={link.label}
                        href={link.href}
                        role="menuitem"
                        className="focus-ring flex flex-col gap-0.5 px-4 py-3 text-sm font-bold text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-colors"
                      >
                        <span className="hover:text-accent dark:hover:text-accent transition-colors">{link.label}</span>
                        <span className="text-[11px] font-normal text-gray-500 dark:text-gray-400">{descriptions[link.label]}</span>
                      </a>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>

        <div className="flex items-center gap-4">
          {/* Sun/Moon Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="focus-ring w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1A1A1A] text-obsidian dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-all duration-300 relative overflow-hidden"
          >
            <motion.div
              initial={false}
              animate={{ rotate: theme === 'dark' ? 90 : 0, scale: theme === 'dark' ? 0 : 1 }}
              transition={{ duration: 0.3 }}
              className="absolute"
            >
              <Sun size={17} className="text-accent" />
            </motion.div>
            <motion.div
              initial={false}
              animate={{ rotate: theme === 'dark' ? 0 : -90, scale: theme === 'dark' ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              className="absolute"
            >
              <Moon size={17} className="text-amber-400" />
            </motion.div>
          </button>

          {/* Contact Button */}
          <motion.a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ x: springX, y: springY }}
            className="focus-ring group relative isolate overflow-hidden bg-accent text-white text-sm font-semibold px-5 py-2.5 rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.08)] ring-1 ring-white/10 transition-all duration-500 hover:scale-[1.03] hover:bg-accent-hover hover:shadow-[0_12px_32px_-8px_rgba(226,117,51,0.4)] active:scale-[0.98] hidden md:flex items-center gap-2"
          >
            <div className="shimmer-layer absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent z-0 pointer-events-none" />
            <span className="relative z-10">Contact Us</span>
          </motion.a>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            className="focus-ring md:hidden w-9 h-9 flex items-center justify-center rounded-lg text-obsidian dark:text-white border border-gray-200 dark:border-white/10 hover:bg-gray-105 dark:hover:bg-white/5 transition-colors"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            id="mobile-menu"
            ref={mobileMenuRef}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="md:hidden mt-4 pb-4 border-t border-gray-200/50 dark:border-white/5 pt-4 space-y-1 overflow-hidden"
            aria-label="Mobile navigation"
          >
            {[
              { label: 'Platform', href: '/#platform' },
              { label: 'Solutions', href: '/#solutions', indent: true },
              { label: 'Connectors', href: '/connectors', indent: true },
              { label: 'Pricing', href: '/#pricing' },
              { label: 'Customers', href: '/#customers' },
              { label: 'Blog', href: '/blog' },
              { label: 'Careers', href: '/careers' },
              { label: 'About', href: '/about' },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={closeMobile}
                className={`focus-ring block px-3 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-200 rounded hover:bg-gray-100 dark:hover:bg-white/5 transition-colors ${link.indent ? 'pl-6 text-gray-500 dark:text-gray-400 font-medium' : ''}`}
              >
                {link.label}
              </a>
            ))}
            <div className="pt-2">
              <a
                href={CALENDLY_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={closeMobile}
                className="focus-ring block w-full text-center bg-accent text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-accent-hover transition-colors shadow-sm"
              >
                Contact Us
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
