# Settings — Design Specification

> **Prototype**: `.designs/settings/index.html`
> **Target**: `app/settings/page.tsx` (proposed; route does not exist yet)
> **Persona**: any signed-in user managing their account; trader/PM by default, but Operations and Risk may also live in some sections.
> **Primary action**: change a preference, save, move on. Secondary: rotate an API key, sign a session out, review what data sources are connected.

---

## Design → Code alignment

The settings page is greenfield. Some sections need backing tables/endpoints that don't exist yet; others (SSO, security policy) are governed by IT and the page is intentionally read-only there.

| Design element | In current code? | Action |
|---|---|---|
| `/settings` route | No | Add `app/settings/page.tsx` (server) + `app/settings/SettingsApp.tsx` (`'use client'`) holding the section state machine |
| User profile (name, email, role, photo) | No — auth not wired | Wait for SSO / user provider decision before persisting. Email comes from the IdP and stays disabled |
| Teams membership | No | Add `user_teams` join table when team-scoped alerts ship. Today, render as TagsFields against a static list |
| Notification preferences | No | Add `user_notification_prefs` (channels, event types, severity, quiet hours) + `app/api/me/notifications/route.ts` |
| Display preferences (theme, density, time format) | No | Persist per-user in `user_ui_prefs`. Theme can also be read on first paint via cookie to avoid flash |
| Trading defaults | No | Persist in `user_trading_defaults`. Used by the order ticket (out of scope here) |
| Data sources | No | Add `data_sources` table + `app/api/data-sources/route.ts`. Status (`live`/`stale`/`error`) is derived, not stored |
| API keys | No | Add `api_keys` table — store hashed key, prefix, scope, created_at, last_used_at, revoked_at. **Never store plain-text.** The "I've saved it" dialog is the only chance to show the secret |
| Active sessions | No | Add `sessions` table or read from the auth provider. Remote sign-out hits the provider's revoke endpoint |
| Danger zone | No | Each action maps to a specific API route, all idempotent. "Close account" needs a finance/ops review gate |
| Sticky save bar | n/a (purely UI) | The skill explicitly says no Next framework code inside the prototype; in the real impl this can be a client-only bar tied to a single form context. Mind the focus order |
| `ToastProvider` wiring | No | Move into `app/layout.tsx` once the dashboard ships so toasts are app-wide |

---

## Component tree

```
<ToastProvider>
  <NavBar projectName="TradingDesk" activeMenuItemHref="#settings" … />

  <main className="page-wrap">
    <header className="title-block">
      <h1>Settings</h1>
      <p>Manage your account, alerts, and integrations …</p>
    </header>

    <div className="settings-shell">
      <nav className="settings-nav">              ← sticky on desktop, horizontal-scroll on mobile
        <button>Profile</button>
        <button>Notifications</button>
        <button>Display & theme</button>
        <button>Trading defaults</button>
        <button>Data sources</button>
        <button>API keys</button>
        <button>Security</button>
        <button className="danger">Danger zone</button>
      </nav>

      <div className="panel">  ← active section
        <ProfileSection />
        | <NotifSection />
        | <DisplaySection />
        | <TradingSection />
        | <SourcesSection />
        | <ApiSection />          ← rich: 3 dialogs (create / show secret / revoke)
        | <SecuritySection />     ← read-only SSO row, active sessions table
        | <DangerSection />       ← 4 destructive actions, each behind a Dialog with danger variant
      </div>
    </div>
  </main>

  <div className="save-bar">                       ← sticky bottom
    <span className="dirty-pill">Unsaved … / All saved</span>
    <Ghost variant="cancel">Discard</Ghost>
    <Button type="primary" icon="ap-icon-check" loading={saving}>Save changes</Button>
  </div>
</ToastProvider>
```

