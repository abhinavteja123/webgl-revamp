# HANDOFF — BetterSwitch WebGL Revamp

Living state doc. Read this + `memory/CONTENT-INVENTORY.md` before any work. Update on every finish.

## Current status: Immersive shell + Hero DONE & browser-verified. Rebuilding remaining sections.

Direction = **Immersive Spatial 3D** (dark cinematic, glass panels, spatial depth). Same FROZEN copy
(`memory/CONTENT-INVENTORY.md`). Full per-section spec in `REDESIGN-PLAN.md`.

### ✅ Done & verified (screenshot-confirmed in browser, 2026-07-20)
- `src/components/immersive/ImmersiveLayout.tsx` — dark shell: floating glass nav dock, film grain,
  vignette, left scroll-progress spine. Forces dark. Wraps the home.
- `src/components/immersive/GlassPanel.tsx` — reusable glass surface (blur + inset ring + tinted shadow).
- `src/components/immersive/HeroScene01.tsx` — NEW Hero: oversized off-grid headline, floating glass
  stat chips, docked glass audit terminal, live 3D routing net (`src/three/HeroScene.tsx`) behind. Looks great.
- `src/pages/Home.tsx` — wraps everything in `<ImmersiveLayout>`, Hero on top, old sections below, `<Footer/>`.
- `npm run build` GREEN. Dev server: `npm run dev --prefix "<webgl-revamp>"` → http://localhost:3008/.

### ⚠️ Known issues to fix
- **Logos ("Trusted by") nearly invisible** — logo sub-components in `src/components/Logos.tsx` use
  `text-gray-400 dark:text-white/40`; on the `#0B0B0B` stage bump to `dark:text-white/70`+ so they read.
- Minor faint text in a couple of dark sections — check contrast when rebuilding.

### ▶️ NEXT SECTION — start here
Sections below the Hero still render the OLD stacked-card layouts (dark via `dark:` variants). Rebuild
them into immersive scenes, in this order (highest impact first): **Solutions → Features → Pricing →
Testimonials → Dashboard → CTA → Logos(+contrast fix)**. Then pages (Connectors/About/Careers/Blog).

**Pattern to copy (proven on Hero):** for section X, build `src/components/immersive/sections/XScene.tsx`
= dark section using `GlassPanel` for surfaces, oversized Outfit type, spatial/asymmetric layout (NOT a
centered card row), optional self-contained lazy `<Canvas>` gated by `useSceneEnabled()` for a 3D accent.
Reuse the existing `src/three/XScene.tsx` 3D files as backdrops where they exist. Copy every string
verbatim from `memory/CONTENT-INVENTORY.md`. Swap the old `<X/>` import in `Home.tsx` for the new scene.
Keep reduced-motion/low-tier fallback (gate returns false → no 3D, dark DOM still readable).

**Verify loop (works):** the `claude-in-chrome` extension is NOT connected, but the **ecc chrome-devtools
MCP works** — `mcp__plugin_ecc_chrome-devtools__new_page` / `navigate_page` / `take_screenshot(fullPage)`
against http://localhost:3008/, then Read the saved PNG. Screenshot after each section.

**Per section:** build scene → swap in Home.tsx → `npm run build` green → screenshot-verify → tick tracker
below + append `memory/BUILD-LOG.md`.

### ⚙️ Constraints for next session
- Cost hit **~$392** this session; context filled ~44%. Do this in a FRESH session, section by section.
- GateGuard blocks the FIRST Edit/Write/Bash — restate facts (importer, no schema, user instruction) + retry.
- Delegation was unreliable (agents dropped connections / hit usage limits) — main-thread builds were reliable.

