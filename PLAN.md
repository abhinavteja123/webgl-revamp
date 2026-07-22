# BetterSwitch → WebGL / 3D Immersive Revamp — Master Plan

> **Goal:** Re-present the existing BetterSwitch (Payment Systems as a Service) site as a
> fully interactive, business-grade 3D/WebGL experience. Every section gets ONE unique,
> signature interactive moment tied to its payment-business meaning. **All copy stays
> byte-for-byte identical** — we change the *presentation*, never the words.
>
> **Location:** self-contained new app in `webgl-revamp/` (sibling scaffold inside the repo).
> The current app is untouched and stays as the content source of truth.

---

## 0. Hard constraints (non-negotiable)

1. **Content is frozen.** Every headline, paragraph, stat, code snippet, testimonial,
   connector name, nav label, and CTA string is reused verbatim from
   [`memory/CONTENT-INVENTORY.md`](memory/CONTENT-INVENTORY.md). That file is the contract.
   No paraphrasing, no "improving" copy, no new marketing lines.
2. **Professional, not a tech demo.** 3D serves the story (routing, orchestration, money
   movement). No gratuitous spinning cubes. If an effect doesn't make the payment concept
   clearer or more premium, cut it.
3. **Graceful degradation is mandatory** (this is a fintech site, not an art project):
   - `prefers-reduced-motion` → static/DOM version, no autoplay motion.
   - Mobile / low-power / no-WebGL → DOM+CSS fallback that still looks finished.
   - 3D scenes lazy-load per section; never block first paint.
4. **Keep what already works.** Dark/light theme (`ThemeContext`), routing, SEO/meta,
   accessibility (focus rings, aria, skip link), Calendly CTA, Google Analytics.

---

## 1. Target stack

| Concern | Choice | Why |
|---|---|---|
| Build / framework | **Vite + React 19 + TypeScript** | Reuse current setup; zero migration cost |
| Styling / tokens | **Tailwind 3** (copy `tailwind.config.js` tokens) | Keep exact palette (`accent #e27533`), fonts (Figtree/Outfit/JetBrains Mono) |
| 3D / WebGL | **three.js + @react-three/fiber + @react-three/drei** | Declarative R3F fits React; drei gives `Float`, `Environment`, instancing, text |
| Post FX | **@react-three/postprocessing** (Bloom, DoF) | The glow/neon look the current SVGs fake in 2D, done for real |
| 3D text | **troika-three-text** | Crisp extruded/SDF wordmarks for the curtain + hero |
| Scroll timeline | **GSAP + ScrollTrigger + Observer** | Section pinning, scrub reveals, morphs between states |
| Micro-motion | **anime.js v3** | Staggered list/letter reveals, magnetic buttons, counters |
| Smooth scroll | **lenis** | Buttery scroll that ScrollTrigger syncs to |
| Particle math | **maath** | Fibonacci spheres, curl noise for particle flows |
| DOM motion (kept) | **motion / framer-motion** | Already used; best for DOM state transitions (tabs, modals, carousels) |
| Icons (kept) | **lucide-react** | Already used everywhere |

**Rule of thumb for tool choice per effect:**
- Anything in 3D space, depth, lighting, particles → **R3F**.
- Scroll-driven choreography / pinning / scrub → **GSAP ScrollTrigger**.
- Small DOM flourishes (text stagger, count-up, magnetic hover) → **anime.js**.
- DOM component state (tabs, dropdowns, modals, carousels) → **keep motion/framer**.

---

## 2. Section-by-section creative concepts

Each concept lists: **the moment**, **the tech**, **the fallback**. Content pulled from the inventory.

### 2.1 Preloader / Curtain (`better` | `switch`)
- **Moment:** The two-panel curtain becomes a liquid-metal shader split. "better" / "switch"
  render as SDF 3D text that de-extrudes and drifts apart as the panels part on a GSAP timeline.
- **Tech:** R3F + troika-three-text + custom shader panel; GSAP master timeline gates the reveal.
- **Fallback:** current framer curtain (already good) — reduced-motion shows it instantly gone.

### 2.2 Hero — *"Launch Your Payment Company in a Day"*
- **Moment:** The existing 2D constellation becomes a **true 3D payment-routing network** —
  instanced glowing nodes + bloom edges in depth, a live transaction packet flying a route.
  The `RoutingSimulator` (Checkout → BetterSwitch → Adyen/Stripe/Mollie, failover toggle,
  audit log) is preserved but the graph is rendered in R3F with real glow. Floating HUD cards
  (LIVE TELEMETRY, ORCHESTRATOR NODE) get genuine parallax depth via drei `Float`. Headline
  words rise with GSAP SplitText; the tx counter counts up with anime.js.
