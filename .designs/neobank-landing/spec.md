# Neobank Landing (Nala) — Design Specification

> **Prototype**: [`.designs/neobank-landing/index.html`](./index.html)
> **Plan**: [`.designs/neobank-landing/plan.md`](./plan.md)
> **Persona**: adult LATAM mobile-first visitor (25-45) coming from a social ad or referral, evaluating a new digital bank in under 30 seconds.
> **Primary action**: click the hero CTA **"Abre tu cuenta gratis"** to start onboarding.
> **Visual system**: AlixPartners DS (`--ap-*` tokens, Roboto). Brand stays on the Alix corporate blue — no separate "Nala" accent color.

---

## Figma reference

None. Applying DS standards from the **Platforms Design System** (Figma file `uKDQ4UPs40MQXxn6CrcqTO`) and the established conventions in `.designs/finance-dashboard/`.

---

## Resolved decisions (from plan open questions)

| Q | Decision |
|---|---|
| Widget C chart | Horizontal bars (no donut) |
| Hero card holder | "María González" |
| Category icons | No `ap-icon-*` exists for food/transport/etc → **always** fall back to colored circle + first-letter glyph |
| Navbar sticky | Not sticky at any breakpoint |
| Secondary CTA | Smooth `scroll-into-view` to `#dashboard-preview`, no pulse animation |
| Brand color | `--ap-primary` (#024870) untouched |
| Hero typography | Roboto **700** at 56 / 40 / 28 px |
| Category enum | Internal `'Food' \| 'Subscriptions' \| 'Transfer' \| 'Shopping' \| 'Transport'`; Spanish labels via `categoryLabels` map |
| Trust strip disclaimer | Disclaimer line lives in the footer, not in the trust strip |

---

## Locked mock data

### Balance (Widget A)
| Field | Value |
|---|---|
| `amountUsd` | `12847.32` |
| `deltaPct` | `4.2` |
| `deltaDirection` | `'up'` |
| `periodLabel` | `"vs mes anterior"` |
| Rendered | `$ 12,847.32` + Tag `success` `"+4.2% vs mes anterior"` |

### Transactions (Widget B) — 5 rows in this exact order
| # | merchant | category | amountUsd | date | renderedDate |
|---|---|---|---|---|---|
| 1 | `"Rappi"` | `Food` | `-12.40` | `2026-05-15` | `"Hoy"` |
| 2 | `"Transferencia recibida - Carlos M."` | `Transfer` | `+250.00` | `2026-05-15` | `"Hoy"` |
| 3 | `"Spotify Premium"` | `Subscriptions` | `-9.99` | `2026-05-14` | `"Ayer"` |
| 4 | `"Uber"` | `Transport` | `-7.85` | `2026-05-13` | `"13 May"` |
| 5 | `"Mercado Libre"` | `Shopping` | `-89.50` | `2026-05-12` | `"12 May"` |

Notes for frontend-dev:
- Row 2 (`Transferencia recibida - Carlos M.`) is the long-name truncation probe — ellipsis at the merchant cell, never wrap.
- Negatives render in `--ap-text` (default), positives render in `--ap-success`.
- Tabular numerals on all amounts.
- Date column hides at ≤640 px; merchant ellipsises sooner so the chip+amount stay visible.

### Category spend (Widget C) — 5 rows, sorted desc by pct
| category (label visible) | enum | amountUsd | pctOfTotal | color token |
|---|---|---|---|---|
| Comida | `Food` | `342.18` | `38` | `--ap-primary` |
| Transporte | `Transport` | `198.45` | `22` | `--ap-primary-2` |
| Suscripciones | `Subscriptions` | `162.30` | `18` | `--ap-warning` |
| Compras | `Shopping` | `126.20` | `14` | `--ap-success` |
| Otros | (n/a) | `72.10` | `8` | `--ap-text-soft` |

The 8% bar is the small-value probe — must stay visible (min-width 8% of track but always ≥4 px so it never collapses).

### Quick actions (Widget D) — 4 tiles
| label | icon (intended) | fallback |
|---|---|---|
| Transferir | `ap-icon-send` | not in bundle → use SVG arrow-right inside circle |
| Recargar | `ap-icon-add` | exists in bundle |
| Pagar | `ap-icon-document` | exists in bundle |
| Invertir | `ap-icon-bar` | exists in bundle |

### Hero virtual card (static mock)
| Layer | Spec |
|---|---|
| Container | 320 × 200 px desktop, 88% width mobile, `--ap-radius-lg` (8 px), shadow `0 10px 30px rgba(0,0,0,.18)` |
| Gradient | Linear 135° from `--ap-primary` (#024870) top-left to `--ap-primary-2` (#0369a3) bottom-right |
| Chip | 36 × 26 px rounded rect top-left at `--ap-space-5` (20 px) inset, gold tone `#c8a45c` (mock card chip — no DS token) |
| Brand wordmark | "Nala" in Roboto 700, 22 px, white, top-right at same inset |
| PAN | "•••• •••• •••• 4521", Roboto 500, 18 px, tabular-nums, white, vertical centerline |
| Holder | "MARÍA GONZÁLEZ" uppercase, Roboto 500, 11 px, letter-spacing 0.08em, bottom-left, color `rgba(255,255,255,.85)` |
| Expiry | "12/29", Roboto 500, 11 px, bottom-right, color `rgba(255,255,255,.85)` |
| Tilt | `transform: rotate(-3deg)` desktop, `rotate(0)` ≤640 px |

---

## Component tree

```
<body>
  <header role="banner">
    <NavBar projectName="Nala" projectLogoIcon="ap-icon-logo-alixpartners"  // placeholder; no Nala logo in DS
            projectTag="Demo"
            menuItems=[{label:"Producto", href:"#features"},
                       {label:"Cómo funciona", href:"#dashboard-preview"},
                       {label:"Precios", href:"#"},
                       {label:"Soporte", href:"#"}]
            additionalItems={[
              <Button type="ghost"   label="Ingresar" />,
              <Button type="primary" label="Abre tu cuenta gratis" />
            ]} />
  </header>

  <main>

    <section id="hero" className="hero">
      <div className="hero__copy">
        <p className="hero__eyebrow">Nala · Banca digital sin vueltas</p>
        <h1 className="hero__title">Tu banco, sin vueltas.</h1>
        <p className="hero__subtitle">Abre una cuenta en minutos, manejá tu dinero desde el celular y olvidate de comisiones que no entendés.</p>
        <div className="hero__ctas">
          <Button type="primary"   size="lg" label="Abre tu cuenta gratis" />
          <Button type="secondary" size="lg" label="Ver cómo funciona"
                  onClick={scrollTo('#dashboard-preview')} />
        </div>
        <p className="hero__trust">Regulado · Depósitos protegidos · Soporte 24/7</p>
      </div>

      <aside className="hero__card" aria-hidden="true">
        {/* Static virtual-card mock — pure HTML, see "Locked mock data" */}
      </aside>
    </section>

    <section id="dashboard-preview" className="preview">
      <header className="section-head">
        <h2>Así se ve tu día a día con Nala</h2>
        <p>Un vistazo a la app: tu plata, ordenada y sin sorpresas.</p>
      </header>

      <div className="preview__frame">
        <div className="preview__chrome">
          {/* macOS-style three dots + mini "Nala" wordmark + circular avatar placeholder */}
        </div>

        <div className="preview__grid">
          <div className="panel panel--balance"  data-widget="A">
            <p className="panel__eyebrow">Saldo total</p>
            <p className="panel__amount">$ 12,847.32</p>
            <Tag type="success" structure="solid" label="+4.2% vs mes anterior" />
          </div>

          <div className="panel panel--tx" data-widget="B">
            <header className="panel__head">
              <h3>Últimas transacciones</h3>
            </header>
            <ul className="tx-list">
              {/* 5 rows. Each row = plain <li>, see "Transactions" mock.
                  NOT AG Grid — only 5 rows, AG Grid would be overkill. */}
              <li className="tx-row">
                <span className="tx-icon" data-cat="Food"     >R</span>
                <span className="tx-merchant">Rappi</span>
                <Tag type="basic" structure="border" color="primary" label="Comida" />
                <span className="tx-amount">-$ 12.40</span>
                <span className="tx-date">Hoy</span>
              </li>
              {/* ...4 more rows */}
            </ul>
          </div>

          <div className="panel panel--cat" data-widget="C">
            <header className="panel__head">
              <h3>Gasto por categoría</h3>
            </header>
            <ul className="cat-bars">
              {/* 5 rows. Each row = label + horizontal track + filled bar + % */}
              <li className="cat-row">
                <span className="cat-label">Comida</span>
                <span className="cat-track"><span className="cat-fill" style="width:38%;background:var(--ap-primary)"></span></span>
                <span className="cat-pct">38%</span>
              </li>
              {/* ...4 more rows */}
            </ul>
          </div>

          <div className="panel panel--quick" data-widget="D">
            <header className="panel__head">
              <h3>Acciones rápidas</h3>
            </header>
            <div className="quick-grid">
              <button className="quick-tile">
                <Icon icon="ap-icon-add" />  {/* Transferir uses SVG fallback; others use Icon */}
                <span>Transferir</span>
              </button>
              {/* ...3 more tiles */}
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="features" className="features">
      <header className="section-head">
        <h2>Todo lo que necesitás, en una sola app</h2>
      </header>
      <div className="features__grid">
        <article className="feature">
          <span className="feature__icon" data-feature="card"     ></span>  {/* SVG fallback */}
          <h3>Tarjeta virtual gratis</h3>
          <p>Activá tu Visa virtual en segundos y pagá online sin esperar el plástico.</p>
        </article>
        <article className="feature">
          <span className="feature__icon" data-feature="send"     ></span>  {/* SVG fallback */}
          <h3>Transferencias instantáneas</h3>
          <p>Enviá y recibí dinero en segundos, las 24 horas, sin costo.</p>
        </article>
        <article className="feature">
          <Icon icon="ap-icon-check" />                                      {/* native */}
          <h3>Sin comisiones ocultas</h3>
          <p>Cero mantenimiento, cero sorpresas. Lo que ves es lo que pagás.</p>
        </article>
        <article className="feature">
          <Icon icon="ap-icon-bar" />                                        {/* native */}
          <h3>Ahorro con rendimiento</h3>
          <p>Tu plata trabaja sola: rendimiento diario sobre tu saldo, sin plazos.</p>
        </article>
      </div>
    </section>

    <section id="cta-final" className="cta-final">
      <div className="cta-final__inner">
        <h2>Empezá hoy. Sin papeleo, sin sucursales.</h2>
        <p>Abrí tu cuenta Nala en menos de 3 minutos desde tu celular.</p>
        <Button type="primary" size="lg" label="Abre tu cuenta gratis"
                className="btn--on-dark" />  {/* white-on-blue override */}
        <p className="cta-final__microcopy">Es gratis. Sin tarjeta de crédito requerida.</p>
      </div>
    </section>

  </main>

  <footer role="contentinfo">
    <div className="footer__grid">
      <div className="footer__col footer__col--brand">
        <p className="footer__brand">Nala</p>
        <p className="footer__tag">Banca digital sin vueltas · LATAM</p>
      </div>
      <nav aria-label="Producto" className="footer__col">
        <h4>Producto</h4>
        <ul><li><a href="#">Cuenta</a></li>...</ul>
      </nav>
      <nav aria-label="Compañía" className="footer__col">
        <h4>Compañía</h4>...
      </nav>
      <nav aria-label="Legal" className="footer__col">
        <h4>Legal</h4>...
      </nav>
    </div>

    <div className="footer__social">
      {/* Inline SVG icons: Instagram, X, LinkedIn, YouTube — no DS equivalents */}
    </div>

    <p className="footer__legal">
      © 2026 Nala. Prototipo de demostración. No es un producto real.
    </p>
  </footer>
</body>
```

---

## States table

Prototype renders **populated only**, but every data-bearing block must have a documented state vocabulary for the real implementation.

| Component | Loading | Empty | Error | Populated |
|---|---|---|---|---|
| Widget A — Saldo total | Skeleton block 200×40 px where the amount sits + skeleton chip 80×20 | "Sin movimientos todavía" + `Button` ghost "Recargar saldo" | `Banner type="error" size="sm"` inside panel + retry `Button` | `$ 12,847.32` + `Tag` success `"+4.2% vs mes anterior"` |
| Widget B — Transacciones | 5 skeleton rows, each: 32 px circle + 40% text bar + 60 px chip + 60 px amount | `Illustration empty` `name="search"` + "Aún no hay movimientos" + Button "Hacer una transferencia" | `Banner type="error" size="sm"` above list + retry `Button` | 5 `.tx-row` items (see mock) |
| Widget C — Gasto por categoría | 5 skeleton bars (label bar 30%, track full, % bar 12%) | "Sin gasto este mes" + neutral `Tag` "Empezá usando tu tarjeta" | `Banner type="error" size="sm"` above list + retry `Button` | 5 horizontal `.cat-row` bars (see mock) |
| Widget D — Acciones rápidas | 4 skeleton tiles (40 px icon + 16 px label) | n/a (actions are static, no empty state) | n/a | 4 `.quick-tile` buttons (Transferir / Recargar / Pagar / Invertir) |
| Hero CTA primario | n/a (link, not async) | n/a | n/a (any onboarding error happens on the next screen) | `Button type="primary"` |

---

## @alixpartners/ui-components mapping

Every interactive primitive comes from `@alixpartners/ui-components`. Static layout containers (`.panel`, `.feature`, `.tx-row`, `.cat-row`, `.quick-tile`, the hero card, the footer columns) are plain HTML + `--ap-*` tokens because the library does not ship a generic `Card` primitive — same convention as `.designs/finance-dashboard/`.

| UI element | Library primitive | Key props / notes |
|---|---|---|
| Top navigation | `NavBar` | `projectName="Nala"`, `projectLogoIcon="ap-icon-logo-alixpartners"` (closest available; no Nala logo in DS), `projectTag="Demo"`, `menuItems`, `additionalItems` with two `Button`s |
| All call-to-action buttons | `Button` | Hero primary: `type="primary"` `size="lg"`. Hero secondary: `type="secondary"` `size="lg"`. Navbar "Ingresar": `type="ghost"`. Final CTA: `type="primary"` with `.btn--on-dark` override class for white-on-blue contrast |
| Delta indicator (Widget A) | `Tag` | `type="success"` `structure="solid"` `label="+4.2% vs mes anterior"`. Icon arrow handled via SVG glyph prefix inside the label (no `ap-icon-arrow-up` in bundle) |
| Category chip (transactions) | `Tag` | `type="basic"` `structure="border"` `color="primary" \| "success" \| "warning" \| "error" \| "neutral"` per category. Labels in Spanish via `categoryLabels` map |
| Quick action icons (when available) | `Icon` | `Recargar` → `ap-icon-add`; `Pagar` → `ap-icon-document`; `Invertir` → `ap-icon-bar`. `Transferir` has no DS icon → inline SVG fallback inside the tile |
| Feature card icons | `Icon` | `Sin comisiones` → `ap-icon-check`; `Ahorro` → `ap-icon-bar`. `Tarjeta virtual` and `Transferencias` have **no** DS icons → inline SVG fallback (rectangle-with-chip for "card", arrow-up-out-of-circle for "send") |
| Transaction category fallback glyph | Plain `<span>` | 32 px circle, background = category token color, white first-letter glyph (Roboto 500, 14 px). Used because no `ap-icon-food/transport/shopping/subscriptions/transfer` exists in the bundle |
| Section banner / disclaimer (footer line) | Plain `<p>` | A `Banner type="info"` was considered but reads too loud at the end of a marketing page — disclaimer stays as muted footer text |
| Spinner (loading-state spec only) | `Spinner` | `size="md"` `color="dark"` — not rendered in the prototype but referenced in the states table |
| Illustration (empty-state spec only) | `Illustration` | `level={2}` `category="empty"` `name="search"` `size={140}` — spec-only reference |

Components from the library that we deliberately do **not** use on this page:
- `AgGrid` — only 5 transaction rows, plain `<ul>` is the right tool. Stated explicitly per the plan.
- `Dialog`, `Toast`, `Dropdown`, `Search`, `Datepicker`, `TabNavigation`, `Toggle`, `Checkbox`, `Radio`, `TagsFields`, `Creatable`, `Textarea`, `Tooltip`, `SplitButton` — none have a purpose on a pre-login marketing page.

---

## Interaction flows

1. **Hero CTA primario** → User clicks `Button type="primary"` "Abre tu cuenta gratis" → in production navigates to `/onboarding`; in the prototype the `href="#"` is inert and a `console.info("CTA: open-account")` is logged so the click is observable in dev tools.
2. **Hero CTA secundario** → User clicks `Button type="secondary"` "Ver cómo funciona" → `preventDefault()` on the anchor → `document.getElementById('dashboard-preview').scrollIntoView({behavior:'smooth', block:'start'})` → no pulse / no highlight (decision #5).
3. **Navbar anchor link** → User clicks "Producto" / "Cómo funciona" / "Precios" / "Soporte" → smooth scroll to `#features` / `#dashboard-preview` / `#` / `#` respectively. "Precios" and "Soporte" anchor to `#` and do nothing (inert).
4. **Navbar "Ingresar"** → User clicks the ghost button → inert, logs `console.info("CTA: login")`.
5. **Navbar "Abre tu cuenta gratis"** → same target as hero primary CTA (single onboarding endpoint).
6. **Feature card hover** → On `:hover` over an `.feature` article: `transform: translateY(-2px)` and `box-shadow` step up by one level (use `--ap-radius-md` shadow → larger). Reverts on mouseleave. No JS — pure CSS transition `transform .15s ease, box-shadow .15s ease`.
7. **Quick action tile hover** → background goes from `transparent` to `--ap-bg-subtle`; cursor `pointer`; not clickable in the prototype (inert `<button type="button">`).
8. **CTA final click** → same target as hero primary (a single "open account" surface across the page).
9. **Footer link click** → all footer links have `href="#"` and are inert (`preventDefault` on click). Social SVGs likewise inert.

---

## Layout

**Content container max-width**: 1200 px, centered. Horizontal padding: `--ap-space-6` (24 px) ≥900 px, `--ap-space-4` (16 px) <900 px, `--ap-space-3` (12 px) ≤400 px.

**Vertical rhythm between sections** (gap between section bottom and next section top):

| Breakpoint | Section gap | Tokens |
|---|---|---|
| ≥ 900 px | 96 px | `calc(var(--ap-space-8) * 3)` |
| 640–899 px | 64 px | `calc(var(--ap-space-8) * 2)` |
| 400–639 px | 48 px | `calc(var(--ap-space-6) * 2)` |
| ≤ 400 px | 40 px | `calc(var(--ap-space-5) * 2)` |

### Per-section grids

#### Navbar
- All breakpoints: single row, brand left, links + actions right.
- ≤900 px: links collapse into a static hamburger button (visual only, no dropdown), the two `additionalItems` Buttons remain visible until ≤640 px.
- ≤640 px: only brand + the primary "Abre tu cuenta gratis" Button remain visible; "Ingresar" hides; hamburger stays.
- ≤400 px: primary CTA shrinks to label "Abrir cuenta".

#### Hero
- ≥900 px: 2-col grid `1.1fr 0.9fr`, copy left, virtual card right, vertical-aligned center, min-height 520 px.
- 640–899 px: 1 col, copy first, card second, max-card-width 360 px centered.
- 400–639 px: 1 col, CTAs become `width:100%` and stack vertically with `--ap-space-3` between them; card scales to 88% width.
- ≤400 px: `h1` drops to 28 px, eyebrow to 12 px, subtitle to 15 px; CTAs full-width stacked.

#### Dashboard preview (`.preview__grid` inside `.preview__frame`)
- ≥900 px: 2×2 grid. `grid-template: "A B" "C D" / 1fr 1fr`. Widget B (transactions) spans both rows on the right? **No** — keep strict 2×2 (the plan's "preferred" option), all 4 panels same height row-wise.
- 640–899 px: 1 col, order `A → B → C → D`. Each panel full-width inside the frame.
- 400–639 px: same single column; transactions row hides the `date` column (CSS `display:none` on `.tx-date`).
- ≤400 px: Widget D `.quick-grid` collapses from 4 tiles in a row to 2×2.
- Frame: `--ap-radius-lg` (8 px), border `1px solid --ap-border-soft`, shadow `0 20px 40px -20px rgba(0,0,0,.15)`, internal padding `--ap-space-6`; chrome strip on top is 36 px tall with `--ap-bg-muted` background.

#### Features grid
- ≥900 px: 4 columns, equal width, gap `--ap-space-6`.
- 640–899 px: 2×2, gap `--ap-space-5`.
- 400–639 px: 1 column, gap `--ap-space-4`.
- ≤400 px: 1 column, icon size reduces from 32 to 28 px.

#### CTA final
- Full-bleed background `--ap-primary`. Inner container respects the 1200 px max-width. Vertical padding 96 / 80 / 64 / 48 px across the four breakpoints. Text + CTA centered.

#### Footer
- ≥900 px: 4 columns, gap `--ap-space-8`.
- 640–899 px: 2×2 (brand spans full width of row 1).
- 400–639 px: 1 column, headings still bold, links left-aligned, gap `--ap-space-4` between columns.
- ≤400 px: same 1-column layout, `.footer__legal` font-size shrinks to 12 px.

### Tabular numerals
Every amount, percentage, and PAN digit (`•••• 4521`) uses `font-variant-numeric: tabular-nums` to keep digits column-aligned.

---

## Accessibility notes

- **Landmarks**: `<header role="banner">` around the NavBar, `<main>` wrapping all five content sections, `<footer role="contentinfo">`. Each footer column wraps its link list in a `<nav aria-label="Producto|Compañía|Legal">`.
- **Heading hierarchy**: a single `h1` ("Tu banco, sin vueltas.") in the hero; one `h2` per section title ("Así se ve tu día a día con Nala", "Todo lo que necesitás, en una sola app", "Empezá hoy. Sin papeleo, sin sucursales."); `h3` for widget titles and feature card titles; `h4` for footer column headings. No skipped levels.
- **Focus-visible on CTAs**: all `Button`s and `<a>` use `:focus-visible { outline: 2px solid var(--ap-primary-2); outline-offset: 2px; border-radius: var(--ap-radius); }`. Inherited from DS but verify the override applies on `.btn--on-dark` (use white outline `outline: 2px solid #fff` instead because the background is `--ap-primary`).
- **Contrast on the CTA-final block**: the white "Abre tu cuenta gratis" button on `--ap-primary` (#024870) provides label contrast 13.6:1 (white on #024870). Subtitle text uses white at 100% (≥4.5:1). Microcopy uses `rgba(255,255,255,.78)` which still measures ≥4.7:1 on #024870 — safe.
- **Hero card**: marked `aria-hidden="true"` because the holder name and PAN are mock decoration, not real information for screen readers.
- **Category fallback glyph**: each colored circle has an empty `aria-hidden="true"` because the visible `Tag` next to it already names the category in text. The glyph carries no extra meaning.
- **Smooth scroll**: respects `prefers-reduced-motion: reduce` — `scrollIntoView` falls back to `behavior:'auto'`.
- **AG Grid note**: not used here. The horizontal-scroll-on-mobile caveat that applies to AG Grid tables does not affect this page; the transactions list linearizes naturally as a column of cards.
- **Hamburger button**: even though it is decorative/static, must have `aria-label="Abrir menú"` and `aria-expanded="false"` for screen readers, and a visible focus ring.
- **Disclaimer for clarity**: the line *"© 2026 Nala. Prototipo de demostración. No es un producto real."* sits at the very bottom of the footer, full-width, with `font-size: 12px` and `color: var(--ap-text-soft)`. It is the only place we admit the prototype is not a real bank — the trust strip in the hero remains aspirational copy (Regulado · Depósitos protegidos · Soporte 24/7) without asterisks.

---

## Open UX questions

None. All open questions from `plan.md` have been resolved with the defaults the plan recommended (see *Resolved decisions* table above). The two genuine library gaps surfaced — missing `ap-icon-card/send/transfer/shield/financial` and missing food/transport/shopping/subscriptions glyphs — are addressed by deterministic SVG fallbacks declared in the *@alixpartners/ui-components mapping* table.

---

## Design → Code alignment

| Spec element | What was built | Reason for delta |
|---|---|---|
| `NavBar` from `@alixpartners/ui-components` with two `Button`s in `additionalItems` | Custom semantic `<nav class="nb">` styled with `--ap-*` tokens | The DS `NavBar` bundle accepts `additionalItems` as an object with `notifications` / `userProfile` keys, **not** an array/list of buttons. A marketing pre-login navbar with two CTAs doesn't fit that shape, so a plain `<nav>` is used. `Button` primitives from the DS are still used for both CTAs. |
| `Tag` `color="primary" \| "success" \| "warning" \| "error" \| "neutral"` for the transaction category chips | `Tag type="basic"` with `color="primary" \| "green" \| "yellow" \| "blue" \| "gray"` | The DS `Tag` bundle exposes color tokens as `primary / green / yellow / blue / gray` on `type="basic"` (verified in `vendor/alix-ui.js`). Same visual intent, different prop value names. |
| `Tag type="success"` delta with an inline arrow-up glyph prefix | `Tag type="success" structure="solid"` rendering its built-in `ap-icon-success` check glyph; the literal text "+4.2% vs mes anterior" carries the direction signal | The DS `Tag` auto-injects its own icon per `type` and there is no `ap-icon-arrow-up` to swap in. The leading `+` plus `success` color preserves the up/positive read. |
| `<NavBar>` `projectLogoIcon="ap-icon-logo-alixpartners"` | Inline circular gradient dot next to the "Nala" wordmark | The Alix logo is unrelated to the Nala brand fiction and would read as an Alix property, not a neobank brand. A neutral gradient dot keeps the corporate-blue DS feel without falsely branding the page. |
| Hero / Final CTA `Button label="…"` | `<Button>…</Button>` with text as children | Bundle's `Button` reads its label from `children`, not a `label` prop. Same visual output. |
| `.btn--on-dark` class as a prop on the Button | `.btn--on-dark` is applied to a wrapping `<span>` that scopes the `> button` override | The DS Button doesn't merge external `className` into the rendered `<button>` cleanly enough to repaint the gradient; wrapping it scopes the white-on-blue override deterministically. Final visual + contrast (13.6:1) match the spec. |
| `Spinner`, `Illustration`, `Banner` referenced in the states table | Not rendered in the prototype | These are documented for the real implementation only — prototype is populated-state-only per the plan. |