## Redesign tracker (per REDESIGN-PLAN.md — NEW layouts)
| Section | New layout (REDESIGN §) | Built | Fallback | Build green |
|---|---|---|---|---|
| Global shell (floating dock + progress spine + grain) | 1 | ✅ | ✅ | ✅ |
| Hero (scene 01) | 2 | ✅ | ✅ | ✅ |
| Logos (scene 02) | 3 | ☐ | ☐ | ☐ |
| Solutions (scene 03) | 4 | ☐ | ☐ | ☐ |
| Features (scene 04) | 5 | ☐ | ☐ | ☐ |
| Dashboard (scene 05) | 6 | ☐ | ☐ | ☐ |
| Testimonials (scene 06) | 7 | ☐ | ☐ | ☐ |
| Pricing (scene 07) | 8 | ☐ | ☐ | ☐ |
| CTA (scene 08) | 9 | ☐ | ☐ | ☐ |
| Footer | 10 | ☐ | ☐ | ☐ |
| Pages (Connectors/About/Careers/Blog) | 11 | ☐ | ☐ | ☐ |

**Loop protocol:** each iteration builds ONE section's new layout against frozen copy, adds
reduced-motion fallback, runs `npm run build` green, ticks this table + appends BUILD-LOG.

### Done
- Read + inventoried the entire existing app (home sections, all pages, tokens, assets).
- Wrote `PLAN.md` (master creative + technical plan, section concepts, stack, orchestration, roadmap).
- Wrote `memory/CONTENT-INVENTORY.md` (frozen copy contract — source of truth for all text).
- Wrote memory logs (`BUILD-LOG.md`, `DECISIONS.md`).

### Next up: Phase 1 — Foundation (NOT started, awaiting go-ahead to build)
1. Scaffold Vite + React 19 + TS app inside `webgl-revamp/`.
2. Install deps: `three @react-three/fiber @react-three/drei @react-three/postprocessing troika-three-text gsap animejs lenis maath motion lucide-react` + tailwind toolchain.
3. Copy design tokens: `tailwind.config.js`, `styles/index.css`, `styles/animations.css`, fonts, `focus-ring`.
4. Copy `context/ThemeContext.tsx` and wire dark/light.
5. Build providers: Lenis + GSAP ScrollTrigger + a single R3F `SceneManager`.
6. Build gates: `useReducedMotion()`, `useDeviceTier()` → DOM fallback path FIRST.
7. Port `App.tsx` routing shell + `PageLayout`.
8. Copy `/public` assets (portraits, page images, all `/public/connectors/*.svg`).

### Open decisions (see DECISIONS.md)
- Shared single R3F canvas (drei `View` portals) vs. per-section canvases. **Leaning: shared.**
- anime.js v3 vs v4 API. **Leaning: v3** (stable, well-documented staggers).
- Whether `webgl-revamp` copies content files or imports from `../`. **Leaning: copy** (self-contained, no coupling).

### Blockers
- None. Awaiting user green-light to begin Phase 1 build (build is multi-day, subagent-driven).

## Section build tracker (Phase 3+)
| Section | Concept (PLAN §) | Built | Fallback | Reviewed | Build green | Logged |
|---|---|---|---|---|---|---|
| Curtain | 2.1 | ☐ | ☐ | ☐ | ☐ | ☐ |
| Hero | 2.2 | ☐ | ☐ | ☐ | ☐ | ☐ |
| Logos | 2.3 | ☐ | ☐ | ☐ | ☐ | ☐ |
| Solutions | 2.4 | ☐ | ☐ | ☐ | ☐ | ☐ |
| Features | 2.5 | ☐ | ☐ | ☐ | ☐ | ☐ |
| Dashboard | 2.6 | ☐ | ☐ | ☐ | ☐ | ☐ |
| Testimonials | 2.7 | ☐ | ☐ | ☐ | ☐ | ☐ |
| Pricing | 2.8 | ☐ | ☐ | ☐ | ☐ | ☐ |
| CTA | 2.9 | ☐ | ☐ | ☐ | ☐ | ☐ |
| Header/Footer | 2.10 | ☐ | ☐ | ☐ | ☐ | ☐ |
| Connectors page | 2.11 | ☐ | ☐ | ☐ | ☐ | ☐ |
| About/Careers | 2.12 | ☐ | ☐ | ☐ | ☐ | ☐ |
| Blog/BlogPost | 2.13 | ☐ | ☐ | ☐ | ☐ | ☐ |
