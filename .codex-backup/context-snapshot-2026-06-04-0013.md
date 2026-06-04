# Context Snapshot - 2026-06-04 00:13 +08:00

## Project

- Project: `bca-aicc-demo-v2`
- Branch: `codex/text-channel-config-settings`
- Focus: `Routing Config > Site Access Volume` query refinement.

## Current Change

- Added a dedicated `Media Type` select filter to `Site Access Volume`.
- Query toolbar is now `Keyword / Media Type / Status / Search / Reset / Add`.
- `Keyword` now only matches Channel ID, Channel Code, and Channel Name.
- `Media Type` uses existing media options and supports `All / Voice / Video / Text`.
- Filtering by media recalculates channel merged-cell `rowSpan` from the filtered media rows.

## Scope Preserved

- No data model changes.
- No modal add/edit/delete logic changes.
- No route or menu changes.
- No table column changes.

## Validation

- `npm run lint`: passed.
- `npm run build`: passed; existing Vite/Rolldown chunk size warning only.
- Browser `/routing-config/site-access-volume`: page renders and query toolbar shows `Keyword`, `Media Type`, and `Status`.

## Risk

- No new technical risk found. Manual review should still check filtered rowSpan behavior across Voice / Video / Text.
