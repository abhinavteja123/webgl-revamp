# CONTENT INVENTORY — FROZEN CONTRACT

> **This is the source of truth for all copy.** Reuse every string byte-for-byte in the WebGL
> revamp. Do not paraphrase, shorten, or "improve." Large data arrays (connectors, blog bodies,
> SDK code) are referenced to their source files to avoid transcription drift — copy those files
> verbatim rather than retyping. Source app root: repo root (`../` from this folder).

## Brand & tokens
- **Name / wordmark:** `better` (obsidian/white) + `switch` (accent). Font: Outfit, weight 600.
- **Tagline pill:** `Payment Systems as a Service`
- **Accent:** `#e27533` (hover `#F28C38`). Canvas `#FAFAFA`. Obsidian `#111111`. Green `#22c55e`.
- **Fonts:** Figtree (sans/display), Outfit (wordmark), JetBrains Mono (mono).
- **Calendly CTA:** `https://calendly.com/biz-betterswitch/30min`
- **Meta title:** `BetterSwitch | Payment Systems as a Service`
- **Meta description:** `BetterSwitch - Payment Systems as a Service. Launch a PCI-compliant payment Orchestrator, Merchant of Record, Facilitator, or Gateway in a day. 200+ connectors.`
- Source: `lib/constants.ts`, `tailwind.config.js`, `index.html`.

## Navigation (`lib/constants.ts`)
- **navLinks:** Platform `/#platform` · Solutions `/#solutions` · Pricing `/#pricing` · Customers `/#customers` · Connectors `/connectors` · Blog `/blog`
- **Header nav:** Platform (dropdown: Overview, Solutions, Connectors) · Pricing · Customers · Company (dropdown: Blog, Careers, About)
- **Platform dropdown descriptions:** Overview → "Our core payment orchestrator architecture" · Solutions → "Orchestrator, Gateway, Facilitator & MOR" · Connectors → "Explore 200+ global payment integrations"
- **Company dropdown descriptions:** Blog → "Thought leadership and updates" · Careers → "Join our infrastructure team" · About → "Our mission and story"
- **Header CTA button:** `Contact Us`
- **partnerLogos:** dodopayments (dodopayments.com) · VAULTERA (vaultera.co) · PesaSwap (pesaswap.com) · paycode (paycode.com) — rendered as `dodo payments`, `VAULTERA`, `PesaSwap`, `paycode`.

