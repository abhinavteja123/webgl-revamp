import React, { useState, Suspense } from 'react';
import { Plug, Shield, Cloud, Palette, ShoppingCart } from 'lucide-react';
import ShopShuffle from './ShopShuffle';
import CloudCarousel from './CloudCarousel';
import ConnectorScroller from './ConnectorScroller';
import { useSceneEnabled } from '../three/SceneManager';
import { useInView } from '../hooks/useInView';
import { ErrorBoundary } from './shared/ErrorBoundary';

const FeaturesScene = React.lazy(() => import('../three/FeaturesScene'));


const Features: React.FC = () => {
  const [themeColor, setThemeColor] = useState<'orange' | 'purple' | 'emerald' | 'indigo'>('orange');

  const colorsMap = {
    orange: {
      accent: '#e27533',
      light: 'rgba(226, 117, 51, 0.15)',
      sub: '#fed7aa',
      sub2: '#ffedd5',
    },
    purple: {
      accent: '#7F54B3',
      light: 'rgba(127, 84, 179, 0.15)',
      sub: '#ddd6fe',
      sub2: '#f3e8ff',
    },
    emerald: {
      accent: '#10B981',
      light: 'rgba(16, 185, 129, 0.15)',
      sub: '#a7f3d0',
      sub2: '#d1fae5',
    },
    indigo: {
      accent: '#635BFF',
      light: 'rgba(99, 91, 255, 0.15)',
      sub: '#c7d2fe',
      sub2: '#e0e7ff',
    },
  };

  const sceneEnabled = useSceneEnabled();
  const [sectionRef, inView] = useInView({ threshold: 0.05 });

  return (
    <section ref={sectionRef} id="platform" className="py-section px-6 md:px-12 lg:px-20 relative z-10 bg-white dark:bg-[#0B0B0B] transition-colors duration-300">
      {sceneEnabled && inView && (
        <ErrorBoundary fallback={null}>
          <Suspense fallback={null}>
            <FeaturesScene />
          </Suspense>
        </ErrorBoundary>
      )}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div className="max-w-xl">
            <h2 className="font-sans text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tighter mb-6 leading-[1.1]">
              Everything You Need
              <span className="text-gray-500 dark:text-gray-400 block">to Run a Payment Company.</span>
            </h2>
            <p className="font-sans text-sm font-medium text-gray-600 dark:text-gray-300 leading-relaxed">
              200+ connectors, PCI compliance, dashboards, storefronts, and plugins. Everything ships on day one.
            </p>
          </div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Card 1: Connector Integrations (Spans 8 columns) */}
          <div className="md:col-span-8 group relative bg-canvas dark:bg-[#121212] border border-gray-200/80 dark:border-white/5 rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.01)] hover:border-accent/40 dark:hover:border-accent/40 hover:-translate-y-1 hover:shadow-lg transition-all duration-500">
            <div className="relative z-10 p-6 h-full flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div className="max-w-md">
                  <div className="w-9 h-9 bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-white/10 rounded-lg flex items-center justify-center mb-4 text-gray-950 dark:text-white shadow-sm">
                    <Plug size={18} />
                  </div>
                  <h3 className="font-sans text-xl font-bold text-gray-950 dark:text-white tracking-tight mb-2">
                    Smart Routing
                  </h3>
                  <p className="font-sans text-sm font-semibold text-gray-550 dark:text-gray-350 leading-relaxed">
                    Route every transaction through the optimal processor. Automatic failover, retries, and cost-based optimization across 200+ connectors.
                  </p>
                </div>
                <div className="hidden lg:block select-none">
                  <div className="px-2 py-1 bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-white/10 rounded text-[9px] font-mono text-gray-500 dark:text-gray-400 font-extrabold uppercase tracking-wider">
                    Any Processor
                  </div>
                </div>
              </div>

              <div className="mt-8 w-full relative border-t border-gray-200/40 dark:border-white/5 pt-5">
                <ConnectorScroller />
              </div>
            </div>
          </div>

          {/* Card 2: PCI Compliant Support (Spans 4 columns) */}
          <div className="md:col-span-4 group relative bg-canvas dark:bg-[#121212] border border-gray-200/80 dark:border-white/5 rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.01)] hover:border-accent/40 dark:hover:border-accent/40 hover:-translate-y-1 hover:shadow-lg transition-all duration-500 flex flex-col">
            <div className="p-6 relative z-10 flex flex-col h-full">
              <div className="w-9 h-9 bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-white/10 rounded-lg flex items-center justify-center mb-4 text-gray-950 dark:text-white shadow-sm">
                <Shield size={18} />
              </div>
              <h3 className="font-sans text-xl font-bold text-gray-950 dark:text-white tracking-tight mb-2">PCI Compliance</h3>
              <p className="font-sans text-sm font-semibold text-gray-550 dark:text-gray-350 leading-relaxed mb-6">
                PCI DSS Level 1 certified from day one. Audit-ready documentation included.
              </p>

              <div className="mt-auto relative w-full h-24 flex items-center justify-center">
                <div className="relative w-full h-20 bg-white dark:bg-[#1A1A1E] border border-gray-200 dark:border-white/10 rounded-xl shadow-md flex items-center px-4 gap-3 z-10">
                  <div className="pci-status-dot w-2 h-2 bg-amber-500 rounded-full shrink-0"></div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-[10px] font-extrabold text-gray-950 dark:text-white uppercase tracking-wider">PCI DSS Level 1</span>
                      <div className="pci-tick-container flex items-center gap-1.5">
                        <span className="text-[9px] font-mono text-gray-500 pci-certified-text font-bold">Certified</span>
                        <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center pci-tick">
                          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div className="h-1.5 w-full bg-canvas dark:bg-[#121212] rounded-full overflow-hidden">
                      <div className="h-full pci-progress-bar rounded-full" style={{ backgroundColor: '#e27533' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Multi-cloud Deployments (Spans 4 columns) */}
          <div className="md:col-span-4 group relative bg-canvas dark:bg-[#121212] border border-gray-200/80 dark:border-white/5 rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.01)] hover:border-accent/40 dark:hover:border-accent/40 hover:-translate-y-1 hover:shadow-lg transition-all duration-500 flex flex-col">
            <div className="p-6 relative z-10 flex flex-col h-full">
              <div className="w-9 h-9 bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-white/10 rounded-lg flex items-center justify-center mb-4 text-gray-950 dark:text-white shadow-sm">
                <Cloud size={18} />
              </div>
              <h3 className="font-sans text-xl font-bold text-gray-950 dark:text-white tracking-tight mb-2">Multi-cloud Deployments</h3>
              <p className="font-sans text-sm font-semibold text-gray-550 dark:text-gray-350 leading-relaxed mb-6">
                Deploy on AWS, GCP, Azure, or your preferred cloud provider in hours with our Terraform scripts.
              </p>

              <div className="mt-auto">
                <CloudCarousel />
              </div>
            </div>
          </div>

          {/* Card 4: Whitelabelling & Customization (Spans 4 columns) */}
          <div className="md:col-span-4 group relative bg-canvas dark:bg-[#121212] border border-gray-200/80 dark:border-white/5 rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.01)] hover:border-accent/40 dark:hover:border-accent/40 hover:-translate-y-1 hover:shadow-lg transition-all duration-500 flex flex-col">
            <div className="p-6 relative z-10 flex flex-col h-full">
              <div className="w-9 h-9 bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-white/10 rounded-lg flex items-center justify-center mb-4 text-gray-950 dark:text-white shadow-sm">
                <Palette size={18} />
              </div>
              <h3 className="font-sans text-xl font-bold text-gray-950 dark:text-white tracking-tight mb-2">Whitelabelling</h3>
              <p className="font-sans text-sm font-semibold text-gray-550 dark:text-gray-350 leading-relaxed mb-4">
                Complete whitelabelling to match your brand. Click below to test live themes.
              </p>

              {/* Theme Customizer Controls */}
              <div className="flex gap-2 mb-6 select-none">
                {(['orange', 'purple', 'emerald', 'indigo'] as const).map((col) => (
                  <button
                    key={col}
                    onClick={() => setThemeColor(col)}
                    className={`w-4 h-4 rounded-full border transition-all ${themeColor === col ? 'scale-125 ring-2 ring-accent/30' : 'opacity-70 hover:opacity-100'}`}
                    style={{
                      backgroundColor: colorsMap[col].accent,
                      borderColor: themeColor === col ? '#FFF' : 'transparent',
                    }}
                    title={`Switch visualizer theme to ${col}`}
                  />
                ))}
              </div>

              <div className="mt-auto relative w-full h-24 flex items-center justify-center gap-6">
                {/* Original template card */}
                <div className="w-16 h-20 bg-white dark:bg-[#18181E] border border-gray-200 dark:border-white/10 rounded-lg p-2 whitelabel-card-1 transition-all duration-300">
                  <div className="w-5 h-5 rounded bg-gray-100 dark:bg-white/5 mb-2 flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-sm bg-gray-355 dark:bg-white/20"></div>
                  </div>
                  <div className="w-full h-1 bg-gray-200 dark:bg-white/10 rounded mb-1.5"></div>
                  <div className="w-4/5 h-0.5 bg-gray-150 dark:bg-white/5 rounded mb-1"></div>
                  <div className="w-3/5 h-0.5 bg-gray-150 dark:bg-white/5 rounded"></div>
                </div>

                {/* Arrow indicator */}
                <div className="whitelabel-arrow">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-gray-300 dark:text-white/20">
                    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>

                {/* Interactive branded card */}
                <div 
                  className="w-16 h-20 bg-white dark:bg-[#1A1A22] rounded-lg p-2 transition-all duration-500 shadow-md border"
                  style={{ borderColor: colorsMap[themeColor].accent + '50' }}
                >
                  <div 
                    className="w-5 h-5 rounded mb-2 flex items-center justify-center transition-colors duration-300"
                    style={{ backgroundColor: colorsMap[themeColor].light }}
                  >
                    <div className="w-2.5 h-2.5 rounded-sm transition-colors duration-300" style={{ backgroundColor: colorsMap[themeColor].accent }}></div>
                  </div>
                  <div className="w-full h-1 rounded mb-1.5 transition-colors duration-300" style={{ backgroundColor: colorsMap[themeColor].accent }}></div>
                  <div className="w-4/5 h-0.5 rounded mb-1 transition-colors duration-300" style={{ backgroundColor: colorsMap[themeColor].sub }}></div>
                  <div className="w-3/5 h-0.5 rounded transition-colors duration-300" style={{ backgroundColor: colorsMap[themeColor].sub2 }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 5: E-commerce Plugins (Spans 4 columns) */}
          <div className="md:col-span-4 group relative bg-canvas dark:bg-[#121212] border border-gray-200/80 dark:border-white/5 rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.01)] hover:border-accent/40 dark:hover:border-accent/40 hover:-translate-y-1 hover:shadow-lg transition-all duration-500 flex flex-col">
            <div className="p-6 relative z-10 flex flex-col h-full">
              <div className="w-9 h-9 bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-white/10 rounded-lg flex items-center justify-center mb-4 text-gray-950 dark:text-white shadow-sm">
                <ShoppingCart size={18} />
              </div>
              <h3 className="font-sans text-xl font-bold text-gray-950 dark:text-white tracking-tight mb-2">E-commerce Plugins</h3>
              <p className="font-sans text-sm font-semibold text-gray-550 dark:text-gray-350 leading-relaxed mb-6">
                Connect your e-commerce store to your payment system out of the box.
              </p>

              <div className="mt-auto">
                <ShopShuffle />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
