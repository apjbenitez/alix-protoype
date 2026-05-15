---
name: figma-design-system
description: |
  Use the AlixPartners "Platforms Design System" Figma file as the source of truth
  when building UI. Looks up components, variables, and frames via the Figma MCP,
  then maps them to `@alixpartners/ui-components` exports. Triggered by phrases
  like "what does this look like in Figma", "use the Figma design", "match the
  design system", "pull the token for X", or when the user drops a figma.com link.
---

# Figma design system — usage

This project uses the AlixPartners **Platforms Design System** as the source of truth for all visual decisions. Components in `@alixpartners/ui-components` are the code expression of that system. When you build UI, the Figma file is authoritative and the code library is the implementation — go from Figma → component, never the other way around.

## File coordinates

- **File name**: Platforms Design System
- **File key**: `uKDQ4UPs40MQXxn6CrcqTO`
- **URL**: https://www.figma.com/design/uKDQ4UPs40MQXxn6CrcqTO/Platforms-Design-System
- **What's in it**: every primitive (Button, Tag, Banner, Dialog, NavBar, AgGrid wrapper, …), the design tokens as Figma Variables (colors, spacing, typography, radius), and reference layouts.

If the user gives you a `figma.com/design/<fileKey>/...?node-id=<nodeId>` link for a different file (e.g. a feature mockup): use that file. Convert the `-` in the node-id to `:` when calling the MCP.

## When to invoke the MCP

Use the Figma MCP whenever:
- The user shares a Figma URL.
- The user asks "what does X look like in Figma?" or "match the design".
- You are about to invent a colour, spacing value, font, or component shape — first check Figma for the existing one.
- You are choosing between two `@alixpartners/ui-components` primitives and want to confirm which one Figma uses for that pattern.

Do **not** invoke the MCP for trivial layout decisions that have no design system implication (raw `display:flex` containers, gap between two siblings, etc.).

## Procedure

### 1. Look up the right node

If the user gave a URL with `?node-id=...`:
1. Parse out `fileKey` and `nodeId` (replace `-` with `:`).
2. Call `mcp__figma__get_design_context` with that `fileKey` + `nodeId` to get the structured spec.
3. Call `mcp__figma__get_screenshot` for the same node when you need to see the visual.

If there is no specific frame:
1. Use `mcp__figma__search_design_system` to find the closest existing component (`{ query: "data table" }`, `{ query: "primary button" }`, etc.).
2. Pick the closest match and pull its node id.
3. Call `mcp__figma__get_design_context` on it.

### 2. Pull variables (tokens)

For every coloured / sized element, resolve to a Figma Variable, not a raw value:

```
mcp__figma__get_variable_defs({ fileKey: "uKDQ4UPs40MQXxn6CrcqTO", nodeId: "<node>" })
```

Quote the variable name in the spec (e.g. `color/semantic/success/default`, `spacing/md`, `radius/lg`). If you cannot find a matching variable, flag it — do not paste a hex.

### 3. Map to `@alixpartners/ui-components`

For each Figma component in the frame, find the code primitive it maps to. Use these as the starting cross-reference:

| Figma component (typical name) | Code primitive | Common props |
|---|---|---|
| Button / Primary, Secondary | `Button` | `type="primary" \| "secondary"`, `size`, `icon` |
| Ghost button | `Ghost` | `variant`, `noIcon` |
| Tag / Chip | `Tag` | `type="success" \| "warning" \| "error" \| "basic"`, `structure`, `size` |
| Banner / Alert | `Banner` | `type`, `size`, `isFullWidth`, `icon`, `content` |
| Tooltip | `Tooltip` | `content`, `size`, `tipSide` |
| Toggle / Switch | `Toggle` | `checked`, `onChange`, `labelPosition` |
| Checkbox | `Checkbox` | `checked`, `onChange` |
| Radio group | `RadioGroup` + `Radio` | `value`, `onChange`, `orientation`, `ariaLabel` |
| Text input | `Input` | `type`, `label`, `icon`, `iconPosition`, `helpText` |
| Search | `Search` | `value`, `onChange` (string, not event), `placeholder`, `label` |
| Datepicker | `Datepicker` | `value`, `onChange`, `dateFormat` |
| Dropdown / Select | `Dropdown` | `options`, `value: string[]`, `multiSelect`, `searchable` |
| Tags field | `TagsFields` | `options`, `value`, `multiSelect`, `searchable` |
| Creatable tags | `Creatable` | `options`, `value`, `multiSelect` |
| Textarea | `Textarea` | `rows`, `resize`, `fullWidth`, `errorMessage` |
| Split button | `SplitButton` | `trigger="split"`, `buttonLabel`, `actionOptions=[{value,label,action}]` |
| Tabs | `TabNavigation` + `Tab` | `numberCount`, `hasError`, `active`, `onClick` |
| Top nav | `NavBar` | `projectName`, `projectLogoIcon`, `menuItems`, `additionalItems` |
| Modal / Dialog | `Dialog` | `isOpen`, `onClose`, `title`, `description`, `confirmButtonText` |
| Toast | `useToast()` hook inside `ToastProvider` | `.success()` / `.error()` / `.warning()` |
| Spinner | `Spinner` | `size`, `color` |
| Empty illustration | `Illustration` | `level`, `category`, `name`, `size` |
| Icon | `Icon` | `icon="ap-icon-*"` (use the ap-icon-* family) |
| Data grid / table | `AgGrid` | `columnDefs`, `rowData`, `gridOptions` |

If a Figma component does not have a corresponding export in `@alixpartners/ui-components`, leave a code comment exactly:

```tsx
// TODO: replace with @alixpartners/ui-components once available
```

and implement it as plainly as possible against the Figma variables.

### 4. Hand off

Whether you are producing a UI spec (ux-designer agent), a static prototype (design-prototype skill), or production code (frontend-dev agent), include:

- The Figma file key + node id of the source frame.
- The list of Figma Variables used and the code primitives they map to.
- Any gap where the library does not yet implement the Figma component.

## Rules

- **Figma is source of truth for visuals.** Code is the implementation. If they disagree, flag the mismatch but follow the code library's current behaviour in shipped code (since that is what users get), and report the gap.
- **Never paste raw hex/px/font from Figma.** Always go through a Variable.
- **Never invent a new primitive** when `@alixpartners/ui-components` has one. If the closest match is imperfect, use it and flag the gap.
- **Always quote the file key and node id** in your output so reviewers can verify against Figma in one click.
- **Auth**: if `mcp__figma__whoami` fails or the MCP returns a permission error, tell the user and stop — do not guess values from screenshots.