## Hero (`components/Hero.tsx`)
- **Pill:** `Payment Systems as a Service`
- **Headline (3 lines):** `Launch Your` / `Payment Company` / `in a Day` (last line accent gradient)
- **Subhead:** `White-label platform with 200+ payment connectors. Deploy a PCI-compliant Orchestrator, Merchant of Record, Facilitator, or Gateway on your own infrastructure.`
- **Buttons:** `Schedule a Demo` (→ Calendly) · `Explore Solutions` (→ #solutions)
- **Stat cards:** `200+` / `Payment Connectors` — `24 Hours` / `Deployment Time` — `PCI` / `Level 1 Certified`
- **HUD left widget:** `LIVE TELEMETRY` · `Transactions Settle` · animated count (starts `1,482,829`) · `SLA STATUS` · `100.0% RUNNING`
- **HUD right widget:** `ORCHESTRATOR NODE` · `**** **** **** 2026` · `ACTIVE ROUTE: ADYEN -> STRIPE` · `betterswitch v1.0` · `99.98% SLA`
- **Simulator toolbar:** `betterswitch-sandbox-v1.0.4` · toggle `Simulate Failure & Failover`
- **Simulator nodes:** Checkout · BetterSwitch (Router) · Stripe `1.5% Fee` · Adyen `1.2% Fee` · Mollie `1.4% Fee`
- **Simulator log lines (verbatim, order matters):**
  - `System initialized. Orchestrator listening on port 443.`
  - `Connectors synced: 200+ global gateways operational.`
  - `Transaction initiated: Checkout payload received ($84.00 USD).`
  - `Evaluating smart routing rule: [Lowest Cost Route].`
  - `Candidates: Adyen (1.2%), Mollie (1.4%), Stripe (1.5%).`
  - `Adyen selected (lowest cost: 1.2% fee). Dispatching transaction...`
  - `Adyen gateway returned 500: Internal Server Error.`
  - `FAILOVER ACTIVE: Initiating smart retry logic.`
  - `Secondary candidate chosen: Stripe (1.5% fee). Routing...`
  - `Adyen response: 200 OK. Transaction settled successfully.`
  - `Stripe response: 200 OK. Failover route completed successfully.`
  - Controls label: `Simulator Controls` · `Click process to test smart cost-based failover routing.` · button `Process Transaction` / `Routing...`
  - Audit panel: `REAL-TIME AUDIT LOGS` · `Processing packet stream...` · `SYSTEM HEALTH` · `PCI LEVEL 1 DEPLOYED`
  - Caption: `Interactive Payment Orchestrator & Auto-Failover Sandbox`

## Logos (`components/Logos.tsx`)
- Eyebrow: `Trusted by`. Logos: dodo payments · VAULTERA · PesaSwap · paycode.

## Solutions (`components/Solutions.tsx`)
- **Heading:** `One Platform,` / `Four System Types.`
- **Sub:** `Choose the payment system that fits your business model. Each one is fully white-labelled, PCI-compliant, and live in a day.`
- **Tab 1 — Orchestrator / "Payment Orchestrator":** `Route transactions across 200+ processors with smart routing, automatic failover, and cost optimization. One integration for your customers, every processor for you.` · Features: Smart routing engine · 200+ processor connectors · Automatic failover and retries · Cost-based optimization
- **Tab 2 — Merchant of Record:** `You handle payments on behalf of your merchants. You own the compliance, tax, refunds, and disputes. Your sellers just sell.` · Features: Merchant onboarding · Tax and compliance handling · Refund and dispute management · Seller payouts
- **Tab 3 — Facilitator / "Payment Facilitator":** `Sub-merchant management, split payments, and regulatory compliance for marketplaces and platforms. KYC/KYB, payouts, and onboarding included.` · Features: Sub-merchant management · Split payments · KYC/KYB workflows · Regulatory compliance
- **Tab 4 — Gateway / "Payment Gateway":** `Direct processor connectivity with tokenization, 3DS authentication, and PCI scope reduction. Checkout to settlement, nothing in between.` · Features: Direct processor APIs · Tokenization and vaulting · 3DS authentication · PCI DSS Level 1
- Diagram labels (keep): Orchestrator processors = Stripe/Adyen/PayPal/Klarna; MOR = Buyers pay you / You pay sellers / "Tax, Refunds, Disputes, Compliance: All Handled" / "PCI DSS Level 1 Certified"; Facilitator split = Merchant $70 / Platform Fee $20 / Tax Reserve $10 / "KYC/KYB Verified · Sub-merchant Onboarding"; Gateway flow = Merchant → Your Gateway (Tokenize + 3DS, PCI Level 1) → Processor → Card Network → Issuing Bank, "You own this", capability tiles (Tokenization, Card Vaulting, 3DS Auth, PCI Scope Reduction, Automatic Retries, Multi-processor).

## Features (`components/Features.tsx`)
- **Heading:** `Everything You Need` / `to Run a Payment Company.`
- **Sub:** `200+ connectors, PCI compliance, dashboards, storefronts, and plugins. Everything ships on day one.`
- **Card 1 — Smart Routing:** `Route every transaction through the optimal processor. Automatic failover, retries, and cost-based optimization across 200+ connectors.` (badge: `Any Processor`)
- **Card 2 — PCI Compliance:** `PCI DSS Level 1 certified from day one. Audit-ready documentation included.` (chip: `PCI DSS Level 1` / `Certified`)
- **Card 3 — Multi-cloud Deployments:** `Deploy on AWS, GCP, Azure, or your preferred cloud provider in hours with our Terraform scripts.`
- **Card 4 — Whitelabelling:** `Complete whitelabelling to match your brand. Click below to test live themes.` (theme swatches: orange/purple/emerald/indigo)
- **Card 5 — E-commerce Plugins:** `Connect your e-commerce store to your payment system out of the box.`
- Sub-widgets keep their data: `ConnectorScroller`, `CloudCarousel`, `ShopShuffle` (copy those components' item lists verbatim).

## Dashboard (`components/Dashboard.tsx`)
- **Heading:** `Beyond the checkout.`
- **Body:** `Custom dashboards built for greater observability, advanced features, and versatile product offerings.` / `From storefronts to payment links - we build the products you need for your business.`
- **Feature chips:** `Storefront & Payment Links` · `Wallets & Subscriptions`
- **View switch:** `Dashboard Observation` · `Developer API Playground`
- **Dashboard SVG copy:** `Greetings, John` · `Monitoring your payment performance in real-time.` · nav (Dashboard, Transactions, Payment Links, Storefront, Wallet, Subscriptions) · `Search transactions...` · John Doe / Admin · Cards: TOTAL REVENUE `$124,500.00` `+12.4%` · SUCCESS RATE `99.8%` `+5.2%` · REFUND RATE `0.45%` `Stable` · AVG TICKET `$45.20` `-2.1%` · Volume Analysis (`$84,320.00` / `$72,110.00`) · Method Split (`$10.2M` GROSS SALES, Cards 65% / Wallets 25% / Transfers 10%).
- **SDK playground:** language tabs curl / node.js / python / go. **Copy the four code snippets + the response JSON verbatim from `components/Dashboard.tsx`** (`sdkCodeSnippets`, `sdkResponseJSON`). Terminal labels: `SDK CLIENT CALL`, `Response Output`, `Run API Request` / `Running API call...`, `STATUS: 200 OK / IDLE`, `LATENCY: 142ms`.

## Testimonials (`components/Testimonials.tsx`)
- **Quote 1** — Ayush Agarwal, CPTO, Dodo Payments (`/ayush_dodo.jpeg`): `Anchored upon core principles of tech-stack, BetterSwitch payment infrastructure enabled us to run on a unified platform.` · stats: Unified/Platform, Scalable/Tech Stack, Seamless/Integration
- **Quote 2** — Chris Munyasya, Founder, Pesaswap East Africa Limited (`/Chris_PS.jpg`): `They delivered a production-ready connector implementation within days which boosted us with a surge in TPS and ensured 99.9% uptime.` · stats: Days/To Production, High/TPS Surge, 99.9%/Uptime
- **Quote 3** — Steinar Atli Skarphéðinsson, CoFounder, Vaultera (`/Steinar_vaultera.jpg`): `Quite excited with their customised payment solution. Our customers loved BetterSwitch's user-friendly payment experience.` · stats: Custom/Solution, Loved/User Experience, Easy/Integration

## Pricing (`components/Pricing.tsx`)
- **Heading:** `Transparent Pricing` · **Sub:** `One-time setup, volume-based transaction pricing thereafter. No hidden fees.`
- **Card:** eyebrow `Setup + Transaction Tier` · `One-time setup` = `Custom` ("Based on system type") · `Per transaction` = `Volume-based` ("Scales with your growth") · `Everything included`.
- **Included features list (verbatim, order):** 200+ payment connectors · PCI DSS Level 1 compliance · White-label dashboards · Smart routing engine · Multi-cloud deployment · E-commerce plugins · KYC/KYB workflows · Dedicated engineering support.
- **Button:** `Book a Demo`

## CTA (`components/CTA.tsx`)
- **Heading:** `Ready to Launch?`
- **Body:** `Tell us what you need. We scope your system type, configure your connectors, and deploy to your cloud. You go live.`
- **Button:** `Book a Demo`

## Footer (`components/Footer.tsx`)
- Wordmark + footerLinks (= navLinks). Socials: Twitter `twitter.com/betterswitch`, LinkedIn `linkedin.com/company/betterswitch`.
- Bottom: `© 2026 betterswitch` · About · Privacy (`betterswitch.io/privacy`) · Terms (`betterswitch.io/terms`) · `All systems operational`.

## Connectors page (`pages/Connectors.tsx`)
- **Heading:** `200+ Payment Connectors` · **Sub:** `Processors, wallets, banks, BNPL, fraud tools, and card networks. Global coverage, one integration.`
- **Categories:** All, Processor, Wallet, Bank Transfer, BNPL, Fraud & Risk, 3DS, Card Network.
- **Regions:** All Regions, Global, North America, Europe, Asia Pacific, Latin America, Middle East & Africa.
- **135-connector dataset:** copy the `connectors` array from `pages/Connectors.tsx` verbatim (name, logo file, category, regions). Logos live in `/public/connectors/*.svg`.
- **Search placeholder:** `Search connectors...`
- **Bottom CTA:** `Need a connector not listed here?` / `We integrate custom local processors and third-party APIs within one week, at zero extra cost.` / button `Request Custom Integration`.
- **Request modal:** `Request Custom Connector` · fields `Connector / PSP Name` (placeholder `e.g. M-Pesa, PayFast, custom bank gateway...`), `Your Corporate Email` (`you@company.com`), `Implementation Notes (Optional)` (`Preferred regions, sandbox API details, timeline requirements...`) · buttons Cancel / `Submit Request` / `Submitting...` · success alert `Request received! We will coordinate the implementation of {name} with you shortly.`

## About page (`pages/About.tsx`)
- Eyebrow `About`. **H1:** `Building the infrastructure layer for payment companies`
- **Body:** `BetterSwitch is Payment Systems as a Service (PSaaS). We help fintechs, platforms, and enterprises launch PCI-compliant payment orchestrators, merchant-of-record systems, facilitators, and gateways on their own infrastructure — in days, not years.`
- Image `/about_payment_network.png`. Cards: `200+ Connectors` / "Global processor, wallet, and bank coverage out of the box." · `Own Your Stack` / "Deploy on AWS, GCP, or Azure with full white-label control." · `PCI Compliant` / "Level 1 certified infrastructure from day one." · CTA `Talk to our team`.

## Careers page (`pages/Careers.tsx`)
- Eyebrow `Careers`. **H1:** `Join us in reshaping global payments`
- **Body:** `We are building the platform that powers the next generation of payment companies. If you are passionate about fintech infrastructure, we would love to hear from you.`
- Image `/careers_team.png`. Panel: `No open roles right now` / `We are not actively hiring for specific positions, but we are always interested in meeting exceptional engineers and product builders.` / `Send your resume to biz@betterswitch.io` (mailto biz@betterswitch.io).

## Blog & BlogPost (`pages/Blog.tsx`, `pages/BlogPost.tsx`, `blogs/*.tsx`)
- Two articles: `agentic-commerce-reckoning`, `cbdc-catalyst`. **Copy `blogs/agentic-commerce-reckoning.tsx`, `blogs/cbdc-catalyst.tsx`, `blogs/types.ts`, and the Blog/BlogPost page shells verbatim** — bodies are long-form; do not retype, copy the files.
- Blog images: `/public/blog_agentic_commerce.png`, `/public/blog_cbdc_catalyst.png`.

## Public assets to carry over (`/public`)
- Testimonial portraits: `ayush_dodo.jpeg`, `Chris_PS.jpg`, `Steinar_vaultera.jpg`.
- Page images: `about_payment_network.png`, `careers_team.png`, `blog_agentic_commerce.png`, `blog_cbdc_catalyst.png`.
- `/public/connectors/*.svg` (all 135 connector logos). `favicon.ico`, `og.png` (referenced from betterswitch.io).
