## UI Spec: Manutato — Gym Administration Dashboard

- Prototype path: `.designs/manutato/index.html`
- Plan path: `.designs/manutato/plan.md`
- Source DS: AlixPartners **Platforms Design System** — Figma file `uKDQ4UPs40MQXxn6CrcqTO`

### Figma reference
None — applying DS standards from Platforms Design System. Layout pattern draws from `.designs/waaaat-rebump-kpis/` (NavBar + KPI strip + main content + sidebar).

---

### Component tree

```
- `Shell` (root)
  - `NavBar` — DS Navigation Bar
    - brand "FitLife Gym"
    - menu: Dashboard (active) / Members / Classes / Payments / Settings
    - trailing slot: `Button type="primary"` "Check in" + notification `Icon` bell + user avatar menu
  - `KpiStrip` (horizontal flex row, `.grid-safe`)
    - `KpiCard` x 4 (composed `Card` + label/value/trend)
      1. Active members — "312 members", "+8 this month"
      2. Today's check-ins — "47 check-ins", "vs 52 last week"
      3. Monthly revenue — "$18,450", "73% of goal"
      4. Classes today — "6 classes", "78/96 spots filled"
  - `QuickFiltersBar` (composed)
    - Date presets: segmented `Button` group (Today / This week / This month / Custom)
    - Membership type `Dropdown`: All / Monthly / Annual / Day pass
  - `MainContent` (CSS grid: 2fr 1fr at desktop)
    - `LeftColumn`
      - `RecentCheckInsCard` (composed `Card`)
        - Header: "Recent check-ins" + "See all" link
        - `AgGrid` — 10 rows (member avatar, name, membership type, time, status)
      - `TodayClassesCard` (composed `Card`)
        - Header: "Today's classes"
        - `AgGrid` — 6 rows (class name, time, instructor, capacity, status)
    - `RightSidebar`
      - `AlertsCard` (composed `Card`)
        - List of `AlertRow` (icon + text + count/amount + "View" link)
      - `QuickStatsCard` (composed `Card`)
        - Peak hours bar chart (CSS-only)
        - Stat rows: avg daily check-ins, new signups
      - `UpcomingRenewalsCard` (composed `Card`)
        - 5 rows: member name, expiry date, type, "Send reminder" `Button`
  - `CheckInDialog` — DS `Dialog`
    - Phase: `search` — member search input + results list
    - Phase: `confirm` — selected member details + confirm `Button`
    - Phase: `success` — success message + close
```

---

### States

| Component | Loading | Empty | Error | Populated |
|-----------|---------|-------|-------|-----------|
| `KpiStrip` | 4 skeleton cards (shimmer rects for value + trend) | n/a (always has data) | Single error `Card` spanning strip + retry `Button` | 4 `KpiCard`s with value + trend `Tag` |
| `KpiCard` | shimmer rect for value | dash `—` for value | red border + alert `Icon` + "Unable to load" | label + value + trend delta |
| `RecentCheckInsCard` | AG Grid `overlayLoadingTemplate` | Grid overlay: clock `Icon` + "No check-ins yet today" | Grid overlay: error `Icon` + retry `Button` | 10 rows with member data |
| `TodayClassesCard` | AG Grid `overlayLoadingTemplate` | Grid overlay: "No classes scheduled" | Grid overlay: error + retry | 6 rows; one with "FULL" `Tag` |
| `AlertsCard` | 3 shimmer rows | check `Icon` + "Everything looks good" | inline `Banner type="error" size="sm"` | 3 `AlertRow`s with counts |
| `QuickStatsCard` | shimmer bars + text | "No data" placeholder | inline error text | bar chart + stat values |
| `UpcomingRenewalsCard` | 5 shimmer rows | "No upcoming renewals" | inline error text | 5 member rows |
| `CheckInDialog` | `Spinner` in results area | "Type to search members" | `Banner type="error"` + retry | Search results list |

---

### `@alixpartners/ui-components` mapping

