import React, { Suspense, lazy } from 'react';
import { ArrowRight } from 'lucide-react';
import { CALENDLY_URL } from '../../lib/constants';
import { GlassPanel } from './GlassPanel';
import { useSceneEnabled } from '../../three/SceneManager';

// Reuse the existing 3D routing network as the spatial backdrop.
const HeroBg = lazy(() => import('../../three/HeroScene'));

const stats = [
  { v: '200+', l: 'Payment Connectors' },
  { v: '24 Hours', l: 'Deployment Time' },
  { v: 'PCI', l: 'Level 1 Certified' },
];

// Verbatim audit log lines (memory/CONTENT-INVENTORY.md — Hero simulator).
const auditLines = [
  'System initialized. Orchestrator listening on port 443.',
  'Connectors synced: 200+ global gateways operational.',
  'Transaction initiated: Checkout payload received ($84.00 USD).',
  'Evaluating smart routing rule: [Lowest Cost Route].',
  'Candidates: Adyen (1.2%), Mollie (1.4%), Stripe (1.5%).',
  'Adyen selected (lowest cost: 1.2% fee). Dispatching transaction...',
  'Adyen response: 200 OK. Transaction settled successfully.',
];

/**
 * Hero — scene 01 (REDESIGN-PLAN.md §2). New spatial layout: oversized off-grid headline,
 * floating glass stat chips at varied depths, a docked glass audit terminal, over a live
 * 3D routing network. All copy verbatim from the content contract.
 *
 * ponytail: renders the audit log as a docked terminal (content preserved) rather than
 * re-porting the full interactive RoutingSimulator — the interactive sim can be layered
 * back in later without changing this layout.
 */
const HeroScene01: React.FC = () => {
  const sceneEnabled = useSceneEnabled();

  return (
    <section id="hero" className="relative flex min-h-[100dvh] items-center overflow-hidden px-6 pb-16 pt-32 md:px-12 lg:px-20">
      {sceneEnabled && (
        <Suspense fallback={null}>
          <HeroBg />
        </Suspense>
      )}

      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-12">
        {/* Left: headline stack */}
        <div className="lg:col-span-7">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-white/60 ring-1 ring-inset ring-white/10">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Payment Systems as a Service
          </span>

          <h1 className="mt-6 font-outfit font-semibold leading-[0.92] tracking-tighter [text-wrap:balance]">
            <span className="block text-[13vw] text-white md:text-[6.5rem] lg:text-[7.5rem]">Launch Your</span>
            <span className="block text-[13vw] text-white md:text-[6.5rem] lg:text-[7.5rem]">Payment Company</span>
            <span className="block bg-gradient-to-r from-accent to-[#F6A96B] bg-clip-text text-[13vw] text-transparent md:text-[6.5rem] lg:text-[7.5rem]">
              in a Day
            </span>
          </h1>

          <p className="mt-8 max-w-xl text-base font-medium leading-relaxed text-white/60 md:text-lg">
            White-label platform with 200+ payment connectors. Deploy a PCI-compliant Orchestrator,
            Merchant of Record, Facilitator, or Gateway on your own infrastructure.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring group inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-white transition-all hover:bg-accent-hover hover:shadow-[0_16px_40px_-12px_rgba(226,117,51,0.5)]"
            >
              Schedule a Demo
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#solutions"
              className="focus-ring inline-flex items-center rounded-full bg-white/5 px-7 py-3.5 text-sm font-semibold text-white/90 ring-1 ring-inset ring-white/15 transition-colors hover:bg-white/10"
            >
              Explore Solutions
            </a>
          </div>

          {/* Floating stat chips at varied depths */}
          <div className="mt-14 flex flex-wrap gap-4">
            {stats.map((s, i) => (
              <GlassPanel
                key={s.l}
                className="px-6 py-4"
                style={{ transform: `translateY(${i % 2 === 0 ? '-6px' : '10px'})` }}
              >
                <div className="text-2xl font-extrabold tabular-nums text-white">{s.v}</div>
                <div className="mt-1 text-[11px] font-bold uppercase tracking-widest text-white/40">{s.l}</div>
              </GlassPanel>
            ))}
          </div>
        </div>

        {/* Right: docked glass audit terminal */}
        <div className="lg:col-span-5">
          <GlassPanel className="overflow-hidden p-0">
            <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-accent/80" />
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-white/50">
                Real-time Audit Logs
              </span>
              <span className="ml-auto font-mono text-[10px] text-emerald-400">PCI LEVEL 1 DEPLOYED</span>
            </div>
            <div className="space-y-1.5 p-4 font-mono text-[11px] leading-relaxed text-white/70">
              {auditLines.map((line, i) => (
                <div key={i} className="flex gap-2">
                  <span className="select-none text-accent/60">›</span>
                  <span>{line}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between border-t border-white/10 px-4 py-2.5 font-mono text-[9px] font-bold text-white/40">
              <span>betterswitch-sandbox-v1.0.4</span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" /> 99.98% SLA
              </span>
            </div>
          </GlassPanel>
        </div>
      </div>
    </section>
  );
};

export default HeroScene01;
