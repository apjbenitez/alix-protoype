## UI Spec: waaaat — Finance Admin Dashboard (CFO / Controller)

- Prototype path: `.designs/waaaat/index.html`
- Plan path: `.designs/waaaat/plan.md`
- Source DS: AlixPartners **Platforms Design System** — Figma file `uKDQ4UPs40MQXxn6CrcqTO`
  - Banner page `21591:16` · Cards page `8474:823` · Tabs page `21606:1953` · Tag page `21606:7708` · Tables (AG Grid) pattern page `6067:1081` · Navigation Bar page `21608:38915` · Left Navigation page `6067:1082` · Dropdown page `21594:4947` · Datepicker page `6067:1077` · Toast page `21606:8372` · Spinner page `21606:1816` · Progress Bar page `9114:4831`

### Figma reference
No bespoke "Finance admin" frame exists in the DS file. Every primitive below is mapped to its component page in the DS file (IDs above). Sparklines, KPI delta strip, status pills and right-rail are compositional (see Design system gaps).

### Component tree
- `Shell` (root)
  - `NavBar` — DS `Navigation Bar` (`21608:38915`)
    - brand "Finance" · menu `Dashboard / Reports / Ledger / Admin` · trailing slot: `Button type="primary"` "Generate CFO pack" + overflow `Dropdown` (Export board report, Schedule, Settings)
  - `StatusBannerRow` — DS `Banner Type=Info Size=Medium` (`21591:16`)
    - icon + label "Month-end close — 3 days remaining" · trailing link "View close calendar" · dismissible
  - `KpiStrip` (horizontal scroller, `.grid-safe` from `proto-defaults.css`)
    - `KpiCard` × 8 (composed `Card` + label/value/delta/`Sparkline`)
      - label · primary value · `KpiDelta` (composed `Tag Type=Success|Error` per sign) · inline SVG sparkline (12 points)
  - `FilterBar` (composed)
    - `DateRangePresetGroup` — segmented `Button type="secondary"` group: `Month / Quarter / YTD / Custom` (Custom opens DS `Datepicker` `6067:1077` range mode)
    - `Dropdown` multi-select Entity (6 BUs) — DS `Dropdown` (`21594:4947`)
    - `Dropdown` Currency (USD / EUR / GBP / JPY) + `Toggle` "FX-normalized"
    - `Dropdown` Compare-to (Prior period / Prior year / Budget)
    - `ActiveFilterChips` — `Tag Type=Basic Structure=Border Size=Medium Trailing Icon=True` per applied filter, with `Button type="ghost"` "Clear all"
  - `MainTabs` — DS `Tabs` (`21606:1953`)
    - Tab heads: `Overview · P&L · Cash flow · AR/AP · Budget vs actual · Headcount` (default `Overview`)
    - `TabPanel`
      - `Overview`
        - `RevenueExpenseChart` (placeholder SVG inside `Card`)
        - `TopVariancesGrid` (AG Grid — see Tables)
        - `CashTrendChart` (placeholder SVG inside `Card`)
      - `PnL` → `PnLGrid` (AG Grid)
      - `CashFlow` → `CashFlowGrid` (AG Grid) + 3 summary tiles (mini `Card`s)
      - `ArAp` → two-column: `ArAgingGrid` + `ApOutstandingGrid` (AG Grids)
      - `BudgetVsActual` → `BudgetGrid` (AG Grid)
      - `Headcount` → `HeadcountGrid` (AG Grid)
  - `RightRail` (composed — DS has no `RightRail`; flex column of `Card`s)
    - `AlertsCard` (list of `AlertRow` = icon + `Tag` severity + text + timestamp)
    - `CloseCycleCard` (DS `Progress Bar` + checklist rows with status `Tag`s)
    - `JournalApprovalsCard` (5 rows: user · entity · amount · time)
    - `QuickLinksCard` (`Button type="ghost"` × 4)

### States

