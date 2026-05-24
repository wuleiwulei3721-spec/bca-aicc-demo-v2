# Context Snapshot - 2026-05-24 19:48 +08:00

## Project

- Project: BANK 1 AICC Demo V2.
- Path: `D:\03projects\bca-aicc-demo-v2`.
- Branch: `codex/toolbar-identification-display-mode`.
- Release target: `v0.5.2`.
- Baseline: `main@v0.5.1`.

## Current Change

- Refined toolbar incoming identification placement and styling.
- Reopened toolbar Settings and added toolbar display mode.
- The change only affects the top Agent Toolbar and Settings modal.

## Behavior

- Incoming identification is the first item in the call action area.
- PSTN calls show `IVR 08123456789`.
- BankApp Voice / Video calls show `BankID 00012345`.
- Identification uses plain text, no colon, no pill background, and a right-side divider.
- Settings offers `Icon + Text` and `Icon Only`; default is `Icon + Text`.
- `Icon Only` hides visible labels on call-control buttons but keeps icons, `aria-label`, and `title`.
- Auto-answer remains fixed at the existing default 3 seconds, with no Settings UI.

## Key Files Changed

- `src/layouts/BasicLayout.tsx`
- `src/layouts/components/AgentToolbar.tsx`
- `src/layouts/components/ToolbarSettingsModal.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`

## Validation

- `npm run lint`: passed.
- `npm run build`: passed with the existing Vite/Rolldown large chunk warning.
- Browser smoke `/`: Settings opens from More and no longer shows auto-answer seconds.
- Browser smoke `/`: Icon Only hides button text while preserving accessible labels.
- Browser smoke `/`: PSTN IVR text is left of Answer/hold controls and hides after Hang Up.
- Browser smoke `/`: BankApp Voice / Video show BankID at the left edge of call actions.
- Browser smoke `/`: BankApp / WhatsApp Live Chat do not show IVR/BankID.
- Browser smoke `/`: 1366x768 header has no toolbar overlap.
- Browser smoke `/design-system`: page loads.

## Risks

- Toolbar display mode is session-only and resets to `Icon + Text` on refresh.
- Auto-answer remains fixed at 3 seconds. Reintroduce a setting only if the customer asks for it.
