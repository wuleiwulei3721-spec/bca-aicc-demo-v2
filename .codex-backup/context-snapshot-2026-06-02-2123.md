# Context Snapshot - 2026-06-02 21:23 +08:00

## Project

- Project: `bca-aicc-demo-v2`
- Branch: `codex/text-channel-config-settings`
- Purpose: BANK 1 AICC front-end demo for enterprise banking contact center workflows.

## Current State

- `Routing Config` is a first-level admin menu with independent second-level configuration pages.
- Ordinary Routing Config CRUD pages share `RoutingConfigCrudPage`.
- Admin CRUD styling is compact: title only, toolbar filters, right-aligned Add, compact table, unified status badge/switch, and 82px x 32px action buttons.

## Latest Change

- Updated `Routing Config > VDN`.
- `Platform VDN ID` is now required in the VDN form and save validation.
- VDN form order is now `VDN ID`, `VDN Name`, `Platform VDN ID`, `Status`, `Description`.
- Added shared `fullWidth` support to `RoutingConfigCrudPage` fields and used it for VDN `Description`, so the remark textarea spans the full modal row.

## Validation

- `npm run lint`: passed.
- `npm run build`: passed; Vite chunk size warning and plugin timing notice remain.
- Browser `/routing-config/vdn`: Add modal opens, `Platform VDN ID*` appears, empty save shows `Platform VDN ID is required.`, and field order matches the requested layout.

## Risks

- The new `fullWidth` field capability is shared but currently only used by VDN `Description`.
- Other pages can use the same capability later, but each page should be visually checked because textarea height affects modal rhythm.

