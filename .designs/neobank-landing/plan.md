## Prototype: neobank-landing

### Scope
Static marketing landing (pre-login) for a fictional Latin American neobank named **Nala**, built as a single static HTML file at `.designs/neobank-landing/index.html`. The page must communicate "simplicity + control over your money" and surface a minimal dashboard preview that hints at the post-login product. Visual system reuses the AlixPartners Design System (`--ap-*` tokens, Roboto, corporate blue) so the neobank brand sits cleanly on top of the corporate DS.

### Persona & device
Adult LATAM user (25-45), comfortable with mobile banking apps, exploring a new digital bank for the first time. Primary device split: ~60% mobile, ~40% desktop. Spanish-language audience, generic LATAM (neutral tuteo, USD currency).

### Primary action
Click the hero CTA **"Abre tu cuenta gratis"** to start onboarding. Secondary action is to scroll down and inspect the dashboard preview to build trust before committing.

### What already exists
- `.designs/finance-dashboard/` — reuse visual cues: Roboto stack, `--ap-*` color tokens, `--ap-spacing-*` rhythm, tabular numerals for amounts, AlixPartners corporate blue as accent, KPI/panel card pattern (border + 12px radius + subtle shadow), three responsive breakpoints (≤900 / ≤640 / ≤400).
- No prior neobank-landing prototype exists.
- No app code is in scope for this stage.

### Surfaces to mock
One single-page landing with six stacked sections (no separate screens):
1. Navbar
2. Hero
3. Dashboard preview
4. Features grid
5. CTA final
6. Footer

---

## Phase 1 — Design scope

### 1. Goal statement
Convince a LATAM mobile-first visitor in under 30 seconds that **Nala** is a modern, transparent, no-fee neobank, and get them to start the sign-up flow.

### 2. Primary persona
Adulto LATAM (25-45) que viene de un banco tradicional, busca una app simple, sin comisiones ocultas, con visibilidad clara sobre su saldo y gastos. Entra desde un anuncio social o un referido y necesita una primera impresión que transmita confianza + simplicidad antes de descargar nada.

### 3. Page structure
1. **Navbar** — Brand mark "Nala" + 3-4 anchor links + login + CTA primario; presencia permanente, no sticky en mobile (libera viewport).
2. **Hero** — Promesa principal y dos CTAs; sin imagen pesada, solo tipografía grande y mucho aire para reforzar simplicidad.
3. **Dashboard preview** — Sección dedicada que muestra una "ventana" del producto con 4 widgets reales; ancla del CTA secundario "Ver cómo funciona".
4. **Features grid** — 4 cards que cubren las objeciones más comunes (tarjeta, transferencias, comisiones, rendimiento).
5. **CTA final** — Bloque a ancho completo que repite la propuesta y empuja al onboarding una vez que el usuario ya vio el producto.
6. **Footer** — Información corporativa, legal y redes; cierre del documento, no de la conversión.

### 4. Hero
- **Eyebrow / pre-headline** (opcional): "Nala · Banca digital sin vueltas"
- **Titular**: "Tu banco, sin vueltas."
- **Subtítulo**: "Abre una cuenta en minutos, manejá tu dinero desde el celular y olvidate de comisiones que no entendés."
- **CTA primario**: "Abre tu cuenta gratis" (botón `type="primary"`, ancho fijo en desktop, full-width en mobile)
- **CTA secundario**: "Ver cómo funciona" (botón `type="secondary"` o `Ghost`, ancla `#dashboard-preview` con scroll suave)
- **Acompañamiento visual**: ninguna foto. A la derecha en desktop, una **tarjeta virtual mockeada** (rectángulo con gradiente corporativo, chip, marca "Nala", últimos 4 dígitos `•••• 4521`, nombre genérico). En mobile la tarjeta se mueve debajo del bloque de copy. La idea: una sola pieza visual fuerte, sin stock photos.
- **Trust strip** debajo de los CTAs (línea fina): "Regulado · Depósitos protegidos · Soporte 24/7" — 3 ítems separados por punto medio, copy chica.

