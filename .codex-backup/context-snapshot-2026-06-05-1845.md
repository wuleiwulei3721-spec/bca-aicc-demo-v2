# Context Snapshot - 2026-06-05 18:45 +08:00

## Project

- Project: BANK 1 AICC Demo V2.
- Branch: `codex/customer-identity-refresh`.
- Base: `main`, customer Production-safe hidden-management-menu version.

## Latest Change

- Fixed Customer ID identity refresh popover placement.
- Popover no longer expands into the left navigation menu area.

## Files Changed

- `src/pages/inbound/components/CustomerInformationCard.tsx`
  - Changed identity refresh `Popover` placement from `bottomRight` to `bottom`.
- `src/styles/index.less`
  - Changed `.aicc-identity-refresh-popover` width from `250px` to `224px`.
- `PROJECT_CONTEXT.md`, `DEV_LOG.md`, `.codex-backup/key-prompts.md`
  - Updated recovery context and prompt notes.

## Behavior

- Customer Information header still shows both actions:
  - `Refresh customer identity`
  - `Edit contact`
- Customer ID popover opens under the refresh icon and stays within the main workspace content area.
- `Paste` still fills `00000078987`.
- `Confirm` still refreshes Customer Information, Customer Journey, and Ticketing History.

## Validation

- `npm run lint` passed.
- `npm run build` passed with existing Vite chunk size warning.
- Browser checked `/`:
  - Sign In -> PSTN opens unidentified customer.
  - Refresh and Edit buttons are both present.
  - Popover style reports `left: 489.322px`; left navigation width is `220px`, so the popover is outside the menu range.
  - Paste and Confirm still work.

## Risks

- This is a layout-only fix.
- Identity lookup remains mock-only and supports one fixed demo ID.
