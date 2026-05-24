# Context Snapshot - 2026-05-25 02:10 +08:00

## Project

- Project: BANK 1 AICC Demo V2
- Path: `D:\03projects\bca-aicc-demo-v2`
- Branch: `codex/multi-inbound-interaction-tabs`
- Baseline: `main@v0.5.6` (`fbed2ff`)
- Target release: `v0.6.0`

## Current State

- Implemented multi call interaction tabs for PSTN, BankApp Voice, and BankApp Video.
- New calls create stable dynamic tabs: `call-1`, `call-2`, `call-3`.
- Active call tabs are not closable before Hang Up.
- Hang Up marks the current `CallInteraction` as `ended`, freezes the tab duration, keeps the page mounted for post-service registration, and makes the tab closable.
- New calls after ACW/Ready create new tabs instead of overwriting old ended tabs.
- Live Chat remains a fixed workspace tab with an internal multi-customer list.
- OpenEye and BankApp Video desktop share remain bound only to the current active video interaction.

## Key Files

- `src/store/appStore.ts`
- `src/pages/AgentWorkspace.tsx`
- `src/pages/inbound/InboundPage.tsx`
- `src/pages/inbound/VideoCallPage.tsx`
- `src/layouts/BasicLayout.tsx`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`

## Verification

- `npm run lint` passed.
- `npm run build` passed with the existing Vite/Rolldown chunk size warning.
- Browser smoke at 1366x768 passed:
  - Sign In opens `Live Chat` without duration.
  - PSTN Incoming creates a non-closable `PSTN (00:xx)` tab.
  - Answer -> Hang Up keeps the PSTN tab, freezes duration, and makes it closable.
  - A second PSTN call creates another PSTN tab without overwriting the old one.
  - BankApp Voice creates `Voice Call (00:xx)` and becomes closable after Hang Up.
  - BankApp Video creates `Video Call (00:xx)`, preserves the old Voice Call tab, and shows OpenEye after Answer.
  - WhatsApp Demo still enters Live Chat and Webchat remains hidden.
  - `/design-system` loads.

## Risks

- The app still supports only one active call at a time; multiple tabs are for retained ended workspaces, not simultaneous live calls.
- Old ended tab form state is in frontend memory and will be lost on page refresh.
- Closing an ended tab discards its dynamic CRM tab state.
