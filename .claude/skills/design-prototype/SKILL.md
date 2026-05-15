---
name: design-prototype
description: >
  Three-agent prototype workflow (PM → UX → frontend-dev) for Next.js + React
  projects using @alixpartners/ui-components. Always delegates the scoping,
  design, and implementation of static HTML prototypes to the
  `feature-planner`, `ux-designer`, and `frontend-dev` agents — in that order.
  Produces files under `.designs/<feature-name>/` only. Never touches `app/`
  or any other production code. Triggered by phrases like "design the UI for
  X", "create a mockup of X", "prototype this page", "how should X look",
  "redesign X".
---

## What It Does

This skill is an **orchestrator**, not a one-shot designer. Every invocation runs the same three-agent pipeline:

```
Feature request
   → feature-planner   (PM — scope the prototype)
   → ux-designer       (UX — design the prototype)
   → frontend-dev      (implementation — write .designs/<feature>/)
```

Each agent runs in its own sub-task. The top-level conversation only orchestrates: it briefs each agent, surfaces the artifact, and waits for user sign-off before advancing to the next stage.

### Hard constraints

- **Prototype-only.** This flow exclusively writes to `.designs/<feature-name>/`. It must never create, edit, or delete files under `app/`, `pages/`, `node_modules/`, the project root, or anywhere else outside `.designs/`.
- **Three-agent chain is mandatory.** Do not skip stages. Do not collapse two stages into one. If the user wants to short-circuit (e.g. "just implement it, skip the planner"), confirm with them once and record the deviation in the spec — but the default is always all three.
- **Each stage produces a named artifact.** Stage 1 → plan. Stage 2 → UI spec. Stage 3 → `index.html` + final `spec.md`. The next stage cannot begin until the prior artifact exists.
- **Sign-off between stages.** Surface the artifact to the user and pause. Only advance when the user confirms (or after explicit "keep going" instruction at the start).

### Output folder

```
.designs/
├── index.html             ← prototype router/index (card grid linking every <feature-name>/)
├── vendor/                ← shared, bundled once per repo
│   ├── entry.tsx
│   ├── bundle.sh
│   ├── alix-ui.js
│   └── alix-ui.css
├── tokens.css             ← optional
├── <feature-name>/
│   ├── plan.md            ← Stage 1 output (feature-planner)
│   ├── spec.md            ← Stage 2 output (ux-designer), refined in Stage 3
│   └── index.html         ← Stage 3 output (frontend-dev)
└── ...
```

**Router index (`.designs/index.html`)** — a card-grid landing page that links to every prototype folder. It must be updated whenever a new prototype is created so it stays discoverable when you run `npx --yes serve .designs`. See **Step 4** of the orchestration protocol below.

### Versioning

- **No v1, v2 suffixes.** Git manages versions. Edit files in place.
- If the user says "don't touch the other one" or asks for a completely different flow, create a new folder. Otherwise update the existing one.

---

## Orchestration protocol

### Step 0 — Check the vendor bundle

Before any agent runs, verify `.designs/vendor/alix-ui.js` exists. If it doesn't, create the vendor files (see **Appendix A**) and run `sh .designs/vendor/bundle.sh`. This is the only setup work the skill itself does — the rest is delegated.

### Stage 1 — feature-planner (PM)

Invoke the `feature-planner` agent. **Brief it explicitly as a prototype-only task** — it must not produce a plan that touches `app/`, route handlers, or DB code. Pass the feature name, the user's request, and this instruction verbatim:

> "Prototype-mode planning. The output must be a plan for a static HTML mockup under `.designs/<feature-name>/` only. No app code, no API routes, no DB. Skip Phase 2 (API) and Phase 3 (Page/components in `app/`). Keep Phase 1 (design scope) and Phase 4 (open questions). Write the plan to `.designs/<feature-name>/plan.md`."

