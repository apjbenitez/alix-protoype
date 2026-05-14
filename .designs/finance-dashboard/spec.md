# Finance Dashboard — Design Specification

> **Prototype**: `.designs/finance-dashboard/index.html`
> **Target**: `app/dashboard/page.tsx` (proposed; route does not exist yet)
> **Persona**: portfolio manager / desk lead reviewing the trading day after the 4:00 PM ET close.
> **Primary action**: scan today's P&L, drill into top movers, queue an EOD report.

---

## Design → Code alignment

The dashboard does not yet exist in code. The only relevant existing artifact is the `/api/hello` Postgres roundtrip from the bootstrap. Everything below is greenfield.

| Design element | In current code? | Action |
|---|---|---|
| `/dashboard` route | No | Create `app/dashboard/page.tsx` (server component) + `app/dashboard/Dashboard.tsx` (`'use client'`) |
| KPI data source | No | Add `app/api/eod/route.ts` returning `{ pnl, winRate, tradeCount, netExposure }` from the trades table |
| Positions data | No | Add `app/api/positions/route.ts` reading from a `positions` table (schema TBD) |
| Watchlist persistence | No | Add `user_watchlists` table keyed by user id + sym list |
| Send-daily-report action | No | Add `app/api/reports/eod/route.ts` (POST) that enqueues a job. Out of scope for the first screen |
| Auth / role gating | No | Wire whichever auth the team picks before this ships — the dashboard is data-sensitive |
| `ToastProvider` wiring | No | Move from prototype into `app/layout.tsx` so toasts work app-wide |

---

## Component tree

```
<ToastProvider>
  <NavBar projectName="TradingDesk" projectLogoIcon="ap-icon-logo-vault" projectTag="EOD"
          menuItems=[Dashboard|Positions|Trades|Reports|Settings]
          additionalItems={ notifications, userProfile } />

  <main className="page-wrap">
    <Banner type="info" content="Market closed at 4:00 PM ET …" isFullWidth />

    <header>
      <h1>End-of-day snapshot</h1>
      <div className="header-actions">
        <Datepicker dateFormat="Mon DD, YYYY" />
        <Search placeholder="Find symbol or strategy" />
        <Dropdown label="Account" />
        <Dropdown label="Asset class" multiSelect searchable />
        <Toggle label="Closed only" />
        <SplitButton trigger="split" buttonLabel="Export EOD"
                     actionOptions=[CSV|Excel|PDF] />
      </div>
    </header>

    <section className="kpi-grid">
      <KPI label="Daily P&L"        delta=<Tag success solid /> tip=<Tooltip /> />
      <KPI label="Win Rate"         delta=<Tag success solid /> />
      <KPI label="Trades Executed"  delta=<Tag warning solid /> />
      <KPI label="Net Exposure"     delta=<Tag basic border gray /> />
    </section>

    <TabNavigation>
      <Tab label="Overview" active />
      <Tab label="Positions" numberCount={24} />
      <Tab label="Trades" numberCount={142} />
      <Tab label="Allocations" />
      <Tab label="Compliance" hasError numberCount={2} />
    </TabNavigation>

    <div className="main-grid">
      <section>
        {/* tab-specific content */}
        <MoversPanel>  (Overview)
          <Tag success | error /> per gainer/loser
        <PositionsTable>
          <Checkbox /> per row
          <Tooltip><Tag basic /></Tooltip> for sector
          <Ghost variant="default">View</Ghost> for drilldown
        <LoadingTab>     (Trades)   <Spinner size="md" />
        <EmptyTab>       (Allocs)   <Illustration level=2 category="empty" name="search" /> + <Button>
        <ErrorTab>       (Compl.)   <Banner type="error" /> + <Button>Retry + <Ghost>
      </section>

      <aside className="sidebar">
        <Panel "Risk alerts"><Banner warning /><Banner info /></Panel>
        <Panel "Display settings">
          <Toggle /> ×2
          <Input type="number" icon="ap-icon-financial" />
          <RadioGroup><Radio /> ×3</RadioGroup>
        </Panel>
        <Panel "Watchlist"><TagsFields multiSelect searchable /></Panel>
        <Panel "Day notes">
          <Creatable multiSelect />
          <Textarea rows={3} resize="vertical" />
        </Panel>
        <Button icon="ap-icon-send">Send daily report</Button>
        <Dialog title="Send daily report" description="…" confirm/cancel />
      </aside>
    </div>
  </main>
</ToastProvider>
```

---

## States table

Every data-bearing component must define all four states. The prototype shows the populated state for Overview/Positions, plus dedicated tabs for the other three so reviewers can see them on one screen.

