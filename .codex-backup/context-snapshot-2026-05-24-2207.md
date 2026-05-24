# Context Snapshot - 2026-05-24 22:07 +08:00

## Project

- Project: BANK 1 AICC Demo V2.
- Path: `D:\03projects\bca-aicc-demo-v2`.
- Branch: `codex/toolbar-visual-polish`.
- Release target: `v0.5.3`.
- Baseline: `main@v0.5.2`.

## Current Change

- Polished the top Agent Toolbar divider visibility and Settings display-mode selector.
- The change only affects Agent Toolbar visual details, More menu trigger behavior, and Toolbar Settings modal styling.

## Behavior

- Incoming identification remains the first item in the call action area.
- PSTN calls show `IVR 08123456789`.
- BankApp Voice / Video calls show `BankID 00012345`.
- Identification remains plain text with no colon, no background, and no pill border.
- Identification divider and timer divider use the same clearer 1px color: `rgba(86, 122, 166, 0.52)`.
- `IVR` / `BankID` remain visually stronger; the number remains semi-bold at 700 with tabular numerals.
- More opens on click and exposes Outbound Call and Settings.
- Settings uses a project custom segmented button group for `Icon + Text` / `Icon Only`, aligned with the BankApp Customer type style.

## Key Files Changed

- `src/layouts/components/AgentToolbar.tsx`
- `src/layouts/components/ToolbarSettingsModal.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`

## Validation

- `npm run lint`: passed.
- `npm run build`: passed with the existing Vite/Rolldown large chunk warning.
- Browser smoke `/` at 1366x768: More click opens the menu and Settings opens.
- Browser smoke `/`: Settings shows custom segmented buttons for `Icon + Text` and `Icon Only`.
- Browser smoke `/`: `Icon Only` hides toolbar button text and keeps icons plus accessible labels.
- Browser smoke `/`: PSTN Incoming still shows `IVR 08123456789` before Answer.
- Browser smoke `/design-system`: page loads.

## Risks

- Toolbar display mode remains session-only and resets to `Icon + Text` on refresh.
- BankApp Voice / Video were not retested end to end in this visual polish pass, but they reuse the same `AgentToolbar` identification rendering path.
