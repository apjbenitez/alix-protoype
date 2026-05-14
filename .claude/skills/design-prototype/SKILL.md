---
name: design-prototype
description: >
  PM → UX → static HTML mockup workflow for Next.js + React projects using
  @alixpartners/ui-components. Takes a feature request, scopes it against the
  existing code, designs the UI with the real component library, and produces
  static HTML prototypes (mounted via in-browser React + JSX) plus an MD spec
  in .designs/. Triggered by phrases like "design the UI for X", "create a
  mockup of X", "prototype this page", "how should X look", "redesign X".
---

## What It Does

Three-stage pipeline:

```
Feature request → PM clarifies scope → UX reads project → static HTML prototype + MD spec
```

Produces two files per feature in `.designs/<feature-name>/`:
- `index.html` — static HTML that mounts a React tree using `@alixpartners/ui-components`. No bundler, no dev server. Served via `npx serve .designs`.
- `spec.md` — developer-ready spec with component tree, states, library mappings.

### Folder structure

```
.designs/
├── vendor/                ← pre-bundled, shared by every prototype
│   ├── entry.tsx
│   ├── bundle.sh
│   ├── alix-ui.js         ← produced by bundle.sh
│   └── alix-ui.css        ← produced by bundle.sh (esbuild emits CSS next to the JS)
├── tokens.css             ← optional, only if the project needs overrides
├── <feature-name>/
│   ├── index.html
│   └── spec.md
└── ...
```

### Versioning

- **No v1, v2 suffixes.** Git manages versions. Edit files in place.
- If the user says "don't touch the other one" or asks for a completely different flow, create a new folder. Otherwise update the existing one.
- If a feature replaces another, update the existing folder. Don't duplicate.

### Core principle: design is source of truth for looks

- The design dictates visual decisions. Code follows the design.
- But code drives structure — models, API endpoints, DB schema constrain what's possible.
- Iterate both: read code → improve design → update code to match.
- When design and code differ, add a "Design → Code alignment" section in the spec flagging the deltas.

---

## Stage 1: PM — Clarify the scope

Before any design work, resolve ambiguity. Ask all questions in one batch:

1. **Where does this live?** — New page? New tab inside an existing route? Replacing a component? Which path under `app/`?
2. **What data is involved?** — What models or tables? What API routes exist (or need to exist) under `app/api/`?
3. **Who uses it?** — What role / persona? What device (desktop, tablet, phone)?
4. **What's the primary action?** — The one thing the user does most often on this screen.
5. **What already exists?** — Is there a current version? What's wrong with it?
6. **Edge cases** — Empty state, error state, first-time use, permission-denied.

If the feature is vague ("build me a dashboard"), push back for specifics before designing.

---

## Stage 2: UX — Read the project before designing

**Mandatory steps before any design work:**

1. **Detect the stack.** Read `package.json`. Expect `next` + `react`. Check whether the project uses the App Router (`app/`) or Pages Router (`pages/`).
2. **Read existing `.designs/` folders.** Many patterns will already be solved. Reuse before inventing.
3. **Read the current implementation.** Open the actual `.tsx` files for related routes/components, any API route handlers under `app/api/`, and any DB module. Don't design in a vacuum.
4. **Read the library's exports.** `node_modules/@alixpartners/ui-components/dist/main.d.ts` lists every primitive available: `Button`, `Checkbox`, `Icon`, `Input`, `Radio`, `RadioGroup`, `Textarea`, `Toggle`, `Banner`, `Ghost`, `Dropdown`, `FilePicker`, `Search`, `Datepicker`, `RichTextEditor`, `Toast`, `ToastProvider`, `Creatable`, `SplitButton`, `DragAndDrop`, `Tab`, `TabNavigation`, `Dialog`, `TagsFields`, `NavBar`, `Tag`, `Tooltip`, `Spinner`, `Illustration`, plus utilities (`useToast`, `useFilePickerContext`, validators).
5. **Search for similar UI patterns** in the project — reuse before inventing.

**Design principles:**
- Compose `@alixpartners/ui-components` primitives. Do not invent custom equivalents of what the library exports.
- Use the library's own styling. Don't hand-roll hex colors, px values, or font choices that conflict with what the library ships.
- Every interactive component must define all four states: **loading, empty, error, populated**.
- Critical/safety information must be always visible (banners, alerts), not buried behind tabs.
- Flag any user-facing copy that needs review — don't invent product tone.

---

## Stage 3: Output — vendor bundle + static prototype + spec

### 3a. Bootstrap the vendor bundle (once per repo)

Before producing the first prototype, check whether `.designs/vendor/alix-ui.js` exists. If not, create the vendor files.

`.designs/vendor/entry.tsx`:
```tsx
export * as React from "react";
export { createRoot } from "react-dom/client";
export * from "@alixpartners/ui-components";
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

esbuild emits `alix-ui.js` and (because the library imports CSS as side effects) `alix-ui.css` alongside it. Rerun `bundle.sh` only when `@alixpartners/ui-components` (or one of its peers) is upgraded.

**Troubleshooting:** if bundling fails on missing peer deps, run `npm install` first — esbuild reads from `node_modules`.

### 3b. The prototype HTML template

Each `.designs/<feature>/index.html`:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>FeatureName — prototype</title>
  <link rel="stylesheet" href="../vendor/alix-ui.css" />
  <script src="https://unpkg.com/@babel/standalone@7/babel.min.js"></script>
  <style>
    body { margin: 0; font-family: system-ui, sans-serif; }
    .design-badge {
      position: fixed; bottom: 12px; right: 12px;
      font: 600 11px/1 system-ui; padding: 6px 10px;
      background: #111; color: #fff; border-radius: 999px;
    }
    /* responsive overrides */
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
      Button, Input /* whatever this prototype uses */
    } from "../vendor/alix-ui.js";

    // ---- mock data ----
    const rows = [/* realistic, enough to show the design working */];

    function App() {
      return (
        <main style={{ padding: 24, display: "grid", gap: 16 }}>
          <h1>FeatureName</h1>
          {/* compose library primitives here */}
        </main>
      );
    }

    createRoot(document.getElementById("root")).render(<App />);
  </script>
</body>
</html>
```

