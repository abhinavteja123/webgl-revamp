# BUILD LOG (append-only)

Every meaningful action / agent run gets one entry: date · actor · what · result · next.

---

- **2026-07-20 · main thread · Phase 0** — Read entire existing BetterSwitch app: home sections
  (Hero+RoutingSimulator, Logos, Solutions 4-tab, Features bento, Dashboard+SDK playground,
  Testimonials, Pricing, CTA), pages (Connectors 135-item, About, Careers, Blog, BlogPost),
  tokens (`tailwind.config.js`, `lib/constants.ts`), `index.html`. Result: full content
  inventory captured. Next: write plan + contract + handoff.
- **2026-07-20 · main thread · Phase 0** — Wrote `PLAN.md`, `memory/CONTENT-INVENTORY.md`,
  `HANDOFF.md`, `memory/DECISIONS.md`. Result: planning scaffold complete; new app not yet
  scaffolded. Next: Phase 1 foundation on user go-ahead.
- **2026-07-20 · main thread · Phase 1** — Scaffolded `webgl-revamp/` Vite+React19+TS app:
  package.json (three/@react-three/fiber+drei+postprocessing, gsap, animejs, lenis, maath,
  troika, motion, lucide), vite/ts/postcss/tailwind configs, index.html (Figtree/Outfit/JBMono),
  main.tsx, App.tsx (routing shell), styles/index.css, lib/constants.ts (verbatim), ThemeContext,
  SmoothScrollProvider (Lenis+GSAP ScrollTrigger), three/SceneManager (shared Canvas + drei View,
  `useSceneEnabled` gate), hooks/useReducedMotion + useDeviceTier, pages/Home shell. `npm install`
  OK (exit 0). `npm run build` GREEN (tsc + vite, 52 modules). Copied `/public` → `webgl-revamp/public`.
  Result: runnable foundation, fallback-first gates in place. Next: section ports.
- **2026-07-20 · main thread · Phase 3 kickoff** — Dispatched 2 background subagents (disjoint scopes):
  (A) home content sections (Logos, Solutions, Features + sub-widgets, Dashboard, Testimonials,
  Pricing, CTA, Reveal, useCarousel, types); (B) chrome + Hero (Header, Footer, PageLayout, Logo,
  useDropdown, Hero incl. RoutingSimulator, animations.css). Both VERBATIM ports, no 3D yet, no build
  (main thread integrates). Next: integrate into Home.tsx + App routes, build, then layer 3D per section.
- **2026-07-20 · react-build-resolver · build verification pass** — Ran `npm run build`
  (`tsc --noEmit && vite build`) in `webgl-revamp/`. Passed clean on first run: 0 TS errors,
  vite build succeeded (2162 modules, exit 0). No fixes needed, no files changed. Result:
  **Build Status: GREEN**. Next: continue Phase 3 (3D layering per section).
- **2026-07-20 · main thread · Phase 3 §2.7 Testimonials 3D** — Added obsidian starfield behind
  the Testimonials carousel. New self-contained `src/three/TestimonialsScene.tsx`: own transparent
  `<Canvas>` (NOT shared View/Port), `position:absolute inset-0` + pointer-events-none, two additive
  drei `<Points>`/`<PointMaterial>` layers (white + faint `#e27533` accent glow) drifting slowly with
  depth via sizeAttenuation. Positions generated inline (uniform-in-sphere; maath left as upgrade path).
  Wired into `src/components/Testimonials.tsx`: `React.lazy` + `<Suspense fallback={null}>`, rendered
  only when `useSceneEnabled()` (else existing DOM dot-pattern/blur fallback). All copy/quotes/stats/
  carousel logic untouched. `npx tsc --noEmit` 0 errors; `npm run build` exit 0 (TestimonialsScene
  code-split into its own 4.38 kB lazy chunk). Result: **GREEN**. Next: remaining Phase 3 sections.
