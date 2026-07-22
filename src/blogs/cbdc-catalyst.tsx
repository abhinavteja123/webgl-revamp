import React from "react";
import { motion } from "motion/react";
import { ArrowRight, Zap, Database, Globe, Shield, Cpu, Wifi } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";

interface Feature {
  icon: React.ReactNode;
  title: string;
  desc: string;
}

const fadeInUp: any = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.8, ease: "easeOut" }
};

const CBDCBlog: React.FC = () => {
  const stats = [
    { val: "137", label: "Countries Exploring" },
    { val: "49", label: "Active Pilots" },
    { val: "698M", label: "India Daily Txns" },
    { val: "98%", label: "Global GDP Engaged" },
  ];

  const features: Feature[] = [
    {
      icon: <Globe className="text-accent" size={20} />,
      title: "Intelligent Routing",
      desc: "Real-time path optimisation across UPI, CBDC, cards — fastest, cheapest, most compliant route every time.",
    },
    {
      icon: <Shield className="text-gold" size={20} />,
      title: "Programmable Compliance",
      desc: "CBDC tokens carry conditions. Our stack reads, validates, and enforces token rules at point of transaction.",
    },
    {
      icon: <Cpu className="text-accent" size={20} />,
      title: "Real-Time Reconciliation",
      desc: "Settlement across CBDC and traditional rails — reconciled instantly. No T+1. One source of truth.",
    },
    {
      icon: <Database className="text-gold" size={20} />,
      title: "Multi-Rail Orchestration",
      desc: "One integration. Every rail. UPI, digital rupee, cards, wallets — a hassle-free, unified experience.",
    },
    {
      icon: <Shield className="text-accent" size={20} />,
      title: "Govt-Ready Integration",
      desc: "DBT subsidy flows, programmable welfare tokens, audit-ready trails — built for regulatory collaboration.",
    },
    {
      icon: <Wifi className="text-gold" size={20} />,
      title: "Offline-First Architecture",
      desc: "NFC-capable, connectivity-agnostic. 190M unbanked Indians won't wait for 5G to use digital money.",
    },
  ];

  return (
    <div className="relative min-h-screen bg-canvas text-obsidian font-sans selection:bg-accent/30 overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]" 
           style={{ 
             backgroundImage: 'linear-gradient(to right, #111 1px, transparent 1px), linear-gradient(to bottom, #111 1px, transparent 1px)',
             backgroundSize: '40px 40px'
           }} 
      />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-grow container mx-auto max-w-[900px] px-6 py-12 md:px-10 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-16"
          >
            <span className="inline-block bg-accent/10 border border-accent/30 text-accent px-4 py-2 rounded-full text-xs font-bold uppercase tracking-[1.5px] mb-6">
              The Future of Money
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.1] mb-6 text-obsidian tracking-tight">
              CBDC — The Catalyst <span className="italic text-gold">Shifting</span> the Global Landscape
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mb-12">
              Every central bank is evaluating the future of money. In the age of AI and quantum, the real question is: who controls the code it runs on?
            </p>

            <div className="flex flex-wrap justify-center gap-px bg-gray-200 rounded-xl overflow-hidden">
              {stats.map((stat, i) => (
                <div key={i} className="bg-white px-8 py-6 min-w-[140px]">
                  <div className="text-3xl font-bold text-obsidian">{stat.val}</div>
                  <div className="text-xs text-gray-500 tracking-wider uppercase mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div {...fadeInUp} className="mb-16">
            <p className="text-xl text-gray-700 border-l-2 border-gold pl-6 mb-8">
              Money is the most sensitive thing on earth. You can't rely on something external — detached from human judgement — to govern it. Digital payments aren't a passing wave. They are permanent infrastructure. And permanent infrastructure demands conviction.
            </p>

            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              With everyone accessing AI, the future doesn't belong to those with the best tools. It belongs to those who combine experience and instinct with technology. Thinking independently — seeing tech as an enabler, not a replacement for clear thinking — builds the edge that lasts. Technology can't teach conviction.
            </p>

            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              India already proved this. UPI — 228.3 billion transactions in 2025, ₹300 lakh crore in value, 84% of digital retail payments, surpassing Visa's daily global volume — is the world's largest real-time payment system. Built in India. For Indian conditions. But UPI moves money between bank accounts. A CBDC <em className="text-gold font-medium">is</em> the money — issued by the central bank, programmable, sovereign. The digital rupee pilot has reached 17 banks, 6 million users, ₹1,016 crore in circulation. And the innovations at the edges signal something bigger.
            </p>
          </motion.div>

          <motion.div {...fadeInUp} className="mb-16 -mx-6 md:-mx-10 bg-gray-100 rounded-2xl overflow-hidden border border-gray-200">
            <img 
              src="https://akm-img-a-in.tosshub.com/indiatoday/images/story/202602/cbdc-food-subsidy-pilot-puducherry-274938216-16x9_0.png?VersionId=z2qxjDkVEDlJvNbfJDJn2RO8BE3kMeSx&size=690:388" 
              alt="India's Digital Rupee CBDC pilot" 
              className="w-full h-auto max-h-80 object-cover"
            />
            <div className="p-8">
              <span className="inline-block text-xs font-semibold tracking-wider uppercase text-accent bg-accent/10 px-3 py-1 rounded-full mb-3">Live Pilot — Puducherry, Feb 2026</span>
              <p className="text-obsidian font-semibold mb-2">Food Subsidies via Programmable Digital Rupee Tokens</p>
              <p className="text-gray-600 text-sm leading-relaxed">
                Beneficiaries receive CBDC tokens in their wallets — tokens that can <em className="text-gold">only</em> be spent on entitled food grains at authorised fair price shops. No diversion. No leakage. Money with policy intent embedded in it.
              </p>
            </div>
          </motion.div>

          <motion.div {...fadeInUp} className="mb-16">
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              This isn't an upgrade to payments. It's a <span className="text-gold font-semibold">platform shift</span> — fundamentally changing how people build, work, and think about money.
            </p>

            <div className="flex items-center gap-4 my-12">
              <div className="flex-1 h-px bg-gray-200" />
              <div className="w-5 h-0.5 bg-accent rounded" />
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            <p className="text-xl text-gray-700 leading-relaxed">
              Here's the paradox we must name. <span className="text-gold">We are slowing everything down with our unquenchable quest for AI</span> — compute, talent, capital, all consumed. And while we chase that gold rush, quantum computing is quietly approaching the gates of every cryptographic lock securing digital money. By ~2035, quantum machines will crack today's standards. Adversaries are already harvesting encrypted financial data — waiting. Every CBDC transaction encrypted with today's algorithms is a future vulnerability. The question isn't <em className="text-gold">whether</em> quantum breaks cryptography. It's whether your sovereign currency stack can be migrated on your own timeline.
            </p>
          </motion.div>

          <motion.div {...fadeInUp} className="mb-20 bg-gradient-to-br from-obsidian to-charcoal p-10 md:p-14 rounded-3xl border border-gray-100">
            <span className="inline-block text-xs font-semibold tracking-[2.5px] uppercase text-ember mb-4">The Core Challenge</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Deep Tech Takes Time. Capital Has None.</h2>
            <p className="text-gray-300 leading-relaxed mb-8">
              The technologies behind an indigenous CBDC stack — post-quantum cryptography, sovereign ledger systems, AI-driven compliance, offline NFC for 190 million unbanked adults — are <span className="text-ember font-semibold">deep tech problems.</span> They take 7 to 12 years to mature. Traditional VC wants returns in five. There's no growth hack for quantum-safe key management. There's only physics, maths, and patience.
            </p>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-8">
              <div className="text-xs font-semibold tracking-wider uppercase text-ember mb-4">The Structural Tension</div>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-400 w-40">Deep tech maturity</span>
                  <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-accent to-gold w-[85%] rounded-full" />
                  </div>
                  <span className="text-xs text-gray-400 font-mono">7–12 yrs</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-400 w-40">VC patience</span>
                  <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-ember to-gold w-[38%] rounded-full" />
                  </div>
                  <span className="text-xs text-gray-400 font-mono">3–5 yrs</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-400 w-40">US vs India funding</span>
                  <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-ember/50 to-ember w-[93%] rounded-full" />
                  </div>
                  <span className="text-xs text-gray-400 font-mono">89× gap</span>
                </div>
              </div>
            </div>

            <p className="text-gray-300 leading-relaxed mb-6">
              India raised <span className="text-gold font-semibold">$1.65 billion</span> for deep tech in 2025. The US raised <span className="text-gold font-semibold">$147 billion.</span> That's not a gap — it's a chasm. The ₹1 lakh crore RDI Fund, the ₹10K crore Fund of Funds 2.0, the IDTA's $2.5B commitment — all necessary steps. But funding alone doesn't close the loop. These ventures need <span className="text-gold font-semibold">buyers</span> — a first institution willing to bet on unproven domestic tech and become the reference point for everyone else.
            </p>

            <p className="text-gray-300 leading-relaxed mb-8">
              Israel solved this through defence procurement. South Korea through government policy. The US through DARPA. India's CBDC programme could serve exactly that role — if the RBI treats indigenous technology as a <span className="text-ember font-semibold">strategic sovereign investment</span>, not a favour. This is where BetterSwitch steps in — with <span className="text-gold font-semibold">computing power and cybersecurity baked into our payment infrastructure</span>, we're building the security-first orchestration layer that sovereign digital currency demands. Not adapting foreign architecture. Building it right, from the ground up.
            </p>

            <div className="bg-accent/10 border border-accent/20 rounded-lg p-6 text-center">
              <p className="text-gray-200">
                This is the gap between policy ambition and engineering reality. Bridging it requires payment orchestration that's ready for programmable, sovereign, offline-capable digital currency rails — not someday, but <strong className="text-accent">now.</strong>
              </p>
            </div>
          </motion.div>

          <motion.div {...fadeInUp} className="mb-20">
            <span className="inline-block text-xs font-semibold tracking-[2.5px] uppercase text-accent mb-4">Our Conviction</span>
            <h2 className="text-3xl md:text-4xl font-bold text-obsidian mb-2">BetterSwitch: Responsible Practice of Money in the CBDC Era</h2>
            <p className="text-lg text-gray-500 mb-10">Payment orchestration built for what money is becoming — not what it used to be.</p>

            <p className="text-gray-600 leading-relaxed mb-6">
              Our journey is rooted in solving real-world problems. We navigated the early challenges every builder knows — limited resources, establishing credibility, and the engineering effort of solving multiple technical problems at once. Payment orchestration isn't a single problem. It's routing, reconciliation, compliance, fraud detection, multi-provider failover — all at scale, zero tolerance for failure.
            </p>

            <p className="text-gray-600 leading-relaxed mb-12">
              With CBDC as the next layer, the architecture must evolve to handle <em className="text-gold">programmable money</em> — tokens carrying spending restrictions, geographic limits, expiry dates, and policy conditions embedded in the currency itself. We're fostering strong collaboration with government bodies, measuring practical utility at every step, and building for the rails that are coming — not just the ones that exist.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-gray-200 rounded-xl overflow-hidden">
              {features.map((feature, i) => (
                <div key={i} className="bg-white p-6 hover:bg-gray-50 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h4 className="text-obsidian font-semibold mb-2">{feature.title}</h4>
                  <p className="text-gray-500 text-sm leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>

            <p className="text-gray-600 leading-relaxed mt-12">
              We're committed to hearing a wide range of voices — regulators, engineers, merchants, everyday users. Our clear objective: <strong className="text-accent">stay relevant with our tenets.</strong> Reduce complexity. Provide hassle-free experiences. Measure practical utility, not theoretical elegance.
            </p>
          </motion.div>

          <motion.div {...fadeInUp} className="mb-20 border-t border-gray-200 pt-12">
            <div className="text-center">
              <div className="w-8 h-0.5 bg-gold mx-auto mb-6 rounded" />
              <blockquote className="text-2xl text-obsidian leading-relaxed font-medium">
                Technology can't teach conviction.<br/>
                <em className="text-gold">The future belongs to those who act on it.</em>
              </blockquote>
            </div>
          </motion.div>

          <motion.div {...fadeInUp} className="bg-obsidian p-12 md:p-20 rounded-[32px] text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 flex justify-center items-center gap-4">
              <div className="w-1 h-8 bg-accent rounded-full" />
              Building for the future of payments? So are we.
            </h2>
            <p className="text-gray-400 text-xl mb-10 max-w-2xl mx-auto">
              We're shaping payment orchestration for the CBDC era. If you care about how money moves — let's talk.
            </p>
            <motion.a 
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.95 }}
              href="mailto:biz@betterswitch.io?subject=Business%20Inquiry"
              className="inline-block bg-accent text-white px-12 py-5 rounded-xl font-bold text-lg shadow-xl shadow-accent/20 transition-all hover:bg-accent/90"
            >
              Start a Conversation
            </motion.a>
            <div className="mt-12 pt-8 border-t border-gray-700 flex justify-center gap-8 text-xs text-gray-500">
              <span>© 2026 BetterSwitch</span>
              <span>Perspectives</span>
              <span>April 2026</span>
            </div>
          </motion.div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default CBDCBlog;