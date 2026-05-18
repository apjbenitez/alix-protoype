## Prototype: manutato — Gym Administration Dashboard

### Scope
Admin dashboard for a local gym owner/manager to monitor daily operations at a glance. Shows key business metrics (active memberships, check-ins, revenue, class attendance), recent member activity, and upcoming scheduled classes. Designed for quick morning review and throughout-the-day monitoring of the gym floor.

### Persona & device
Gym owner or front-desk manager at a small-to-medium local gym (~200-500 members). Desktop-primary (used on the front desk computer), but must render legibly at tablet breakpoint for walking the floor with an iPad. Three breakpoints: >=1200px (desktop — full layout), <=900px (tablet — sidebar stacks below main), <=640px (mobile — single column, KPIs wrap 2x2).

### Primary action
"Check in member" — quick-access button in the header for front-desk workflow. Secondary actions: "Add new member", "View schedule".

### What already exists
- `.designs/vendor/alix-ui.css` and `.designs/vendor/alix-ui.js` — DS primitives including NavBar, Button, Icon, Card components.
- `.designs/waaaat-rebump-kpis/` — similar dashboard structure (NavBar + KPI strip + filters + main content + sidebar) that can inform layout patterns.
- No prior gym-specific prototype exists.

### Surfaces to mock

#### Header / NavBar
- Logo/gym name: "FitLife Gym" (or generic "Gym Admin")
- Primary nav: Dashboard (active) / Members / Classes / Payments / Settings
- Quick actions on right: "Check in" primary button, notification bell icon, user avatar menu
- Current date/time display

#### KPI strip (4 cards in a row)
1. **Active members** — total count, trend vs last month (e.g., "312 members", "+8 this month")
2. **Today's check-ins** — count so far today, comparison to same day last week (e.g., "47 check-ins", "vs 52 last week")
3. **Monthly revenue** — MTD amount, percentage of monthly target (e.g., "$18,450", "73% of goal")
4. **Classes today** — number of classes scheduled, total spots filled (e.g., "6 classes", "78/96 spots filled")

#### Quick filters bar
- Date selector: Today / This week / This month / Custom range
- Location filter (if multi-location): All locations / Downtown / Westside
- Membership type filter: All / Monthly / Annual / Day pass

#### Main content area (left 2/3)

**Recent check-ins table**
Live-updating list of the last 10-15 check-ins:
- Member photo (avatar placeholder)
- Member name
- Membership type (Monthly, Annual, Day pass)
- Check-in time
- Status indicator (valid, expiring soon, expired — for walk-in handling)

**Today's class schedule**
Horizontal cards or table showing today's classes:
- Class name (Spin, Yoga, HIIT, etc.)
- Time
- Instructor
- Capacity (filled/total)
- Status (upcoming, in progress, completed)

#### Right sidebar (1/3)

**Alerts card**
- Memberships expiring this week (count + "View" link)
- Outstanding payments (count + amount)
- Equipment maintenance due (if any flagged)

**Quick stats card**
- Peak hours graph placeholder (simple bar chart showing busiest hours)
- Average daily check-ins this week
- New signups this week

**Upcoming renewals card**
List of 5 members with renewals in next 7 days:
- Member name
- Expiry date
- Membership type
- "Send reminder" action

### Data to mock

**Members pool** — 15-20 member records with:
- Name (mix of short and long names, e.g., "Ana G.", "Christopher Rodriguez-Martinez")
- Membership type: Monthly, Annual, Day pass, Trial
- Status: Active, Expiring (within 7 days), Expired, Frozen
- Join date, last check-in date

**Check-ins** — 15 recent check-ins with timestamps spread across the morning (e.g., 6:00 AM to current time)

**Classes** — 6-8 classes for today:
- 6:00 AM — Spin (completed)
- 7:30 AM — Yoga (completed)
- 9:00 AM — HIIT (in progress)
- 12:00 PM — Pilates (upcoming)
- 5:30 PM — CrossFit (upcoming)
- 7:00 PM — Zumba (upcoming)
Include one class at full capacity and one with low attendance.

**Instructors** — 5-6 names

**Alerts data**:
- 4 memberships expiring this week
- 2 outstanding payments totaling $89
- 1 equipment maintenance flag

**Revenue** — Monthly target $25,000, current MTD varies to show progress

### States to cover

**KPI cards**
- Loading: skeleton shimmer
- Populated: normal display with values
- Error: inline error icon with "Unable to load" text

**Check-ins table**
- Loading: skeleton rows
- Empty: "No check-ins yet today" with clock icon
- Populated: normal list
- Error: table-level error message

**Class schedule**
- Loading: skeleton cards
- Empty: "No classes scheduled" (edge case)
- Populated: normal display
- One class showing "FULL" badge

**Alerts sidebar**
- All clear: "Everything looks good" with checkmark
- Populated: alert items with counts
- Critical: red highlight for expired memberships attempting check-in

**Quick actions**
- Check-in button: normal, hover, active states
- Notification bell: with/without badge count

### Out of scope
- App code under `app/`, route handlers, database access — prototype-only
- Real authentication or role-based permissions
- Actual check-in functionality (button can open a stub modal)
- Payment processing or Stripe integration
- Member detail pages (click on member row does nothing or shows a placeholder modal)
- Class booking flow
- Settings or configuration pages
- Multi-language support
- Real-time websocket updates (mock data is static)

### Open questions
For ux-designer (Stage 2):
1. Should the check-in button open a modal with member search, or navigate to a dedicated check-in page? (Recommend: modal for speed)
2. For the peak hours chart, is a simple CSS bar chart sufficient, or should we use a charting library? (Recommend: CSS-only for prototype simplicity)
3. Should expired-membership check-in attempts show inline in the table with a warning, or trigger a modal alert? (Recommend: inline warning row with "Handle" action)
4. Is there a DS avatar/thumbnail component for member photos, or use a simple circular div with initials?

For frontend-dev (Stage 3):
- Use mock data embedded in the HTML; no fetch calls needed
- Check-in timestamps should be relative ("5 min ago", "23 min ago") — can use simple JS or static text
- Class status (completed/in progress/upcoming) can be derived from hardcoded times vs a mock "current time"
