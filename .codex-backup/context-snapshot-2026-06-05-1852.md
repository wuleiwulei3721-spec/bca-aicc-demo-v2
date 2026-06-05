# Context Snapshot - 2026-06-05 18:52 +08:00

## Project

- Project: BANK 1 AICC Demo V2.
- Branch: `codex/customer-identity-refresh`.
- Base: `main`, customer Production-safe hidden-management-menu version.

## Latest Change

- Fixed Customer Information header action icon centering inside hover backgrounds.
- Root cause: button default padding / line-height and a 20px header extra box did not match the 22px action button.

## Files Changed

- `src/styles/index.less`
  - `.aicc-base-card__header-extra` now uses `min-height: 22px`.
  - `.aicc-customer-info__header-actions` sets `line-height: 0`.
  - `.aicc-customer-info__edit-button` clears default `padding`.
  - `.aicc-customer-info__edit-button .anticon` uses inline-flex centering.
- `PROJECT_CONTEXT.md`, `DEV_LOG.md`, `.codex-backup/key-prompts.md`
  - Updated recovery context and prompt notes.

## Behavior

- Customer Information header still shows both actions:
  - `Refresh customer identity`
  - `Edit contact`
- Both icons should be visually centered inside their hover backgrounds.
- Customer ID popover placement and width remain unchanged from the 18:45 fix.

## Validation

- Browser checked `/`:
  - Sign In -> PSTN opens customer information header.
  - Refresh and Edit buttons are both present.
- `npm run lint` passed.
- `npm run build` passed with existing Vite chunk size warning.

## Risks

- This is a visual alignment-only fix.
- Identity lookup remains mock-only and supports one fixed demo ID.