### Per-section primitives (compact)
- **Profile**: `Input` ×4, `Dropdown`, `Datepicker` (disabled), `TagsFields`, `FilePicker` (single, png/jpg), `Textarea`.
- **Notifications**: `Banner` (info), `Toggle` ×4 (channels), `Checkbox` ×5 (events), `Dropdown` (severity), `RadioGroup`+`Radio` ×3 (quiet hours), `Input`.
- **Display**: `RadioGroup` ×2 (theme, density, horizontal orientation), `Toggle` ×2, `Dropdown` ×2.
- **Trading defaults**: `Banner` (warning), `Input` ×4, `Dropdown`, `Datepicker`, `Toggle`.
- **Data sources**: `Banner` (error, conditional, dismissable), card row × N with `Tag` (status), `Toggle`, `Ghost` (configure); `SplitButton` to add a source.
- **API keys**: `Banner` (warning), `Input` (name), `Button`, table of keys with `Tag` (scope), `Ghost` ×2 per row (rotate / revoke); three `Dialog`s — generate confirm, show-once secret (with reveal `Button` + copy `Button`), revoke confirm with `confirmButtonVariant="danger"`.
- **Security**: `RadioGroup` (MFA), `Toggle` (disabled — managed by IT), `Dropdown` (idle timeout), table of active sessions with `Tag` ("this session") + `Ghost` (variant="danger") for remote sign-out.
- **Danger zone**: `Banner` (error, full-width), four destructive `Button` (`type="secondary"`, `variant="danger"`); each opens a `Dialog` with `confirmButtonVariant="danger"`.

---

## States table

The settings page is mostly forms — most cells are populated from the user's saved prefs. "Loading" appears when initial prefs are being fetched and when the save spinner runs. "Empty" mostly only matters for the API keys table and active sessions table. "Error" appears for save failures and for data-source connection failures.

| Component | Loading | Empty | Error | Populated |
|---|---|---|---|---|
| Section content (initial load) | Skeleton rows replacing each field for ~300ms | n/a — there are always defaults | `Banner type="error"` at top of section + Retry | Real form values |
| Save action | `<Button loading>` swaps text to spinner | n/a | Toast (`useToast().error`) + Banner above the section | Toast success + `dirty=false` |
| Profile photo (`FilePicker`) | "Uploading…" hint on the row | Placeholder text ("PNG or JPG, ≤ 2 MB") | `errorMessage` prop on `FilePicker` (lib renders inline) | Filename + remove control |
| Teams `TagsFields` | Skeleton chips | Placeholder ("Add team") | inline error message | Chips of memberships |
| Data sources list | Skeleton card ×5 | "No sources configured — add one to get live data" + `SplitButton` | Per-card `Tag` `error` + sticky `Banner` at top; **shown in prototype** | Cards with `Tag` `success` `Live` |
| API keys table | Skeleton row ×4 | `Illustration` `empty` + "Create your first API key" | Banner above the table + Retry | Rows with `Tag` `read`/`write` + Ghost actions |
| Active sessions | Skeleton row ×3 | "Only this session is signed in" | Banner | Rows with "this session" `Tag` + Ghost `Sign out` |
| Danger zone | n/a | n/a | If an action fails, toast.error and keep the dialog open | Each action behind a `confirmButtonVariant="danger"` Dialog **(shown in prototype)** |
| Sticky save bar | `loading` prop on the Save Button when saving | n/a | If save 4xx/5xx, toast.error and keep dirty=true | "All changes saved" + 8 px green dot |

---

## @alixpartners/ui-components mapping

