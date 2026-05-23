# Context Snapshot - 2026-05-23 19:03 +08:00

## Project

- Project: `bca-aicc-demo-v2`
- Branch: `codex/bankapp-channel-demo`
- Purpose: BANK 1 AICC demo with agent workspace and BankApp customer-side access simulation.
- Current focus: BankApp customer-side process ownership labels for customer demo clarity.

## Latest Change

- Added owner badges to BankApp current phone step heading and AICC Process rail.
- `Choose Channel`, `Input Phone Number`, `Personal Information`, and `Service Closed` show `BANK1`.
- `Select Business`, `Confirm Business`, `Calling Agent`, `Connected`, and `Chat Page` show `Netinfo`.
- Updated `src/pages/bankapp/BankAppDemoPage.tsx` and `src/styles/index.less`.
- Updated `PROJECT_CONTEXT.md`, `DEV_LOG.md`, and `.codex-backup/key-prompts.md`.

## Behavior

- BankApp process steps now communicate which party develops each screen.
- The labels are presentation-only and do not change routing, screenshots, handoff, or state machine behavior.
- Registered Voice shows BANK1 for `Choose Channel` and `Service Closed`, Netinfo for the AICC-controlled middle steps.
- Guest Voice adds `Input Phone Number` with BANK1.
- Guest Live Chat adds `Personal Information` with BANK1.

## Validation

- `npm run lint` passed.
- `npm run build` passed with the existing Vite/Rolldown chunk size warning.
- Browser `/` passed:
  - Registered Voice displayed BANK1 and Netinfo badges in the expected steps.
  - Guest Voice displayed `Input Phone Number` with BANK1.
  - Guest Live Chat displayed `Personal Information` with BANK1.
- Browser `/design-system` loaded normally and displayed `UI Design System`.

## Risks

- Ownership labels are demo explanation metadata, not a contractual or technical integration boundary.
- If the ownership split changes, update `bankOwnedSteps` in `BankAppDemoPage.tsx`.