| Component | Loading | Empty | Error | Populated |
|---|---|---|---|---|
| KPI cards (`KPI`) | Skeleton block sized like the value (≥3 shimmer rectangles in the row) | "—" with a hint like "No trades today" | Tag in `error` with retry tooltip | Number + delta Tag |
| Top movers (`MoversPanel`) | Skeleton rows ×4 per column | "Markets closed flat — no movers" | `Banner type="error"` inside the panel | Two columns of rows |
| Positions table | Skeleton rows ×6 | "No open positions for this account" + `Button` "New trade" | Inline `Banner type="error"` above the table with retry | Rows with Checkbox / Tooltip / Tag / Ghost |
| Trades blotter (`Trades` tab) | `<Spinner size="md" color="dark" />` + "Loading trade blotter…" *(shown in prototype)* | `<Illustration empty/>` + "No fills today" | Banner + retry | Table of fills |
| Allocations (`Allocations` tab) | Skeleton chart | `<Illustration level=2 category="empty" name="search" />` + CTA *(shown in prototype)* | Banner + retry | Donut + sleeve list |
| Compliance (`Compliance` tab) | Spinner | "All checks passed today" + green Tag | `Banner type="error"` + Retry button *(shown in prototype)* | Per-rule status list |
| Sidebar Watchlist | Skeleton chips | "Add symbols to track" placeholder inside TagsFields | Inline error message on TagsFields | Chips of selected symbols |
| Day notes / Textarea | n/a (input) | Placeholder text | `errorMessage` prop on Textarea | Free text |

---

## @alixpartners/ui-components mapping

Every visible chrome element is a library primitive — only the `<table>`, `.kpi-card`, and `.panel` containers are hand-rolled (no library primitive covers tables or generic cards).

| UI element | Library primitive | Notes |
|---|---|---|
| Top nav (logo, menu, bell, avatar) | `NavBar` | `projectLogoIcon="ap-icon-logo-vault"` as the closest finance-flavored ApLogo. Swap if a real finance logo gets added |
| Market-closed strip | `Banner` `type="info"` `isFullWidth` `icon="ap-icon-clock"` | |
| Sidebar alerts | `Banner` `type="warning"` and `type="info"` `size="sm"` | |
| Compliance error | `Banner` `type="error"` `isFullWidth` | |
| Date picker | `Datepicker` `dateFormat="Mon DD, YYYY"` | |
| Symbol/strategy search | `Search` | Returns string via `onChange(value)` (not an event) |
| Account / asset class filter | `Dropdown` (single + `multiSelect` + `searchable`) | Value is always `string[]` even single-select |
| Closed-only switch | `Toggle` `labelPosition="right"` | `onChange` receives `CheckedState` (boolean \| 'indeterminate') |
| Export action | `SplitButton` `trigger="split"` with `actionOptions=[{value,label,action}]` | |
| Tabs | `TabNavigation` + `Tab` | `numberCount={n}` shows count, `hasError` paints red |
| KPI delta chips | `Tag` `type="success"`/`"warning"`/`"error"`/`"basic"` | `basic` requires `color`; semantic types do not |
| KPI label tip | `Tooltip` `size="sm"` `tipSide="top"` | `size: "sm"` disallows `onClose` (per types) |
| Sector chips in table | `Tag` `type="basic"` `structure="border"` `color={sectorColor}` | |
| Drill-down per row | `Ghost` `variant="default"` `noIcon` | |
| Send-report CTA | `Button` `type="primary"` `icon="ap-icon-send"` | |
| Send-report modal | `Dialog` controlled via `isOpen` + `onClose` | `title` + `description` required |
| Confirmation toast | `useToast()` from inside `ToastProvider` | `.success()` / `.error()` / `.warning()` |
| Loading state | `Spinner` `size="md"` `color="dark"` | |
| Empty state | `Illustration` `level={2}` `category="empty"` `name="search"` `size={140}` | Combined with a `Button` CTA |
| Display settings | `Toggle` ×2, `Input` `type="number"` with `icon="ap-icon-financial"`, `RadioGroup` + `Radio` ×3 | |
| Tracked symbols | `TagsFields` `multiSelect` `searchable` | |
| Day tags | `Creatable` `multiSelect` | Lets the PM add new tags inline |
| Free-form notes | `Textarea` `rows={3}` `resize="vertical"` `fullWidth` | |
| Per-row select | `Checkbox` | `onChange` receives `CheckedState` like Toggle |
| Section title chevrons | `Icon` `icon="ap-icon-bar"` / `"ap-icon-financial"` / `"ap-icon-alert"` / `"ap-icon-settings"` / `"ap-icon-bookmark"` / `"ap-icon-comment"` | |

