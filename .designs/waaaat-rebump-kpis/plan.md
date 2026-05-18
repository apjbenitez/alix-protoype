## Prototype: waaaat — Finance Admin Dashboard (CFO / Controller)

### Scope
Full admin dashboard for a CFO / Controller monitoring company-wide finances. Composes the AlixPartners Platforms Design System (Figma file `uKDQ4UPs40MQXxn6CrcqTO`) primitives into a single desktop-primary surface: top nav, status banner, KPI strip, filter bar, tabbed content with AG Grid tables, and a right-hand sidebar of alerts and close-cycle status. Replaces the prior 404 "Waaaat?" prototype in this folder.

### Persona & device
CFO / Controller at a mid-to-large company, reviewing finance health daily. Desktop-primary (1440+). Must still render legibly at the three skill-mandated breakpoints: ≤900 px (tablet — sidebar collapses below main), ≤640 px (mobile — KPI strip wraps, filters stack, tabs scroll horizontally), ≤400 px (small phone — single-column, banner condenses).

### Primary action
"Generate CFO pack" — top-right CTA in the NavBar/header row. Secondary: "Export board report" available from the same menu.

### What already exists
- `.designs/waaaat/plan.md` — prior 404 plan, **discarded** by this revision.
- `.designs/waaaat/spec.md` — prior 404 spec, will be overwritten by ux-designer in Stage 2.
- `.designs/waaaat/index.html` — prior 404 page, will be overwritten by frontend-dev in Stage 3. Confirms vendor link paths: `../vendor/alix-ui.css`, `../vendor/alix-ui.js`, AG Grid CDN already wired.
- `.designs/vendor/alix-ui.js` re-exports everything from `@alixpartners/ui-components` plus the `AgGrid` wrapper — primitives available include `NavBar`, `Button`, `Icon`, plus whatever the DS package exports for Banner / Card / Tabs / Select / DateRange.
- No bespoke "finance admin" frame in the Figma DS file — ux-designer (Stage 2) will use the Figma MCP to search `uKDQ4UPs40MQXxn6CrcqTO` for KPI cards, filter chips, tab navigation, sidebar layout, alert/banner variants, and compose them. Prior `.designs/finance-dashboard/` (deleted, last in commit `7d0c2cb`) used the same NavBar + banner + KPI + filters + Tabs + main + sidebar skeleton — reuse the **shape**, not the trading-desk content.

### Surfaces to mock
- **NavBar** with project name "Finance" (or similar), primary nav (Dashboard / Reports / Ledger / Admin), user menu on right, primary CTA "Generate CFO pack".
- **Status banner row** below NavBar — "Month-end close: 3 days remaining" with a secondary action ("View close calendar").
- **KPI strip** — 6–8 KPI cards in a horizontally scrolling row: Revenue (MTD/YTD), Operating expenses, Gross margin %, Operating cash position, Net income, AR aging >60d, AP outstanding, Headcount cost. Each card: label, primary value, delta vs prior period, mini sparkline.
- **Filter bar** — Date range selector (Month / Quarter / YTD / Custom), Entity / business unit multi-select, Currency selector with FX-normalized toggle, Compare-to selector (Prior period / Prior year / Budget).
- **Tab navigation** — Overview (default) / P&L / Cash flow / AR-AP / Budget vs actual / Headcount.
- **Tab content panels** (one per tab, only the default needs to be visually complete; the rest can be lower-fidelity placeholders within the same structural frame):
  - Overview: revenue-vs-expense chart placeholder + top 5 variances AG Grid + cash position trend placeholder.
  - P&L: AG Grid with line items, current period, prior period, variance, % variance.
  - Cash flow: AG Grid with inflow/outflow rows grouped by category + summary tiles.
  - AR / AP: two AG Grids side by side — AR aging buckets and AP outstanding by vendor.
  - Budget vs actual: AG Grid with department rows, budget, actual, variance, RAG status.
  - Headcount: AG Grid by department, headcount, fully loaded cost, vs plan.
- **Right sidebar** — stacked cards:
  - Alerts list (covenant breaches, overdue AR, budget overruns) with severity icons.
  - Close-cycle status (month-end checklist progress, days remaining).
  - Recent journal approvals (5 most recent, user + amount + entity).
  - Quick links (Export pack, Schedule board report, Open close calendar).

### Data to mock
- **8 KPIs** — value, prior-period value, delta absolute + %, 12-point sparkline series.
- **Variances grid (Overview)** — 5 rows: line item, actual, budget, variance, % variance.
- **P&L grid** — ~25 rows across Revenue / COGS / Opex / Other, mixed indent levels, subtotal rows.
- **Cash flow grid** — ~15 rows grouped operating / investing / financing.
- **AR aging grid** — 12 rows: customer, current, 1–30d, 31–60d, 61–90d, >90d, total. Include one row with a very long customer name and one all-zero row.
- **AP outstanding grid** — 10 rows: vendor, due date, amount, days outstanding, status.
- **Budget vs actual grid** — 10 department rows with RAG values.
- **Headcount grid** — 8 department rows.
- **Alerts** — 4–6 items, mixed severity (critical / warning / info).
- **Close-cycle checklist** — 8 tasks, mixed states (done / in progress / blocked / not started).
- **Recent journal approvals** — 5 entries.
- **Entities for filter** — 6 business units. **Currencies** — USD, EUR, GBP, JPY.

### States to cover
List per data-driven surface; all four states must be representable in `spec.md` even if only "Populated" is shown in the primary view of `index.html`.
- KPI strip — Loading (skeleton cards), Empty (no data for selected period), Error (single inline error tile), Populated.
- Filter bar — Default, Active (chips showing applied filters), Disabled (during fetch).
- Each AG Grid (Variances, P&L, Cash flow, AR aging, AP, Budget, Headcount) — Loading (grid overlay), Empty (no rows), Error (grid-level error overlay), Populated.
- Alerts sidebar card — Empty ("All clear"), Populated, Error.
- Close-cycle card — In progress (default), Complete, Blocked.
- Banner — Visible (close in progress), Hidden (close complete).

### Out of scope
- App code under `app/`, route handlers, database access — prototype-only.
- Real auth, real SSO, real role/permission gating.
- Real export — the CTA can open a stub modal or do nothing.
- Live data, websockets, real FX rates.
- Drill-downs into ledger detail beyond what fits in the grids.
- The lower-fidelity non-Overview tabs do not need full interactivity; clicking the tab swaps the content frame, no more.

### Open questions
For ux-designer (Stage 2) — route via Figma MCP search of file `uKDQ4UPs40MQXxn6CrcqTO`:
- Does the DS expose a dedicated `Banner` (or `Alert`) variant suitable for the month-end close status row, or should the generic `Alert` / inline card be used?
- Is there a DS `KpiCard` / `MetricCard` primitive with a sparkline slot, or must the sparkline be composed (e.g. Card + inline SVG)?
- Does the DS provide a `FilterBar` / `Toolbar` primitive with chips, or is this composed from `Select` + `Button` + `DateRangePicker`?
- Is there a `Tabs` primitive with horizontal-scroll behaviour for the ≤640 px breakpoint, or does ux-designer need to spec the fallback?
- Does the DS have a `Sidebar` / `RightRail` layout primitive, or is the right column a plain flex column of `Card`s?
- Confirm currency / number formatting tokens exist (e.g. for FX-normalized values, accounting-style negatives).