- **Tech:** R3F instancing + postprocessing Bloom; GSAP entrance; anime.js counter.
- **Fallback:** current canvas constellation + SVG simulator (already ships) under reduced-motion.

### 2.3 Logos — *"Trusted by"*
- **Moment:** Partner logos (dodo payments, VAULTERA, PesaSwap, paycode) ride a **curved 3D
  conveyor ring** rotating slowly through depth fog; hover pulls one forward with anime.js.
- **Tech:** R3F billboards on a curve; anime.js hover.
- **Fallback:** current CSS marquee (keep exactly; already reduced-motion aware).

### 2.4 Solutions — 4 system types (Orchestrator / MOR / Facilitator / Gateway)
- **Moment:** One central 3D object **morphs** per tab to embody the business model:
  - Orchestrator → routing hub firing branching light beams to processors.
  - Merchant of Record → a sealed vault/ledger cube (you own the transaction).
  - Facilitator → a splitting particle fountain ($100 → $70/$20/$10).
  - Gateway → a tokenization tunnel (card → 3DS → issuing bank).
  The existing per-tab SVG flow diagrams graduate to 3D flow lines; tab copy + feature
  bullets unchanged.
- **Tech:** R3F object morph on tab change; GSAP transition; keep framer tab pill.
- **Fallback:** current SVG diagrams per tab.

### 2.5 Features — bento grid
- **Moment:** Each bento cell hosts a live mini-widget:
  - Smart Routing → 3D connector orbit around a core.
  - PCI Compliance → shield with a scanning-line shader + the existing "Certified" tick.
  - Multi-cloud → AWS/GCP/Azure faces on a slow-rotating cube (feeds the CloudCarousel data).
  - Whitelabelling → a real 3D card whose material recolors live from the existing
    orange/purple/emerald/indigo picker (wires straight into current state).
  - E-commerce Plugins → shuffling 3D storefront cards (upgrades ShopShuffle).
- **Tech:** small isolated R3F canvases (or one shared canvas w/ portals) per cell; anime.js.
- **Fallback:** current bento SVG/DOM widgets.

### 2.6 Dashboard — *"Beyond the checkout."*
- **Moment:** The big SVG analytics dashboard becomes a **floating glass panel array** you can
  subtly orbit (drei), charts drawing on scroll (GSAP). The SDK playground (curl/node/python/go
  + run → JSON response) stays DOM but gains a 3D "request packet" that flies code → API → response.
- **Tech:** R3F glass panels + GSAP scrub; keep DOM playground logic verbatim.
- **Fallback:** current SVG dashboard + DOM playground.

### 2.7 Testimonials
- **Moment:** Quotes become a **3D cover-flow / card stack** drifting in an obsidian starfield
  (WebGL points); author portraits on subtly lit planes; quote text reveals with anime.js.
  All 3 quotes + stats unchanged.
- **Tech:** R3F point starfield + card depth; keep carousel logic; anime.js text.
- **Fallback:** current framer carousel.

### 2.8 Pricing
- **Moment:** The single dark pricing card **assembles from particles**; the 8 included
  features check off in sequence (anime.js stagger). Copy/values unchanged (Custom setup,
  Volume-based, "Everything included" list, Book a Demo).
- **Tech:** GSAP/anime.js assemble; optional light R3F particle burst.
- **Fallback:** current static card.

### 2.9 CTA — *"Ready to Launch?"*
- **Moment:** A **launch beat** — transaction dots converge into a trail as the section pins;
  GSAP scrub tied to scroll. Ends on the existing "Book a Demo" button (magnetic via anime.js).
- **Tech:** GSAP ScrollTrigger pin + particle trail (R3F or canvas).
- **Fallback:** current centered CTA.

### 2.10 Header / Footer
- **Header:** animated logo mark, magnetic Contact button (anime.js), keep dropdowns/mobile/theme toggle.
- **Footer:** low ambient shader gradient behind the existing layout; "All systems operational" pulse kept.

### 2.11 Connectors page — showcase moment
- **Moment:** The 135 connectors become a **rotatable 3D galaxy/sphere** of instanced logo
  billboards. Category/region filters make non-matching logos fly out; search highlights hits.
  The "Request Custom Integration" modal + all data unchanged.
- **Tech:** R3F instanced billboards on a Fibonacci sphere (maath); GSAP filter transitions;
  keep filter/search/modal logic verbatim.
- **Fallback:** current responsive logo grid.

### 2.12 About / Careers
- **Moment:** Replace the static hero PNGs with a **live WebGL payment-network scene**;
  reveal cards on scroll. All copy + the "No open roles" / résumé mailto unchanged.
- **Fallback:** keep the existing PNGs.

### 2.13 Blog / BlogPost
- **Moment:** Keep articles verbatim (copy the two blog `.tsx` files as-is:
  `agentic-commerce-reckoning`, `cbdc-catalyst`). Add Lenis smooth scroll, a scroll-progress
  accent, and animated section headers. Content untouched.