Library primitives **not** demonstrated (deliberate omissions): `FilePicker`, `DragAndDrop`, `RichTextEditor`. They didn't fit the EOD-snapshot use case; revisit if a "upload trade file" or "compose research note" feature joins this screen.

---

## Interaction flows

1. **PM lands on dashboard** → KPIs populated → reads Overview tab (top movers + positions) → spots NVDA gainer + concentration warning in sidebar.
2. **Filter by account** → opens Account `Dropdown` → picks "Core Long Equity" → KPIs + Positions reflow (in real impl: refetch on filter change).
3. **Drill into a position** → clicks `Ghost`("View") on the NVDA row → (out of scope) navigates to `/positions/NVDA`.
4. **Inspect today's risk** → clicks `Compliance` tab (red error chip) → sees `Banner` + retry → clicks Retry → toast confirms retry.
5. **Send EOD report** → sidebar `Button` "Send daily report" → `Dialog` opens → confirms → toast confirms queued.
6. **Export** → clicks `SplitButton` (or its dropdown) → picks CSV/Excel/PDF.
7. **Adjust threshold** → sidebar `Input` (number) → `RadioGroup` chooses refresh cadence → (out of scope) persists per user.

---

## Layout

- **Container**: 1400 px max, 24 px gutter on desktop, 12 px on mobile.
- **Header row**: title left, filter+export cluster right, wraps when narrow.
- **KPI grid**: 4 cols ≥ 1100 px, 2 cols 640–1099 px, 1 col ≤ 640 px.
- **Main grid**: 2 fr / 1 fr (content / sidebar) ≥ 1100 px; stacks below.
- **Movers panel**: 2 cols ≥ 900 px; stacks below.
- **Positions table**: at ≤ 640 px the table linearizes — each row becomes a bordered card with label/value pairs. Header row hidden on mobile per skill convention.

Three breakpoints required by the skill:
- `≤900 px` tablet — movers stack
- `≤640 px` mobile — table → cards, single column, full-width filter inputs
- `≤400 px` small phone — typography compresses (h1 22 px, KPI value 22 px)

---

## Accessibility notes

- All filter controls use `label` props (not just placeholder) so screen readers announce them.
- KPI labels are wrapped in `Tooltip`; the `size="sm"` variant disallows close buttons per the library's types — fine for hover-only tooltips, but keyboard users need focus support: real impl should add `tabIndex={0}` to the wrapping `<span>` or use a `<button>` so the tip is reachable.
- `RadioGroup` carries `ariaLabel="Refresh cadence"` since there's no rendered `<fieldset>/<legend>`.
- `Dialog` is Radix-backed (per its docstring) — focus-trapping and ESC-to-close come for free.
- Color is never the only signal: P&L is reinforced with `+`/`−` prefixes and Tags; sector chips include text.
- The compliance error Banner uses `type="error"` (red) plus an explicit retry button — error state is actionable, not just informative.
- Tabular numerals applied to all numeric cells (`font-variant-numeric: tabular-nums`) so digits align without monospacing the whole table.

**Gaps to close at implementation time:**
- Add `aria-live="polite"` to the toast region (ToastProvider may already do this — verify).
- The mobile linearized table loses semantic `<th>` association — implementation should add `aria-label` or render visible field names inside each `<td>`.
- Tooltips on KPIs are mouseover-only in the prototype; real impl needs focus + Esc-to-dismiss.

---

## Open UX questions

1. **Refresh cadence default** — prototype uses "End of day only". Should the live websocket option be gated behind a feature flag or a role check?
2. **Account scoping** — the Account `Dropdown` is single-select. Should we support multi-account aggregation (e.g., "Core + Hedge combined"), or force the user to pick one base book?
3. **Compliance tab** — should the red `hasError` indicator persist after the user acknowledges the alert, or auto-clear on tab visit? Today it stays until backend reports green.
4. **Send-daily-report distribution** — the dialog says "desk distribution list" but doesn't show *which* list. Reveal recipients in the dialog, or open a second step?
5. **Mobile parity** — is the dashboard expected to be usable on a phone, or is mobile read-only at-a-glance? The current responsive treatment supports either, but the desk's actual access pattern needs confirmation.
6. **Empty Allocations CTA** — clicking "Configure allocations" goes where? `/settings/allocations` is the placeholder assumption; confirm route.
7. **Copy** — every user-facing string in the prototype (banner text, alert wording, dialog description) needs product/legal review before ship.
