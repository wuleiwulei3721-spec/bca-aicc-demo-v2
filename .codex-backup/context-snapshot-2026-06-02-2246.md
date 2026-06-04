# Context Snapshot - 2026-06-02 22:46 +08:00

## Project

- Project: `bca-aicc-demo-v2`
- Current branch: `codex/text-channel-config-settings`
- Current workstream: `Routing Config` admin configuration pages.

## Current Change

- Updated `Routing Config > Business Types`.
- Query row is now `Keyword + Status`.
- `Keyword` searches `Business Type ID` and `Business Name`.
- Removed `Project` from the table.
- Hid `Project Code` from the Add/Edit modal.

## Important Boundary

- `projectCode` remains in the underlying data model and draft data with default `BANK1`.
- This keeps project-scoped uniqueness available without exposing the field in the demo UI.

## Verification

- `npm run lint`: passed.
- `npm run build`: passed with existing Vite chunk size warning.
- Browser `/routing-config/business-types`: page shows `Business Type ID / Name` and `Status` filters, with no `Project` column.
- Browser Add modal: shows `Business Type ID`, `Business Name`, and `Status`; does not show `Project Code`.
