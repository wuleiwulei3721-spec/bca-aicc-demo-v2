# Context Snapshot - 2026-06-02 19:03 +08:00

## Project

- Project: BANK 1 AICC Demo V2
- Branch: `codex/text-channel-config-settings`
- Current focus: refine the first `Routing Config` child page into a standard admin CRUD maintenance page.

## Latest User Decision

- The first menu is route element management, not VDN management.
- Route element fields should be: `要素ID`, `要素名称`, `状态（启用/禁用）`.
- VDN remains a separate page with VDN-specific fields.

## Latest Changes

- `RoutingConfigCrudPage` now supports:
  - configured filters instead of only a single global search box
  - search/reset/add in one admin toolbar
  - `submitAttempted`, so validation errors are shown only after Save is clicked
  - `statusSwitch`, a compact status switch field
  - configurable Chinese action/modal labels
  - compact form layout for short forms
- `RouteElementsPage` now:
  - shows title `路由要素配置`
  - hides the `Routing Config` eyebrow and long description
  - filters by `要素ID`, `要素名称`, `状态`
  - lists only `要素ID`, `要素名称`, `状态`, `操作`
  - uses Chinese modal labels and only three fields in Add/Edit/View
- CSS updated to:
  - keep CRUD modal body white
  - remove blue-gray read-only field backgrounds
  - make validation alerts smaller and content-based
  - keep status switches compact
  - lay out the admin filter toolbar as a compact row

## Validation

- `npm run lint`: passed.
- `npm run build`: passed; Vite chunk size warning remains.
- Browser checked `/routing-config/route-elements` for:
  - `路由要素配置` title
  - compact query fields
  - no Source Entity / Display Order / Required / Allow ANY columns
  - Add modal opens without initial validation errors

## Risks

- The new admin CRUD style is only applied to `Route Elements` for now.
- Other routing config pages still use the previous generic CRUD layout until they are reviewed.

## Rollback

- Restore `RoutingConfigCrudPage.tsx`, `RoutingConfigDataPages.tsx`, and `styles/index.less` to the previous 18:37 state.
- Restore this turn's docs/backups if needed.
