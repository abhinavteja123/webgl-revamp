import React from "react";
import { motion } from "motion/react";
import { Linkedin, Twitter, ExternalLink, ArrowRight, Zap, Database, Globe } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";

interface Pillar {
  title: string;
  desc: string;
  icon: React.ReactNode;
}

interface SocialLink {
  icon: React.ReactNode;
  label: string;
  href: string;
}

const fadeInUp: any = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.8, ease: "easeOut" }
};

const CriticalRisksVisual = () => (
  <div className="w-full bg-gradient-to-br from-indigo-50/50 to-purple-50/50 p-8 md:p-12 rounded-3xl border border-gray-100">
    <h3 className="text-3xl md:text-4xl font-bold text-indigo-900 mb-12 tracking-tight">Critical Risks Merchants Face</h3>
    
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      <div className="space-y-6">
        {[
          { 
            title: "Chargebacks", 
            desc: "Increase with AI agent misinterpretation or unauthorized purchases, leading to financial loss." 
          },
          { 
            title: "Product Misalignment", 
            desc: "Agents may select incorrect items or quantities, resulting in customer dissatisfaction and returns." 
          },
          { 
            title: "Disputes", 
            desc: "Multiply when customers deny agent actions, creating administrative burden and potential penalties." 
          }
        ].map((risk, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm border-l-8 border-l-indigo-600 transition-transform hover:scale-[1.02]">
            <h4 className="font-bold text-xl text-obsidian mb-2">{risk.title}</h4>
            <p className="text-gray-600 text-sm leading-relaxed">{risk.desc}</p>
          </div>
        ))}
      </div>
      
      <div className="bg-white p-8 rounded-2xl border-2 border-accent shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full -mr-16 -mt-16" />
        <h4 className="text-2xl font-bold text-obsidian mb-8 flex items-center gap-3">
          <div className="w-2 h-8 bg-accent rounded-full" />
          Impacts:
        </h4>
        <ul className="space-y-6">
          {[
            "Revenue", 
            "operational costs", 
            "payment provider relationships"
          ].map((impact, i) => (
            <li key={i} className="flex items-center gap-4 text-lg text-gray-700 font-medium">
              <div className="w-2.5 h-2.5 rounded-full bg-accent shadow-sm shadow-accent/40" />
              {impact}
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);

const SafetyTracingVisual = () => (
  <div className="w-full bg-gradient-to-br from-purple-50/50 to-indigo-50/50 p-8 md:p-12 rounded-3xl border border-gray-100">
    <h3 className="text-3xl md:text-4xl font-bold text-indigo-900 mb-12 tracking-tight">Safety & Tracing Are Non-Negotiables</h3>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {[
        {
          num: "1",
          label: "Critical Requirement",
          header: "Retain exact artifacts for every transaction:",
          items: ["intent payloads", "credentials", "signatures", "risk decisions", "payment outcomes"],
          footer: "If you can't replay the decision, you can't defend it."
        },
        {
          num: "2",
          label: "Design Assumption",
          header: "Build assuming every transaction will be questioned.",
          body: "This requires comprehensive logging, immutable audit trails, and deterministic replay.",
          footer: "In an agentic world, auditability is the new receipt."
        },
        {
          num: "3",
          label: "Beyond the Transaction",
          header: "Monitoring and intelligence provide continuous visibility to:",
          items: ["detect anomalies", "contain risk", "validate intent vs. execution"],
          footer: "Safety is a system property, not a feature."
        }
      ].map((card, i) => (
        <div key={i} className="bg-white rounded-2xl shadow-xl border border-gray-100 flex flex-col overflow-hidden transition-transform hover:scale-[1.03]">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 text-center">
            <span className="text-white font-bold text-sm uppercase tracking-widest">{card.num} - {card.label}</span>
          </div>
          <div className="p-6 flex-grow flex flex-col">
            <h4 className="font-bold text-obsidian mb-4 leading-tight">{card.header}</h4>
            
            {card.items && (
              <ul className="space-y-2 mb-6">
                {card.items.map((item, j) => (
                  <li key={j} className="flex items-center gap-2 text-gray-600 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                    {item}
                  </li>
                ))}
              </ul>
            )}
            
            {card.body && (
              <p className="text-gray-600 text-sm leading-relaxed mb-6">{card.body}</p>
            )}
            
            <div className="mt-auto pt-4 border-t border-gray-50 italic text-gray-500 text-sm leading-relaxed">
              {card.footer}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const Badge: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className="inline-block bg-accent/10 border border-accent/30 text-accent px-5 py-2 rounded-full text-xs font-bold uppercase tracking-[1.5px] mb-8"
  >
    {children}
  </motion.div>
);

const SectionHeading: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2 className="flex items-center gap-4 text-2xl md:text-3xl font-bold mb-6 text-obsidian">
    <div className="w-1 h-8 rounded-full bg-gradient-to-b from-accent to-obsidian" />
    {children}
  </h2>
);

export const AgenticCommerceReckoning: React.FC = () => {
  const pillars: Pillar[] = [
    {
      title: "1. Intent Capture",
      desc: "Every agentic transaction needs metadata on the agent's decision logic. Not just 'purchase'—why did the agent make this choice? What rules governed it? What budget constraints applied? This metadata becomes your audit anchor.",
      icon: <Zap className="text-accent" size={24} />
    },
    {
      title: "2. Protocol Orchestration",
      desc: "VISA protocols, ACP, UCP, Agent Pay—there's a protocol ladder emerging. You don't need to bet on one. You need orchestration that's PSP-agnostic, flexible, and future-proof.",
      icon: <Globe className="text-accent" size={24} />
    },
    {
      title: "3. Data Intelligence",
      desc: "Move from rigid SQL databases to data warehouses that track behavioral patterns, intent signals, and risk indicators in real-time. This is where competitive advantage lives.",
      icon: <Database className="text-accent" size={24} />
    }
  ];

  const socialLinks: SocialLink[] = [
    { icon: <Twitter size={20} />, label: "Twitter", href: "https://twitter.com/betterswitch" },
    { icon: <Linkedin size={20} />, label: "LinkedIn", href: "https://www.linkedin.com/company/betterswitch/" },
    { icon: <ExternalLink size={20} />, label: "Product Hunt", href: "#" }
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
          <Badge>Research Insights 2026</Badge>

          <motion.section 
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="mb-16"
          >
            <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.1] mb-6 text-obsidian tracking-tight">
              The Agentic <span className="text-accent">Commerce</span> Reckoning
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 leading-relaxed max-w-2xl">
              What Payment Leaders Need to Know—And Why Your Stack Isn't Ready for 2030
            </p>
          </motion.section>

          <motion.div 
            {...fadeInUp}
            className="bg-white border border-gray-200 shadow-sm border-l-4 border-l-accent p-8 md:p-12 rounded-xl mb-20"
          >
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-4">
              <strong className="text-accent font-bold">Mastercard just made a prediction that should shake every payments executive awake:</strong> 50% of all commerce will be agentic by 2030.
            </p>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-4">
              Not someday. Not eventually. <strong className="text-obsidian">In four years.</strong>
            </p>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
              But here's what nobody's talking about: agentic commerce isn't about technology. It's about <strong className="text-obsidian">authority, accountability, and who bears the risk</strong> when autonomous agents make purchasing decisions on behalf of humans.
            </p>
          </motion.div>

          <motion.section {...fadeInUp} className="mb-24">
            <SectionHeading>The Opportunity: New Markets Are Opening</SectionHeading>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              This is genuinely transformative. We're watching autonomous agents handle shopping decisions, orchestrated transactions across protocols, and entirely new payment paradigms emerging.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              Stripe's already moved: machine payments using the PX 402 protocol. VISA, Shopify, OpenAI—they're all racing to define what this looks like at scale.
            </p>
            
            <div className="bg-accent/5 border-l-4 border-accent p-8 rounded-lg mb-8">
              <p className="text-xl text-gray-700 font-medium leading-relaxed">
                <strong className="text-accent text-2xl block mb-2">For payment service providers,</strong>
                this opens an entirely new market. New transaction types. New data streams. New revenue opportunities. <strong className="text-obsidian">The vendors who move fast here will own the next decade of payments.</strong>
              </p>
            </div>
            <p className="text-gray-600 text-lg leading-relaxed">
              But most organizations are still in the investigative phase. And that's the problem.
            </p>
          </motion.section>

          <motion.section {...fadeInUp} className="mb-24">
            <SectionHeading>The Problem Nobody's Prepared For</SectionHeading>
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              Early signals are already flashing. Chargebacks are spiking. Risk frameworks are breaking. And most payment platforms aren't ready.
            </p>

            <h3 className="text-xl font-bold text-obsidian mb-8">Three Questions Keeping Executives Up at Night:</h3>

            <div className="space-y-10">
              <div>
                <h3 className="text-xl font-bold text-accent mb-3">1. Who has authority?</h3>
                <p className="text-gray-600 leading-relaxed">
                  When an agentic transaction executes, was there proper authorization? What constraints governed the agent's decision? What intent did we actually capture? These aren't edge cases—they're foundational questions that your current stack probably can't answer.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-accent mb-3">2. Friendly fraud just got friendlier</h3>
                <p className="text-gray-600 leading-relaxed">
                  Chargebacks are exploding in early agentic adoption. The liability shift? <strong className="text-obsidian font-bold">Moving aggressively toward merchants.</strong> That means your customers' chargeback rates, their customer relationships, their revenue—all at risk.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-accent mb-3">3. Your infrastructure wasn't built for this</h3>
                <p className="text-gray-600 leading-relaxed">
                  You're running SQL databases designed for human commerce patterns. Agentic commerce is different. It's not a patch. <strong className="text-obsidian font-bold">It's a rip-and-replace situation.</strong> The architectures that scale from zero to millions of autonomous transactions need fundamentally different data infrastructure, authorization models, and intent tracking.
                </p>
              </div>
            </div>
          </motion.section>

          <motion.section {...fadeInUp} className="mb-24">
            <div className="bg-white rounded-3xl p-2 md:p-4 border border-gray-100 shadow-2xl shadow-gray-200/40">
              <CriticalRisksVisual />
            </div>
          </motion.section>

          <motion.section {...fadeInUp} className="mb-24">
            <SectionHeading>The Architecture for 2030</SectionHeading>
            <p className="text-gray-600 text-lg leading-relaxed mb-10">
              So what does a ready-for-agentic-commerce payment stack actually look like? Three cornerstones:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {pillars.map((pillar, i) => (
                <motion.div 
                  key={i}
                  whileHover={{ y: -8 }}
                  className="bg-white border border-gray-100 p-8 rounded-2xl shadow-sm transition-all hover:shadow-md hover:border-accent/20"
                >
                  <div className="mb-4">{pillar.icon}</div>
                  <h4 className="text-xl font-bold text-obsidian mb-4">{pillar.title}</h4>
                  <p className="text-gray-600 leading-relaxed text-sm">{pillar.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          <motion.section {...fadeInUp} className="mb-24">
            <SectionHeading>The Boardroom Conversation</SectionHeading>
            <div className="bg-gradient-to-br from-accent/5 to-obsidian/5 border border-gray-200 p-10 rounded-2xl border-l-8 border-l-accent italic shadow-sm">
              <p className="text-xl text-gray-700 leading-relaxed mb-6">
                "We know agentic transactions create new chargeback risk. We know there's product misalignment. But we're going to do it anyway—because the long-term opportunity is too big to miss."
              </p>
              <div className="text-accent font-bold not-italic text-sm uppercase tracking-wider">
                — What forward-thinking merchants are saying right now
              </div>
            </div>
            <p className="text-gray-600 text-lg leading-relaxed mt-8">
              That's the decision being made today. Not whether to adopt agentic commerce. <strong className="text-obsidian font-bold">But how to adopt it safely and strategically.</strong>
            </p>
          </motion.section>

          <motion.section {...fadeInUp} className="mb-24">
            <SectionHeading>Your Playbook: Four Steps</SectionHeading>
            <div className="space-y-12">
              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-accent text-white flex items-center justify-center font-bold text-xl">1</div>
                <div>
                  <h3 className="text-xl font-bold text-obsidian mb-2">Step 1: Instrument for Visibility</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Constantly monitor your transaction flow. Understand what's happening in real time. If you jump from zero to a million agentic transactions, you need visibility into every decision point, every authorization, every risk signal.
                  </p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-accent text-white flex items-center justify-center font-bold text-xl">2</div>
                <div>
                  <h3 className="text-xl font-bold text-obsidian mb-2">Step 2: Build the Identity Layer</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Non-negotiable. Know your agent. Know the merchant. Know the authorization path. Make every transaction traceable.
                  </p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-accent text-white flex items-center justify-center font-bold text-xl">3</div>
                <div>
                  <h3 className="text-xl font-bold text-obsidian mb-2">Step 3: Create Positive Feedback Loops</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Anonymized risk data points. Shared learnings across your merchant ecosystem. Companies that build transparency will build trust—and win merchant loyalty.
                  </p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-accent text-white flex items-center justify-center font-bold text-xl">4</div>
                <div>
                  <h3 className="text-xl font-bold text-obsidian mb-2">Step 4: Shape the Conversation</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Not just staying informed—actively shaping the standards. Work with orchestrators. Engage with protocol developers. Be part of the evolution, not a passenger watching it happen.
                  </p>
                </div>
              </div>
            </div>
          </motion.section>

          <motion.section {...fadeInUp} className="mb-24">
            <div className="bg-white rounded-3xl p-2 md:p-4 border border-gray-100 shadow-2xl shadow-gray-200/40">
              <SafetyTracingVisual />
            </div>
          </motion.section>

          <motion.section {...fadeInUp} className="mb-24">
            <SectionHeading>The Timeline</SectionHeading>
            <div className="bg-white border border-gray-200 p-10 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-10 shadow-sm">
              <div className="text-center flex-1">
                <div className="text-xs text-gray-400 uppercase tracking-widest mb-2">Today</div>
                <div className="text-5xl font-black text-obsidian">0%</div>
                <div className="text-sm text-gray-500 mt-2">Agentic Commerce</div>
              </div>
              <ArrowRight className="hidden md:block text-accent/30 w-10 h-10" />
              <div className="text-center flex-1">
                <div className="text-xs text-gray-400 uppercase tracking-widest mb-2">2030</div>
                <div className="text-5xl font-black text-accent">50%</div>
                <div className="text-sm text-gray-500 mt-2">Agentic Commerce</div>
              </div>
              <ArrowRight className="hidden md:block text-accent/30 w-10 h-10" />
              <div className="text-center flex-1">
                <div className="text-xs text-gray-400 uppercase tracking-widest mb-2">Window</div>
                <div className="text-5xl font-black text-obsidian">4</div>
                <div className="text-sm text-gray-500 mt-2">Years to Prepare</div>
              </div>
            </div>
            <p className="text-center mt-10 text-accent font-bold text-lg">
              The window is closing. Organizations that treat this as exploratory won't catch up.
            </p>
          </motion.section>

          <motion.section {...fadeInUp} className="mb-24">
            <SectionHeading>Your Choice</SectionHeading>
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              There's a lot of noise in this market. New protocols announced weekly. Vendors overselling their readiness. Frameworks that don't yet exist in production.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed mb-10">
              But the organizations that will own 2030 are those making strategic, coherent decisions now. Not reactive decisions. Not follow-the-crowd decisions. <strong className="text-obsidian font-bold">Intentional decisions.</strong>
            </p>

            <div className="bg-gradient-to-br from-obsidian to-charcoal text-white p-10 rounded-2xl border-l-8 border-l-accent shadow-xl">
              <p className="text-xl font-bold mb-6">You can either:</p>
              <ul className="space-y-4 text-gray-300">
                <li className="flex items-start gap-3">
                  <ArrowRight className="text-accent flex-shrink-0 mt-1" size={18} />
                  <span>Wait and optimize later (and spend the next decade playing catch-up)</span>
                </li>
                <li className="flex items-start gap-3">
                  <ArrowRight className="text-accent flex-shrink-0 mt-1" size={18} />
                  <span>Or move now, instrument carefully, and build the stack that owns this decade</span>
                </li>
              </ul>
            </div>
            <p className="mt-10 text-accent font-bold text-xl text-center">
              The timeline is real. The opportunity is massive. Mastercard just put a stake in the ground.
            </p>
          </motion.section>

          <motion.section 
            {...fadeInUp}
            className="bg-obsidian p-12 md:p-20 rounded-[32px] text-center text-white"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 flex justify-center items-center gap-4">
              <div className="w-1 h-8 bg-accent rounded-full" />
              What's Your Move?
            </h2>
            <p className="text-gray-400 text-xl mb-10 max-w-2xl mx-auto">
              The agentic commerce shift isn't coming. It's already here. The payments leaders who shape this moment will define the next decade.
            </p>
            <div className="flex justify-center">
              <motion.a 
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.95 }}
                href="mailto:biz@betterswitch.io?subject=Business%20Inquiry"
                className="bg-accent text-white px-12 py-5 rounded-xl font-bold text-lg shadow-xl shadow-accent/20 transition-all hover:bg-accent/90"
              >
                Start the Conversation
              </motion.a>
            </div>
          </motion.section>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default AgenticCommerceReckoning;