---

## 3. Shared systems (build once, use everywhere)

- **`<SceneManager>`** — single R3F canvas strategy vs. per-section canvases (decide in Phase 1;
  default: one shared canvas with `View`/portals from drei to keep one WebGL context and save memory).
- **`useReducedMotion()` + `useDeviceTier()`** — gate every 3D scene; return DOM fallback.
- **`<Reveal>` / scroll orchestration** — GSAP ScrollTrigger + Lenis wired once in a provider.
- **Theme bridge** — read `ThemeContext`; feed accent/canvas colors into shader uniforms so 3D
  respects dark/light.
- **Design tokens** — copy `tailwind.config.js`, `styles/index.css`, `styles/animations.css`,
  fonts, and the `focus-ring` utility.

---

## 4. Subagent orchestration

**Model:** main thread = architect/integrator + memory keeper. Subagents do bounded, reviewable
units of work. Every subagent MUST (a) read `HANDOFF.md` + `memory/CONTENT-INVENTORY.md` first,
(b) touch only its assigned files, (c) append to `memory/BUILD-LOG.md` and update `HANDOFF.md`
on finish. Content contract is read-only for them.

| Phase | Agent(s) | Job |
|---|---|---|
| Direction | `frontend-design`, `ui-ux-pro-max` skills; `Explore` + firecrawl for trending WebGL refs | Lock visual language, motion grammar, references |
| Scaffold | `ecc:code-architect` / `Plan` | Vite app, providers, SceneManager, fallback hooks, token copy |
| Section build | `general-purpose` (one per section, sequential or small batches) | Build a section per §2 against the content contract |
| Build fixes | `ecc:react-build-resolver` | Green the build after each section |
| Review | `ecc:react-reviewer` + `ecc:typescript-reviewer` | Per-section correctness/hooks/types |
| Perf | `ecc:performance-optimizer` | Draw calls, bundle, lazy-load, 60fps budget |
| A11y | `ecc:a11y-architect` / `frontend-a11y` skill | Reduced-motion, focus, aria parity with DOM |
| Surgical edits | `caveman:cavecrew-builder` | 1–2 file mechanical tweaks |

**Efficiency rule:** one section = one agent task with a tight file scope. Don't re-explore the
codebase per agent — the content contract + this plan are the shared context.

---

## 5. Phased roadmap

- **Phase 0 — Inventory & scaffold docs** *(this turn)*: content contract, plan, handoff, memory. ✅
- **Phase 1 — Foundation**: new Vite app, deps, Tailwind tokens, Theme/Lenis/GSAP/R3F providers,
  `SceneManager`, `useReducedMotion`/`useDeviceTier`, routing shell, DOM fallbacks first.
- **Phase 2 — Design system + 3D primitives**: shared materials, bloom pipeline, reusable
  `Float`/instancing helpers, scroll-reveal wrapper, magnetic button, count-up.
- **Phase 3 — Home sections** (order): Curtain → Hero → Logos → Solutions → Features →
  Dashboard → Testimonials → Pricing → CTA. Each: build → build-fix → review → log/handoff.
- **Phase 4 — Pages**: Connectors galaxy → About/Careers → Blog/BlogPost (verbatim).
- **Phase 5 — Hardening**: perf pass, a11y pass, reduced-motion + mobile fallbacks verified,
  cross-browser, Lighthouse.
- **Phase 6 — QA & ship**: browser walkthrough of every section, visual polish, build, preview.

**Definition of done per section:** content matches contract exactly · 3D moment works ·
reduced-motion + mobile fallback works · reviewed · build green · logged in `BUILD-LOG.md` ·
`HANDOFF.md` updated.

---

## 6. Risks & mitigations

- **Perf blowup** (many WebGL contexts) → one shared canvas + drei `View` portals; lazy per section.
- **Content drift** → the contract file is the single source; reviewers diff against it.
- **Scope sprawl** → one signature moment per section, not five; fallback always exists.
- **Mobile jank** → device-tier gate drops to DOM on low power; test early, not at the end.
- **Theme mismatch** → shaders read theme uniforms from day one, not retrofitted.

---

## 7. Handoff & memory protocol

- `HANDOFF.md` — living state: what's done, what's next, open decisions, blockers. Update every phase/section.
- `memory/CONTENT-INVENTORY.md` — **frozen** content contract (source of truth for all copy).
- `memory/BUILD-LOG.md` — append-only log of every meaningful action/agent run.
- `memory/DECISIONS.md` — architecture decisions (shared canvas? which anime version? etc.).
- Every subagent reads HANDOFF + CONTENT-INVENTORY first and writes back to BUILD-LOG + HANDOFF last.
