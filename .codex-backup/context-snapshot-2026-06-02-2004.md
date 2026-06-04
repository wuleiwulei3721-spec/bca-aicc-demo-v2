# Context Snapshot - 2026-06-02 20:04 +08:00

## Project

- Project: `bca-aicc-demo-v2`
- Branch: `codex/text-channel-config-settings`
- Purpose: BANK 1 AICC front-end demo for enterprise banking contact center workflows.

## Current State

- `Routing Config` is a first-level admin menu with independent second-level configuration pages.
- Ordinary Routing Config CRUD pages share `RoutingConfigCrudPage`.
- Top-left page area follows the current admin standard: page title only, no eyebrow, no description, no title-side Add.
- Toolbar follows the current admin standard: filters on the left, `Search` / `Reset` beside filters, `Add` independently aligned right.

## Latest Change

- Updated `src/styles/index.less` so Routing Config CRUD modal footer buttons share the same sizing and visual rules as toolbar Search / Reset buttons.
- Modal `Cancel` / `Save` / `Delete` and toolbar `Search` / `Reset` now use 82px width, 32px height, 12px font size, and the same compact radius/padding.
- The rule applies through the shared CRUD modal footer, so Route Elements, VDN, and other ordinary Routing Config CRUD pages inherit it.

## Validation

- `npm run lint`: passed.
- `npm run build`: passed; Vite chunk size warning remains.
- Browser `/routing-config/route-elements`: Add modal opens and `Cancel` / `Save` render.

## Risks

- This update covers ordinary Routing Config CRUD pages only.
- Independent pages with custom modals, such as future Skill Routing Rules dialogs, may still need their own button normalization if they do not reuse the shared CRUD footer.