Rules:
- JSX lives inside a single `<script type="text/babel" data-type="module" data-presets="react">`. Babel-standalone rewrites it to an ES module, so relative imports from `../vendor/alix-ui.js` work natively.
- Imports come **only** from `../vendor/alix-ui.js`. Never reference `@alixpartners/ui-components` directly from a prototype — it's a private package and won't resolve in the browser.
- Three responsive breakpoints in `<style>`: tablet ≤900px, mobile ≤640px, small phone ≤400px.
- Add the `design-badge` corner pill.
- No Tailwind classes, no bundler-specific syntax, no `import "x.css"` inside the inline script.
- For app shell context (sidebar/topbar), render a static placeholder so the prototype feels real.

### 3c. The MD spec (`spec.md`)

Required sections:

```md
# FeatureName — Design Specification
> **Prototype**: `.designs/feature-name/index.html`
> **Target**: `app/...` (route or component path)

## Design → Code alignment (if applicable)
| Design element | In current code? | Action |
|---|---|---|

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
```

---

## Conventions

### File naming
- Each feature: `.designs/<feature-name>/index.html` + `spec.md`.
- No version suffixes — git owns history.
- A genuinely divergent flow → new folder.

### Vendor bundle
- `.designs/vendor/` is shared across all prototypes.
- Rebuild via `sh .designs/vendor/bundle.sh` only when the library or its peers (`react`, `react-dom`, `radix-ui`, `notistack`) are upgraded.
- Commit `entry.tsx` and `bundle.sh` to git. The two outputs (`alix-ui.js`, `alix-ui.css`) can be committed for instant zero-setup previews, or gitignored if the team prefers a "run bundle.sh after clone" workflow — pick one and document it.

### tokens.css (optional)
- Only create `.designs/tokens.css` if the project needs visual overrides on top of the library's CSS.
- If present, link it from each prototype: `<link rel="stylesheet" href="../tokens.css" />` (after `alix-ui.css`).
- Don't introduce a `--brand-*` token namespace just for prototypes — mirror whatever the real app uses.

### Component states
Every component that loads data describes all four states:

| State | What to show |
|---|---|
| **Loading** | Skeleton/shimmer rectangles, not just a spinner. |
| **Empty** | Meaningful empty state with a CTA. Not just "No data." |
| **Error** | `Banner` / alert with a retry action. Never just "Error." |
| **Populated** | Normal state with realistic mock data. |

### Mock data
- Realistic enough to show the design working under real proportions (long names, long titles, edge values).
- Keep it generic unless the project has a clear locale/domain — locale-specific mock data is a per-project override, not a default.
- Pre-populate with enough rows to show pagination/scroll behavior where relevant.

### Responsive
- Sidebar hides on mobile (`display: none` at ≤640px).
- Tables collapse to bordered cards on mobile.
- Hover-only actions become always-visible on touch widths.
- Buttons go full-width with min-height ~2.5rem on mobile.
- Filter chips, calendars, charts: horizontal-scroll containers with the scrollbar hidden.

### flows.json (optional)
- `.designs/flows.json` documents architecture: nodes (pages, components, stores, externals) and flows (step-by-step data paths).
- Worth creating once the project has ~3+ prototypes and architecture decisions need a single source of truth.
- Update it when a design change moves responsibilities, adds a new component, or shifts a data path. Ask the user before regenerating if it already exists.

---

## What NOT to do

- ❌ Don't write Next.js framework code (`use client`, server actions, route handlers) inside a prototype. The prototype is a leaf HTML page; the only React it runs is via the Babel-in-browser script.
- ❌ Don't hardcode hex colors or pixel values when the library already exposes a primitive or class that covers the case.
- ❌ Don't invent new UI patterns when an `@alixpartners/ui-components` export covers it.
- ❌ Don't add a build step beyond the one-shot `bundle.sh`.
- ❌ Don't load `@alixpartners/ui-components` from a public CDN (esm.sh, unpkg). The package is on a private registry — it must come from the local vendor bundle.
- ❌ Don't import directly from `@alixpartners/ui-components` inside the prototype script. Always import from `../vendor/alix-ui.js`.
- ❌ Don't design in a vacuum — always read the existing code first.
- ❌ Don't skip the PM step for vague requests.
- ❌ Don't create prototypes without the MD spec.
- ❌ Don't forget the three responsive breakpoints.
- ❌ Don't skip the four-state table in `spec.md`.
- ❌ Don't add v1/v2 folder suffixes.
- ❌ Don't add Tailwind classes inside a prototype — Tailwind isn't running there.

---

## Serving prototypes

From the repo root:

```sh
npx --yes serve .designs
```

Open `http://localhost:3000/<feature-name>/` (or whichever port `serve` picks).

Each prototype is a pure static page: it loads `alix-ui.css` + Babel-standalone (CDN) + the local ESM bundle (`alix-ui.js`), then mounts a React tree at `#root`.

---

## Integration with other skills

- **Before designing**: read `node_modules/@alixpartners/ui-components/dist/main.d.ts` to know what primitives are available.
- **After approval**: hand the prototype + `spec.md` to whichever implementation skill the team uses (e.g., `feature-planner`) to produce a real `app/<route>/page.tsx`.