| Component | Loading | Empty | Error | Populated |
|---|---|---|---|---|
| `KpiStrip` | 8 `Skeleton` cards (DS `Spinner` overlay disabled — use shimmer rects) | Single empty `Card`: "No data for selected period" + `Button` "Reset filters" | One inline error `Card` spanning strip + retry `Button type="secondary"` | 8 `KpiCard`s with sparkline + delta `Tag` |
| `KpiCard` | shimmer rect for value & sparkline | dash `—` for value, no sparkline | red border, alert icon, "Failed to load" text | label · value · delta `Tag` · 12-pt SVG sparkline |
| `FilterBar` | inputs `disabled`, spinner adjacent to "Apply" | n/a | inline `Banner Type=Error Size=Small` above bar | default values · `ActiveFilterChips` row visible when ≥1 filter applied |
| `StatusBanner` | n/a | hidden when close complete | swaps to `Banner Type=Error` if checklist blocked | `Banner Type=Info Size=Medium` with countdown + link |
| `TopVariancesGrid` (AG Grid) | grid `overlayLoadingTemplate` | grid `overlayNoRowsTemplate` "No variances over threshold" | full-grid overlay: error icon + retry `Button` | 5 rows |
| `PnLGrid` (AG Grid) | overlay loading | overlay no-rows | overlay error + retry | ~25 rows w/ indent + subtotal styling |
| `CashFlowGrid` (AG Grid) | overlay loading | overlay no-rows | overlay error | ~15 grouped rows + 3 summary tiles above |
| `ArAgingGrid` (AG Grid) | overlay loading | overlay "No outstanding AR" | overlay error | 12 rows incl. long-name + all-zero |
| `ApOutstandingGrid` (AG Grid) | overlay loading | overlay "No outstanding AP" | overlay error | 10 rows |
| `BudgetGrid` (AG Grid) | overlay loading | overlay no-rows | overlay error | 10 rows with RAG `Tag` cell |
| `HeadcountGrid` (AG Grid) | overlay loading | overlay no-rows | overlay error | 8 rows |
| `AlertsCard` | 3 shimmer rows | check icon + "All clear" | inline `Banner Type=Error Size=Small` | 4–6 `AlertRow`s sorted critical → info |
| `CloseCycleCard` | `Progress Bar` indeterminate | n/a (always shown during cycle) | progress bar red + blocked checklist row highlighted | progress % + 8 checklist items w/ status `Tag` |
| `JournalApprovalsCard` | 5 shimmer rows | "No recent approvals" | inline error text | 5 rows |
| `Toast` host | n/a | n/a | error toast on action failure | success toast on export start |

### `@alixpartners/ui-components` mapping

