# Context Snapshot - 2026-06-05 19:21 +08:00

## Project

- Project: BANK 1 AICC Demo V2.
- Branch: `codex/customer-identity-refresh`.
- Base: `main`, customer Production-safe hidden-management-menu version.

## Latest Change

- Customer Information card now shows a compact `Last IVR Menu` hint for voice / IVR interactions.
- The hint is a second line below the existing channel / verification / Verify strip, so the existing controls are not squeezed.
- The hint displays only the final IVR menu node; full path remains in `Call Flow Detail`.

## Files Changed

- `src/components/CustomerInformationPanel.tsx`
  - Added optional `accessRouteHintNode`.
- `src/pages/inbound/InteractionWorkspace.tsx`, `src/pages/inbound/components/LeftColumn.tsx`, `src/pages/inbound/InboundPage.tsx`
  - Threaded `showIvrJourney` from voice/PSTN wrapper to Customer Information.
- `src/pages/inbound/components/CustomerInformationCard.tsx`
  - Reads the final node from `callFlowDetail.ivrJourney`.
  - Renders `Last IVR Menu` only when IVR Journey is enabled.
- `src/styles/index.less`
  - Added compact route hint styling.
- `PROJECT_CONTEXT.md`, `DEV_LOG.md`, `.codex-backup/key-prompts.md`
  - Updated recovery context and business rules.

## Behavior

- PSTN and BankApp Voice show:
  - First row: channel + access duration, verification state, `Verify`.
  - Second row: `Last IVR Menu` + `Report Lost Card & Check Credit Card Application Status`.
- Live Chat and Video do not show `Last IVR Menu`.
- Clicking the channel tag still opens full `Call Flow Detail`.
- Customer identity refresh behavior is unchanged.

## Validation

- `npm run lint` passed.
- `npm run build` passed with the existing Vite chunk size warning.
- Browser `/`:
  - PSTN showed `Last IVR Menu`.
  - PSTN channel click opened full Call Flow Detail.
  - PSTN identity refresh Paste / Confirm still worked.
  - BankApp Voice showed `Last IVR Menu`.
  - Live Chat did not show the hint.
  - BankApp Video / Video Call did not show the hint.
- Browser `/design-system` loaded successfully.

## Risks

- Current IVR menu data is still static mock data from `callFlowDetail`.
- If later calls need instance-specific IVR paths, the data should move to the interaction/customer layer instead of remaining global.
