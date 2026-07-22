import React, { Suspense, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { GitBranch, Building2, Users, Zap } from 'lucide-react';
import { Reveal } from './motion/Reveal';
import { useSceneEnabled } from '../three/SceneManager';
import { useInView } from '../hooks/useInView';
import { ErrorBoundary } from './shared/ErrorBoundary';

const SolutionsScene = React.lazy(() => import('../three/SolutionsScene'));

const systemTypes = [
  {
    id: 'orchestrator',
    icon: GitBranch,
    label: 'Orchestrator',
    title: 'Payment Orchestrator',
    desc: 'Route transactions across 200+ processors with smart routing, automatic failover, and cost optimization. One integration for your customers, every processor for you.',
    features: ['Smart routing engine', '200+ processor connectors', 'Automatic failover and retries', 'Cost-based optimization'],
  },
  {
    id: 'mor',
    icon: Building2,
    label: 'Merchant of Record',
    title: 'Merchant of Record',
    desc: 'You handle payments on behalf of your merchants. You own the compliance, tax, refunds, and disputes. Your sellers just sell.',
    features: ['Merchant onboarding', 'Tax and compliance handling', 'Refund and dispute management', 'Seller payouts'],
  },
  {
    id: 'facilitator',
    icon: Users,
    label: 'Facilitator',
    title: 'Payment Facilitator',
    desc: 'Sub-merchant management, split payments, and regulatory compliance for marketplaces and platforms. KYC/KYB, payouts, and onboarding included.',
    features: ['Sub-merchant management', 'Split payments', 'KYC/KYB workflows', 'Regulatory compliance'],
  },
  {
    id: 'gateway',
    icon: Zap,
    label: 'Gateway',
    title: 'Payment Gateway',
    desc: 'Direct processor connectivity with tokenization, 3DS authentication, and PCI scope reduction. Checkout to settlement, nothing in between.',
    features: ['Direct processor APIs', 'Tokenization and vaulting', '3DS authentication', 'PCI DSS Level 1'],
  },
];

const Solutions: React.FC = () => {
  const [active, setActive] = useState(0);
  const ActiveIcon = systemTypes[active].icon;
  const sceneEnabled = useSceneEnabled();
  const [sectionRef, inView] = useInView({ threshold: 0.05 });

  return (
    <section ref={sectionRef} id="solutions" className="py-section px-6 md:px-12 lg:px-20 relative z-10 bg-canvas dark:bg-[#0B0B0B] transition-colors duration-300">
      {sceneEnabled && inView && (
        <ErrorBoundary fallback={null}>
          <Suspense fallback={null}>
            <SolutionsScene activeTab={active} />
          </Suspense>
        </ErrorBoundary>
      )}
      <div className="max-w-7xl mx-auto">
        <Reveal className="max-w-xl mb-16">
          <h2 className="font-sans text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tighter mb-6 leading-[1.1]">
            One Platform,
            <span className="text-gray-500 dark:text-gray-400 block">Four System Types.</span>
          </h2>
          <p className="font-sans text-sm font-medium text-gray-600 dark:text-gray-300 leading-relaxed">
            Choose the payment system that fits your business model. Each one is fully white-labelled, PCI-compliant, and live in a day.
          </p>
        </Reveal>

        <div className="flex flex-wrap gap-2 mb-10 relative z-10" role="tablist" aria-label="Payment system types">
          {systemTypes.map((type, idx) => {
            const Icon = type.icon;
            const isActive = idx === active;
            return (
              <button
                key={type.id}
                role="tab"
                id={`tab-${type.id}`}
                aria-selected={isActive}
                aria-controls={`panel-${type.id}`}
                onClick={() => setActive(idx)}
                className={`focus-ring relative inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${
                  isActive
                    ? 'text-white dark:text-obsidian'
                    : 'bg-white dark:bg-[#151515] border border-gray-200 dark:border-white/5 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-white/10 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeSolutionTab"
                    className="absolute inset-0 bg-obsidian dark:bg-white rounded-lg shadow-md -z-10"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon size={15} aria-hidden="true" className="relative z-10" />
                <span className="relative z-10">{type.label}</span>
              </button>
            );
          })}
        </div>

        <div className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/10 rounded-2xl shadow-lg overflow-hidden transition-colors">
          <AnimatePresence mode="wait">
            <motion.div
              key={systemTypes[active].id}
              id={`panel-${systemTypes[active].id}`}
              role="tabpanel"
              aria-labelledby={`tab-${systemTypes[active].id}`}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-1 md:grid-cols-2"
            >
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <div className="flex items-center gap-3.5 mb-5">
                <div className="w-10 h-10 bg-accent/10 dark:bg-accent/15 rounded-lg flex items-center justify-center text-accent">
                  <ActiveIcon size={18} />
                </div>
                <h3 className="font-sans text-xl font-bold text-gray-900 dark:text-white tracking-tight">
                  {systemTypes[active].title}
                </h3>
              </div>
              <p className="font-sans text-sm font-medium text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                {systemTypes[active].desc}
              </p>
              <ul className="space-y-3.5">
                {systemTypes[active].features.map((feat) => (
                  <li key={feat} className="flex items-center gap-3 text-sm font-semibold text-gray-700 dark:text-gray-200">
                    <svg className="w-5 h-5 text-accent flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {feat}
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: visual */}
            <div className="bg-canvas dark:bg-[#181818]/40 border-t md:border-t-0 md:border-l border-gray-200 dark:border-white/10 p-8 md:p-12 flex items-center justify-center transition-colors">
              <svg className="w-full max-w-sm overflow-visible" viewBox="0 0 400 280">
                <defs>
                  <linearGradient id="solOrangeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#e27533" />
                    <stop offset="100%" stopColor="#F28C38" />
                  </linearGradient>
                  <linearGradient id="solGreenGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#10B981" />
                    <stop offset="100%" stopColor="#34D399" />
                  </linearGradient>
                  <filter id="glow-effect" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="2.5" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Different SVG per system type */}
                {active === 0 && (
                  <>
                    {/* Orchestrator: Request → Router → Processors → Success */}
                    <circle cx="30" cy="140" r="7" fill="#888" className="dark:fill-white/60"/>
                    <text x="30" y="166" textAnchor="middle" fontFamily="'Figtree'" fontSize="9" fontWeight="700" fill="#666" className="dark:fill-white/40">Request</text>
                    <path d="M37,140 L90,140" stroke="#DDD" strokeWidth="2" className="dark:stroke-white/10" />

                    <rect x="90" y="118" width="65" height="44" rx="6" fill="#111" className="dark:fill-white dark:stroke-white/20"/>
                    <text x="122" y="137" textAnchor="middle" fontFamily="'Figtree'" fontSize="9" fontWeight="700" fill="white" className="dark:fill-obsidian">Router</text>
                    <text x="122" y="150" textAnchor="middle" fontFamily="'Figtree'" fontSize="7.5" fontWeight="600" fill="#999" className="dark:fill-obsidian/60">Smart Routing</text>

                    {['Stripe', 'Adyen', 'PayPal', 'Klarna'].map((name, i) => {
                      const y = 50 + i * 60;
                      return (
                        <g key={name}>
                          {/* Router → Processor */}
                          <path d={`M155,140 C180,140 195,${y} 220,${y}`} stroke="#DDD" strokeWidth="1.5" fill="none" className="dark:stroke-white/10"/>
                          <path d={`M155,140 C180,140 195,${y} 220,${y}`} stroke="url(#solOrangeGrad)" strokeWidth="2.5" fill="none" opacity="0" strokeLinecap="round" filter="url(#glow-effect)">
                            <animate attributeName="opacity" values="0;1;0" dur="3s" begin={`${i * 0.75}s`} repeatCount="indefinite"/>
                          </path>
                          {/* Processor → Success */}
                          <path d={`M295,${y} C315,${y} 330,140 350,140`} stroke="#DDD" strokeWidth="1.5" fill="none" className="dark:stroke-white/10"/>
                          <path d={`M295,${y} C315,${y} 330,140 350,140`} stroke="url(#solGreenGrad)" strokeWidth="2.5" fill="none" opacity="0" strokeLinecap="round" filter="url(#glow-effect)">
                            <animate attributeName="opacity" values="0;0;1;0" dur="3s" begin={`${i * 0.75}s`} repeatCount="indefinite"/>
                          </path>
                          {/* Processor node */}
                          <rect x="220" y={y - 12} width="75" height="24" rx="5" fill="white" stroke="#DDD" strokeWidth="1.5" className="dark:fill-[#1E1E1E] dark:stroke-white/10" />
                          <circle cx="228" cy={y} r="3.5" fill="#E0E0E0" className="dark:fill-white/20">
                            <animate attributeName="fill" values="#888;#e27533;#888" dur="3s" begin={`${i * 0.75}s`} repeatCount="indefinite"/>
                          </circle>
                          <text x="262" y={y + 3.5} textAnchor="middle" fontFamily="'Figtree'" fontSize="8.5" fontWeight="700" fill="#111" className="dark:fill-white">{name}</text>
                        </g>
                      );
                    })}

                    {/* Success node */}
                    <circle cx="362" cy="140" r="12" fill="#10B981" filter="url(#glow-effect)"/>
                    <path d="M357 140l3 3 6-6" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                    <text x="362" y="168" textAnchor="middle" fontFamily="'Figtree'" fontSize="8.5" fontWeight="700" fill="#059669" className="dark:fill-emerald-400">Success</text>
                  </>
                )}
                {active === 1 && (
                  <>
                    {/* MOR: Buyers → Your Platform → Sellers + Compliance */}
                    <text x="200" y="15" textAnchor="middle" fontFamily="'Figtree'" fontSize="8.5" fontWeight="700" fill="#999" letterSpacing="0.05em" className="dark:fill-white/30">BUYERS PAY YOU</text>
                    {['Buyer 1', 'Buyer 2', 'Buyer 3'].map((name, i) => {
                      const x = 80 + i * 120;
                      return (
                        <g key={name}>
                          <rect x={x - 32} y="25" width="64" height="22" rx="4" fill="white" stroke="#EEE" strokeWidth="1" className="dark:fill-[#1A1A1E] dark:stroke-white/5"/>
                          <text x={x} y="38" textAnchor="middle" fontFamily="'Figtree'" fontSize="8.5" fontWeight="600" fill="#888" className="dark:fill-white/55">{name}</text>
                          {/* Static path */}
                          <line x1={x} y1="47" x2="200" y2="75" stroke="#EAEAEA" strokeWidth="1.5" className="dark:stroke-white/10" />
                          {/* Animated path */}
                          <line x1={x} y1="47" x2="200" y2="75" stroke="url(#solOrangeGrad)" strokeWidth="2" opacity="0" strokeLinecap="round" filter="url(#glow-effect)">
                            <animate attributeName="opacity" values="0;1;0" dur="3s" begin={`${i * 1}s`} repeatCount="indefinite"/>
                          </line>
                        </g>
                      );
                    })}
                    {/* Platform */}
                    <rect x="120" y="75" width="160" height="44" rx="8" fill="#111" className="dark:fill-white dark:stroke-white/20"/>
                    <text x="200" y="95" textAnchor="middle" fontFamily="'Figtree'" fontSize="9.5" fontWeight="700" fill="white" className="dark:fill-obsidian">Your Platform (MOR)</text>
                    <text x="200" y="108" textAnchor="middle" fontFamily="'Figtree'" fontSize="7.5" fill="#999" className="dark:fill-obsidian/60">You own the transaction</text>
                    
                    {/* Sellers with animated payouts */}
                    <text x="200" y="145" textAnchor="middle" fontFamily="'Figtree'" fontSize="8.5" fontWeight="700" fill="#999" letterSpacing="0.05em" className="dark:fill-white/30">YOU PAY SELLERS</text>
                    {['Seller A', 'Seller B', 'Seller C'].map((name, i) => {
                      const x = 80 + i * 120;
                      return (
                        <g key={name}>
                          {/* Static path */}
                          <line x1="200" y1="119" x2={x} y2="155" stroke="#EAEAEA" strokeWidth="1.5" className="dark:stroke-white/10" />
                          {/* Animated payout path */}
                          <line x1="200" y1="119" x2={x} y2="155" stroke="url(#solGreenGrad)" strokeWidth="2" opacity="0" strokeLinecap="round" filter="url(#glow-effect)">
                            <animate attributeName="opacity" values="0;0;1;0" dur="3s" begin={`${i * 1}s`} repeatCount="indefinite"/>
                          </line>
                          <rect x={x - 36} y="155" width="72" height="28" rx="5" fill="white" stroke="#DDD" strokeWidth="1.5" className="dark:fill-[#1E1E1E] dark:stroke-white/10" />
                          <circle cx={x - 28} cy="169" r="3.5" fill="#EAEAEA" className="dark:fill-white/20">
                            <animate attributeName="fill" values="#888;#10B981;#888" dur="3s" begin={`${i * 1}s`} repeatCount="indefinite"/>
                          </circle>
                          <text x={x} y="172.5" textAnchor="middle" fontFamily="'Figtree'" fontSize="9" fontWeight="700" fill="#111" className="dark:fill-white">{name}</text>
                        </g>
                      );
                    })}
                    {/* Compliance bar */}
                    <rect x="60" y="210" width="280" height="36" rx="6" fill="#10B981" opacity="0.08" />
                    <rect x="60" y="210" width="280" height="36" rx="6" stroke="#10B981" strokeWidth="1.5" fill="none" opacity="0.25" />
                    <text x="200" y="227" textAnchor="middle" fontFamily="'Figtree'" fontSize="8.5" fontWeight="700" fill="#059669" className="dark:fill-emerald-400">Tax, Refunds, Disputes, Compliance: All Handled</text>
                    <text x="200" y="239" textAnchor="middle" fontFamily="'Figtree'" fontSize="7.5" fontWeight="600" fill="#059669" opacity="0.8" className="dark:fill-emerald-400/80">PCI DSS Level 1 Certified</text>
                  </>
                )}
                {active === 2 && (
                  <>
                    {/* Facilitator: Marketplace → Split Engine → Merchant + Platform + Tax */}
                    <rect x="130" y="15" width="140" height="36" rx="8" fill="#111" className="dark:fill-white"/>
                    <text x="200" y="30" textAnchor="middle" fontFamily="'Figtree'" fontSize="8.5" fontWeight="700" fill="white" className="dark:fill-obsidian">Marketplace / Platform</text>
                    <text x="200" y="42" textAnchor="middle" fontFamily="'Figtree'" fontSize="7.5" fill="#999" className="dark:fill-obsidian/60">Customer pays $100</text>

                    {/* Animated flow down */}
                    <line x1="200" y1="51" x2="200" y2="80" stroke="#DDD" strokeWidth="2" className="dark:stroke-white/10" />
                    <line x1="200" y1="51" x2="200" y2="80" stroke="url(#solOrangeGrad)" strokeWidth="2.5" opacity="0" strokeLinecap="round" filter="url(#glow-effect)">
                      <animate attributeName="opacity" values="0;1;1;0" dur="4s" repeatCount="indefinite"/>
                    </line>

                    <rect x="130" y="80" width="140" height="36" rx="8" fill="#e27533" filter="url(#glow-effect)" />
                    <text x="200" y="99" textAnchor="middle" fontFamily="'Figtree'" fontSize="8.5" fontWeight="700" fill="white">Split Payment Engine</text>
                    <text x="200" y="110" textAnchor="middle" fontFamily="'Figtree'" fontSize="7.5" fill="white" opacity="0.8">Automatic distribution</text>

                    {[
                      { label: 'Merchant', amount: '$70', x: 60 },
                      { label: 'Platform Fee', amount: '$20', x: 200 },
                      { label: 'Tax Reserve', amount: '$10', x: 340 },
                    ].map((item, i) => (
                      <g key={item.label}>
                        {/* Static path */}
                        <line x1="200" y1="116" x2={item.x} y2="150" stroke="#DDD" strokeWidth="1.5" className="dark:stroke-white/10" />
                        {/* Animated split path */}
                        <line x1="200" y1="116" x2={item.x} y2="150" stroke="url(#solOrangeGrad)" strokeWidth="2" opacity="0" strokeLinecap="round" filter="url(#glow-effect)">
                          <animate attributeName="opacity" values="0;0;1;0" dur="4s" begin={`${i * 0.5}s`} repeatCount="indefinite"/>
                        </line>
                        <rect x={item.x - 42} y="150" width="84" height="36" rx="5" fill="white" stroke="#DDD" strokeWidth="1.5" className="dark:fill-[#1E1E1E] dark:stroke-white/10" />
                        <circle cx={item.x - 34} cy="168" r="3.5" fill="#E0E0E0" className="dark:fill-white/20">
                          <animate attributeName="fill" values="#888;#e27533;#888" dur="4s" begin={`${i * 0.5}s`} repeatCount="indefinite"/>
                        </circle>
                        <text x={item.x} y="165.5" textAnchor="middle" fontFamily="'Figtree'" fontSize="9.5" fontWeight="700" fill="#111" className="dark:fill-white">{item.label}</text>
                        <text x={item.x} y="179.5" textAnchor="middle" fontFamily="'Figtree'" fontSize="10" fontWeight="800" fill="#e27533">{item.amount}</text>
                      </g>
                    ))}

                    <rect x="60" y="210" width="280" height="30" rx="6" fill="#10B981" opacity="0.08" />
                    <rect x="60" y="210" width="280" height="30" rx="6" stroke="#10B981" strokeWidth="1.2" fill="none" opacity="0.25" />
                    <text x="200" y="229" textAnchor="middle" fontFamily="'Figtree'" fontSize="8.5" fontWeight="700" fill="#059669" className="dark:fill-emerald-400">KYC/KYB Verified · Sub-merchant Onboarding</text>
                  </>
                )}
                {active === 3 && (
                  <>
                    {/* Gateway: Merchant → Your Gateway → Processor → Card Network → Bank */}
                    <text x="200" y="15" textAnchor="middle" fontFamily="'Figtree'" fontSize="8.5" fontWeight="700" fill="#999" letterSpacing="0.05em" className="dark:fill-white/30">TRANSACTION FLOW</text>

                    {/* Merchant */}
                    <rect x="5" y="35" width="62" height="44" rx="5" fill="white" stroke="#DDD" strokeWidth="1.5" className="dark:fill-[#1E1E1E] dark:stroke-white/10" />
                    <text x="36" y="54" textAnchor="middle" fontFamily="'Figtree'" fontSize="9" fontWeight="700" fill="#111" className="dark:fill-white">Merchant</text>
                    <text x="36" y="67" textAnchor="middle" fontFamily="'Figtree'" fontSize="7" fill="#999" className="dark:fill-white/40">Your client</text>

                    {/* Static paths */}
                    <path d="M67,57 L88,57" stroke="#DDD" strokeWidth="1.5" className="dark:stroke-white/10" />
                    <path d="M168,57 L190,57" stroke="#DDD" strokeWidth="1.5" className="dark:stroke-white/10" />
                    <path d="M258,57 L278,57" stroke="#DDD" strokeWidth="1.5" className="dark:stroke-white/10" />
                    <path d="M330,57 L348,57" stroke="#DDD" strokeWidth="1.5" className="dark:stroke-white/10" />

                    {/* Animated flow */}
                    <path d="M67,57 L88,57" stroke="url(#solOrangeGrad)" strokeWidth="2.5" opacity="0" strokeLinecap="round" filter="url(#glow-effect)">
                      <animate attributeName="opacity" values="0;1;0;0;0" dur="4s" repeatCount="indefinite"/>
                    </path>
                    <path d="M168,57 L190,57" stroke="url(#solOrangeGrad)" strokeWidth="2.5" opacity="0" strokeLinecap="round" filter="url(#glow-effect)">
                      <animate attributeName="opacity" values="0;0;1;0;0" dur="4s" repeatCount="indefinite"/>
                    </path>
                    <path d="M258,57 L278,57" stroke="url(#solOrangeGrad)" strokeWidth="2.5" opacity="0" strokeLinecap="round" filter="url(#glow-effect)">
                      <animate attributeName="opacity" values="0;0;0;1;0" dur="4s" repeatCount="indefinite"/>
                    </path>
                    <path d="M330,57 L348,57" stroke="url(#solGreenGrad)" strokeWidth="2.5" opacity="0" strokeLinecap="round" filter="url(#glow-effect)">
                      <animate attributeName="opacity" values="0;0;0;0;1" dur="4s" repeatCount="indefinite"/>
                    </path>

                    {/* Your Gateway */}
                    <rect x="88" y="30" width="80" height="54" rx="8" fill="#111" className="dark:fill-white dark:stroke-white/20"/>
                    <text x="128" y="50" textAnchor="middle" fontFamily="'Figtree'" fontSize="9" fontWeight="700" fill="white" className="dark:fill-obsidian">Your Gateway</text>
                    <text x="128" y="62" textAnchor="middle" fontFamily="'Figtree'" fontSize="7" fontWeight="600" fill="#e27533" className="dark:fill-accent">Tokenize + 3DS</text>
                    <text x="128" y="73" textAnchor="middle" fontFamily="'Figtree'" fontSize="7" fill="#999" className="dark:fill-obsidian/50">PCI Level 1</text>

                    {/* Processor */}
                    <rect x="190" y="35" width="68" height="44" rx="5" fill="white" stroke="#DDD" strokeWidth="1.5" className="dark:fill-[#1E1E1E] dark:stroke-white/10" />
                    <circle cx="198" cy="57" r="3.5" fill="#DDD" className="dark:fill-white/20">
                      <animate attributeName="fill" values="#888;#888;#e27533;#888;#888" dur="4s" repeatCount="indefinite"/>
                    </circle>
                    <text x="228" y="54" textAnchor="middle" fontFamily="'Figtree'" fontSize="8" fontWeight="700" fill="#111" className="dark:fill-white">Processor</text>
                    <text x="228" y="67" textAnchor="middle" fontFamily="'Figtree'" fontSize="7" fill="#999" className="dark:fill-white/40">Acquirer</text>

                    {/* Card Network */}
                    <rect x="278" y="35" width="52" height="44" rx="5" fill="white" stroke="#DDD" strokeWidth="1.5" className="dark:fill-[#1E1E1E] dark:stroke-white/10" />
                    <circle cx="286" cy="57" r="3.5" fill="#DDD" className="dark:fill-white/20">
                      <animate attributeName="fill" values="#888;#888;#888;#e27533;#888" dur="4s" repeatCount="indefinite"/>
                    </circle>
                    <text x="308" y="54" textAnchor="middle" fontFamily="'Figtree'" fontSize="8" fontWeight="700" fill="#111" className="dark:fill-white">Card</text>
                    <text x="308" y="67" textAnchor="middle" fontFamily="'Figtree'" fontSize="7" fill="#999" className="dark:fill-white/40">Network</text>

                    {/* Issuing Bank */}
                    <rect x="348" y="35" width="48" height="44" rx="5" fill="#10B981" opacity="0.12" stroke="#10B981" strokeWidth="1.5"/>
                    <circle cx="356" cy="57" r="3.5" fill="#DDD" className="dark:fill-white/20">
                      <animate attributeName="fill" values="#888;#888;#888;#888;#10B981" dur="4s" repeatCount="indefinite"/>
                    </circle>
                    <text x="376" y="54" textAnchor="middle" fontFamily="'Figtree'" fontSize="8" fontWeight="700" fill="#059669" className="dark:fill-emerald-400">Issuing</text>
                    <text x="376" y="67" textAnchor="middle" fontFamily="'Figtree'" fontSize="7" fill="#059669" className="dark:fill-emerald-400/50">Bank</text>

                    {/* Bracket showing what you own */}
                    <rect x="85" y="92" width="86" height="1.5" fill="#e27533" opacity="0.5" />
                    <line x1="88" y1="88" x2="88" y2="96" stroke="#e27533" strokeWidth="1.5" opacity="0.5" />
                    <line x1="168" y1="88" x2="168" y2="96" stroke="#e27533" strokeWidth="1.5" opacity="0.5" />
                    <text x="128" y="108" textAnchor="middle" fontFamily="'Figtree'" fontSize="8" fontWeight="700" fill="#e27533">You own this</text>

                    {/* Divider */}
                    <line x1="20" y1="130" x2="380" y2="130" stroke="#DDD" strokeWidth="0.5" className="dark:stroke-white/5" />

                    {/* Bottom: capabilities */}
                    <text x="200" y="150" textAnchor="middle" fontFamily="'Figtree'" fontSize="9" fontWeight="700" fill="#111" className="dark:fill-white">Your Gateway Capabilities</text>

                    <g>
                      {[
                        { label: 'Tokenization', desc: 'Secure card data' },
                        { label: 'Card Vaulting', desc: 'Store for reuse' },
                        { label: '3DS Auth', desc: 'SCA compliance' },
                      ].map((item, i) => (
                        <g key={item.label}>
                          <rect x={20 + i * 128} y="162" width="118" height="36" rx="4" fill="white" stroke="#EEE" strokeWidth="1" className="dark:fill-[#1E1E1E] dark:stroke-white/10" />
                          <text x={79 + i * 128} y="177" textAnchor="middle" fontFamily="'Figtree'" fontSize="8.5" fontWeight="700" fill="#111" className="dark:fill-white">{item.label}</text>
                          <text x={79 + i * 128} y="189" textAnchor="middle" fontFamily="'Figtree'" fontSize="7.5" fill="#999" className="dark:fill-white/40">{item.desc}</text>
                        </g>
                      ))}
                    </g>

                    <g>
                      {[
                        { label: 'PCI Scope Reduction', desc: 'Level 1 compliant' },
                        { label: 'Automatic Retries', desc: 'Maximize auth rates' },
                        { label: 'Multi-processor', desc: 'Connect to any acquirer' },
                      ].map((item, i) => (
                        <g key={item.label}>
                          <rect x={20 + i * 128} y="206" width="118" height="36" rx="4" fill="white" stroke="#EEE" strokeWidth="1" className="dark:fill-[#1E1E1E] dark:stroke-white/10" />
                          <text x={79 + i * 128} y="221" textAnchor="middle" fontFamily="'Figtree'" fontSize="8.5" fontWeight="700" fill="#111" className="dark:fill-white">{item.label}</text>
                          <text x={79 + i * 128} y="233" textAnchor="middle" fontFamily="'Figtree'" fontSize="7.5" fill="#999" className="dark:fill-white/40">{item.desc}</text>
                        </g>
                      ))}
                    </g>
                  </>
                )}
              </svg>
            </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default Solutions;