| UI element | Library export | Key props | Figma node | Token / variant ref |
|---|---|---|---|---|
| Top bar | `NavBar` | `projectName="Finance"`, `menuItems`, `additionalItems`, `activeMenuItemHref` | `21608:38915` Navigation Bar | brand slot uses `brand/platforms` instance |
| Primary CTA | `Button` | `type="primary"`, label="Generate CFO pack" | inside `21608:38915` Tools | DS `Button` page `21591:1069` |
| Secondary CTA | `Button` | `type="secondary"` | `21591:1069` | |
| Ghost link | `Button` | `type="ghost"` | DS `Ghost Button` `21594:7685` | |
| Status row | `Banner` | `type="info"`, `size="medium"`, `state="default"`, dismissible | `21591:16` Banner — variant `Type=Info, Size=Medium, State=Default` | other variants available: `Warning / Error / Success / AI`, sizes `Small / Medium / Large` |
| Severity pill in alerts | `Tag` | `type="error" \| "warning" \| "success" \| "basic"`, `size="medium"`, `structure="solid"` | `21606:7708` Tag — variant `Type=Error/Warning/Success/Basic, Structure=Solid` | |
| Filter chip | `Tag` | `type="basic"`, `structure="border"`, `trailingIcon=true` (close X) | `21606:7708` Tag variant `Basic / Border / Trailing Icon=True` | |
| RAG cell renderer | `Tag` | `type="success" \| "warning" \| "error"`, `structure="solid"`, `size="small"` | `21606:7708` | |
| Multi-select filter | `Dropdown` (multi mode) | `multiple`, `options`, `value`, `onChange` | `21594:4947` Dropdown component_set | |
| Custom date range | `DateRangePicker` (or `Datepicker` range mode) | `value`, `onChange` | `6067:1077` Datepicker — `Calendar` component | |
| Toggle | `Toggle` | `checked`, `onChange`, label="FX-normalized" | DS `Toggle` `21606:8801` | |
| Tabs | `Tabs` | `items=[{label,value}]`, `value`, `onChange` | `21606:1953` Tabs `#=6` variant | |
| Cards | `Card` | base wrapper for KPI, right-rail blocks | `8474:823` Cards (Stats Card) — only structural reference; we override layout | |
| Tables | `AgGrid` (vendor wrapper) | `columnDefs`, `rowData`, `defaultColDef`, `gridOptions` | `6067:1081` Tables pattern | theme `ag-theme-quartz` |
| Progress | `ProgressBar` | `value`, `max`, optional `variant="error"` | `9114:4831` Progress Bar | |
| Spinner | `Spinner` | size="small" | `21606:1816` Spinner | |
| Feedback toasts | `useToast()` | `.success()`, `.error()`, `.warning()` | `21606:8372` Toast | |
| Confirmation (export) | `Dialog` | `isOpen`, `onClose`, `title`, `description` | `6067:1094` Dialog | |

AG Grid `columnDefs` sketches:

- **Top variances (Overview)** — `[{field:"lineItem",headerName:"Line item",flex:2,pinned:"left"},{field:"actual",headerName:"Actual",type:"numericColumn",valueFormatter:currency},{field:"budget",headerName:"Budget",type:"numericColumn",valueFormatter:currency},{field:"variance",headerName:"Variance",type:"numericColumn",cellRenderer:"VarianceArrow"},{field:"pct",headerName:"%",type:"numericColumn",valueFormatter:pct}]`
- **P&L** — `lineItem` (tree, pinned left, flex 2.5, indent via `cellStyle.paddingLeft`), `current` num, `prior` num, `variance` num + arrow, `pctVariance` num; subtotal rows via `rowClassRules:{subtotal:p=>p.data.isSubtotal}` (bold + `--ap-bg-subtle`).
- **Cash flow** — grouped by `category` (`rowGroupPanelShow:"never"`, autoGroupColumnDef pinned), `amount` num + arrow; summary tiles outside grid.
- **AR aging** — `customer` (pinned left, flex 2, ellipsis on long names), buckets `current / d1_30 / d31_60 / d61_90 / d90plus` num, `total` num + bold; conditional cell color on >60d via `cellClassRules`.
- **AP outstanding** — `vendor`, `dueDate` (date formatter), `amount` num, `daysOutstanding` num, `status` (RAG `Tag` renderer).
- **Budget vs actual** — `department` pinned left, `budget` num, `actual` num, `variance` num + arrow, `pctVariance` num, `rag` (`Tag` renderer success/warning/error).
- **Headcount** — `department` pinned, `headcount` num, `loadedCost` num + currency, `vsPlan` num + arrow.

`defaultColDef`: `{ resizable:true, sortable:true, filter:true, flex:1, minWidth:96 }`. `headerHeight: 36`, `rowHeight: 36`. Numeric columns right-aligned via `cellClass:"ag-right-aligned-cell"`.

### Interaction flows

1. **Open dashboard → scan KPIs → apply filter → drill AR aging**
   1. Page loads → all data-driven surfaces render Loading states simultaneously.
   2. Data resolves → `StatusBanner` + `KpiStrip` + Overview panel + RightRail populate.
   3. User opens Entity `Dropdown`, selects 2 BUs → `ActiveFilterChips` appear → `KpiStrip` + active tab grid show Loading overlay for ~300 ms → re-populate.
   4. User clicks `AR/AP` tab → tab indicator slides, panel content swaps; previous tab unmounts.
   5. User clicks an AR aging row over >60d → row selects (single-select), no drilldown in prototype (out of scope per plan).

