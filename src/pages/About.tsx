import React from 'react';
import PageLayout from '../components/layout/PageLayout';
import { Reveal } from '../components/motion/Reveal';
import { CALENDLY_URL } from '../lib/constants';
import { useSceneEnabled } from '../three/SceneManager';

const AboutCareersScene = React.lazy(() => import('../three/AboutCareersScene'));

const AboutPage: React.FC = () => {
  const sceneEnabled = useSceneEnabled();

  return (
    <PageLayout mainClassName="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 pt-16 pb-24 bg-canvas dark:bg-[#0B0B0B] transition-colors duration-300">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16 mt-6">
        {/* Left Content column */}
        <div className="lg:col-span-7 space-y-6">
          <Reveal>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white dark:bg-[#1A1A1E] border border-gray-200 dark:border-white/10 shadow-sm mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              <span className="font-sans text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">About</span>
            </span>
            <h1 className="font-sans text-4xl md:text-5xl font-extrabold tracking-tighter text-obsidian dark:text-white leading-tight mb-6">
              Building the infrastructure layer for payment companies
            </h1>
            <p className="font-sans text-base md:text-lg font-semibold text-gray-600 dark:text-gray-300 leading-relaxed max-w-xl">
              BetterSwitch is Payment Systems as a Service (PSaaS). We help fintechs, platforms, and enterprises launch PCI-compliant payment orchestrators, merchant-of-record systems, facilitators, and gateways on their own infrastructure — in days, not years.
            </p>
          </Reveal>
        </div>

        {/* Right Generated Image Column */}
        <div className="lg:col-span-5">
          <Reveal delay={0.15}>
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-250/20 dark:border-white/10 bg-white dark:bg-[#121212] p-2 hover:scale-[1.01] transition-transform duration-300 min-h-[300px] flex items-center justify-center">
              {sceneEnabled ? (
                <React.Suspense fallback={
                  <div className="w-8 h-8 border border-accent/30 border-t-accent rounded-full animate-spin" />
                }>
                  <AboutCareersScene />
                </React.Suspense>
              ) : (
                <>
                  <img 
                    src="/about_payment_network.png" 
                    alt="Abstract Payment Network Visual representation" 
                    className="w-full h-auto rounded-xl object-cover"
                    loading="lazy"
                  />
                  {/* Decorative glows */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 pointer-events-none" />
                </>
              )}
            </div>
          </Reveal>
        </div>
      </div>

      {/* 3 Grid cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {[
          { title: '200+ Connectors', desc: 'Global processor, wallet, and bank coverage out of the box.' },
          { title: 'Own Your Stack', desc: 'Deploy on AWS, GCP, or Azure with full white-label control.' },
          { title: 'PCI Compliant', desc: 'Level 1 certified infrastructure from day one.' },
        ].map((item, i) => (
          <Reveal key={item.title} delay={i * 0.1}>
            <div className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/5 rounded-2xl p-6 shadow-sm hover:border-[#e27533]/45 hover:shadow-md transition-all duration-300 h-full">
              <h2 className="font-sans text-lg font-bold text-obsidian dark:text-white mb-2">{item.title}</h2>
              <p className="font-sans text-sm font-semibold text-gray-550 dark:text-gray-350 leading-relaxed">{item.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.3} className="mt-16 text-center">
        <a
          href={CALENDLY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="focus-ring inline-flex items-center gap-2 bg-accent text-white text-sm font-semibold px-8 py-3.5 rounded-lg hover:bg-accent-hover hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md"
        >
          Talk to our team
        </a>
      </Reveal>
    </PageLayout>
  );
};

export default AboutPage;