| UI element | Library export | Key props | Notes |
|------------|----------------|-----------|-------|
| Top bar | `NavBar` | `projectName="FitLife Gym"`, `menuItems`, `additionalItems`, `activeMenuItemHref` | DS Navigation Bar |
| Primary CTA "Check in" | `Button` | `type="primary"` | Triggers `CheckInDialog` |
| Secondary actions | `Button` | `type="secondary"` | "Add new member", "View schedule" |
| Tertiary / ghost links | `Button` | `type="tertiary"` | "See all", "View", quick links |
| Quick filter presets | composed segmented `Button` group | `type="secondary"`, active uses `type="primary"` | No DS primitive; compose manually |
| Membership filter | `Dropdown` | `options`, `value`, `onChange` | Single-select |
| Status pill (valid/expiring/expired) | `Tag` | `type="success" \| "warning" \| "error"`, `structure="solid"`, `size="small"` | AG Grid cell renderer |
| Class status (upcoming/in progress/completed) | `Tag` | `type="basic" \| "success" \| "warning"` | AG Grid cell renderer |
| Capacity badge "FULL" | `Tag` | `type="error"`, `structure="solid"`, `size="small"` | |
| Alert severity | `Tag` | `type="error" \| "warning" \| "basic"` | In `AlertsCard` |
| Trend indicator (+/-) | `Tag` | `type="success"` (positive), `type="error"` (negative) | In KPI cards |
| Data grids | `AgGrid` (vendor wrapper) | `columnDefs`, `rowData`, `defaultColDef`, `gridOptions` | All tables |
| Feedback toasts | `useToast()` | `.success()`, `.error()` | Check-in success/failure |
| Check-in modal | `Dialog` | `isOpen`, `onClose`, `title` | Multi-phase modal |
| Loading spinner | `Spinner` | `size="sm"` | In dialog search |
| Icons | `Icon` | `name="ap-icon-*"`, `size` | Bell, alerts, etc. |
| Error banner | `Banner` | `type="error"`, `size="sm"` | Inline errors |

#### AG Grid `columnDefs`

**Recent check-ins:**
```
[
  { field: "avatar", headerName: "", width: 48, cellRenderer: "avatarRenderer", sortable: false, filter: false },
  { field: "name", headerName: "Member", flex: 2, pinned: "left" },
  { field: "membershipType", headerName: "Type", flex: 1, cellRenderer: "tagRenderer" },
  { field: "checkInTime", headerName: "Time", flex: 1, valueFormatter: relativeTime },
  { field: "status", headerName: "Status", flex: 1, cellRenderer: "statusRenderer" }
]
```

- `avatarRenderer`: Circular div (40px) with initials, background `--ap-bg-muted`
- `statusRenderer`: `Tag` with `type="success"` (valid), `type="warning"` (expiring), `type="error"` (expired)
- Expired rows: additional inline warning with "Handle" action button

**Today's classes:**
```
[
  { field: "className", headerName: "Class", flex: 2, pinned: "left" },
  { field: "time", headerName: "Time", flex: 1 },
  { field: "instructor", headerName: "Instructor", flex: 1.5 },
  { field: "capacity", headerName: "Capacity", flex: 1, cellRenderer: "capacityRenderer" },
  { field: "status", headerName: "Status", flex: 1, cellRenderer: "classStatusRenderer" }
]
```

- `capacityRenderer`: "45/50" format; shows `Tag type="error"` "FULL" when at capacity
- `classStatusRenderer`: `Tag type="basic"` (completed — gray), `Tag type="warning"` (in progress — amber), `Tag type="success"` (upcoming — green)

**`defaultColDef`:** `{ resizable: true, sortable: true, filter: true, flex: 1, minWidth: 80 }`. `rowHeight: 48`, `headerHeight: 36`.

---

### Interaction flows

1. **Check in member (primary action)**
   1. User clicks "Check in" `Button` in `NavBar`
   2. `CheckInDialog` opens in **search phase**: title "Check in member", search input focused
   3. User types member name → results populate below (debounced 300ms)
   4. User clicks a member row → dialog transitions to **confirm phase**
   5. **Confirm phase** shows: member photo/initials, name, membership type, status
      - If status is "expired" → warning `Banner` "Membership expired on [date]. Proceed anyway?"
   6. User clicks "Confirm check-in" `Button` → POST request (mocked)
   7. Success → dialog closes, `useToast().success("Ana G. checked in")`, check-ins table updates with new row at top
   8. Failure → error `Banner` in dialog + retry option

2. **View expired membership alert (inline in table)**
   1. Check-in table shows row with `Tag type="error"` "Expired" status
   2. Row also has "Handle" `Button type="tertiary"` inline
   3. User clicks "Handle" → `Dialog` opens with options: "Renew membership" / "Allow one-time entry" / "Cancel"
   4. Selection triggers appropriate toast and updates row