2. **Generate CFO pack (primary action)**
   1. User clicks `Button` "Generate CFO pack" in `NavBar`.
   2. `Dialog` opens: "Generate CFO pack for *<period>*?" · destinations checklist · `Button type="primary"` "Generate".
   3. On confirm → `Dialog` closes → `useToast().success("CFO pack queued — you'll be notified when ready")`.
   4. If error → `useToast().error("Couldn't queue pack — try again")`.

3. **Click an alert**
   1. User clicks an `AlertRow` in `AlertsCard` → row gets focus ring.
   2. Right-rail card slides a contextual `Popover` (DS `Popover` `6067:1078`) with action: "Open related ledger" (stub) + "Dismiss".

4. **Toggle FX-normalized**
   1. User flips `Toggle` → all currency columns + KPI values re-format via column `valueFormatter`. No re-fetch. Currency `Dropdown` becomes disabled and shows "USD (normalized)" while toggle is on.

5. **Banner dismiss**
   1. User clicks close icon → `StatusBanner` removed for session (state in component). Reappears on reload.

### Layout

Three mandatory breakpoints. Grid uses CSS grid for shell, flex for inner rows.

- **Desktop ≥ 901 px (target 1440)**
  - Shell grid: `grid-template-columns: 1fr 320px; grid-template-rows: auto auto auto auto 1fr;`
  - Rows: `NavBar` (full width) · `StatusBanner` (full) · `KpiStrip` (full, horizontal-scroll if overflow) · `FilterBar` (full) · `MainTabs` + `TabPanel` (col 1) and `RightRail` (col 2, sticky `top: 16px`).
  - `KpiCard` width clamps `min(260px, 1fr)` with `gap: 12px`. 8 cards visible at 1440 px.

- **Tablet ≤ 900 px**
  - Shell becomes single column. `RightRail` drops below `TabPanel`, becomes a horizontal scroll row of the 4 rail cards (`scroll-snap-type: x mandatory`).
  - `FilterBar` keeps single row but presets group wraps; `Dropdown`s shrink to icon + count.
  - `KpiStrip` keeps horizontal scroll; 3–4 cards visible.
  - Tab heads scroll horizontally; DS `Tabs` `#=6` retained.

- **Mobile ≤ 640 px**
  - `KpiStrip` becomes 1-up vertical stack (no horizontal scroll — accessibility).
  - `FilterBar` collapses to a single `Button` "Filters · n" that opens a bottom-sheet `Dialog` containing the filter controls stacked vertically.
  - Tabs stay horizontal-scroll; active tab auto-scrolls into view.
  - `TabPanel`: AR/AP two-column → stacks. Charts shrink to `aspect-ratio: 16/9`.
  - All AG Grids: horizontal scroll within their container (do **not** linearize — call this out in A11y notes).
  - `RightRail` cards stack vertically below `TabPanel`.

- **Small phone ≤ 400 px**
  - `NavBar` collapses brand text; CTA "Generate CFO pack" hides into overflow `Dropdown` (icon only).
  - `StatusBanner` switches to `Size=Small`, single line + arrow link (no paragraph).
  - `KpiCard` value font drops one step (typography token `--ap-text-display-sm` → `--ap-text-display-xs`); sparklines remain visible at 80 px wide.
  - `Tag` size drops to `Small` in chips + RAG cells.

### Accessibility notes