### 5. Dashboard preview
Bloque presentado como un "marco" (mock de ventana de app) que contiene los 4 widgets. Grid 2x2 en desktop (≥900px), 1 columna stackeada en mobile.

#### Widget A — Saldo total
- **Datos mock**:
  ```ts
  interface Balance {
    amountUsd: number;          // ej. 12345.67
    deltaPct: number;           // ej. +4.2
    deltaDirection: 'up' | 'down';
    periodLabel: string;        // "vs mes anterior"
  }
  ```
- **Comportamiento visual**: estático. Monto en tipografía grande (≥32px desktop), delta como `Tag` `type="success"` o `"error"` con flechita.
- **Tamaño en la grilla**: 1 celda (top-left). En mobile ocupa fila completa, queda primero.

#### Widget B — Últimas transacciones
- **Datos mock**: 5 movimientos.
  ```ts
  interface Transaction {
    id: string;
    merchant: string;           // "Rappi", "Spotify", "Transferencia recibida", ...
    category: 'Food' | 'Subscriptions' | 'Transfer' | 'Shopping' | 'Transport';
    amountUsd: number;          // negativo si es gasto, positivo si es ingreso
    date: string;               // ISO; render como "Hoy", "Ayer", "12 May"
  }
  ```
- **Comportamiento visual**: lista vertical (NO AG Grid — solo 5 filas, sería overkill). Cada fila: ícono de categoría + comercio + chip de categoría + monto alineado a la derecha con tabular-nums + fecha pequeña. Negativos en color por defecto, positivos en verde.
- **Tamaño en la grilla**: 1 celda alta (top-right) o 1 celda ancha si la grilla termina siendo 2x2 — preferencia: top-right, mismo alto que el conjunto A+C apilado.

#### Widget C — Gasto por categoría
- **Datos mock**: 4-5 categorías con totales.
  ```ts
  interface CategorySpend {
    category: string;           // "Comida", "Suscripciones", "Transporte", "Compras", "Otros"
    amountUsd: number;
    pctOfTotal: number;         // 0-100
    color: string;              // token del DS o derivado
  }
  ```
- **Comportamiento visual**: estático. Donut SVG inline (sin librería) **o** lista de barras horizontales con porcentaje a la derecha. Decisión final en Phase 4 (open question).
- **Tamaño en la grilla**: 1 celda (bottom-left).

#### Widget D — Acciones rápidas
- **Datos mock**: 4 acciones fijas.
  ```ts
  interface QuickAction {
    label: 'Transferir' | 'Recargar' | 'Pagar' | 'Invertir';
    icon: string;               // ap-icon-* slug
  }
  ```
- **Comportamiento visual**: 4 tiles cuadrados o pills con ícono arriba y label abajo. Estáticos en el prototipo (no clickeables más allá del estilo hover CSS).
- **Tamaño en la grilla**: 1 celda (bottom-right). En mobile queda al final, en fila de 4 íconos compactos o grid 2x2.

#### Marco visual del preview
El conjunto va dentro de un contenedor con borde, esquinas redondeadas (16px) y sombra suave; arriba del contenedor, una barra fake de navbar de la app (3 puntitos a la izquierda estilo macOS opcional, o un mini-logo Nala + un avatar circular) para reforzar el "estás viendo la app real". Encima del marco un título de sección: **"Así se ve tu día a día con Nala"** + subtítulo corto.

### 6. Features grid
4 cards en una fila en desktop (≥900px), 2x2 en tablet (640-899px), 1 columna en mobile. Cada card: ícono `ap-icon-*` arriba, título bold, descripción 1 línea.

1. **Tarjeta virtual gratis**
   - Descripción: "Activá tu Visa virtual en segundos y pagá online sin esperar el plástico."
   - Ícono sugerido: `ap-icon-card` o equivalente.
