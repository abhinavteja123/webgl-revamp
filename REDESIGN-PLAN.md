# REDESIGN PLAN — Completely New Layout (Immersive Spatial 3D)

> **Why this file exists:** the first pass cloned the original layout and put WebGL *behind* it.
> The user wants a **completely different layout and visual language** — same frozen content
> (`memory/CONTENT-INVENTORY.md`), radically new structure. This file is the per-section spec for
> that redesign. The `/loop` executes it one section at a time.

## Direction: Immersive Spatial 3D (professional, not gimmicky)
- **Canvas:** dark by default (`#0B0B0B`/obsidian), full-bleed, cinematic. Accent `#e27533`.
- **Motion:** vertical scroll drives depth/parallax + GSAP ScrollTrigger scene transitions. Real
  readability preserved — no disorienting free-fly. Lenis smooth scroll (already wired).
- **Type:** oversized display (Outfit), tabular numerals for stats, mono (JetBrains) for data/labels.
- **Surfaces:** true glassmorphism panels (1px inner border + inner shadow), tinted shadows, grain overlay.
- **Rule:** every section is a distinct *spatial scene*, NOT a stacked card block. Content floats on
  glass panels in 3D depth. Each section reads differently from the last.

## Hard rules (unchanged)
- Copy is FROZEN — reuse every string from `memory/CONTENT-INVENTORY.md` verbatim.
- Reduced-motion / low-tier / no-WebGL → a clean, still-premium **flat dark** fallback (not the old clone).
- Keep dark/light theme, SEO, a11y (focus, skip link, aria), Calendly CTA.

## New per-section layout (this is the departure — structure changes, not just background)

1. **Global shell** — replace the top nav bar with a minimal floating glass dock (logo left,
   condensed nav center, Contact right) that shrinks on scroll. Fixed grain + vignette overlay.
   A thin scroll-progress spine on the left edge with section ticks.

2. **Hero — scene 01** — full-viewport dark stage. Headline "Launch Your / Payment Company / in a Day"
   set MASSIVE, offset left, breaking the grid. To the right, a live 3D routing-globe (nodes = 200+
   connectors) slowly rotating. Stat trio (200+, 24 Hours, PCI) as floating glass chips at varied
   depths. The RoutingSimulator becomes a docked glass "terminal" panel lower-right, not a centered box.

3. **Logos — scene 02** — a thin horizontal band where partner logos ride a subtle 3D depth conveyor
   through fog; eyebrow "Trusted by" set vertical along the left margin.

4. **Solutions — scene 03** — replace the tab box with a horizontal "system selector" rail: 4 large
   numbered spatial cards (Orchestrator/MOR/Facilitator/Gateway) that come forward on hover/scroll;
   selecting one expands its features + 3D morph object into a full-width stage.

5. **Features — scene 04** — a true bento wall of unequal glass tiles at different z-depths (parallax),
   each holding its live widget (routing orbit, PCI shield, cloud cube, whitelabel recolor card,
   storefront shuffle). Asymmetric, not a 3-up row.

6. **Dashboard — scene 05** — "Beyond the checkout." as huge left type; the analytics dashboard on a
   tilted 3D glass slab you scrub as you scroll; the SDK playground slides in as a docked terminal.

7. **Testimonials — scene 06** — quotes as large glass cards drifting in a starfield, cover-flow depth;
   author + stats on the panel face. Big pull-quote typography.

8. **Pricing — scene 07** — a single monolithic glass "receipt" slab centered in space, the 8 included
   features etching in line by line; "Custom / Volume-based" as oversized figures.

9. **CTA — scene 08** — "Ready to Launch?" over a converging particle launch field; magnetic
   "Book a Demo" button. Section pins briefly for the beat.

10. **Footer** — low ambient shader horizon; wordmark huge; links as a sparse row. "All systems operational" pulse kept.

11. **Pages (Connectors / About / Careers / Blog)** — carry the same dark spatial shell: Connectors =
    the 3D logo galaxy as the primary hero with the filter grid as a glass panel below; About/Careers =
    spatial hero with the network scene; Blog = dark editorial reading view with scroll-progress.

## Execution loop (one section per iteration)
Order: shell → Hero → Solutions → Features → Dashboard → Testimonials → Pricing → CTA → Logos → Footer → pages.
Per iteration: build the NEW layout for one section against the frozen copy → reduced-motion fallback →
`npm run build` green → update `HANDOFF.md` tracker + `memory/BUILD-LOG.md`. Use the design skills
(`frontend-design`, `.agents/skills/high-end-visual-design`, `redesign-existing-projects`, `ui-ux-pro-max`).

## Reality note (2026-07-20)
Session/account usage limit was hit (resets ~12:50am Asia/Calcutta) and cost is high — so this redesign
runs incrementally via the loop, resuming after the reset, rather than one big fan-out. Progress is
durable on disk; `HANDOFF.md` tracks what's next.