The agent should:
1. Ask the user the PM-clarification questions (scope, persona, primary action, edge cases, what already exists). All in one batch.
2. Wait for answers.
3. Write `.designs/<feature-name>/plan.md` with the prototype-scoped plan.

After the agent returns, **show the plan to the user and pause for sign-off** before Stage 2.

### Stage 2 — ux-designer

Invoke the `ux-designer` agent. Pass the path to `plan.md` from Stage 1 and this instruction:

> "Prototype-mode UX. Read `.designs/<feature-name>/plan.md`. Produce a UI spec at `.designs/<feature-name>/spec.md` mapping every UI element to a `@alixpartners/ui-components` primitive. Tables map to `AgGrid` from the vendor bundle. Every interactive component must define loading / empty / error / populated states. Three responsive breakpoints: ≤900 / ≤640 / ≤400 px. Do not write code — spec only."

The agent should:
1. Read `plan.md` and the project to find reusable patterns.
2. Ask any UX questions in one batch and wait for answers.
3. Write `.designs/<feature-name>/spec.md` matching the format documented in `ux-designer.md`.

After the agent returns, **show the spec to the user and pause for sign-off** before Stage 3.

### Stage 3 — frontend-dev

Invoke the `frontend-dev` agent. Pass the paths to `plan.md` and `spec.md`, and this instruction:

> "Prototype implementation mode. This is the documented exception to your 'no static HTML prototypes' rule — the `design-prototype` skill is invoking you. Read `.designs/<feature-name>/plan.md` and `.designs/<feature-name>/spec.md`. Produce `.designs/<feature-name>/index.html` following the template in `design-prototype/SKILL.md` Appendix B. Update `spec.md` if implementation forced any design changes (under a 'Design → Code alignment' section). Do not touch any file outside `.designs/<feature-name>/`, `.designs/vendor/`, or `.designs/index.html` (the router — see Step 4). Do not write Next.js code. Do not run `npm run lint` or `npm run dev` — this is static HTML, not part of the build."

The agent should:
1. Read both artifacts.
2. Write `.designs/<feature-name>/index.html` per Appendix B.
3. Update `spec.md` if needed.
4. Print the local serve command (`npx --yes serve .designs`) and the prototype URL path.

### Step 4 — Register the prototype in the router index (mandatory)

After `index.html` exists at `.designs/<feature-name>/index.html`, the orchestrator (NOT a sub-agent) must update `.designs/index.html` so the new prototype is reachable from the root listing.

This step is **mandatory on every new prototype** and **only runs when a NEW folder under `.designs/` was created**. If Stage 3 only edited an existing prototype (same folder), skip this step.

Procedure:

1. Read `.designs/index.html`.
2. Inside the `<div class="grid">…</div>` block, add a new card matching the existing pattern. Place it last in the list (chronological order — newest at the bottom keeps git diffs minimal):

   ```html
   <a class="card" href="<feature-name>/">
     <div class="name"><Display name> <span class="arrow">→</span></div>
     <div class="path"><feature-name>/</div>
     <div class="blurb">
       <One-to-two-sentence summary lifted from spec.md's Goal statement,
       trimmed to ~160 chars.>
     </div>
     <span class="tag"><Category></span>
   </a>
   ```

   - **Display name** — human-readable, may include a project codename (e.g. `Neobank landing — Nala`).
   - **`<feature-name>/`** — the kebab-case folder name with a trailing slash so `serve` resolves the index.
   - **Blurb** — pulled from the spec's Goal statement or Persona line. No marketing copy.
   - **Tag** — one of `Dashboard`, `Forms`, `Sandbox`, `Landing`, `Onboarding`, `Settings`, `Wizard`, `Report`, or a new one if none fits. Keep it singular and Title Case.

3. Do not modify the `<style>`, `<header>`, or `<footer>` of the router index. Only insert the new `<a class="card">` block.
4. Do not touch other cards — the router is an append-only registry from the orchestrator's perspective.

After the card is added, **show the final artifacts to the user**. Stop.

