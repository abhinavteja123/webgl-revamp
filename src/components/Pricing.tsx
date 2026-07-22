import React from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { Reveal } from './motion/Reveal';
import { CALENDLY_URL } from '../lib/constants';
import { useSceneEnabled } from '../three/SceneManager';
import { useInView } from '../hooks/useInView';
import { ErrorBoundary } from './shared/ErrorBoundary';

const PricingScene = React.lazy(() => import('../three/PricingScene'));

const features = [
  '200+ payment connectors',
  'PCI DSS Level 1 compliance',
  'White-label dashboards',
  'Smart routing engine',
  'Multi-cloud deployment',
  'E-commerce plugins',
  'KYC/KYB workflows',
  'Dedicated engineering support',
];

const Pricing: React.FC = () => {
  const sceneEnabled = useSceneEnabled();
  const [sectionRef, inView] = useInView({ threshold: 0.05 });

  return (
    <section id="pricing" className="py-section px-6 md:px-12 lg:px-20 border-b border-gray-250/30 dark:border-white/5 bg-canvas dark:bg-[#0B0B0B] transition-colors duration-300 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[20%] left-[-10%] w-[350px] h-[350px] bg-accent/5 rounded-full blur-[90px] pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        <Reveal className="text-center mb-16">
          <h2 className="font-sans text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tighter mb-6 leading-[1.1]">
            Transparent Pricing
          </h2>
          <p className="text-base font-semibold text-gray-600 dark:text-gray-300 leading-relaxed">
            One-time setup, volume-based transaction pricing thereafter. No hidden fees.
          </p>
        </Reveal>

        <div ref={sectionRef} className="max-w-lg mx-auto relative">
          {sceneEnabled && inView && (
            <ErrorBoundary fallback={null}>
              <React.Suspense fallback={null}>
                <PricingScene />
              </React.Suspense>
            </ErrorBoundary>
          )}
          {/* Pricing Details Card */}
          <div className="relative z-10 bg-obsidian text-white p-8 md:p-10 rounded-2xl shadow-2xl border border-white/5 hover:border-accent/30 hover:shadow-[0_20px_50px_rgba(226,117,51,0.15)] transition-all duration-500 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="font-mono text-[9px] font-bold text-accent uppercase tracking-[0.12em]">Setup + Transaction Tier</span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8 pb-8 border-b border-white/10">
                <div>
                  <div className="text-[10px] text-white/50 font-bold uppercase tracking-wider mb-1">One-time setup</div>
                  <div className="text-2xl font-extrabold text-white tracking-tight">Custom</div>
                  <div className="text-[10px] text-white/40 font-semibold mt-1">Based on system type</div>
                </div>
                <div>
                  <div className="text-[10px] text-white/50 font-bold uppercase tracking-wider mb-1">Per transaction</div>
                  <div className="text-2xl font-extrabold text-white tracking-tight">Volume-based</div>
                  <div className="text-[10px] text-white/40 font-semibold mt-1">Scales with your growth</div>
                </div>
              </div>

              <div className="mb-8">
                <div className="text-xs font-bold text-white/40 uppercase tracking-wider mb-4">Everything included</div>
                <ul className="grid grid-cols-1 gap-3.5">
                  {features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-white/80 font-medium">
                      <Check size={14} className="text-accent flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring group w-full py-3.5 rounded-lg text-sm font-semibold transition-all duration-300 ease-out hover:scale-[1.02] active:scale-[0.98] bg-white text-obsidian hover:shadow-[0_0_20px_rgba(255,255,255,0.25)] flex items-center justify-center gap-2"
            >
              Book a Demo
              <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
