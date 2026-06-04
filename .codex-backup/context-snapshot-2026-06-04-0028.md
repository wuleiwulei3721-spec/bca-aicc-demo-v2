# Context Snapshot - 2026-06-04 00:28 +08:00

## Project

- Project: `bca-aicc-demo-v2`
- Branch: `codex/text-channel-config-settings`
- Focus: `Routing Config > Skill Routing Rules` toolbar standardization.

## Current Change

- Moved `Batch Add` out of the rules filter container.
- Toolbar now follows the ordinary admin pattern:
  - Left: `query-group` with route factor filters, `Target Skill Queue`, `Status`, `Search`, and `Reset`.
  - Right: independent `add-action` with `Batch Add`.
- Removed rules-page CSS overrides that made the toolbar `display: block` and forced Add to sit next to Reset.

## Scope Preserved

- No query field changes.
- No table column changes.
- No Batch Add modal logic changes.
- No data model or store changes.

## Validation

- `npm run lint`: passed.
- `npm run build`: passed; existing Vite/Rolldown chunk size warning only.
- Browser `/routing-config/skill-routing-rules`: page renders and still shows `Search`, `Reset`, and `Batch Add`.

## Risk

- No new technical risk found. Manual visual review should confirm the right-aligned button behavior at different viewport widths.
