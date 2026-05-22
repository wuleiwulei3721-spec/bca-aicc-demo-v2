# Context Snapshot - 2026-05-22 11:45 +08:00

## Project Goal

`bca-aicc-demo-v2` is a BANK 1 AICC frontend demo for a banking agent workspace. The current branch is `codex/live-chat-detail`, focused on polishing the Live Chat inbound popup left customer list.

## This Change

- Only `src/styles/index.less` customer-list-panel styles were changed for the application UI.
- The Live Chat customer list panel moved from grey-blue to a clearer light BANK 1 blue tone.
- Unselected customer rows no longer use background blocks; they use transparent backgrounds and separator lines.
- The active customer row still uses a white background and primary left accent.
- Channel filter buttons no longer add an outer border or active frame around the icon.
- Filter button and icon sizes were increased to improve hit area and clarity.
- Collapse/expand button no longer has a border; it is subtle by default and becomes visible on hover.

## Key Files

- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`

## Validation

- `npm run lint`: passed.
- `npm run build`: passed; existing Vite chunk size warning remains.
- Browser `/`: Live Chat customer list shows the updated blue panel, separator-line rows, larger channel icons, no outer filter borders, and a borderless collapse button.

## Risks

- Final demo resolution should still be checked visually.
- This pass intentionally did not change content outside the customer list panel.