- **Tab order**: NavBar logo → menu items → primary CTA → user menu → StatusBanner link → StatusBanner close → KPI strip (each card focusable, arrow-key navigates between cards) → FilterBar controls L→R → Tab list (arrow keys between tabs, Enter activates) → AG Grid (grid keyboard nav) → RightRail cards.
- **Keyboard**: Tabs implement `role="tablist"` w/ arrow + Home/End. KPI strip uses `role="list"`; cards `role="listitem"`. AG Grid built-in nav (arrow keys, Page Up/Down, Ctrl+Home/End) — confirm `suppressCellFocus:false`.
- **Screen-reader labels**:
  - Sparkline: `aria-label="12-month trend: 8 of 12 points above period average"`. Hide raw SVG from AT, expose summary.
  - KPI delta: `Tag` includes screen-reader-only text `"up 4.2% vs prior period"` — direction is not conveyed by color alone.
  - RAG cell: `aria-label="Red — over budget by 12%"`; never rely on color.
  - Variance arrow: include sign in text (`"+1.2M"` / `"-340K"`), color is decoration.
- **Contrast**: All `Tag` solid variants meet 4.5:1 against their background per DS token. Verify the banner Info variant `text-on-info-subtle` against `bg-info-subtle` is ≥4.5:1 (DS default — should pass).
- **AG Grid mobile**: tables horizontal-scroll on ≤640 px rather than linearizing. Make this explicit to users via a small "Scroll →" hint badge on first paint; AG Grid is the canonical primitive and AR/AP/Budget tables are *critical* on phones, so users must be told.
- **Reduced motion**: tab indicator slide and toast enter animations respect `prefers-reduced-motion: reduce` (handled by `proto-defaults.css`).
- **Focus styles**: DS focus ring tokens used everywhere; never `outline:none`.

### Design system gaps

Primitives the DS does NOT expose — documented composition for each.

1. **KpiCard with sparkline** — DS `Cards` page (`8474:823`) has only "Stats Card" (label + value rows, no chart). Compose: `Card` wrapper → `<div>` label (`--ap-text-secondary`, small) → `<div>` value (display-sm) → row of (`Tag` delta + inline `<svg>` sparkline 96×28). Sparkline is a polyline + area fill in `--ap-primary` with `stroke-width:1.5`.
2. **FilterBar / Toolbar primitive** — none. Compose from `Dropdown` + `Datepicker` (range mode) + `Button` segmented group + `Toggle` + `Tag` chips. Container is a `Card` with `padding: 12px 16px` and `gap: 12px` flex row that wraps at ≤900 px.
3. **Active filter chip** — repurpose `Tag` `Type=Basic, Structure=Border, Trailing Icon=True` (the close icon variant exists in `21606:7708`). No dedicated "FilterChip" exists.
4. **Right rail / Sidebar layout** — DS has `Left Navigation` (`6067:1082`) but no right rail. Compose as a `<aside>` flex column of `Card`s; on ≤900 px it becomes a horizontal scroll-snap row.
5. **KPI strip / horizontal scroller** — no DS primitive. Plain `overflow-x:auto; scroll-snap-type:x mandatory` on a flex row of `Card`s.
6. **Variance arrow cell** — no DS cell renderer. Compose: SVG triangle (up `--ap-success` / down `--ap-error`) + numeric value; never color-only.
7. **RAG status cell** — use `Tag` (`type=success|warning|error`, `structure=solid`, `size=small`) as the AG Grid `cellRenderer`. No dedicated "RAG" component.
8. **Sparkline / Mini chart** — no DS chart primitive. Inline `<svg>` polyline; on ≥901 px add an area fill at 12% opacity.
9. **Segmented Button group** (date range presets) — no DS primitive. Compose `Button type="secondary"` row with `border-radius` only on first/last and shared border between buttons. Active preset uses `type="primary"`.
10. **Numeric formatting tokens** — DS does not publish accounting-style negatives (parentheses) as tokens. Spec uses JS formatter `new Intl.NumberFormat('en-US', { style:'currency', currency:'USD', currencySign:'accounting' })`; flag for DS team.
11. **Variables / token names** — Figma file's published-variables endpoint returns empty under the prototype API token (likely Enterprise-scoped). Tokens are therefore referenced by their canonical `--ap-*` names declared in `proto-defaults.css` / `alix-ui.css`. Frontend-dev must verify the exact CSS custom property names in `.designs/vendor/alix-ui.css` when implementing.