2. **Transferencias instantáneas**
   - Descripción: "Enviá y recibí dinero en segundos, las 24 horas, sin costo."
   - Ícono sugerido: `ap-icon-send` o `ap-icon-transfer`.
3. **Sin comisiones ocultas**
   - Descripción: "Cero mantenimiento, cero sorpresas. Lo que ves es lo que pagás."
   - Ícono sugerido: `ap-icon-shield` o `ap-icon-check`.
4. **Ahorro con rendimiento**
   - Descripción: "Tu plata trabaja sola: rendimiento diario sobre tu saldo, sin plazos."
   - Ícono sugerido: `ap-icon-financial` o `ap-icon-bar`.

Título de la sección: **"Todo lo que necesitás, en una sola app"**.

### 7. CTA final
Bloque a ancho completo con fondo en color corporativo Alix (azul) y texto claro.
- **Titular**: "Empezá hoy. Sin papeleo, sin sucursales."
- **Subtítulo**: "Abrí tu cuenta Nala en menos de 3 minutos desde tu celular."
- **CTA**: "Abre tu cuenta gratis" (botón blanco sobre fondo azul, `type="primary"` invertido).
- **Microcopy debajo del CTA**: "Es gratis. Sin tarjeta de crédito requerida."

### 8. Footer
Fondo neutro oscuro o muy claro (definir en UX para contraste con CTA final), 4 columnas en desktop, stackea en mobile.

- **Columna 1 — Brand**: logo "Nala" + tagline corta + país/region "LATAM".
- **Columna 2 — Producto**: Cuenta · Tarjeta · Ahorro · Transferencias · Inversiones (links inertes con `href="#"`).
- **Columna 3 — Compañía**: Nosotros · Carreras · Prensa · Soporte (links inertes).
- **Columna 4 — Legal**: Términos · Privacidad · Cookies · Regulación (links inertes).
- **Redes sociales**: placeholder de íconos Instagram, X, LinkedIn, YouTube (íconos del DS si existen; si no, SVG inline genérico).
- **Línea inferior**: "© 2026 Nala. Prototipo de demostración. No es un producto real." en copy chica.

### 9. Mock data shape
Resumen de los tipos que el frontend-dev va a hardcodear como constantes en el HTML/JS inline. Sin valores específicos todavía — el ux-designer rellena los números realistas.

```ts
interface Balance {
  amountUsd: number;
  deltaPct: number;
  deltaDirection: 'up' | 'down';
  periodLabel: string;
}

interface Transaction {
  id: string;
  merchant: string;
  category: 'Food' | 'Subscriptions' | 'Transfer' | 'Shopping' | 'Transport';
  amountUsd: number;
  date: string; // ISO 8601
}

interface CategorySpend {
  category: string;
  amountUsd: number;
  pctOfTotal: number;
  color: string;
}

interface QuickAction {
  label: 'Transferir' | 'Recargar' | 'Pagar' | 'Invertir';
  icon: string;
}
```

**Reglas de formato**:
- Moneda: `$ 1,234.56` (símbolo `$`, espacio, separador de miles `,`, decimal `.`, 2 decimales).
- Fechas: relativas para los últimos 2 días ("Hoy", "Ayer"), luego "12 May" en español abreviado.
- Tabular numerals para todos los montos.

**Edge values a incluir** (aunque solo se mockea estado populated, los valores deben ser realistas, no perfectos):
- Saldo con decimales no redondos.
- Al menos 1 transacción positiva (ingreso) y 1 negativa larga en nombre de comercio para probar truncado.
- Una categoría con porcentaje pequeño (<10%) para validar que el donut/barra no rompe.

