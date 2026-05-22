# Context Snapshot - 2026-05-22 12:19 +08:00

## Project Goal

`bca-aicc-demo-v2` is a BANK 1 AICC frontend demo for a banking agent workspace. The current branch is `codex/live-chat-detail`, focused on polishing the Live Chat inbound popup left customer list.

## This Change

- Only Live Chat customer list row background colors were adjusted.
- Hover/focus row background was made lighter and brighter.
- Active/selected row background was made lighter and brighter.
- No sizing, filtering, icon, collapse, badge, or non-panel layout behavior was changed.

## Key Files

- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`

## Validation

- `npm run lint`: passed.
- `npm run build`: passed; existing Vite chunk size warning remains.
- Browser `/`: visually checked the expanded Live Chat customer list selected-row brightness.

## Risks

- Final perceived contrast should still be checked on the actual demo display.