### Open UX questions

- Default tab — spec assumes **Overview** per plan. Confirm with PM that landing on Overview (not P&L) is correct for the CFO persona.
- "Generate CFO pack" tone in the success toast: "queued" vs "started" vs "ready in ~2 min" — copywriting input needed.
- Banner copy when close is **complete**: hide entirely, or show a `Type=Success` confirmation for 24 h?
- Should the FX-normalization toggle persist across sessions (localStorage) or reset per visit?
- Pixel-level KPI card width on 1440 px: `260` (spec default) vs `280` — tied to whether 8 cards must all be visible without scroll on the target resolution.

### Design → Code alignment

Filled by frontend-dev in Stage 3.

#### Deviations from spec (and reason)

| Spec assumption | Reality in `@alixpartners/ui-components` (vendor bundle) | Implementation taken |
|---|---|---|
| `Tabs` component with `items` + `value` + `onChange` props | DS exports `TabNavigation` (container) + `Tab` (child with `label`, `active`, `onClick`). No `items` array prop. | Composed `<TabNavigation>` with mapped `<Tab>` children, each wired to local `activeTab` state. |
| `NavBar` accepts a CTA slot for "Generate CFO pack" | `NavBar` exposes only `menuItems` and `additionalItems` (notifications/help/userProfile). No trailing CTA slot. | Added a composed sub-toolbar `.topbar__actions` row directly below the NavBar containing the primary "Generate CFO pack" `Button` plus a secondary "Export board report" `Button`. On ≤400 px the row hides per the spec's overflow rule. |
| `Banner Size=Medium` | DS Banner sizes are `sm \| md \| lg`. | Used `size="md"`. Trailing "View close calendar" link composed as an inline `<button class="banner-trailing">` inside `contentHTML`, since Banner has no explicit "trailing action" slot. Dismiss via `onClose`. |
| `Tag Type=Basic, Structure=Border, Trailing Icon=True` for filter chips | DS Tag: `type=basic` requires a `color` (gray/red/green/etc.). `onClose` produces the close (trailing) icon. | Filter chips and the basic-tone severity tag use `type="basic" color="gray"` with `onClose` for trailing X. `noIcon` is set on basic tags where the structure="solid" forced a redundant icon. |
| `Button type="ghost"` for quick links / Clear all | DS Button types are `primary \| secondary \| tertiary` only — no `ghost`. | Used `type="tertiary"` everywhere the spec called for ghost. |
| `Toggle` returns `boolean` | Toggle's `onChange` receives a `CheckedState` from Radix (`boolean | "indeterminate"`). | `setFxOn(!!v)` coerces to boolean before use. |
| DS `Card` primitive wrapping KPI / right rail blocks | No `Card` export in the bundle (only `Cards` *page* in Figma). | Composed `.card` class — `<div>` with `--ap-bg-surface` background, `--ap-border-soft` border, `--ap-radius-md` radius, `--ap-shadow-sm`. |
| DS `ProgressBar` for the close-cycle card | No `ProgressBar` export in the bundle. | Composed `.progress` + `.progress__fill` div pair; `role="progressbar"` + `aria-valuemin/max/now`. Switches to `.progress--error` (red fill) when any checklist task is `blocked`. |
| DS segmented Button group | No segmented primitive. | Composed `.seg` + `.seg__btn` with shared border + `aria-pressed`. Active button uses `--ap-primary` background per spec gap #9. |
| Sparkline as `Sparkline` primitive | None. | Inline `<svg>` polyline + 12% area fill, accent driven by direction (success/error) per spec gap #1 + accessibility note. |
| Variance arrow / RAG renderer as DS components | None. | Custom AG Grid `cellRenderer` HTML strings (`varianceRenderer`, `variancePctRenderer`, `ragRenderer`, `statusRenderer`). Each includes `aria-label` describing direction + magnitude. |
| `Datepicker` range mode for "Custom" date preset | DS `Datepicker` is single-date only (`onChange?: (value: Date | null) => void`). | "Custom" preset button is wired but selecting it does NOT open a range picker — keeps the segmented control state. Flagged here for DS team: spec needs DateRangePicker or pair of Datepickers. Out of scope to compose for the prototype. |
| `useToast` available globally | Hook throws if not inside `<ToastProvider>`. | Wrapped root component with `<ToastProvider>`; toast calls inside event handlers are guarded with try/catch falling back to `window.alert` per spec note. |
| Banner "dismissible" boolean | DS Banner has no `dismissible` prop — close button appears only when `onClose` is supplied (and `size` is not `sm`). | Pass `onClose={() => setBannerOpen(false)}`; banner state is component-local so it reopens on reload. |
| `cellRenderer` allowed to render a React `Tag` | AG Grid + React adapter not registered in the wrapper; rendering returns an HTML string. | RAG / status cells render inline pill HTML matching `Tag` solid variant styling (`.rag-cell--success/warning/error`) instead of mounting an actual `<Tag>` component. Same colors, same `--ap-*` tokens. |

