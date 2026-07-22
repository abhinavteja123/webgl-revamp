import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Store, Wallet, Play, Terminal, CheckCircle, RefreshCw } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useSceneEnabled } from '../three/SceneManager';
import { useInView } from '../hooks/useInView';
import { ErrorBoundary } from './shared/ErrorBoundary';

const DashboardScene = React.lazy(() => import('../three/DashboardScene'));

const sdkCodeSnippets: Record<string, string> = {
  curl: `curl -X POST https://api.betterswitch.com/v1/payments \\
  -H "Authorization: Bearer bs_live_8F3k9s01" \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 8400,
    "currency": "usd",
    "routing_rule": "lowest_cost",
    "card": {
      "number": "4111 2222 3333 4444",
      "exp_month": 12,
      "exp_year": 2028
    }
  }'`,
  node: `import BetterSwitch from '@betterswitch/node';

const client = new BetterSwitch('bs_live_8F3k9s01');

const payment = await client.payments.create({
  amount: 8400,
  currency: 'usd',
  routing_rule: 'lowest_cost',
  payment_method: 'pm_card_visa'
});

console.log(\`Payment settled via: \${payment.processor}\`);`,
  python: `import betterswitch

betterswitch.api_key = "bs_live_8F3k9s01"

payment = betterswitch.Payment.create(
    amount=8400,
    currency="usd",
    routing_rule="lowest_cost",
    payment_method="pm_card_visa"
)

print(f"Settled via: {payment.processor}")`,
  go: `package main

import (
  "context"
  "fmt"
  "github.com/betterswitch/betterswitch-go"
)

func main() {
  client := betterswitch.NewClient("bs_live_8F3k9s01")
  payment, _ := client.Payments.Create(
    context.Background(),
    &betterswitch.PaymentParams{
      Amount:      8400,
      Currency:    "usd",
      RoutingRule: "lowest_cost",
    },
  )
  fmt.Printf("Settled via: %s\\n", payment.Processor)
}`
};

const sdkResponseJSON = `{
  "id": "pay_9hKf3nd1s9a",
  "object": "payment",
  "amount": 8400,
  "currency": "usd",
  "status": "succeeded",
  "routing": {
    "rule_evaluated": "lowest_cost",
    "primary_choice": "adyen",
    "actual_processor": "adyen",
    "fee_saved_usd": 0.25
  },
  "processor_response": {
    "status": "settled",
    "auth_code": "849201",
    "transaction_id": "tx_ady_8fH931a"
  },
  "created": 1781604712
}`;