| UI element | Library primitive | Notes |
|---|---|---|
| Top nav | `NavBar` | Same chrome as dashboard; `activeMenuItemHref="#settings"` |
| Page-level info banners | `Banner` (`info` / `warning` / `error` / `success`) | `size="sm"` inside sections, `size="md"` `isFullWidth` for the danger zone |
| Section side nav | hand-rolled `<button>`s | The library has no vertical-nav primitive; `Tab`/`TabNavigation` is horizontal-only. Each button is keyboard-focusable, role can be `tab` if we want full ARIA — pending decision |
| Form labels everywhere | each primitive's `label` prop | Avoid hand-rolled `<label>`s; they don't get the lib's spacing/typography |
| Text fields | `Input` | `type="number"` for numeric fields; `type="password"` toggle implemented on the show-once dialog via reveal `Button` |
| Email/AT-icon | `Input` `icon="ap-icon-at"` `iconPosition="left"` | Used for the CC field in Notifications |
| Multi-select with chips | `TagsFields` `multiSelect` `searchable` | Teams; can be reused for tags elsewhere |
| Roles / single-select | `Dropdown` (no `multiSelect`) | Value is still `string[]` (`[role]`) per the lib's type |
| Date fields | `Datepicker` | `disabled` when the field comes from HR (Started date); `dateFormat="Mon DD, YYYY"` for consistency with dashboard |
| Toggles (channels, behaviors, source enabled) | `Toggle` `labelPosition="right"` | `disabled` for the IT-managed "Force SSO" row |
| Checkboxes (event subscriptions) | `Checkbox` | |
| Radios (theme, density, MFA, quiet hours) | `RadioGroup` + `Radio` | `orientation="horizontal"` for short choices (theme, density), `vertical` otherwise. Always set `ariaLabel` since there's no rendered fieldset |
| Free-form text | `Textarea` `rows={3}` `resize="vertical"` `fullWidth` | Bio field on Profile |
| Status pills | `Tag` `type="success"`/`"warning"`/`"error"` | Live / Stale / Error per data source; "this session" basic gray |
| Scope chips | `Tag` `type="basic"` `color="blue"` (read) / `color="red"` (write) | API keys table |
| File upload | `FilePicker` `type="single"` `fileExtensionsAllowed=["png","jpg","jpeg"]` `maxSize={2*1024*1024}` | Profile photo |
| Multi-action button | `SplitButton` `type="secondary"` `trigger="split"` | "Add source" with three creation modes |
| Per-row actions | `Ghost` `variant="default"`/`"danger"` | Rotate, Revoke, Sign-out, Configure |
| Primary save | `Button` `type="primary"` `icon="ap-icon-check"` `loading={saving}` `disabled={!dirty}` | In the sticky save bar |
| Confirmations | `Dialog` controlled via `isOpen` + `onClose` | `confirmButtonVariant="danger"` for revoke + danger-zone actions; `description` accepts ReactNode so the "show secret" dialog can embed a full Input + Reveal/Copy row |
| Toasts | `ToastProvider` + `useToast()` | Anchored bottom-right, 3.5 s autoHide, max 3 stacked |
| Section icons | `Icon` | `ap-icon-person`, `ap-icon-notification-filled`, `ap-icon-color`, `ap-icon-financial`, `ap-icon-sync`, `ap-icon-key`, `ap-icon-lock`, `ap-icon-alert` |
| Loading states | `Spinner` (inherited from `<Button loading>`) | Not currently used standalone — settings has no list pagination |

Library primitives **not** used here: `Tab` / `TabNavigation`, `Tooltip`, `Search`, `Creatable`, `DragAndDrop`, `RichTextEditor`, `Illustration`. They were demonstrated on the dashboard and don't fit settings naturally; documenting the omission so reviewers don't think it's an oversight.

---

## Interaction flows

1. **Tweak a preference**: navigate via SideNav → flip a `Toggle` / pick a `RadioGroup` value → `dirty=true`, save bar shows orange dot → click **Save changes** → button spinner → success toast → `dirty=false`, green dot.
2. **Generate API key**: API keys tab → enter name in `Input` → click **Generate key** → confirmation `Dialog` → on confirm, second `Dialog` opens with the full secret in a read-only `Input` (`type="password"`) + **Reveal** + **Copy** buttons → click **I've saved it** → dialog closes; the new row is at the top of the table.
3. **Revoke API key**: per-row **Revoke** (Ghost danger) → confirmation `Dialog` with `confirmButtonVariant="danger"` → on confirm, the row disappears + toast confirms.
4. **Remote sign-out**: Security tab → click **Sign out** on a non-current session → toast confirms. (Real impl: hits the IdP revoke endpoint, row disappears on next list refresh.)
5. **Toggle a data source**: Data sources tab → flip the per-card `Toggle` → marks dirty. A `Toggle` in OFF state still shows the row so the user can re-enable. The error `Banner` only shows when at least one source is in `error` state.
6. **Danger zone**: SideNav → Danger zone tab → click any action → `Dialog` with red Confirm. (Real impl should add a "type the verb to confirm" gate inside the dialog — current prototype only mentions it in the description.)
7. **Discard changes**: save bar → **Discard** Ghost → resets local state, warning toast.

---

## Layout

