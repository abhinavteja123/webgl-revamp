import React, { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

/**
 * Wires Lenis inertial smooth-scroll and drives GSAP ScrollTrigger from Lenis' RAF.
 * Disabled entirely under prefers-reduced-motion (native scroll, no inertia).
 */
export const SmoothScrollProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;

    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, [reduced]);

  return <>{children}</>;
};