---

## Appendix A — Vendor bundle (one-time setup)

`.designs/vendor/entry.tsx`:
```tsx
import { useEffect, useRef, useMemo, createElement } from "react";

export * as React from "react";
export { createRoot } from "react-dom/client";
export * from "@alixpartners/ui-components";

/**
 * Thin React wrapper around AG Grid Community loaded from the CDN.
 * AG Grid is the canonical primitive for tables in every prototype — do not hand-roll <table>.
 * The CDN script must be present in the HTML <head>; this wrapper reads globalThis.agGrid.
 */
export function AgGrid({
  rowData,
  columnDefs,
  height = 400,
  theme = "ag-theme-quartz",
  gridOptions = {},
  defaultColDef,
  rowHeight,
  headerHeight,
  pagination,
  paginationPageSize,
  onReady,
}) {
  const containerRef = useRef(null);
  const apiRef = useRef(null);
  const mergedDefaults = useMemo(
    () => ({ resizable: true, sortable: true, filter: true, flex: 1, minWidth: 80, ...(defaultColDef || {}) }),
    [defaultColDef]
  );
  useEffect(() => {
    const agGrid = globalThis.agGrid;
    if (!agGrid?.createGrid) {
      containerRef.current.innerHTML =
        '<div style="padding:24px;color:#991b1b;background:#fef2f2;border:1px solid #fecaca;border-radius:10px;font:13px system-ui">AG Grid not loaded.</div>';
      return;
    }
    const api = agGrid.createGrid(containerRef.current, {
      rowData, columnDefs, defaultColDef: mergedDefaults,
      animateRows: true, rowHeight, headerHeight, pagination, paginationPageSize, ...gridOptions,
    });
    apiRef.current = api;
    onReady?.(api);
    return () => api.destroy?.();
  }, []);
  useEffect(() => { apiRef.current?.setGridOption?.("rowData", rowData); }, [rowData]);
  useEffect(() => { apiRef.current?.setGridOption?.("columnDefs", columnDefs); }, [columnDefs]);
  return createElement("div", {
    ref: containerRef,
    className: theme,
    style: { height: typeof height === "number" ? height + "px" : height, width: "100%" },
  });
}
```

`.designs/vendor/bundle.sh`:
```sh
#!/usr/bin/env sh
set -e
cd "$(dirname "$0")"
npx --yes esbuild entry.tsx \
  --bundle \
  --format=esm \
  --jsx=automatic \
  --loader:.css=css \
  --outfile=alix-ui.js
```

Run it:
```sh
sh .designs/vendor/bundle.sh
```

esbuild emits `alix-ui.js` and `alix-ui.css` alongside it. Rerun `bundle.sh` only when `@alixpartners/ui-components` (or one of its peers) is upgraded.

**Troubleshooting:** if bundling fails on missing peer deps, run `npm install` first.

---

## Appendix B — Prototype HTML template (used by frontend-dev in Stage 3)

Each `.designs/<feature>/index.html`:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>FeatureName — prototype</title>
  <link rel="stylesheet" href="../vendor/alix-ui.css" />
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/ag-grid-community@31/styles/ag-grid.css" />
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/ag-grid-community@31/styles/ag-theme-quartz.css" />
  <script src="https://cdn.jsdelivr.net/npm/ag-grid-community@31/dist/ag-grid-community.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone@7/babel.min.js"></script>
  <style>
    body { margin: 0; font-family: system-ui, sans-serif; }
    .design-badge {
      position: fixed; bottom: 12px; right: 12px;
      font: 600 11px/1 system-ui; padding: 6px 10px;
      background: #111; color: #fff; border-radius: 999px;
    }
    @media (max-width: 900px) { /* tablet */ }
    @media (max-width: 640px) { /* mobile: stack columns, hide sidebar */ }
    @media (max-width: 400px) { /* small phone */ }
  </style>