- **Container**: 1280 px max width on desktop, 12 px gutter on mobile. Reads narrower than the dashboard because settings forms benefit from shorter line lengths.
- **Two-column shell**: 220 px sticky side nav + flexible content column. Side nav stays in view while scrolling long sections.
- **Section panels**: 20 px internal padding, 16 px between sub-sections separated by a thin top border. Each sub-section has its own `<h3>` so screen-reader landmarks make sense.
- **Form grid**: 2 columns on desktop, 1 column ≤900 px. Helper text always sits directly under the field via the library's `helpText` prop — never as a separate `<small>`.
- **Sticky save bar**: full-width strip at the bottom, on top of content. Pushes the page content's bottom padding (120 px) so nothing is hidden behind it.
- **Mobile (≤900 px)**: side nav converts to a horizontal-scroll row at the top of the shell. Section content fills the viewport.
- **Mobile (≤640 px)**: tables (`Existing keys`, `Active sessions`) linearize into labeled cards using the same `data-label::before` pattern as the dashboard. Save bar wraps to two rows so the "Unsaved" pill keeps a full line.

Three breakpoints required by the skill:
- `≤900 px` tablet — side nav goes horizontal, form grid collapses
- `≤640 px` mobile — tables → cards, save bar wraps
- `≤400 px` small phone — h1 22 px

---

## Accessibility notes

- Section nav: today it's `<button>`s. To match WAI-ARIA "tabs" semantics, the real impl should set `role="tab"`, `aria-selected`, and pair with `role="tabpanel"` on the content. Arrow-key navigation within the nav is also expected for that pattern.
- Every form control comes from the library and inherits the lib's keyboard/focus behavior. Verify TAB order in Storybook before ship.
- The sticky save bar is a footer; expose it via `<footer role="contentinfo">` (or `aria-label="Settings save bar"`) so screen readers don't read it as part of the section content.
- The "Unsaved changes" indicator currently relies on a colored dot. Add an `aria-live="polite"` region announcing "Unsaved changes" / "All changes saved" so non-sighted users notice the state flip.
- `Dialog` is Radix-backed — focus trap, ESC, and overlay click are wired by the library. Confirm-dialog descriptions are ReactNode-typed; ensure the "show secret" dialog's nested Input + buttons get correct focus on open.
- All `RadioGroup`s set `ariaLabel`. All `Toggle`s use the library's `label` prop (no orphan switches).
- `disabled` state is used for IT-controlled rows (Force SSO, employee email, started date). Pair it with `helpText` explaining *why* it's disabled so users don't think the page is broken.
- Color is never the only signal: status pills include text ("Live"/"Stale"/"Error"), scope pills say "read"/"write", and dirty/clean dots have the words right next to them.

**Gaps to close at implementation time:**
- The "type the verb to confirm" gate on the danger-zone dialogs is described in copy but not enforced by the prototype. Add a real `Input` inside the dialog and disable Confirm until it matches.
- Make sure the save bar doesn't obscure inline form errors near the bottom of a long section. Either keep the bar inside the flow at the very bottom on long pages, or scroll the focused field above the bar when an error appears.
- Verify that the FilePicker drag-and-drop area is keyboard reachable.

---

## Open UX questions

1. **Should the side nav use ARIA tabs or just an in-page nav?** The choice affects keyboard nav (arrow keys vs Tab) and how the URL reflects the active section (?section=api?).
2. **Per-section vs global save** — today, Save is a single global button at the bottom. If sections have very different update endpoints (Profile vs Data sources), per-section save might be clearer. Trade-off: more UI, but more reliable for partial saves.
3. **Dirty navigation guard** — if `dirty=true` and the user clicks a NavBar link or another SideNav section, do we (a) silently switch, (b) show a confirmation dialog, or (c) autosave?
4. **Danger zone scope** — "Close account" needs a finance/ops review gate before it can actually delete data. Should we hide that action behind an admin role until the back-end gate exists?
5. **API key "scope"** — prototype only shows `read` / `write`. The real model is probably finer-grained (per-resource scopes). Need product input on the actual scope surface before the table column means anything.
6. **Data source connection failure** — the prototype shows a top-level `Banner type="error"` whenever any source has status `error`. Is that the right escalation, or should errors stay per-card?
7. **Time format & locale** — the prototype lets the user pick 12h vs 24h but doesn't expose locale separately. Should the same setting govern decimal/thousands separators in tables, or is that the "Show thousands separators" toggle's job alone?
8. **Photo upload host** — where does the uploaded avatar live? S3? Internal blob store? Affects whether `FilePicker.onUpload` is a one-shot multipart POST or a presigned-URL dance.
9. **Active sessions list** — does the auth provider expose this? If not, fall back to "only this device" + "sign out everywhere else" without the table.
10. **Copy review** — every dialog description, every danger-zone subtitle, every helper text needs product/legal sign-off before ship.