- **2026-07-20 · main thread · Phase 3 · Hero 3D (flagship)** — Added the first real WebGL layer.
  New file `src/three/HeroScene.tsx`: self-contained `<Canvas>` (absolute, `inset-0`, `z-0`,
  `pointer-events-none`) rendering a 3D payment-routing network — 26 instanced accent (#e27533)
  nodes drifting on sine paths, edge lines rebuilt each frame from live node positions, a bright
  packet flying edge→edge, `@react-three/postprocessing` Bloom, GSAP soft entrance (group scale +
  wrapper fade), theme-reactive via `useTheme` (brighter/warmer in dark, subtler in light).
  Changed `src/components/Hero.tsx`: `React.lazy(() => import('../three/HeroScene'))` +
  `<Suspense fallback={null}>`, mounted ONLY when `useSceneEnabled()` is true, inserted right after
  `InteractiveConstellation`. No copy/DOM/simulator/HUD touched. HeroScene code-split into its own
  lazy chunk (never blocks first paint). `npx tsc --noEmit` = 0 errors; `npm run build` = exit 0.
  Result: **Build Status: GREEN**. Next: replicate the gate→lazy→self-contained-canvas pattern to
  other sections (Logos, Solutions, ...).
- **2026-07-20 · main thread · Phase 4 · Connectors galaxy hero** — Added the Connectors-page 3D
  showcase. New file `src/three/ConnectorsGalaxy.tsx`: self-contained `<Canvas>` in its own bounded,
  pointer-events-enabled panel (dark space gradient, rounded, `mb-8`) that sits ABOVE the page heading.
  Renders a slow-rotating "galaxy" — a dense accent (#e27533) Fibonacci-sphere point shell (720 nodes)
  + 64 brighter theme-tinted "hub" points, both additive-blended for glow; drei `OrbitControls`
  (autoRotate + drag-to-rotate, zoom/pan disabled). Fibonacci sphere hand-rolled (no maath import) for
  even distribution + zero import risk; decorative only — does NOT read the `connectors` array. Theme-
  reactive hub tint via `useTheme`. Changed `src/pages/Connectors.tsx`: `lazy(() => import(...))` +
  `<Suspense fallback={null}>`, mounted ONLY when `useSceneEnabled()` is true, inserted as first child
  above the `{/* Page header */}` block. Filter/search/modal/grid logic + all copy + the 135-item
  `connectors` array untouched. Galaxy code-split into its own lazy chunk (17.2 kB, never blocks first
  paint). `npx tsc --noEmit` = 0 errors; `npm run build` = exit 0. Result: **Build Status: GREEN**.
  Next: About/Careers hero scenes, then Blog/BlogPost.
- **2026-07-20 · main thread · Phase 3 CTA (§2.9)** — Added the "launch beat" behind the CTA
  section. New `src/three/CTAScene.tsx`: self-contained transparent `<Canvas>` (NOT the shared
  SceneManager View/Port), absolute inset-0, `pointer-events-none`, behind content. ~150 accent
  (#e27533) transaction dots stream upward via a `ShaderMaterial` (soft round points), converging
  toward center as they rise → a narrowing trail; per-particle bottom/top fade. Theme-aware opacity
  (dark 0.9 / light 0.5, NormalBlending so it stays visible on white and never harms heading/button
  readability). Optional gentle GSAP ScrollTrigger tie-in ramps intensity as the section enters
  (floored so it never fully disappears). `src/components/CTA.tsx`: `React.lazy` + `<Suspense
  fallback={null}>`, mounted ONLY when `useSceneEnabled()` is true; existing radial-glow backgrounds,
  Tailwind/dark classes, and all copy untouched. Code-split into its own lazy chunk (~3 kB). `npx tsc
  --noEmit` = 0 errors; `npm run build` = exit 0. Result: **Build Status: GREEN**. Next: About/Careers
  hero scenes, then Blog/BlogPost.
- **2026-07-20 · main thread · Phase 3 §2.4 Solutions 3D** — Added a subtle central 3D accent that
  morphs with the active tab, behind the existing 4-tab Solutions card. New self-contained
  `src/three/SolutionsScene.tsx`: own transparent `<Canvas>` (NOT shared View/Port), wrapper
  `absolute inset-0 -z-10 pointer-events-none` + `aria-hidden` (negative z paints behind the in-flow
  card/copy but above the section bg — no content markup reordered). Accepts an `activeTab` prop and
  cross-fades four accent-`#e27533` reps by weight+opacity in a single `useFrame` via
  `THREE.MathUtils.damp` (frame-rate independent; no gsap needed): 0 Orchestrator = routing hub +
  branching beam lines, 1 MOR = nested wireframe vault cubes, 2 Facilitator = 3-stream splitting
  particle fountain (animated Points), 3 Gateway = tokenization tunnel (rings receding in depth).
  Theme-aware opacity (dark 0.8 / light 0.5, NormalBlending — skipped bloom/postprocessing since
  additive glow washes out on the `#FAFAFA` light bg; it's a subtle accent). `useTheme` read outside
  the Canvas and passed as props (context boundary). `src/components/Solutions.tsx`: `React.lazy` +
  `<Suspense fallback={null}>`, mounted ONLY when `useSceneEnabled()` is true (else the existing
  per-tab SVG diagrams are the fallback); all copy, feature bullets, tab logic, and SVGs untouched.
  Code-split into its own 3.77 kB lazy chunk. `npx tsc --noEmit` = 0 errors; `npm run build` = exit 0.
  Result: **Build Status: GREEN**. Next: About/Careers hero scenes, then Blog/BlogPost.
