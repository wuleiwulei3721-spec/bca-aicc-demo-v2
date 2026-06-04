# Context Snapshot - 2026-06-02 21:52 +08:00

## Project

- Project: `bca-aicc-demo-v2`
- Branch: `codex/text-channel-config-settings`
- Purpose: BANK 1 AICC front-end demo for enterprise banking contact center workflows.

## Current State

- `Routing Config` is a first-level admin menu with independent second-level configuration pages.
- Ordinary Routing Config CRUD pages share `RoutingConfigCrudPage`.
- Route Elements, VDN, and Sites currently use the same query structure: `Keyword + Status`.

## Latest Change

- Updated `Routing Config > Route Elements`.
- Query filters changed from separate `Element ID`, `Element Name`, `Status` to `Keyword + Status`.
- Route Elements `Keyword` matches `Element ID` and `Element Name`.
- Status remains `All / Enabled / Disabled`.

## Validation

- `npm run lint`: passed.
- `npm run build`: passed; Vite chunk size warning remains.
- Browser `/routing-config/route-elements`: verified only `Keyword` and `Status` filters show, with `Element ID / Name` placeholder.

## Risks

- This change only affects Route Elements filters.
- Other Routing Config pages still use their current filter setup unless separately normalized.