const Dashboard: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const sceneEnabled = useSceneEnabled();
  
  const [isVisible, setIsVisible] = useState(false);
  const [viewMode, setViewMode] = useState<'dashboard' | 'sdk'>('dashboard');
  const [activeLang, setActiveLang] = useState<'curl' | 'node' | 'python' | 'go'>('curl');
  const [isRunning, setIsRunning] = useState(false);
  const [showTerminalOutput, setShowTerminalOutput] = useState(false);
  const [latency, setLatency] = useState(0);

  const [sectionRef, inView] = useInView({ threshold: 0.05 });

  useEffect(() => {
    if (inView && !isVisible) {
      setTimeout(() => {
        setIsVisible(true);
      }, 200);
    }
  }, [inView, isVisible]);

  const runCode = () => {
    if (isRunning) return;
    setIsRunning(true);
    setShowTerminalOutput(false);
    setLatency(0);

    let currentLatency = 0;
    const interval = setInterval(() => {
      currentLatency += Math.floor(Math.random() * 18) + 4;
      if (currentLatency >= 142) {
        currentLatency = 142;
        clearInterval(interval);
      }
      setLatency(currentLatency);
    }, 40);

    setTimeout(() => {
      clearInterval(interval);
      setLatency(142);
      setIsRunning(false);
      setShowTerminalOutput(true);
    }, 1200);
  };

  return (
    <>
      <style>{`
        .dashboard-section-content {
          opacity: 0;
          transition: opacity 0.6s ease-out, transform 0.6s ease-out;
          transform: translateY(24px);
        }
        .dashboard-section-content.visible {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
      <section ref={sectionRef} className="py-section px-6 md:px-12 lg:px-20 border-t border-gray-250/30 dark:border-white/5 bg-white dark:bg-[#0B0B0B] transition-colors duration-300">
        <div className={`max-w-7xl mx-auto dashboard-section-content ${isVisible ? 'visible' : ''}`}>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-24 items-center">

            {/* Text Column */}
            <div className="md:col-span-4 space-y-8 mb-12 md:mb-0">
              <div className="space-y-4">
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tighter text-gray-950 dark:text-white leading-tight">
                  Beyond the checkout.
                </h2>
              </div>

              <div className="space-y-4 text-sm md:text-base font-semibold text-gray-600 dark:text-gray-300 leading-relaxed">
                <p>
                  Custom dashboards built for greater observability, advanced features, and versatile product offerings.
                </p>
                <p>
                  From storefronts to payment links - we build the products you need for your business.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3.5 pt-2">
                <div className="p-4 rounded-xl bg-canvas dark:bg-[#121212] border border-gray-200 dark:border-white/5 flex items-center gap-3.5 transition-all hover:bg-white dark:hover:bg-[#181818] hover:shadow-md">
                  <div className="p-2 bg-white dark:bg-[#1E1E1E] rounded-lg border border-gray-200 dark:border-white/10 text-obsidian dark:text-white shadow-sm">
                    <Store size={18} />
                  </div>
                  <div className="text-sm font-bold text-gray-950 dark:text-white">Storefront & Payment Links</div>
                </div>
                <div className="p-4 rounded-xl bg-canvas dark:bg-[#121212] border border-gray-200 dark:border-white/5 flex items-center gap-3.5 transition-all hover:bg-white dark:hover:bg-[#181818] hover:shadow-md">
                  <div className="p-2 bg-white dark:bg-[#1E1E1E] rounded-lg border border-gray-200 dark:border-white/10 text-obsidian dark:text-white shadow-sm">
                    <Wallet size={18} />
                  </div>
                  <div className="text-sm font-bold text-gray-950 dark:text-white">Wallets & Subscriptions</div>
                </div>
              </div>
            </div>

            {/* Dashboard / SDK Container */}
            <div className="md:col-span-8 relative min-h-[460px] md:min-h-[520px] w-full rounded-2xl overflow-hidden group border border-gray-200 dark:border-white/10 shadow-2xl bg-[#F8FAFC] dark:bg-[#121212] flex flex-col transition-colors">
              {/* View Mode Switcher Header */}
              <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center px-5 py-4 border-b border-gray-200/50 dark:border-white/5 bg-white dark:bg-[#181818] gap-3 shrink-0">
                <div className="flex gap-1.5 p-0.5 bg-gray-100 dark:bg-white/5 rounded-lg self-start">
                  <button
                    onClick={() => setViewMode('dashboard')}
                    className={`px-3.5 py-1.5 rounded-md text-xs font-bold transition-all ${viewMode === 'dashboard' ? 'bg-white dark:bg-[#1E1E1E] text-obsidian dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
                  >
                    Dashboard Observation
                  </button>
                  <button
                    onClick={() => setViewMode('sdk')}
                    className={`px-3.5 py-1.5 rounded-md text-xs font-bold transition-all ${viewMode === 'sdk' ? 'bg-white dark:bg-[#1E1E1E] text-obsidian dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
                  >
                    Developer API Playground
                  </button>
                </div>
                {viewMode === 'sdk' && (
                  <div className="flex gap-1 overflow-x-auto self-start sm:self-auto py-0.5">
                    {      (['curl', 'node', 'python', 'go'] as const).map((lang) => (
                      <button
                        key={lang}
                        onClick={() => { setActiveLang(lang); setShowTerminalOutput(false); }}
                        className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase transition-all ${activeLang === lang ? 'bg-accent/15 text-accent border border-accent/25' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
                      >
                        {lang === 'node' ? 'node.js' : lang}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex-1 relative overflow-hidden flex flex-col bg-white dark:bg-[#121212] min-h-[380px] lg:min-h-[460px]">
                {viewMode === 'dashboard' ? (
                  sceneEnabled && inView ? (
                    <ErrorBoundary fallback={
                      <div className="flex-1 flex items-center justify-center bg-white dark:bg-[#121212]">
                        <div className="w-8 h-8 border border-accent/30 border-t-accent rounded-full animate-spin" />
                      </div>
                    }>
                      <React.Suspense fallback={
                        <div className="flex-1 flex items-center justify-center bg-white dark:bg-[#121212]">
                          <div className="w-8 h-8 border border-accent/30 border-t-accent rounded-full animate-spin" />
                        </div>
                      }>
                        <DashboardScene />
                      </React.Suspense>
                    </ErrorBoundary>
                  ) : (
                    <svg
                    viewBox="0 0 1440 1024"
                    preserveAspectRatio="xMidYMin slice"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-full object-cover"
                  >
                    {/* Background Grid */}
                    <defs>
                      <pattern id="dashGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke={isDark ? '#1C1C1F' : '#E2E8F0'} strokeWidth="0.5"/>
                      </pattern>
                      <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#e27533" stopOpacity={isDark ? '0.15' : '0.1'}/>
                        <stop offset="100%" stopColor={isDark ? '#121212' : '#FFFFFF'} stopOpacity="0"/>
                      </linearGradient>
                    </defs>
                    <rect width="1440" height="1024" fill="url(#dashGrid)"/>

                    {/* Sidebar */}
                    <rect width="280" height="1024" fill={isDark ? '#151518' : 'white'}/>
                    <rect width="1" height="1024" x="279" fill={isDark ? '#252528' : '#E2E8F0'}/>

                    {/* Sidebar Wordmark */}
                    <g transform="translate(24, 30)">
                      <circle cx="20" cy="20" r="16" fill="url(#chartGradient)" stroke="#e27533" strokeWidth="2" />
                      <circle cx="20" cy="20" r="4" fill="#e27533" />
                      <text x="46" y="26" fontFamily="Outfit, sans-serif" fontWeight="700" fontSize="21" letterSpacing="-0.02em" fill={isDark ? '#FFFFFF' : '#111111'}>better</text>
                      <text x="105" y="26" fontFamily="Outfit, sans-serif" fontWeight="700" fontSize="21" letterSpacing="-0.02em" fill="#e27533">switch</text>
                    </g>

                    {/* Nav Items */}
                    <rect x="16" y="112" width="248" height="48" rx="8" fill={isDark ? 'rgba(226,117,51,0.08)' : '#FFF7ED'}/>
                    <rect x="16" y="112" width="4" height="48" rx="2" fill="#e27533"/>
                    {/* Dashboard */}
                    <g transform="translate(32, 126)">
                      <path d="M4 4h7v7H4V4zM13 4h7v7h-7V4zM4 13h7v7H4v-7zM13 13h7v7h-7v-7z" fill="#e27533" transform="scale(0.8)"/>
                      <text x="36" y="14" fontFamily="'Figtree', sans-serif" fontWeight="700" fontSize="14" fill="#e27533">Dashboard</text>
                    </g>
                    {/* Transactions */}
                    <g transform="translate(32, 182)">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 2l5 5h-5V4zM6 20V4h5v7h7v9H6z" fill="#64748B" transform="scale(0.8)"/>
                      <text x="36" y="14" fontFamily="'Figtree', sans-serif" fontWeight="600" fontSize="14" fill="#64748B">Transactions</text>
                    </g>
                    {/* Payment Links */}
                    <g transform="translate(32, 238)">
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" transform="scale(0.8)"/>
                      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" transform="scale(0.8)"/>
                      <text x="36" y="14" fontFamily="'Figtree', sans-serif" fontWeight="600" fontSize="14" fill="#64748B">Payment Links</text>
                    </g>
                    {/* Storefront */}
                    <g transform="translate(32, 294)">
                      <rect x="0" y="-2" width="16" height="16" rx="2" stroke="#64748B" strokeWidth="1.5" fill="none" transform="scale(0.8)"/>
                      <rect x="2" y="6" width="12" height="6" stroke="#64748B" strokeWidth="1.5" fill="none" transform="scale(0.8)"/>
                      <line x1="8" y1="6" x2="8" y2="12" stroke="#64748B" strokeWidth="1.5" transform="scale(0.8)"/>
                      <text x="36" y="14" fontFamily="'Figtree', sans-serif" fontWeight="600" fontSize="14" fill="#64748B">Storefront</text>
                    </g>
                    {/* Wallet */}
                    <g transform="translate(32, 350)">
                      <rect x="2" y="4" width="18" height="14" rx="2" stroke="#64748B" strokeWidth="2" fill="none" transform="scale(0.8) translate(2,2)"/>
                      <path d="M18 8v4" stroke="#64748B" strokeWidth="2" strokeLinecap="round" transform="scale(0.8) translate(2,2)"/>
                      <circle cx="16" cy="10" r="1" fill="#64748B" transform="scale(0.8) translate(2,2)"/>
                      <text x="36" y="14" fontFamily="'Figtree', sans-serif" fontWeight="600" fontSize="14" fill="#64748B">Wallet</text>
                    </g>
                    {/* Subscriptions */}
                    <g transform="translate(32, 406)">
                      <path d="M17 1l4 4-4 4" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" transform="scale(0.8) translate(2,2)"/>
                      <path d="M3 11V9a4 4 0 0 1 4-4h14" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" transform="scale(0.8) translate(2,2)"/>
                      <path d="M7 23l-4-4 4-4" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" transform="scale(0.8) translate(2,2)"/>
                      <path d="M21 13v2a4 4 0 0 1-4 4H3" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" transform="scale(0.8) translate(2,2)"/>
                      <text x="36" y="14" fontFamily="'Figtree', sans-serif" fontWeight="600" fontSize="14" fill="#64748B">Subscriptions</text>
                    </g>

                    {/* Main Content Area Header */}
                    <rect x="280" width="1160" height="88" fill={isDark ? '#151518' : 'white'}/>
                    <rect x="280" y="87" width="1160" height="1" fill={isDark ? '#252528' : '#E2E8F0'}/>

                    {/* Search Bar */}
                    <rect x="320" y="24" width="400" height="40" rx="8" fill={isDark ? '#1A1A1E' : '#F8FAFC'} stroke={isDark ? '#2D2D2D' : '#E2E8F0'}/>
                    <circle cx="340" cy="44" r="6" stroke="#94A3B8" strokeWidth="2" fill="none"/>
                    <line x1="345" y1="49" x2="350" y2="54" stroke="#94A3B8" strokeWidth="2"/>
                    <text x="365" y="49" fontFamily="'Figtree', sans-serif" fontSize="14" fill="#94A3B8">Search transactions...</text>

                    {/* Profile */}
                    <g transform="translate(1330, 44)">
                      <circle r="20" fill={isDark ? '#1A1A1E' : '#E2E8F0'}/>
                      <text x="0" y="5" textAnchor="middle" fontFamily="'Figtree', sans-serif" fontWeight="700" fontSize="14" fill={isDark ? '#FFFFFF' : '#64748B'}>JD</text>
                    </g>
                    <text x="1300" y="40" textAnchor="end" fontFamily="'Figtree', sans-serif" fontWeight="700" fontSize="14" fill={isDark ? '#FFFFFF' : '#0F172A'}>John Doe</text>
                    <text x="1300" y="56" textAnchor="end" fontFamily="'Figtree', sans-serif" fontWeight="500" fontSize="12" fill="#94A3B8">Admin</text>

                    {/* Dashboard Content */}
                    <text x="320" y="160" fontFamily="'Figtree', sans-serif" fontWeight="800" fontSize="32" fill={isDark ? '#FFFFFF' : '#0F172A'}>Greetings, John</text>
                    <text x="320" y="185" fontFamily="'Figtree', sans-serif" fontWeight="500" fontSize="16" fill="#64748B">Monitoring your payment performance in real-time.</text>

                    {/* Time Toggle */}
                    <rect x="1110" y="145" width="250" height="40" rx="8" fill={isDark ? '#1A1A1E' : 'white'} stroke={isDark ? '#2D2D2D' : '#E2E8F0'}/>
                    <rect x="1114" y="149" width="80" height="32" rx="6" fill={isDark ? '#FFFFFF' : '#0F172A'}/>
                    <text x="1154" y="170" textAnchor="middle" fontFamily="'Figtree', sans-serif" fontWeight="700" fontSize="12" fill={isDark ? '#111111' : 'white'}>Today</text>
                    <text x="1235" y="170" textAnchor="middle" fontFamily="'Figtree', sans-serif" fontWeight="600" fontSize="12" fill="#64748B">7 Days</text>
                    <text x="1316" y="170" textAnchor="middle" fontFamily="'Figtree', sans-serif" fontWeight="600" fontSize="12" fill="#64748B">30 Days</text>

                    {/* Card 1: Revenue */}
                    <g transform="translate(320, 230)">
                      <rect width="255" height="240" rx="16" fill={isDark ? '#151518' : 'white'} stroke={isDark ? '#252528' : '#E2E8F0'}/>
                      <rect x="24" y="24" width="48" height="48" rx="12" fill={isDark ? 'rgba(226,117,51,0.1)' : '#FFF7ED'}/>
                      <circle cx="48" cy="48" r="10" stroke="#e27533" strokeWidth="2" fill="none"/>
                      <text x="48" y="52" textAnchor="middle" fontFamily="'Figtree', sans-serif" fontSize="12" fill="#e27533">$</text>

                      <rect x="175" y="24" width="65" height="24" rx="12" fill="#DCFCE7"/>
                      <text x="207" y="40" textAnchor="middle" fontFamily="'Figtree', sans-serif" fontWeight="700" fontSize="12" fill="#166534">+12.4%</text>

                      <text x="24" y="96" fontFamily="'Figtree', sans-serif" fontWeight="700" fontSize="10" fill="#94A3B8" letterSpacing="0.1em">TOTAL REVENUE</text>
                      <text x="24" y="128" fontFamily="'Figtree', sans-serif" fontWeight="800" fontSize="28" fill={isDark ? '#FFFFFF' : '#0F172A'}>$124,500.00</text>

                      <rect x="24" y={isVisible ? 190 : 216} width="24" height={isVisible ? 26 : 0} rx="4" fill={isDark ? '#e27533' : '#FFEDD5'} opacity={isDark ? 0.3 : 1} style={{ transition: 'all 0.8s cubic-bezier(0.25, 1, 0.5, 1) 0.1s' }}/>
                      <rect x="56" y={isVisible ? 180 : 216} width="24" height={isVisible ? 36 : 0} rx="4" fill={isDark ? '#e27533' : '#FFEDD5'} opacity={isDark ? 0.3 : 1} style={{ transition: 'all 0.8s cubic-bezier(0.25, 1, 0.5, 1) 0.2s' }}/>
                      <rect x="88" y={isVisible ? 195 : 216} width="24" height={isVisible ? 21 : 0} rx="4" fill={isDark ? '#e27533' : '#FDBA74'} opacity={isDark ? 0.6 : 1} style={{ transition: 'all 0.8s cubic-bezier(0.25, 1, 0.5, 1) 0.3s' }}/>
                      <rect x="120" y={isVisible ? 160 : 216} width="24" height={isVisible ? 56 : 0} rx="4" fill={isDark ? '#e27533' : '#FDBA74'} opacity={isDark ? 0.6 : 1} style={{ transition: 'all 0.8s cubic-bezier(0.25, 1, 0.5, 1) 0.4s' }}/>
                      <rect x="152" y={isVisible ? 185 : 216} width="24" height={isVisible ? 31 : 0} rx="4" fill={isDark ? '#e27533' : '#FDBA74'} opacity={isDark ? 0.8 : 1} style={{ transition: 'all 0.8s cubic-bezier(0.25, 1, 0.5, 1) 0.5s' }}/>
                      <rect x="184" y={isVisible ? 150 : 216} width="24" height={isVisible ? 66 : 0} rx="4" fill="#e27533" style={{ transition: 'all 0.8s cubic-bezier(0.25, 1, 0.5, 1) 0.6s' }}/>
                    </g>

                    {/* Card 2: Success Rate */}
                    <g transform="translate(605, 230)">
                      <rect width="255" height="240" rx="16" fill={isDark ? '#151518' : 'white'} stroke={isDark ? '#252528' : '#E2E8F0'}/>
                      <rect x="24" y="24" width="48" height="48" rx="12" fill={isDark ? 'rgba(20,184,166,0.1)' : '#CCFBF1'}/>
                      <path d="M40 48 L46 54 L56 42" stroke="#14B8A6" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>

                      <rect x="180" y="24" width="60" height="24" rx="12" fill="#DCFCE7"/>
                      <text x="210" y="40" textAnchor="middle" fontFamily="'Figtree', sans-serif" fontWeight="700" fontSize="12" fill="#166534">+5.2%</text>

                      <text x="24" y="96" fontFamily="'Figtree', sans-serif" fontWeight="700" fontSize="10" fill="#94A3B8" letterSpacing="0.1em">SUCCESS RATE</text>
                      <text x="24" y="128" fontFamily="'Figtree', sans-serif" fontWeight="800" fontSize="28" fill={isDark ? '#FFFFFF' : '#0F172A'}>99.8%</text>

                      <rect x="24" y={isVisible ? 180 : 216} width="24" height={isVisible ? 36 : 0} rx="4" fill="#14B8A6" opacity="0.3" style={{ transition: 'all 0.8s cubic-bezier(0.25, 1, 0.5, 1) 0.1s' }}/>
                      <rect x="56" y={isVisible ? 185 : 216} width="24" height={isVisible ? 31 : 0} rx="4" fill="#14B8A6" opacity="0.3" style={{ transition: 'all 0.8s cubic-bezier(0.25, 1, 0.5, 1) 0.2s' }}/>
                      <rect x="88" y={isVisible ? 160 : 216} width="24" height={isVisible ? 56 : 0} rx="4" fill="#14B8A6" opacity="0.6" style={{ transition: 'all 0.8s cubic-bezier(0.25, 1, 0.5, 1) 0.3s' }}/>
                      <rect x="120" y={isVisible ? 185 : 216} width="24" height={isVisible ? 31 : 0} rx="4" fill="#14B8A6" opacity="0.6" style={{ transition: 'all 0.8s cubic-bezier(0.25, 1, 0.5, 1) 0.4s' }}/>
                      <rect x="152" y={isVisible ? 150 : 216} width="24" height={isVisible ? 66 : 0} rx="4" fill="#14B8A6" opacity="0.8" style={{ transition: 'all 0.8s cubic-bezier(0.25, 1, 0.5, 1) 0.5s' }}/>
                      <rect x="184" y={isVisible ? 160 : 216} width="24" height={isVisible ? 56 : 0} rx="4" fill="#14B8A6" style={{ transition: 'all 0.8s cubic-bezier(0.25, 1, 0.5, 1) 0.6s' }}/>
                    </g>

                    {/* Card 3: Refund Rate */}
                    <g transform="translate(890, 230)">
                      <rect width="255" height="240" rx="16" fill={isDark ? '#151518' : 'white'} stroke={isDark ? '#252528' : '#E2E8F0'}/>
                      <rect x="24" y="24" width="48" height="48" rx="12" fill={isDark ? 'rgba(255,255,255,0.05)' : '#F1F5F9'}/>
                      <path d="M48 42 A 8 8 0 1 0 48 58" stroke={isDark ? '#FFF' : '#64748B'} strokeWidth="2" fill="none"/>
                      <path d="M48 42 L44 46" stroke={isDark ? '#FFF' : '#64748B'} strokeWidth="2" fill="none"/>

                      <rect x="190" y="24" width="50" height="24" rx="12" fill={isDark ? 'rgba(255,255,255,0.05)' : '#F1F5F9'}/>
                      <text x="215" y="40" textAnchor="middle" fontFamily="'Figtree', sans-serif" fontWeight="700" fontSize="12" fill={isDark ? '#CCC' : '#64748B'}>Stable</text>

                      <text x="24" y="96" fontFamily="'Figtree', sans-serif" fontWeight="700" fontSize="10" fill="#94A3B8" letterSpacing="0.1em">REFUND RATE</text>
                      <text x="24" y="128" fontFamily="'Figtree', sans-serif" fontWeight="800" fontSize="28" fill={isDark ? '#FFFFFF' : '#0F172A'}>0.45%</text>

                      <rect x="24" y={isVisible ? 200 : 216} width="24" height={isVisible ? 16 : 0} rx="4" fill={isDark ? '#444' : '#E2E8F0'} style={{ transition: 'all 0.8s cubic-bezier(0.25, 1, 0.5, 1) 0.1s' }}/>
                      <rect x="56" y={isVisible ? 205 : 216} width="24" height={isVisible ? 11 : 0} rx="4" fill={isDark ? '#444' : '#E2E8F0'} style={{ transition: 'all 0.8s cubic-bezier(0.25, 1, 0.5, 1) 0.2s' }}/>
                      <rect x="88" y={isVisible ? 202 : 216} width="24" height={isVisible ? 14 : 0} rx="4" fill={isDark ? '#555' : '#CBD5E1'} style={{ transition: 'all 0.8s cubic-bezier(0.25, 1, 0.5, 1) 0.3s' }}/>
                      <rect x="120" y={isVisible ? 198 : 216} width="24" height={isVisible ? 18 : 0} rx="4" fill={isDark ? '#666' : '#94A3B8'} style={{ transition: 'all 0.8s cubic-bezier(0.25, 1, 0.5, 1) 0.4s' }}/>
                      <rect x="152" y={isVisible ? 205 : 216} width="24" height={isVisible ? 11 : 0} rx="4" fill={isDark ? '#444' : '#E2E8F0'} style={{ transition: 'all 0.8s cubic-bezier(0.25, 1, 0.5, 1) 0.5s' }}/>
                      <rect x="184" y={isVisible ? 200 : 216} width="24" height={isVisible ? 16 : 0} rx="4" fill={isDark ? '#555' : '#CBD5E1'} style={{ transition: 'all 0.8s cubic-bezier(0.25, 1, 0.5, 1) 0.6s' }}/>
                    </g>

                    {/* Card 4: Avg Ticket */}
                    <g transform="translate(1175, 230)">
                      <rect width="230" height="240" rx="16" fill={isDark ? '#151518' : 'white'} stroke={isDark ? '#252528' : '#E2E8F0'}/>
                      <rect x="24" y="24" width="48" height="48" rx="12" fill={isDark ? 'rgba(226,117,51,0.1)' : '#FFF7ED'}/>
                      <path d="M40 46h16l-3 9H43z" stroke="#e27533" strokeWidth="2" fill="none"/>
                      <path d="M40 46l3-6h10l3 6" stroke="#e27533" strokeWidth="2" fill="none"/>

                      <rect x="160" y="24" width="60" height="24" rx="12" fill="#FEE2E2"/>
                      <text x="190" y="40" textAnchor="middle" fontFamily="'Figtree', sans-serif" fontWeight="700" fontSize="12" fill="#EF4444">-2.1%</text>

                      <text x="24" y="96" fontFamily="'Figtree', sans-serif" fontWeight="700" fontSize="10" fill="#94A3B8" letterSpacing="0.1em">AVG TICKET</text>
                      <text x="24" y="128" fontFamily="'Figtree', sans-serif" fontWeight="800" fontSize="28" fill={isDark ? '#FFFFFF' : '#0F172A'}>$45.20</text>

                      <rect x="24" y={isVisible ? 170 : 216} width="24" height={isVisible ? 46 : 0} rx="4" fill={isDark ? '#e27533' : '#FFEDD5'} opacity={isDark ? 0.3 : 1} style={{ transition: 'all 0.8s cubic-bezier(0.25, 1, 0.5, 1) 0.1s' }}/>
                      <rect x="56" y={isVisible ? 175 : 216} width="24" height={isVisible ? 41 : 0} rx="4" fill={isDark ? '#e27533' : '#FFEDD5'} opacity={isDark ? 0.3 : 1} style={{ transition: 'all 0.8s cubic-bezier(0.25, 1, 0.5, 1) 0.2s' }}/>
                      <rect x="88" y={isVisible ? 180 : 216} width="24" height={isVisible ? 36 : 0} rx="4" fill={isDark ? '#e27533' : '#FDBA74'} opacity={isDark ? 0.6 : 1} style={{ transition: 'all 0.8s cubic-bezier(0.25, 1, 0.5, 1) 0.3s' }}/>
                      <rect x="120" y={isVisible ? 185 : 216} width="24" height={isVisible ? 31 : 0} rx="4" fill={isDark ? '#e27533' : '#FDBA74'} opacity={isDark ? 0.6 : 1} style={{ transition: 'all 0.8s cubic-bezier(0.25, 1, 0.5, 1) 0.4s' }}/>
                      <rect x="152" y={isVisible ? 190 : 216} width="24" height={isVisible ? 26 : 0} rx="4" fill={isDark ? '#e27533' : '#FB923C'} opacity={isDark ? 0.8 : 1} style={{ transition: 'all 0.8s cubic-bezier(0.25, 1, 0.5, 1) 0.5s' }}/>
                      <rect x="184" y={isVisible ? 195 : 216} width="24" height={isVisible ? 21 : 0} rx="4" fill={isDark ? '#e27533' : '#FB923C'} opacity={isDark ? 0.8 : 1} style={{ transition: 'all 0.8s cubic-bezier(0.25, 1, 0.5, 1) 0.6s' }}/>
                    </g>

                    {/* Volume Analysis */}
                    <g transform="translate(320, 500)">
                      <rect width="730" height="480" rx="16" fill={isDark ? '#151518' : 'white'} stroke={isDark ? '#252528' : '#E2E8F0'}/>
                      <text x="32" y="48" fontFamily="'Figtree', sans-serif" fontWeight="700" fontSize="18" fill={isDark ? '#FFFFFF' : '#0F172A'}>Volume Analysis</text>
                      <text x="32" y="70" fontFamily="'Figtree', sans-serif" fontWeight="500" fontSize="14" fill="#64748B">Comparing current week performance</text>

                      <rect x="610" y="32" width="90" height="32" rx="6" fill={isDark ? '#1C1C20' : '#F8FAFC'}/>
                      <rect x="612" y="34" width="44" height="28" rx="4" fill={isDark ? '#151518' : 'white'} stroke={isDark ? '#2D2D32' : '#E2E8F0'} strokeWidth="0.5"/>
                      <text x="634" y="52" textAnchor="middle" fontFamily="'Figtree', sans-serif" fontWeight="700" fontSize="10" fill={isDark ? '#FFFFFF' : '#0F172A'}>Line</text>
                      <text x="678" y="52" textAnchor="middle" fontFamily="'Figtree', sans-serif" fontWeight="600" fontSize="10" fill="#64748B">Bar</text>

                      <text x="32" y="128" fontFamily="'Figtree', sans-serif" fontWeight="700" fontSize="10" fill="#94A3B8" letterSpacing="0.1em">CURRENT PERIOD</text>
                      <text x="32" y="156" fontFamily="'Figtree', sans-serif" fontWeight="800" fontSize="24" fill={isDark ? '#FFFFFF' : '#0F172A'}>$84,320.00</text>
                      <text x="240" y="128" fontFamily="'Figtree', sans-serif" fontWeight="700" fontSize="10" fill="#94A3B8" letterSpacing="0.1em">PREVIOUS PERIOD</text>
                      <text x="240" y="156" fontFamily="'Figtree', sans-serif" fontWeight="800" fontSize="24" fill="#CBD5E1">$72,110.00</text>

                      <line x1="32" y1="380" x2="698" y2="380" stroke={isDark ? '#2D2D32' : '#F1F5F9'}/>
                      <line x1="32" y1="320" x2="698" y2="320" stroke={isDark ? '#2D2D32' : '#F1F5F9'}/>
                      <line x1="32" y1="260" x2="698" y2="260" stroke={isDark ? '#2D2D32' : '#F1F5F9'}/>

                      <path
                        d="M32 420 C100 410 150 350 200 360 C250 370 300 220 400 270 C500 320 600 250 700 260"
                        stroke="#e27533"
                        strokeWidth="4"
                        fill="none"
                        strokeLinecap="round"
                        style={{
                          strokeDasharray: 800,
                          strokeDashoffset: isVisible ? 0 : 800,
                          transition: 'stroke-dashoffset 2s cubic-bezier(0.25, 0.1, 0.25, 1) 0.2s'
                        }}
                      />
                      <path
                        d="M32 420 C100 410 150 350 200 360 C250 370 300 220 400 270 C500 320 600 250 700 260 L 700 480 L 32 480 Z"
                        fill="url(#chartGradient)"
                        style={{
                          opacity: isVisible ? 1 : 0,
                          transition: 'opacity 1.5s ease-out 1.5s'
                        }}
                      />
                      <circle
                        cx="400"
                        cy="270"
                        r="6"
                        fill="#e27533"
                        stroke="white"
                        strokeWidth="3"
                        style={{
                          transform: isVisible ? 'scale(1)' : 'scale(0)',
                          transformOrigin: '400px 270px',
                          transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 1.8s'
                        }}
                      />
                    </g>

                    {/* Method Split */}
                    <g transform="translate(1080, 500)">
                      <rect width="325" height="480" rx="16" fill={isDark ? '#151518' : 'white'} stroke={isDark ? '#252528' : '#E2E8F0'}/>
                      <text x="32" y="48" fontFamily="'Figtree', sans-serif" fontWeight="700" fontSize="18" fill={isDark ? '#FFFFFF' : '#0F172A'}>Method Split</text>
                      <text x="32" y="70" fontFamily="'Figtree', sans-serif" fontWeight="500" fontSize="14" fill="#64748B">Distribution by volume</text>

                      <g transform="translate(162, 220)">
                        <circle cx="0" cy="0" r="80" fill="none" stroke={isDark ? '#1F1F24' : '#F1F5F9'} strokeWidth="20"/>
                        <circle
                          cx="0"
                          cy="0"
                          r="80"
                          fill="none"
                          stroke="#e27533"
                          strokeWidth="20"
                          strokeDasharray="326 502"
                          strokeDashoffset={isVisible ? 0 : 326}
                          transform="rotate(-90)"
                          style={{
                            transition: 'stroke-dashoffset 1.8s cubic-bezier(0.25, 0.1, 0.25, 1) 0.4s',
                            willChange: 'stroke-dashoffset'
                          }}
                        />
                        <circle
                          cx="0"
                          cy="0"
                          r="80"
                          fill="none"
                          stroke="#14B8A6"
                          strokeWidth="20"
                          strokeDasharray="125 502"
                          strokeDashoffset={isVisible ? 0 : 125}
                          transform="rotate(144)"
                          style={{
                            transition: 'stroke-dashoffset 1.8s cubic-bezier(0.25, 0.1, 0.25, 1) 0.6s',
                            willChange: 'stroke-dashoffset'
                          }}
                        />
                        <text x="0" y="5" textAnchor="middle" fontFamily="'Figtree', sans-serif" fontWeight="800" fontSize="28" fill={isDark ? '#FFFFFF' : '#0F172A'}>$10.2M</text>
                        <text x="0" y="25" textAnchor="middle" fontFamily="'Figtree', sans-serif" fontWeight="700" fontSize="10" fill="#94A3B8" letterSpacing="0.1em">GROSS SALES</text>
                      </g>

                      <g transform="translate(32, 360)">
                        <circle cx="6" cy="6" r="4" fill="#e27533"/>
                        <text x="24" y="10" fontFamily="'Figtree', sans-serif" fontWeight="600" fontSize="14" fill={isDark ? '#DDD' : '#0F172A'}>Cards</text>
                        <text x="280" y="10" textAnchor="end" fontFamily="'Figtree', sans-serif" fontWeight="800" fontSize="14" fill={isDark ? '#FFFFFF' : '#0F172A'}>65%</text>
                      </g>
                      <g transform="translate(32, 395)">
                        <circle cx="6" cy="6" r="4" fill="#14B8A6"/>
                        <text x="24" y="10" fontFamily="'Figtree', sans-serif" fontWeight="600" fontSize="14" fill={isDark ? '#DDD' : '#0F172A'}>Wallets</text>
                        <text x="280" y="10" textAnchor="end" fontFamily="'Figtree', sans-serif" fontWeight="800" fontSize="14" fill={isDark ? '#FFFFFF' : '#0F172A'}>25%</text>
                      </g>
                      <g transform="translate(32, 430)">
                        <circle cx="6" cy="6" r="4" fill={isDark ? '#2D2D32' : '#E2E8F0'}/>
                        <text x="24" y="10" fontFamily="'Figtree', sans-serif" fontWeight="600" fontSize="14" fill={isDark ? '#DDD' : '#0F172A'}>Transfers</text>
                        <text x="280" y="10" textAnchor="end" fontFamily="'Figtree', sans-serif" fontWeight="800" fontSize="14" fill={isDark ? '#FFFFFF' : '#0F172A'}>10%</text>
                      </g>
                    </g>
                  </svg>
                  )
                ) : (
                  <div className="flex-1 bg-[#111112] text-white font-mono p-5 flex flex-col justify-between overflow-y-auto min-h-[380px]">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch flex-1">
                      {/* Left: Code input editor */}
                      <div className="flex flex-col bg-[#16161A] border border-white/5 rounded-xl overflow-hidden min-h-[220px]">
                        <div className="px-4 py-2 bg-[#1C1C20] border-b border-white/5 flex items-center justify-between text-[10px] text-gray-500 font-bold tracking-wider select-none">
                          <span>SDK CLIENT CALL</span>
                          <span className="text-[9px] text-accent font-semibold">{activeLang === 'curl' ? 'HTTP Request' : `${activeLang} SDK`}</span>
                        </div>
                        <pre className="p-4 text-[11.5px] text-gray-300 leading-relaxed overflow-x-auto whitespace-pre select-all font-mono flex-1">
                          {sdkCodeSnippets[activeLang]}
                        </pre>
                        <div className="px-4 py-2.5 bg-[#1C1C20] border-t border-white/5 flex justify-end">
                          <button
                            onClick={runCode}
                            disabled={isRunning}
                            className="focus-ring flex items-center gap-1.5 px-4 py-2 bg-accent hover:bg-accent-hover disabled:bg-gray-800 text-white text-[11px] font-bold rounded-lg transition-all shadow-md"
                          >
                            {isRunning ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                            {isRunning ? 'Running API call...' : 'Run API Request'}
                          </button>
                        </div>
                      </div>

                      {/* Right: Response terminal console */}
                      <div className="flex flex-col bg-[#16161A] border border-white/5 rounded-xl overflow-hidden min-h-[220px]">
                        <div className="px-4 py-2 bg-[#1C1C20] border-b border-white/5 flex items-center gap-2 text-[10px] text-gray-500 font-bold tracking-wider select-none">
                          <Terminal size={12} />
                          <span>Response Output</span>
                        </div>
                        <div className="p-4 text-[11.5px] leading-relaxed overflow-y-auto font-mono flex-1 min-h-[160px]">
                          {isRunning && (
                            <div className="text-accent animate-pulse flex items-center gap-2">
                              <RefreshCw size={11} className="animate-spin" />
                              <span>POST https://api.betterswitch.com/v1/payments...</span>
                            </div>
                          )}
                          {showTerminalOutput ? (
                            <motion.pre
                              initial={{ opacity: 0, y: 4 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3 }}
                              className="text-emerald-400 whitespace-pre select-all"
                            >
                              {sdkResponseJSON}
                            </motion.pre>
                          ) : (
                            !isRunning && <span className="text-gray-500 italic font-medium block select-none">// Click "Run API Request" to see target response payload</span>
                          )}
                        </div>
                        <div className="px-4 py-2.5 bg-[#1C1C20] border-t border-white/5 flex items-center justify-between text-[9px] font-bold text-gray-500 select-none">
                          <span>STATUS: {showTerminalOutput ? '200 OK' : 'IDLE'}</span>
                          <span>LATENCY: {showTerminalOutput ? '142ms' : `${latency}ms`}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Dashboard;