### 10. Responsive breakpoints
- **≤ 900 px (tablet)**: navbar colapsa links en un botón hamburguesa (no desplegable funcional, solo visual); hero pasa a 1 columna con tarjeta virtual debajo del copy; dashboard preview pasa a 1 columna (orden: A → B → C → D); features grid 2x2.
- **≤ 640 px (mobile)**: hero CTAs full-width, apilados; trust strip pasa a 1 línea con scroll horizontal si no entra; widget B (transacciones) reduce columnas (esconde fecha si necesario, prioriza merchant + monto); widget D pasa a fila de 4 íconos compactos; features grid 1 columna; footer 1 columna con secciones colapsables visualmente (no JS).
- **≤ 400 px (small phone)**: tipografía comprime (h1 28px → 24px, monto saldo 32px → 26px); padding lateral reduce de 24px a 16px; CTA final reduce padding vertical.

---

## Phase 4 — Open questions

1. **Donut vs barras para Widget C** — recomendación: barras horizontales con label + porcentaje. Razón: 4-5 categorías en barras se leen más rápido en mobile y son más fáciles de implementar en SVG inline sin librería. ¿Confirmamos barras, o el cliente espera ver un donut por convención de neobanks?
2. **Librería para el donut** (si gana donut en lugar de barras) — no incluir ninguna librería externa; SVG inline a mano con `stroke-dasharray` es suficiente para 4-5 segmentos y mantiene el archivo autocontenido.
3. **Tarjeta virtual del hero** — ¿debe llevar el logo "Nala" + un nombre genérico tipo "Juan Pérez" hardcodeado, o queda anónima (`CARDHOLDER NAME`)? Default propuesto: nombre genérico tipo "María González" para humanizar.
4. **Lista de transacciones — íconos por categoría** — ¿usamos íconos del set `ap-icon-*` (verificar disponibilidad: food, shopping, transport, transfer, subscriptions) o caemos en un círculo coloreado con la inicial de la categoría? Default: intentar `ap-icon-*` primero, fallback a círculo + inicial.
5. **Navbar — comportamiento sticky** — ¿sticky en desktop (>900px) y no-sticky en mobile, o no-sticky en todos lados para máxima simplicidad? Default propuesto: no-sticky en todos (es marketing, scroll completo previsto).
6. **CTA secundario "Ver cómo funciona"** — ¿solo scroll al dashboard preview, o también dispara una mini-animación (highlight pulse del marco) al llegar? Default: solo scroll suave, sin animación, para no inflar el prototipo.
7. **Brand color** — usar `--ap-color-primary` corporativo de Alix tal cual, o introducir un acento "Nala" distinto (verde, violeta) para diferenciar visualmente que es una marca encima del DS? Default: usar el azul corporativo de Alix sin tocar — el spec dice "respect Alix DS". Confirmar.
8. **Tipografía del titular del hero** — ¿Roboto regular muy grande o Roboto bold? Default: Roboto bold 56px desktop / 40px tablet / 28px mobile.
9. **Idioma de las categorías de transacciones** — los nombres internos del tipo (`'Food'`, `'Subscriptions'`) son enums en inglés, pero los labels visibles deben estar en español (`"Comida"`, `"Suscripciones"`). Mapeo `categoryLabels` necesario.
10. **Microcopy regulatorio** — "Regulado · Depósitos protegidos · Soporte 24/7" — ¿agregamos asterisco con disclaimer "Prototipo de demostración. No es una entidad financiera real." en el footer, o ya alcanza con la línea de copyright? Default: agregar disclaimer explícito en el footer (ya incluido en sección 8).

### Out of scope
- App code (`app/`, route handlers, DB) — esto es prototype-only.
- Onboarding flow real (pantallas post-click del CTA primario).
- Login page o área autenticada.
- Estados loading / empty / error — solo populated.
- Integraciones reales con cualquier API.
- Localización fuera de español LATAM (no English, no portugués).
- Animaciones complejas (parallax, scroll-driven). Solo transiciones CSS básicas en hover.
- Modo oscuro.
- Accesibilidad WCAG completa (sí roles semánticos básicos y contraste DS, pero no auditoría exhaustiva).
- Performance optimization (imágenes responsive, lazy load). Es un prototipo estático.