#### `--ap-*` tokens used (declared on `:root` in the prototype)

Layout / surface
- `--ap-font`, `--ap-bg-page`, `--ap-bg-surface`, `--ap-bg-subtle`, `--ap-bg-muted`, `--ap-bg-info`
- `--ap-border`, `--ap-border-soft`
- `--ap-radius-sm`, `--ap-radius`, `--ap-radius-md`, `--ap-radius-lg`
- `--ap-space-1` … `--ap-space-8`
- `--ap-shadow-sm`, `--ap-shadow`

Type
- `--ap-text`, `--ap-text-2`, `--ap-text-muted`, `--ap-text-soft`, `--ap-text-on-primary`
- `--ap-text-display-xs` (22 px, used at ≤400 px), `--ap-text-display-sm` (28 px, default KPI value)

Semantic
- `--ap-primary`, `--ap-primary-2`, `--ap-primary-3`, `--ap-info`
- `--ap-success`, `--ap-success-2`, `--ap-success-bg`
- `--ap-error`, `--ap-error-2`, `--ap-error-bg`
- `--ap-warning`, `--ap-warning-2`, `--ap-warning-bg`

Values mirror the resolved Figma variables in the `@alixpartners/ui-components` bundle (`.designs/vendor/alix-ui.css`) and the prior `finance-dashboard` prototype. The DS Figma file's published-variables endpoint is Enterprise-scoped and was unavailable; canonical `--ap-*` names are used per `proto-defaults.css` convention (spec gap #11).

#### Surfaces fully implemented (not deviated)
- Three-breakpoint responsive (≤900 / ≤640 / ≤400 px) per spec.
- 8-card KPI strip with composed sparklines, delta Tag, `role="list"/"listitem"`, aria-labels.
- Filter bar (segmented date presets, multi-select entities, currency dropdown, FX toggle, compare-to) + chip row with per-chip removal and Clear all.
- Tab navigation across 6 tabs; **all 6 tabs render their AG Grid** (Overview also renders two placeholder charts and the Top variances grid).
- AG Grid `columnDefs` per spec — variance arrow renderer, RAG renderer, AR aging overdue cell classes, P&L subtotal row class via `rowClassRules`, accounting-style negatives (`currencySign:"accounting"`), AG Grid keyboard nav left intact.
- Right rail (4 stacked cards) with `position: sticky` on desktop, horizontal scroll-snap on tablet, vertical stack on mobile.
- Generate CFO pack opens `Dialog` with destinations checklist → `useToast().success(...)` on confirm.
- FX-normalized toggle re-formats all currency columns + KPI values without re-fetch (state-driven `Intl.NumberFormat`).
- Banner dismiss closes for session.