3. **Filter by date/membership**
   1. User clicks "This week" in date presets → preset becomes active (primary style)
   2. Tables show filtered data (mocked: static data, no actual filtering in prototype)
   3. User selects "Monthly" in membership `Dropdown` → chip appears (optional)

4. **Send renewal reminder**
   1. User clicks "Send reminder" in `UpcomingRenewalsCard`
   2. `Button` shows `Spinner` briefly (300ms)
   3. Success → `useToast().success("Reminder sent to [name]")`, button becomes `Button type="tertiary"` "Sent" (disabled)

5. **View alerts**
   1. User clicks "View" link on an alert row → stub navigation (logs to console or shows placeholder modal)

---

### Layout

Three mandatory breakpoints following prototype conventions.

**Desktop >= 901 px (target 1200)**
```
Shell grid:
- grid-template-columns: 1fr
- grid-template-rows: auto auto auto 1fr

MainContent grid:
- grid-template-columns: 2fr 1fr
- gap: var(--ap-space-4)
```
- `NavBar`: full width
- `KpiStrip`: horizontal flex row, 4 cards with `min-width: 220px`, `flex: 1 1 220px`
- `QuickFiltersBar`: single row, flex
- `MainContent`: two columns — left (grids stacked) + right sidebar (cards stacked, `position: sticky; top: 16px`)

**Tablet <= 900 px**
- `MainContent`: single column, sidebar drops below main content
- `KpiStrip`: horizontal scroll, 2-3 cards visible, `scroll-snap-type: x mandatory`
- `QuickFiltersBar`: wraps to two rows if needed
- AG Grids: horizontal scroll within container
- `RightSidebar`: becomes horizontal scroll row of cards OR stacks vertically below

**Mobile <= 640 px**
- `KpiStrip`: 2x2 grid layout OR vertical stack (accessibility preference)
- `QuickFiltersBar`: collapses to single `Button` "Filters" opening bottom-sheet `Dialog`
- AG Grids: horizontal scroll, "Scroll right to see more" hint badge
- All cards: full width, stacked vertically
- `NavBar`: menu collapses to hamburger icon

**Small phone <= 400 px**
- `NavBar`: "Check in" button moves to overflow menu (icon only in nav)
- `KpiCard` values: font drops from `--ap-text-display-sm` to `--ap-text-display-xs`
- `Tag` sizes: drop to `size="small"` everywhere
- AG Grid: `rowHeight: 56` (taller for touch targets)

---

### Accessibility notes

- **Tab order**: NavBar logo → menu items → "Check in" button → notification bell → user menu → KPI cards (focusable, arrow-key nav) → filter controls → check-ins grid → classes grid → sidebar cards → renewal action buttons
- **Keyboard navigation**:
  - Filter presets: `role="group"` with `aria-label="Date filter"`, arrow keys between buttons
  - AG Grid: built-in keyboard nav (arrows, Page Up/Down, Enter to select)
  - Dialog: focus trapped, Escape closes, Tab cycles through interactive elements
- **Screen reader labels**:
  - Avatar cells: `aria-label="Member photo: [name]"` (since initials are decorative)
  - Status tags: include descriptive text, e.g., `aria-label="Status: membership expiring in 3 days"`
  - KPI trend: `aria-label="+8 members compared to last month"` — direction not conveyed by color alone
  - Peak hours chart: `aria-label="Peak hours: 6 AM and 5 PM are busiest"` on the bar chart container
- **Color contrast**: All `Tag` variants meet 4.5:1 per DS tokens. Verify expired (red) tag text-on-background.
- **AG Grid mobile**: Tables horizontal-scroll on <= 640 px. Show visible hint "Scroll to see more" on first render; hide after interaction.
- **Reduced motion**: Respect `prefers-reduced-motion: reduce` for toast animations and dialog transitions.
- **Focus styles**: DS focus ring tokens (`--ap-focus-ring`) used everywhere; never `outline: none`.

---

### Design system gaps

Components the DS does NOT export — documented composition for each:

1. **KpiCard** — DS has no dedicated KPI card. Compose: `Card` wrapper → label (`--ap-text-muted`, 13px) → value (`--ap-text-display-sm`, 24px) → trend row with `Tag` (success/error based on direction).

