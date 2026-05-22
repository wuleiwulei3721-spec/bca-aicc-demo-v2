# Context Snapshot - 2026-05-22 12:09 +08:00

## Project Goal

`bca-aicc-demo-v2` is a BANK 1 AICC frontend demo for a banking agent workspace. The current branch is `codex/live-chat-detail`, focused on polishing the Live Chat inbound popup left customer list.

## This Change

- Only Live Chat customer list panel styles were changed.
- Active customer row background is lighter: `rgba(255, 255, 255, 0.78)`.
- Customer list items container no longer applies horizontal padding.
- Row padding was widened so row content keeps the same readable inset while the selected background spans the full panel width.
- Collapsed customer list active row also spans the full narrow rail.

## Key Files

- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`

## Validation

- `npm run lint`: passed.
- `npm run build`: passed; existing Vite chunk size warning remains.
- Browser `/`: active Live Chat customer row is lighter and spans the full customer list panel width.

## Risks

- This pass intentionally changed only customer list panel row styles.