</head>
<body>
  <div id="root"></div>
  <div class="design-badge">FeatureName — prototype</div>

  <script type="text/babel" data-type="module" data-presets="react">
    import {
      React, createRoot,
      AgGrid,
      Button, Input /* whatever this prototype uses */
    } from "../vendor/alix-ui.js";

    const rows = [/* realistic mock data */];

    const columnDefs = [
      { field: "id",   headerName: "ID",   width: 80, pinned: "left" },
      { field: "name", headerName: "Name", flex: 2 },
      { field: "status", headerName: "Status", cellRenderer: (p) =>
          `<span style="font-size:11px;font-weight:700;padding:2px 8px;border-radius:999px;
                        background:${p.value === "ok" ? "#dcfce7" : "#fee2e2"};
                        color:${p.value === "ok" ? "#166534" : "#991b1b"}">${p.value}</span>`
      },
    ];

    function App() {
      return (
        <main style={{ padding: 24, display: "grid", gap: 16 }}>
          <h1>FeatureName</h1>
          <AgGrid rowData={rows} columnDefs={columnDefs} height={420} rowHeight={36} headerHeight={36} />
        </main>
      );
    }

    createRoot(document.getElementById("root")).render(<App />);
  </script>
</body>
</html>
```

Rules:
- JSX lives inside a single `<script type="text/babel" data-type="module" data-presets="react">`.
- Imports come **only** from `../vendor/alix-ui.js`. Never reference `@alixpartners/ui-components` directly from a prototype — it's a private package and won't resolve in the browser.
- Three responsive breakpoints: tablet ≤900px, mobile ≤640px, small phone ≤400px.
- Add the `design-badge` corner pill.
- No Tailwind classes, no bundler-specific syntax, no `import "x.css"` inside the inline script.
- **Tables → `AgGrid`, always.** Never hand-roll a `<table>`. The vendor bundle exports the `AgGrid` React wrapper.

### Tables: AG Grid usage

```jsx
import { AgGrid } from "../vendor/alix-ui.js";

const columnDefs = [
  { field: "sym",    headerName: "Symbol",  pinned: "left", width: 100 },
  { field: "sector", headerName: "Sector",  width: 130 },
  { field: "qty",    headerName: "Qty",     type: "rightAligned", width: 100, valueFormatter: (p) => p.value.toLocaleString() },
  { field: "pnl",    headerName: "P&L",     type: "rightAligned", flex: 1,
    cellClass: (p) => p.value >= 0 ? "pl-pos" : "pl-neg",
    valueFormatter: (p) => (p.value >= 0 ? "+$" : "−$") + Math.abs(p.value).toLocaleString() },
];

<AgGrid rowData={positions} columnDefs={columnDefs} height={420} rowHeight={36} headerHeight={36} />
```

- **Custom cell rendering** — `cellRenderer` returns an HTML string (no React adapter shipped). Style inline or via classes from `alix-ui.css`.
- **Number formatting** — `valueFormatter` for display, keep raw numbers in `rowData`.
- **Sort/filter/resize** — defaults on. Disable per column with `{ sortable: false, filter: false }`.
- **Pin** — `pinned: "left" | "right"`.
- **Theme** — default `ag-theme-quartz`. Override via the `theme` prop.
- **Height** — give the grid a bounded height.
- **Mobile** — at ≤640px AG Grid horizontal-scrolls; document in the spec if a card layout is needed instead.

When **not** to use `AgGrid`:
- Visually-row-but-not-tabular lists (leaderboards, activity feeds) — use flex/grid.
- KPI / summary blocks — not tables.
- Definition lists — use `<dl>` or flex.

---

## Appendix C — Spec format (used by ux-designer in Stage 2)

Required sections in `.designs/<feature>/spec.md`:

```md
# FeatureName — Design Specification
> **Prototype**: `.designs/feature-name/index.html`
> **Plan**: `.designs/feature-name/plan.md`

## Component tree

