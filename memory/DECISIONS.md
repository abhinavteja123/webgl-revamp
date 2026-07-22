# ARCHITECTURE DECISIONS

Format: decision · status · rationale. Update when a leaning becomes final.

---

### D1 — New app lives in `webgl-revamp/`, self-contained
**Status:** decided. Copy content/tokens/assets from the parent app rather than importing across
folders. Keeps the original app untouched and the revamp independently buildable/deployable.

### D2 — Stack: Vite + React 19 + TS + Tailwind + R3F + GSAP + anime.js + Lenis
**Status:** decided (see PLAN §1). Reuses the existing build/framework; adds the 3D + motion layer.

### D3 — Single shared R3F canvas via drei `View` portals
**Status:** leaning (finalize in Phase 1). One WebGL context for the whole page; each section
renders into a portal. Avoids N contexts (browser caps ~8–16) and cuts memory. Fallback: if
`View` choreography fights ScrollTrigger, drop to a small number of per-section canvases.

### D4 — Fallback-first build order
**Status:** decided. Build the DOM/CSS version of each section FIRST (it already exists in the
parent app), then layer the 3D moment on top behind `useReducedMotion`/`useDeviceTier`. Guarantees
a shippable site at every step and satisfies the a11y/perf constraint.

### D5 — anime.js v3
**Status:** leaning. v3 stagger/timeline API is stable and matches the planned effects; revisit if
a section needs a v4-only feature.

### D6 — Keep motion/framer for DOM state, GSAP for scroll, R3F for space
**Status:** decided (see PLAN §1 rule-of-thumb). Prevents overlap/thrash between motion systems.

### D7 — Content is frozen
**Status:** decided. `memory/CONTENT-INVENTORY.md` is read-only for build agents; reviewers diff
rendered copy against it. No copy changes without an explicit user instruction.
