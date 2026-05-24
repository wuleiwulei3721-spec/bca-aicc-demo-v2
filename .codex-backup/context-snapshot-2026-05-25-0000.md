# Context Snapshot - 2026-05-25 00:00 +08:00

## Project

- Project: BANK 1 AICC Demo V2
- Path: `D:\03projects\bca-aicc-demo-v2`
- Branch: `codex/interaction-tab-duration-sla`
- Baseline: `main@v0.5.4` (`fde58f6`)
- Target release: `v0.5.5`

## Current State

- Implemented workspace tab duration and source-specific tab names for customer remote demo:
  - PSTN inbound tab: `PSTN (mm:ss)`.
  - BankApp Voice tab: `Voice Call (mm:ss)`.
  - Video Call tab: `Video Call (mm:ss)`.
  - Live Chat tab: `Live Chat (mm:ss)` only when active sessions exist.
- Added lightweight new-interaction flash metadata using `startedAt` and `flashUntil`.
- Added Live Chat customer list duration, SLA warning/breach state, expanded accent, collapsed SLA marker, and new-customer flash.
- `ConversationWorkspace` now receives runtime elapsed seconds from `LiveChatPage` instead of maintaining its own interval.
- Voice/video timing cleanup is connected to Hang Up, closing tabs, Unsigned, and AUX reset paths.

## Key Files

- `src/store/appStore.ts`
- `src/hooks/useNow.ts`
- `src/utils/duration.ts`
- `src/pages/AgentWorkspace.tsx`
- `src/pages/inbound/LiveChatPage.tsx`
- `src/pages/inbound/components/LiveChatCustomerList.tsx`
- `src/pages/inbound/components/ConversationWorkspace.tsx`
- `src/layouts/BasicLayout.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`

## Verification

- `npm run lint` passed.
- `npm run build` passed with existing Vite/Rolldown chunk size warning.
- Browser smoke at 1366x768 passed:
  - Sign In opens `Live Chat` without duration.
  - PSTN tab shows `PSTN (mm:ss)` and no old `PSTN / Voice Call`.
  - BankApp Voice tab shows `Voice Call (mm:ss)`.
  - BankApp Video tab shows `Video Call (mm:ss)`.
  - BankApp Live Chat tab/list show active duration and breach SLA.
  - Collapsed Live Chat customer list shows SLA marker.
  - End Service clears Live Chat tab duration.
  - `/design-system` loads.

## Risks

- Multi-interaction support remains scoped to existing architecture: one voice call, one video call, one Live Chat workspace with multiple active Live Chat sessions.
- Live Chat SLA thresholds are fixed at 60 seconds warning and 120 seconds breach.
- Webchat mock remains hidden and does not participate in active session timing.