## States table
| Component | Loading | Empty | Error | Populated |
|---|---|---|---|---|

## @alixpartners/ui-components mapping
| UI element | Library primitive |
|---|---|

## Interaction flows

## Layout

## Accessibility notes

## Open UX questions

## Design → Code alignment (filled by frontend-dev in Stage 3, if applicable)
| Spec element | What was built | Reason for delta |
|---|---|---|
```

---

## Conventions

### File naming
- Each feature: `.designs/<feature-name>/plan.md`, `spec.md`, `index.html`.
- No version suffixes — git owns history.

### Vendor bundle
- `.designs/vendor/` is shared across all prototypes.
- Rebuild via `sh .designs/vendor/bundle.sh` only when the library or its peers (`react`, `react-dom`, `radix-ui`, `notistack`) are upgraded.

### tokens.css (optional)
- Only create `.designs/tokens.css` if the project needs visual overrides on top of the library's CSS.
- If present, link from each prototype: `<link rel="stylesheet" href="../tokens.css" />` (after `alix-ui.css`).

### Component states
Every component that loads data describes all four states:

| State | What to show |
|---|---|
| **Loading** | Skeleton/shimmer rectangles, not just a spinner. |
| **Empty** | Meaningful empty state with a CTA. Not just "No data." |
| **Error** | `Banner` / alert with a retry action. Never just "Error." |
| **Populated** | Normal state with realistic mock data. |

### Mock data
- Realistic enough to show the design under real proportions (long names, edge values).
- Generic unless the project has a clear locale/domain.

### Responsive
- Sidebar hides on mobile (≤640px).
- Tables horizontal-scroll on mobile (AG Grid default); document if cards are needed.
- Hover-only actions become always-visible on touch widths.
- Buttons go full-width with min-height ~2.5rem on mobile.

### flows.json (optional)
- `.designs/flows.json` documents architecture: nodes (pages, components, stores, externals) and flows (data paths).
- Worth creating once the project has ~3+ prototypes.

---

## What NOT to do

- ❌ Don't skip any of the three agents. If the user pushes to skip, confirm once, note the deviation in `spec.md`, then proceed.
- ❌ Don't run any agent against files outside `.designs/`. This skill is prototype-only.
- ❌ Don't write Next.js framework code (`use client`, server actions, route handlers) inside a prototype.
- ❌ Don't hardcode hex colors or pixel values when the library exposes a primitive.
- ❌ Don't invent new UI patterns when an `@alixpartners/ui-components` export covers it.
- ❌ Don't hand-roll a `<table>`. Use `AgGrid`.
- ❌ Don't add a build step beyond `bundle.sh`.
- ❌ Don't load `@alixpartners/ui-components` from a public CDN — use the local vendor bundle.
- ❌ Don't load AG Grid from npm into the vendor bundle — keep it on the CDN.
- ❌ Don't import `@alixpartners/ui-components` directly from a prototype — import from `../vendor/alix-ui.js`.
- ❌ Don't design in a vacuum — agents must read the existing code and prior `.designs/` first.
- ❌ Don't add Tailwind classes inside a prototype — Tailwind isn't running there.
- ❌ Don't run `npm run lint` or `npm run dev` from Stage 3 — prototypes are static HTML, not part of the build.
- ❌ Don't forget Step 4 — every new prototype must be registered in `.designs/index.html` so the router lists it. Skipping this orphans the prototype from the serve root.
- ❌ Don't restyle or restructure `.designs/index.html` when registering a new prototype — only append a `<a class="card">` block inside the existing `<div class="grid">`. The router is append-only.

---

## Serving prototypes

From the repo root:

```sh
npx --yes serve .designs
```

Open `http://localhost:3000/<feature-name>/`.

Each prototype loads `alix-ui.css` + AG Grid CSS + Babel-standalone (CDN) + AG Grid UMD (CDN) + the local ESM bundle (`alix-ui.js`), then mounts a React tree at `#root`.
