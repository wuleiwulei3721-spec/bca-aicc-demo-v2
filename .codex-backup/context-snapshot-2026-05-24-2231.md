# Context Snapshot - 2026-05-24 22:31 +08:00

## Project

- Project: BANK 1 AICC Demo V2.
- Path: `D:\03projects\bca-aicc-demo-v2`.
- Branch: `codex/toolbar-compact-visual-balance`.
- Release target: `v0.5.4`.
- Baseline: `main@v0.5.3`.

## Current Change

- Balanced Agent Toolbar metadata text hierarchy.
- Simplified Toolbar Settings modal.
- Improved `Icon Only` toolbar mode readability.
- The change only affects Agent Toolbar and Toolbar Settings visual behavior.

## Behavior

- Incoming identification remains the first item in the call action area.
- PSTN calls show `IVR 08123456789`.
- BankApp Voice / Video calls show `BankID 00012345`.
- Identification remains plain text with no colon, no background, no pill border, and the existing divider position.
- `IVR` / `BankID` labels now match the timer label style.
- Identification numbers now match the timer value style: black, 700 weight, tabular numerals.
- Settings shows one compact row: `Toolbar display` plus `Icon + Text` / `Icon Only`.
- `Icon Only` mode keeps 29px square toolbar buttons and uses 14px icons for action buttons and More.

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
- Browser smoke `/` at 1366x768: More > Settings opens and Settings is a single row without the description text.
- Browser smoke `/`: `Icon Only` adds `aicc-agent-toolbar--icon-only`, action button width is 29px, and action/More icons are 14px.
- Browser smoke `/`: PSTN Incoming shows `IVR 08123456789`; identification label/value computed styles match timer label/value styles.
- Browser smoke `/design-system`: page loads.

## Risks

- Toolbar display mode remains session-only and resets to `Icon + Text` on refresh.
- This change does not alter BankApp/WhatsApp/Video routing or call state behavior.
