import React from 'react';
import PageLayout from '../components/layout/PageLayout';
import { Reveal } from '../components/motion/Reveal';
import { useSceneEnabled } from '../three/SceneManager';

const AboutCareersScene = React.lazy(() => import('../three/AboutCareersScene'));

const CareersPage: React.FC = () => {
  const sceneEnabled = useSceneEnabled();

  return (
    <PageLayout mainClassName="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 pt-16 pb-24 bg-canvas dark:bg-[#0B0B0B] transition-colors duration-300">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-12 mt-6">
        {/* Left Column Text */}
        <div className="lg:col-span-7 space-y-6">
          <Reveal>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white dark:bg-[#1A1A1E] border border-gray-200 dark:border-white/10 shadow-sm mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              <span className="font-sans text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Careers</span>
            </span>
            <h1 className="font-sans text-4xl md:text-5xl font-extrabold tracking-tighter text-obsidian dark:text-white leading-tight mb-6">
              Join us in reshaping global payments
            </h1>
            <p className="font-sans text-base md:text-lg font-semibold text-gray-600 dark:text-gray-300 leading-relaxed max-w-xl">
              We are building the platform that powers the next generation of payment companies. If you are passionate about fintech infrastructure, we would love to hear from you.
            </p>
          </Reveal>
        </div>

        {/* Right Column Image */}
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
                    src="/careers_team.png" 
                    alt="Futuristic software developers workspace illustration" 
                    className="w-full h-auto rounded-xl object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 pointer-events-none" />
                </>
              )}
            </div>
          </Reveal>
        </div>
      </div>

      <Reveal delay={0.25}>
        <div className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/5 rounded-2xl p-8 md:p-12 text-center shadow-sm max-w-3xl mx-auto transition-colors">
          <h2 className="font-sans text-xl font-bold text-obsidian dark:text-white mb-3">No open roles right now</h2>
          <p className="font-sans text-sm font-semibold text-gray-600 dark:text-gray-400 leading-relaxed max-w-md mx-auto mb-6">
            We are not actively hiring for specific positions, but we are always interested in meeting exceptional engineers and product builders.
          </p>
          <a
            href="mailto:biz@betterswitch.io"
            className="focus-ring inline-flex items-center gap-2 text-sm font-bold text-accent hover:text-accent-hover hover:underline transition-all rounded px-2.5 py-1.5"
          >
            Send your resume to biz@betterswitch.io
          </a>
        </div>
      </Reveal>
    </PageLayout>
  );
};

export default CareersPage;
