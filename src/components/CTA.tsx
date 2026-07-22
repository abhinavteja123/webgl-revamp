import React, { Suspense } from 'react';
import { ArrowRight } from 'lucide-react';
import { Reveal } from './motion/Reveal';
import { CALENDLY_URL } from '../lib/constants';
import { useSceneEnabled } from '../three/SceneManager';
import { useInView } from '../hooks/useInView';
import { ErrorBoundary } from './shared/ErrorBoundary';

const CTAScene = React.lazy(() => import('../three/CTAScene'));

const CTA: React.FC = () => {
  const sceneEnabled = useSceneEnabled();
  const [sectionRef, inView] = useInView({ threshold: 0.05 });

  return (
    <section ref={sectionRef} className="py-section px-6 md:px-12 lg:px-20 relative overflow-hidden bg-white dark:bg-[#0B0B0B] transition-colors duration-300">
      {/* Visual background gradient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(226,117,51,0.08),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(226,117,51,0.04),transparent)] pointer-events-none" aria-hidden="true" />

      <div className="absolute top-[40%] right-[-10%] w-[300px] h-[300px] bg-accent/5 rounded-full blur-[80px] pointer-events-none" />

      {sceneEnabled && inView && (
        <ErrorBoundary fallback={null}>
          <Suspense fallback={null}>
            <CTAScene />
          </Suspense>
        </ErrorBoundary>
      )}

      <Reveal className="max-w-4xl mx-auto text-center relative z-10">
        <h2 className="font-sans text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-6 leading-[1.1]">
          Ready to Launch?
        </h2>
        <p className="text-base font-semibold text-gray-600 dark:text-gray-300 leading-relaxed max-w-xl mx-auto mb-10">
          Tell us what you need. We scope your system type, configure your connectors, and deploy to your cloud. You go live.
        </p>
        <a
          href={CALENDLY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="focus-ring group inline-flex items-center gap-2 bg-accent text-white text-sm font-semibold px-10 py-4 rounded-lg shadow-lg hover:bg-accent-hover hover:shadow-[0_12px_32px_-8px_rgba(226,117,51,0.45)] transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
        >
          <span>Book a Demo</span>
          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
        </a>
      </Reveal>
    </section>
  );
};

export default CTA;
