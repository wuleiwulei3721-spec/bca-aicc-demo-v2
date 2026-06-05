# Context Snapshot - 2026-06-05 19:34 +08:00

## Project

- Project: BANK 1 AICC Demo V2.
- Branch: `codex/customer-identity-refresh`.
- Base: `main`, customer Production-safe hidden-management-menu version.

## Latest Change

- Optimized the Customer Information bottom route hint label.
- Visible label changed from `Last IVR Menu` to `Menu`.
- Full semantic meaning remains in `title` / `aria-label` as `Last IVR menu: ...`.

## Files Changed

- `src/pages/inbound/components/CustomerInformationCard.tsx`
  - Visible route label now renders `Menu`.
  - Route value keeps full `Last IVR menu: ...` title and aria label.
- `src/styles/index.less`
  - Route hint now has full-width box sizing and fixed short-label column.
- `PROJECT_CONTEXT.md`, `DEV_LOG.md`, `.codex-backup/key-prompts.md`
  - Updated current wording and recovery notes.

## Behavior

- PSTN and BankApp Voice show:
  - First row: channel + access duration, verification state, `Verify`.
  - Second row: `Menu` + final IVR menu name.
- Long menu names still truncate in one line.
- Clicking the channel tag still opens full `Call Flow Detail`.
- Live Chat and Video do not show the route hint.

## Validation

- `npm run lint` passed.
- `npm run build` passed with the existing Vite chunk size warning.
- Browser `/`:
  - PSTN showed `Menu` instead of visible `Last IVR Menu`.
  - PSTN route value retained `Last IVR menu: ...` title / aria semantics.
  - PSTN channel click opened full Call Flow Detail.
  - PSTN identity refresh Paste / Confirm still worked.
  - BankApp Voice showed `Menu`.
  - Live Chat and BankApp Video / Video Call did not show the route hint.
- Browser `/design-system` loaded successfully.

## Risks

- This is a visual / wording refinement only.
- IVR menu data remains static mock data from `callFlowDetail`.
