# Context Snapshot - 2026-06-02 21:47 +08:00

## Project

- Project: `bca-aicc-demo-v2`
- Branch: `codex/text-channel-config-settings`
- Purpose: BANK 1 AICC front-end demo for enterprise banking contact center workflows.

## Current State

- `Routing Config` is a first-level admin menu with independent second-level configuration pages.
- Ordinary Routing Config CRUD pages share `RoutingConfigCrudPage`.
- Route Elements style is the current admin CRUD standard.

## Latest Change

- Updated `Routing Config > Sites`:
  - removed the top timezone hint;
  - removed `Country` / `Country Code` from table, form, validation, and search UI;
  - kept internal `countryCode` default for mock/type compatibility;
  - changed modal entity name to singular `Site`, so Add modal shows `Add Site`.
- Updated VDN and Sites filters:
  - VDN: `Keyword + Status`, where Keyword matches `VDN ID`, `VDN Name`, and `Platform VDN ID`;
  - Sites: `Keyword + Status`, where Keyword matches `Site ID` and `Site Name`;
  - Status uses `All / Enabled / Disabled`.

## Validation

- `npm run lint`: passed.
- `npm run build`: passed; Vite chunk size warning remains.
- Browser `/routing-config/vdn`: verified `Keyword + Status` and VDN keyword placeholder.
- Browser `/routing-config/sites`: verified no top hint, no Country field, adjusted table columns, and `Add Site` modal.

## Risks

- Sites UI no longer shows `countryCode`, but the field remains in the internal type/mock data for compatibility.
- If a future backend contract removes site country entirely, update `AccessSite`, mock data, store persistence, and any route factor country references together.