2. **Card** — No `Card` export in vendor bundle. Compose: `<div>` with `background: var(--ap-bg-surface)`, `border: 1px solid var(--ap-border-soft)`, `border-radius: var(--ap-radius-md)`, `box-shadow: var(--ap-shadow-sm)`, `padding: var(--ap-space-4)`.

3. **Avatar / Member photo** — No avatar component. Compose: circular `<div>` (40px x 40px), `border-radius: 50%`, `background: var(--ap-bg-muted)`, `color: var(--ap-text-muted)`, centered initials (14px, medium weight). For members with photos (future), `<img>` with `object-fit: cover`.

4. **Segmented button group** — No DS primitive. Compose: `<div role="group">` containing `Button type="secondary"` siblings with shared border (remove border-radius on adjacent sides). Active button uses `type="primary"`.

5. **Peak hours bar chart** — No charting component. Compose: CSS flex row of `<div>`s with:
   - `height: [percentage of max]%`, `max-height: 80px`
   - `width: 20px`, `background: var(--ap-primary)`, `border-radius: var(--ap-radius-sm) var(--ap-radius-sm) 0 0`
   - X-axis labels below each bar (hour text)

6. **AlertRow** — No dedicated alert list component. Compose: flex row with `Icon` (16px, semantic color) + text + count `Tag` + `Button type="tertiary"` "View".

7. **Search input** — DS likely has `Input`. If not, compose: `<input type="search">` with `border: 1px solid var(--ap-border)`, `border-radius: var(--ap-radius)`, `padding: var(--ap-space-2) var(--ap-space-3)`, leading search `Icon`.

8. **Multi-phase Dialog** — DS `Dialog` has no wizard support. Compose by swapping content based on internal `phase` state. Manage focus programmatically when phase changes.

---

### Open UX questions

All resolved per task context:

1. **Check-in button** → Opens a modal with member search (confirmed — for speed)
2. **Peak hours chart** → CSS-only bars (confirmed — no charting library)
3. **Expired membership check-in** → Inline warning row with "Handle" action button (confirmed)
4. **Member photos** → Circular div with initials (confirmed — no avatar component needed)

No remaining open questions.

---

### Mock data requirements

**Members (15-20):**
- Mix of names: "Ana G.", "Christopher Rodriguez-Martinez", "Mike Chen", "Sarah Kim", etc.
- Membership types: Monthly, Annual, Day pass, Trial
- Statuses: Active (10), Expiring within 7 days (3), Expired (2)

**Check-ins (15):**
- Timestamps from 6:00 AM to current time
- Include 1-2 expired-membership check-in attempts (flagged rows)

**Classes (6-8):**
- 6:00 AM Spin (completed, 28/30)
- 7:30 AM Yoga (completed, 15/20)
- 9:00 AM HIIT (in progress, 22/25)
- 12:00 PM Pilates (upcoming, 8/15)
- 5:30 PM CrossFit (upcoming, 30/30 — FULL)
- 7:00 PM Zumba (upcoming, 12/25)

**Alerts:**
- 4 memberships expiring this week
- 2 outstanding payments ($89 total)
- 1 equipment maintenance flag

**Renewals:**
- 5 members with expiry in next 7 days

---

### Design to Code alignment

| Spec element | What was built | Reason for delta |
|---|---|---|
| KPI trend `Tag` (success/error based on direction) | Plain text trend string (e.g., "+8 this month") | KPI values are descriptive text rather than numeric deltas; tags would add visual noise without adding clarity for the gym context |
| Check-ins table expired row with "Handle" inline action | Expired status shown as Tag; handling done via check-in dialog flow | Simplified implementation — expired members can be handled during check-in confirmation phase which already shows warning banners |
| Location filter in QuickFiltersBar | Omitted | Plan specified single-location gym; multi-location filter marked as "(if multi-location)" |
| Custom date range option | Omitted from segmented control | Prototype scope — Today/This week/This month covers dashboard use cases; custom range would require a date picker Dialog |
| NavBar notification bell badge count | Bell icon without count badge | Tag component `noIcon` prop combined with positioning would require custom CSS; basic bell icon sufficient for prototype |
| Mobile filter bottom-sheet Dialog | Placeholder button only | Prototype scope — mobile-specific interaction pattern deferred |
| AG Grid `overlayLoadingTemplate` / empty states | Not implemented | Prototype shows populated state only per typical prototype scope; loading/empty/error states documented in spec for future implementation |
