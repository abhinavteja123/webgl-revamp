import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, RefreshCw, ArrowRight, Network, Zap, ShieldCheck } from 'lucide-react';
import { CALENDLY_URL } from '../lib/constants';
import { useTheme } from '../context/ThemeContext';
import { useSceneEnabled } from '../three/SceneManager';
import { ErrorBoundary } from './shared/ErrorBoundary';

// Flagship 3D layer — lazy so it never blocks first paint; only mounted when the scene gate is on.
const HeroScene = lazy(() => import('../three/HeroScene'));

interface SimulatorLog {
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'error';
  text: string;
}

const RoutingSimulator: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [failoverMode, setFailoverMode] = useState(false);
  const [activeRoute, setActiveRoute] = useState<'none' | 'checkout-to-router' | 'router-to-adyen' | 'adyen-fail' | 'router-to-stripe' | 'success'>('none');
  const [simStep, setSimStep] = useState(0);
  const [logs, setLogs] = useState<SimulatorLog[]>([
    { timestamp: '13:31:00', type: 'info', text: 'System initialized. Orchestrator listening on port 443.' },
    { timestamp: '13:31:00', type: 'success', text: 'Connectors synced: 200+ global gateways operational.' }
  ]);

  const addLog = (text: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    const time = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLogs(prev => [...prev, { timestamp: time, type, text }]);
  };

  const startSimulation = () => {
    if (isProcessing) return;
    setIsProcessing(true);
    setSimStep(1);
    setActiveRoute('checkout-to-router');
    setLogs([]);
    addLog('Transaction initiated: Checkout payload received ($84.00 USD).', 'info');

    // Step 1: Checkout to Router
    setTimeout(() => {
      setSimStep(2);
      addLog('Evaluating smart routing rule: [Lowest Cost Route].', 'info');
      addLog('Candidates: Adyen (1.2%), Mollie (1.4%), Stripe (1.5%).', 'info');
    }, 1000);

    // Step 2: Route to Processor
    setTimeout(() => {
      setSimStep(3);
      addLog('Adyen selected (lowest cost: 1.2% fee). Dispatching transaction...', 'info');
      setActiveRoute('router-to-adyen');
    }, 2200);

    // Step 3: Response or Failover
    setTimeout(() => {
      if (failoverMode) {
        setSimStep(4);
        setActiveRoute('adyen-fail');
        addLog('Adyen gateway returned 500: Internal Server Error.', 'error');
        addLog('FAILOVER ACTIVE: Initiating smart retry logic.', 'warning');
        addLog('Secondary candidate chosen: Stripe (1.5% fee). Routing...', 'info');
        setActiveRoute('router-to-stripe');
      } else {
        setSimStep(5);
        setActiveRoute('success');
        addLog('Adyen response: 200 OK. Transaction settled successfully.', 'success');
        setIsProcessing(false);
      }
    }, 3600);

    // Step 4 (only if failover): Success on backup
    setTimeout(() => {
      if (failoverMode) {
        setSimStep(5);
        setActiveRoute('success');
        addLog('Stripe response: 200 OK. Failover route completed successfully.', 'success');
        setIsProcessing(false);
      }
    }, 5200);
  };

  return (
    <div className="w-full bg-[#151515] border border-white/10 rounded-2xl shadow-2xl overflow-hidden mt-6">
      {/* Simulator Toolbar */}
      <div className="flex items-center justify-between px-6 py-4 bg-[#1C1C1E] border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500/80" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
          </div>
          <span className="text-xs font-mono text-white/40 font-medium select-none">betterswitch-sandbox-v1.0.4</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <label htmlFor="failover-toggle" className="text-xs font-sans font-semibold text-white/70 select-none">Simulate Failure & Failover</label>
            <button
              id="failover-toggle"
              onClick={() => setFailoverMode(!failoverMode)}
              className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-accent/40 ${failoverMode ? 'bg-accent' : 'bg-white/10'}`}
              aria-checked={failoverMode}
              role="switch"
            >
              <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform duration-300 ${failoverMode ? 'translate-x-4' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Left Interactive panel */}
        <div className="lg:col-span-8 p-6 bg-[#151515] flex flex-col justify-between min-h-[340px] border-b lg:border-b-0 lg:border-r border-white/5">
          <div className="relative w-full flex-1 flex items-center justify-center">
            {/* SVG Visualizer */}
            <svg viewBox="0 0 540 240" className="w-full max-w-lg h-auto overflow-visible">
              <defs>
                <pattern id="sandboxGrid" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="1.2" fill="rgba(255, 255, 255, 0.07)" />
                </pattern>
                <linearGradient id="activeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#e27533" />
                  <stop offset="100%" stopColor="#F28C38" />
                </linearGradient>
                <linearGradient id="successGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10B981" />
                  <stop offset="100%" stopColor="#34D399" />
                </linearGradient>
                <linearGradient id="failGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#EF4444" />
                  <stop offset="100%" stopColor="#F87171" />
                </linearGradient>
                
                {/* Neon Glow Filters */}
                <filter id="neonGlowOrange" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="neonGlowGreen" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="neonGlowRed" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <rect width="540" height="240" fill="url(#sandboxGrid)" rx="8" />

              {/* Paths */}
              {/* Checkout to Router */}
              <path
                d="M60,120 L220,120"
                stroke={activeRoute === 'checkout-to-router' ? 'url(#activeGrad)' : '#2D2D2D'}
                strokeWidth={activeRoute === 'checkout-to-router' ? '3' : '2'}
                strokeDasharray={activeRoute === 'checkout-to-router' ? '6,6' : 'none'}
                fill="none"
                filter={activeRoute === 'checkout-to-router' ? 'url(#neonGlowOrange)' : 'none'}
                className={`transition-all duration-300 ${activeRoute === 'checkout-to-router' ? 'animate-[running-dash_0.6s_linear_infinite]' : ''}`}
              />
              
              {/* Router to Stripe */}
              <path
                d="M220,120 C290,120 290,60 400,60"
                stroke={activeRoute === 'router-to-stripe' || (activeRoute === 'success' && failoverMode) ? 'url(#successGrad)' : '#2D2D2D'}
                strokeWidth={activeRoute === 'router-to-stripe' ? '3' : '2'}
                strokeDasharray={activeRoute === 'router-to-stripe' ? '6,6' : 'none'}
                fill="none"
                filter={activeRoute === 'router-to-stripe' || (activeRoute === 'success' && failoverMode) ? 'url(#neonGlowGreen)' : 'none'}
                className={`transition-all duration-300 ${activeRoute === 'router-to-stripe' ? 'animate-[running-dash_0.6s_linear_infinite]' : ''}`}
              />

              {/* Router to Adyen */}
              <path
                d="M220,120 L400,120"
                stroke={activeRoute === 'router-to-adyen' ? 'url(#activeGrad)' : (activeRoute === 'adyen-fail' ? 'url(#failGrad)' : (activeRoute === 'success' && !failoverMode ? 'url(#successGrad)' : '#2D2D2D'))}
                strokeWidth={activeRoute === 'router-to-adyen' ? '3' : '2'}
                strokeDasharray={activeRoute === 'router-to-adyen' ? '6,6' : 'none'}
                fill="none"
                filter={activeRoute === 'router-to-adyen' ? 'url(#neonGlowOrange)' : (activeRoute === 'adyen-fail' ? 'url(#neonGlowRed)' : (activeRoute === 'success' && !failoverMode ? 'url(#neonGlowGreen)' : 'none'))}
                className={`transition-all duration-300 ${activeRoute === 'router-to-adyen' ? 'animate-[running-dash_0.6s_linear_infinite]' : ''}`}
              />

              {/* Router to Mollie */}
              <path d="M220,120 C290,120 290,180 400,180" stroke="#2D2D2D" strokeWidth="2" fill="none" />

              {/* Pulse particles */}
              {activeRoute === 'checkout-to-router' && (
                <circle cx="0" cy="0" r="5" fill="#f28c38" filter="url(#neonGlowOrange)">
                  <animateMotion dur="1s" repeatCount="indefinite" path="M60,120 L220,120" />
                </circle>
              )}

              {activeRoute === 'router-to-adyen' && (
                <circle cx="0" cy="0" r="5" fill="#f28c38" filter="url(#neonGlowOrange)">
                  <animateMotion dur="1.2s" repeatCount="indefinite" path="M220,120 L400,120" />
                </circle>
              )}

              {activeRoute === 'router-to-stripe' && (
                <circle cx="0" cy="0" r="5" fill="#10B981" filter="url(#neonGlowGreen)">
                  <animateMotion dur="1.2s" repeatCount="indefinite" path="M220,120 C290,120 290,60 400,60" />
                </circle>
              )}

              {/* Nodes */}
              {/* Checkout Node */}
              <g transform="translate(60, 120)">
                <circle r="22" fill="#1A1A1E" stroke="#333" strokeWidth="2" />
                <circle r="4" fill="#FFFFFF" />
                <text x="0" y="34" textAnchor="middle" fontFamily="Figtree" fontSize="9" fontWeight="600" fill="#999">Checkout</text>
              </g>

              {/* Router Node */}
              <g transform="translate(220, 120)">
                <circle r="26" fill="#1A1A1E" stroke={isProcessing ? 'url(#activeGrad)' : '#333'} strokeWidth="2.5" className="transition-colors duration-300" />
                <svg x="-12" y="-12" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={isProcessing ? '#e27533' : '#FFF'} strokeWidth="2.5" className={isProcessing ? 'animate-spin-slow' : ''}>
                  <polyline points="16 3 21 3 21 8" />
                  <line x1="4" y1="20" x2="21" y2="3" />
                  <polyline points="21 16 21 21 16 21" />
                  <line x1="15" y1="15" x2="21" y2="21" />
                </svg>
                <text x="0" y="38" textAnchor="middle" fontFamily="Figtree" fontSize="9" fontWeight="700" fill="#FFF">BetterSwitch</text>
              </g>

              {/* Stripe Node */}
              <g transform="translate(400, 60)">
                {activeRoute === 'router-to-stripe' && (
                  <circle r="24" fill="none" stroke="#e27533" strokeWidth="2" className="animate-ping opacity-25" />
                )}
                {activeRoute === 'success' && failoverMode && (
                  <circle r="24" fill="none" stroke="#10B981" strokeWidth="2" className="animate-ping opacity-25" />
                )}
                <circle r="20" fill="#1A1A1E" stroke={activeRoute === 'success' && failoverMode ? '#10B981' : (activeRoute === 'router-to-stripe' ? '#e27533' : '#333')} strokeWidth="2" className="transition-all duration-300" />
                <text x="0" y="4" textAnchor="middle" fontFamily="Outfit" fontSize="8" fontWeight="700" fill="#635BFF">Stripe</text>
                <text x="0" y="28" textAnchor="middle" fontFamily="Figtree" fontSize="8" fontWeight="600" fill="#666">1.5% Fee</text>
                {activeRoute === 'success' && failoverMode && (
                  <circle cx="14" cy="-14" r="5" fill="#10B981" />
                )}
              </g>

              {/* Adyen Node */}
              <g transform="translate(400, 120)">
                {activeRoute === 'router-to-adyen' && (
                  <circle r="24" fill="none" stroke="#e27533" strokeWidth="2" className="animate-ping opacity-25" />
                )}
                {activeRoute === 'success' && !failoverMode && (
                  <circle r="24" fill="none" stroke="#10B981" strokeWidth="2" className="animate-ping opacity-25" />
                )}
                {activeRoute === 'adyen-fail' && (
                  <circle r="24" fill="none" stroke="#EF4444" strokeWidth="2" className="animate-ping opacity-25" />
                )}
                <circle r="20" fill="#1A1A1E" stroke={activeRoute === 'adyen-fail' ? '#EF4444' : (activeRoute === 'success' && !failoverMode ? '#10B981' : (activeRoute === 'router-to-adyen' ? '#e27533' : '#333'))} strokeWidth="2" className="transition-all duration-300" />
                <text x="0" y="4" textAnchor="middle" fontFamily="Outfit" fontSize="8" fontWeight="700" fill="#0ABF53">Adyen</text>
                <text x="0" y="28" textAnchor="middle" fontFamily="Figtree" fontSize="8" fontWeight="600" fill="#666">1.2% Fee</text>
                {activeRoute === 'success' && !failoverMode && (
                  <circle cx="14" cy="-14" r="5" fill="#10B981" />
                )}
                {activeRoute === 'adyen-fail' && (
                  <circle cx="14" cy="-14" r="5" fill="#EF4444" />
                )}
              </g>

              {/* Mollie Node */}
              <g transform="translate(400, 180)">
                <circle r="20" fill="#1A1A1E" stroke="#333" strokeWidth="2" />
                <text x="0" y="4" textAnchor="middle" fontFamily="Outfit" fontSize="8" fontWeight="700" fill="#3B82F6">Mollie</text>
                <text x="0" y="28" textAnchor="middle" fontFamily="Figtree" fontSize="8" fontWeight="600" fill="#666">1.4% Fee</text>
              </g>
            </svg>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-white/5">
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-white/30 uppercase tracking-wider">Simulator Controls</span>
              <span className="text-xs font-semibold text-white/60">Click process to test smart cost-based failover routing.</span>
            </div>
            <button
              onClick={startSimulation}
              disabled={isProcessing}
              className={`focus-ring inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold text-white shadow-lg transition-all ${isProcessing ? 'bg-white/10 text-white/40 cursor-not-allowed' : 'bg-accent hover:bg-accent-hover hover:scale-[1.02] active:scale-[0.98]'}`}
            >
              <Play size={12} fill="currentColor" />
              {isProcessing ? 'Routing...' : 'Process Transaction'}
            </button>
          </div>
        </div>

        {/* Right Audit Log panel */}
        <div className="lg:col-span-4 p-6 bg-[#111112] text-white flex flex-col justify-between min-h-[340px] font-mono">
          <div className="flex-1 overflow-y-auto space-y-2.5 max-h-[250px]">
            <div className="text-[10px] text-white/30 font-bold uppercase tracking-wider pb-2 border-b border-white/5 flex justify-between items-center select-none">
              <span>REAL-TIME AUDIT LOGS</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <AnimatePresence>
              {logs.map((log, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="text-xs leading-relaxed"
                >
                  <span className="text-white/30 mr-2">[{log.timestamp}]</span>
                  <span className={
                    log.type === 'success' ? 'text-emerald-400 font-semibold' :
                    log.type === 'error' ? 'text-rose-400 font-semibold' :
                    log.type === 'warning' ? 'text-amber-400 font-semibold' : 'text-white/80'
                  }>
                    {log.text}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
            {isProcessing && (
              <div className="text-xs text-accent animate-pulse flex items-center gap-2 pt-1 font-semibold">
                <RefreshCw size={12} className="animate-spin" />
                <span>Processing packet stream...</span>
              </div>
            )}
          </div>
          <div className="border-t border-white/5 pt-4 mt-4 flex items-center justify-between select-none">
            <span className="text-[9px] text-white/30">SYSTEM HEALTH</span>
            <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-wide">PCI LEVEL 1 DEPLOYED</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const InteractiveConstellation: React.FC<{ isDark: boolean }> = ({ isDark }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.45;
        this.vy = (Math.random() - 0.5) * 0.45;
        this.radius = Math.random() * 1.8 + 0.8;
      }

      update(mouseX: number, mouseY: number) {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        if (mouseX !== -1000 && mouseY !== -1000) {
          const dx = mouseX - this.x;
          const dy = mouseY - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            this.x += (dx / dist) * 0.45;
            this.y += (dy / dist) * 0.45;
          }
        }
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = isDark ? 'rgba(226, 117, 51, 0.3)' : 'rgba(226, 117, 51, 0.15)';
        ctx.fill();
      }
    }

    const particles: Particle[] = [];
    const particleCount = Math.min(Math.floor((width * height) / 12000), 55);
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    let mouseX = -1000;
    let mouseY = -1000;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
    };

    const container = canvas.parentElement;
    container?.addEventListener('mousemove', handleMouseMove);
    container?.addEventListener('mouseleave', handleMouseLeave);

    const loop = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        particles[i].update(mouseX, mouseY);
        particles[i].draw();

        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 90) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            const alpha = (1 - dist / 90) * 0.1;
            ctx.strokeStyle = isDark
              ? `rgba(255, 255, 255, ${alpha})`
              : `rgba(17, 17, 17, ${alpha})`;
            ctx.lineWidth = 0.55;
            ctx.stroke();
          }
        }

        if (mouseX !== -1000 && mouseY !== -1000) {
          const dx = particles[i].x - mouseX;
          const dy = particles[i].y - mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(mouseX, mouseY);
            const alpha = (1 - dist / 140) * 0.15;
            ctx.strokeStyle = `rgba(226, 117, 51, ${alpha})`;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      window.removeEventListener('resize', handleResize);
      container?.removeEventListener('mousemove', handleMouseMove);
      container?.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDark]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />;
};

const useParallaxTilt = () => {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    setRotateX((yc - y) / 8); 
    setRotateY((x - xc) / 8);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return {
    ref: cardRef,
    style: {
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
      transition: 'transform 0.1s ease-out',
    },
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
  };
};

const Hero: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const sceneEnabled = useSceneEnabled();
  const leftCardParallax = useParallaxTilt();
  const rightCardParallax = useParallaxTilt();

  // Telemetry state for left card
  const [txCount, setTxCount] = useState(1482829);
  useEffect(() => {
    const interval = setInterval(() => {
      setTxCount(prev => prev + Math.floor(Math.random() * 3) + 1);
    }, 700);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      className="relative overflow-hidden bg-canvas dark:bg-[#0B0B0B] pt-16 transition-colors duration-300 min-h-[640px]"
    >
      {/* Interactive Node Constellation Canvas Backdrop */}
      <InteractiveConstellation isDark={isDark} />

      {/* Flagship 3D payment-routing network — gated (reduced-motion / low-power / no-WebGL show nothing) */}
      {sceneEnabled && (
        <ErrorBoundary fallback={null}>
          <Suspense fallback={null}>
            <HeroScene />
          </Suspense>
        </ErrorBoundary>
      )}

      {/* Floating Abstract Mesh Orbs */}
      <div className="absolute top-[-10%] left-[5%] w-[450px] h-[450px] bg-accent/[0.035] dark:bg-accent/[0.02] rounded-full blur-[90px] animate-[float-slow-1_20s_infinite_ease-in-out] pointer-events-none" />
      <div className="absolute top-[20%] right-[5%] w-[500px] h-[500px] bg-orange-200/[0.07] dark:bg-orange-950/[0.02] rounded-full blur-[100px] animate-[float-slow-2_25s_infinite_ease-in-out] pointer-events-none" />

      {/* Glow Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[360px] bg-gradient-to-b from-accent/[0.08] dark:from-accent/[0.04] via-orange-200/[0.03] to-transparent rounded-full blur-[100px] pointer-events-none animate-aura" />

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.2] dark:opacity-[0.1]"
        style={{
          backgroundImage: `
            radial-gradient(ellipse at 50% 20%, transparent 20%, white 85%),
            linear-gradient(to right, #E2E8F0 1px, transparent 1px),
            linear-gradient(to bottom, #E2E8F0 1px, transparent 1px)
          `,
          backgroundSize: '100% 100%, 48px 48px, 48px 48px',
          maskImage: 'radial-gradient(ellipse at 50% 30%, black, transparent)',
          WebkitMaskImage: 'radial-gradient(ellipse at 50% 30%, black, transparent)'
        }}
      />

      {/* Background Animated Flow Paths */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.14] dark:opacity-[0.06]" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M -100 120 L 600 120 L 600 360 L 1200 360 L 1200 680 L 2200 680"
          fill="none"
          stroke="url(#grid-flow-gradient-1)"
          strokeWidth="1.5"
          strokeDasharray="8 12"
          className="animate-grid-flow"
        />
        <path
          d="M -100 480 L 400 480 L 400 240 L 1400 240 L 1400 600 L 2200 600"
          fill="none"
          stroke="url(#grid-flow-gradient-2)"
          strokeWidth="1.5"
          strokeDasharray="8 12"
          style={{ animationDirection: 'reverse' }}
          className="animate-grid-flow"
        />
        <defs>
          <linearGradient id="grid-flow-gradient-1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#e27533" stopOpacity="0" />
            <stop offset="30%" stopColor="#e27533" stopOpacity="0.8" />
            <stop offset="70%" stopColor="#e27533" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#e27533" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="grid-flow-gradient-2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f28c38" stopOpacity="0" />
            <stop offset="40%" stopColor="#f28c38" stopOpacity="0.6" />
            <stop offset="80%" stopColor="#f28c38" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#f28c38" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      {/* Decorative Floating Left Widget (3D Parallax HUD Telemetry) */}
      <div className="hidden xl:block absolute left-[3%] top-[22%] z-20 cursor-pointer select-none">
        <motion.div
          initial={{ opacity: 0, x: -60, y: 40, rotate: -8 }}
          animate={{ opacity: 0.9, x: 0, y: 0, rotate: 4 }}
          transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          ref={leftCardParallax.ref}
          style={leftCardParallax.style}
          onMouseMove={leftCardParallax.onMouseMove}
          onMouseLeave={leftCardParallax.onMouseLeave}
          className="w-60 bg-white/80 dark:bg-[#121212]/80 backdrop-blur-lg border border-gray-250/30 dark:border-white/10 rounded-2xl p-5 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.06)] dark:shadow-none hover:border-accent/40 transition-all duration-300"
        >
          <div className="flex flex-col justify-between h-full gap-4">
            <div className="flex justify-between items-start">
              <div className="text-[9px] font-mono text-gray-500 dark:text-white/40 tracking-wider">LIVE TELEMETRY</div>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            </div>
            
            <div className="space-y-1">
              <div className="text-[9px] font-extrabold text-gray-450 dark:text-white/30 uppercase tracking-widest leading-none">Transactions Settle</div>
              <div className="text-xl font-black text-obsidian dark:text-white font-mono leading-none tracking-tight">
                {txCount.toLocaleString()}
              </div>
            </div>

            <div className="w-full h-8 overflow-hidden bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-100 dark:border-white/5 p-1 flex items-center">
              <svg className="w-full h-6 text-emerald-500" viewBox="0 0 100 30" fill="none">
                <path
                  d="M0 15 H20 L25 5 L30 25 L35 12 L40 18 L43 15 H55 L60 2 L65 28 L70 10 L75 15 H100"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="200"
                  strokeDashoffset="0"
                />
              </svg>
            </div>

            <div className="flex justify-between items-center text-[9px] font-bold text-gray-400 dark:text-white/20">
              <span>SLA STATUS</span>
              <span className="text-emerald-500 font-extrabold">100.0% RUNNING</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Decorative Floating Right Widget (3D Parallax Metallic Card) */}
      <div className="hidden xl:block absolute right-[3%] top-[14%] z-20 cursor-pointer select-none">
        <motion.div
          initial={{ opacity: 0, x: 60, y: 30, rotate: 8 }}
          animate={{ opacity: 0.9, x: 0, y: 0, rotate: -4 }}
          transition={{ duration: 1.2, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          ref={rightCardParallax.ref}
          style={rightCardParallax.style}
          onMouseMove={rightCardParallax.onMouseMove}
          onMouseLeave={rightCardParallax.onMouseLeave}
          className="w-64 h-40 bg-gradient-to-br from-[#1A1A1E] via-[#121214] to-[#1A1A1E] border border-white/10 rounded-2xl p-5 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35)] hover:border-accent/40 transition-all duration-300"
        >
          <div className="flex flex-col justify-between h-full relative">
            <div className="flex justify-between items-start">
              <div className="text-[9px] font-mono text-white/50 tracking-wider">ORCHESTRATOR NODE</div>
              {/* Golden Smart Card Chip SVG */}
              <svg width="24" height="20" viewBox="0 0 24 20" fill="none" className="text-amber-500/70">
                <rect x="1" y="1" width="22" height="18" rx="3" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M1 7h22M1 13h22M7 1v18M17 1v18" stroke="currentColor" strokeWidth="1"/>
              </svg>
            </div>
            
            <div className="space-y-1">
              <div className="text-white font-mono text-[12px] tracking-widest">**** **** **** 2026</div>
              <div className="text-white/45 text-[8.5px] font-bold tracking-wider leading-none">{"ACTIVE ROUTE: ADYEN -> STRIPE"}</div>
            </div>

            <div className="flex justify-between items-center text-[10px] text-white/60 font-semibold border-t border-white/5 pt-2">
              <span>betterswitch v1.0</span>
              <span className="text-emerald-400 font-extrabold uppercase tracking-wide">99.98% SLA</span>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="px-6 md:px-12 lg:px-20 pt-16 pb-12 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/80 dark:bg-white/5 backdrop-blur-md border border-gray-200/50 dark:border-white/5 shadow-[0_2px_12px_rgba(0,0,0,0.02)] transition-colors"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
              </span>
              <span className="font-sans text-[10.5px] font-extrabold text-gray-500 dark:text-gray-400 uppercase tracking-widest pr-1 select-none">
                Payment Systems as a Service
              </span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="font-sans text-5xl md:text-7xl lg:text-[5.5rem] font-extrabold tracking-tighter text-obsidian dark:text-white leading-[0.95]"
            >
              <span className="block">Launch Your</span>
              <span className="block">Payment Company</span>
              <span className="block bg-gradient-to-r from-accent to-[#f28c38] bg-clip-text text-transparent">in a Day</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-xl mx-auto font-sans text-base md:text-lg font-medium text-gray-650 dark:text-gray-300 leading-relaxed"
            >
              White-label platform with 200+ payment connectors. Deploy a PCI-compliant Orchestrator, Merchant of Record, Facilitator, or Gateway on your own infrastructure.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap items-center justify-center gap-4 pt-2"
            >
              <a
                href={CALENDLY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring group relative isolate overflow-hidden bg-accent text-white text-sm font-semibold px-8 py-3.5 rounded-lg shadow-lg transition-all duration-500 hover:scale-[1.03] hover:bg-accent-hover hover:shadow-[0_12px_32px_-8px_rgba(226,117,51,0.4)] active:scale-[0.98] flex items-center gap-2"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent z-0 pointer-events-none -translate-x-full animate-shimmer" />
                <span className="relative z-10">Schedule a Demo</span>
                <ArrowRight className="w-4 h-4 relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
              <a
                href="#solutions"
                className="focus-ring font-sans text-sm font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-white/5 border border-gray-200/80 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/10 hover:text-obsidian dark:hover:text-white transition-all px-6 py-3.5 rounded-lg flex items-center gap-1.5 shadow-sm hover:scale-[1.03] active:scale-[0.98]"
              >
                Explore Solutions
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
              </a>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto mt-6 mb-12 px-6 relative z-10">
        {/* Card 1: Connectors */}
        <motion.div
          whileHover={{ y: -5, scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="flex items-center gap-4 p-5 bg-white/70 dark:bg-[#151515]/75 backdrop-blur-md border border-gray-200/60 dark:border-white/10 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.01)] dark:shadow-none hover:border-accent/30 dark:hover:border-accent/30 hover:shadow-[0_20px_40px_rgba(226,117,51,0.05)] transition-all duration-300"
        >
          <div className="w-12 h-12 bg-accent/5 border border-accent/15 rounded-xl flex items-center justify-center text-accent flex-shrink-0">
            <Network size={22} className="stroke-[1.75]" />
          </div>
          <div className="text-left">
            <h3 className="text-2xl font-extrabold text-obsidian dark:text-white tracking-tight leading-none">200+</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-bold mt-1">Payment Connectors</p>
          </div>
        </motion.div>

        {/* Card 2: Deployment */}
        <motion.div
          whileHover={{ y: -5, scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="flex items-center gap-4 p-5 bg-white/70 dark:bg-[#151515]/75 backdrop-blur-md border border-gray-200/60 dark:border-white/10 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.01)] dark:shadow-none hover:border-accent/30 dark:hover:border-accent/30 hover:shadow-[0_20px_40px_rgba(226,117,51,0.05)] transition-all duration-300"
        >
          <div className="w-12 h-12 bg-accent/5 border border-accent/15 rounded-xl flex items-center justify-center text-accent flex-shrink-0">
            <Zap size={22} className="stroke-[1.75]" />
          </div>
          <div className="text-left">
            <h3 className="text-2xl font-extrabold text-obsidian dark:text-white tracking-tight leading-none">24 Hours</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-bold mt-1">Deployment Time</p>
          </div>
        </motion.div>

        {/* Card 3: Compliance */}
        <motion.div
          whileHover={{ y: -5, scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="flex items-center gap-4 p-5 bg-white/70 dark:bg-[#151515]/75 backdrop-blur-md border border-gray-200/60 dark:border-white/10 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.01)] dark:shadow-none hover:border-accent/30 dark:hover:border-accent/30 hover:shadow-[0_20px_40px_rgba(226,117,51,0.05)] transition-all duration-300"
        >
          <div className="w-12 h-12 bg-accent/5 border border-accent/15 rounded-xl flex items-center justify-center text-accent flex-shrink-0">
            <ShieldCheck size={22} className="stroke-[1.75]" />
          </div>
          <div className="text-left">
            <h3 className="text-2xl font-extrabold text-obsidian dark:text-white tracking-tight leading-none">PCI</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-bold mt-1">Level 1 Certified</p>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
        className="relative px-6 md:px-16 lg:px-24 mt-2 max-w-6xl mx-auto mb-16"
      >
        <RoutingSimulator />
        <div className="text-center mt-6">
          <p className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-white/30 font-mono font-extrabold">
            Interactive Payment Orchestrator & Auto-Failover Sandbox
          </p>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
