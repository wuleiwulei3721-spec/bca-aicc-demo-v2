# Context Snapshot - 2026-05-22 19:52 +08:00

## Project

- Project: BANK 1 AICC Demo V2
- Path: `D:\03projects\bca-aicc-demo-v2`
- Branch: `codex/bankapp-channel-demo`
- Focus: BankApp customer-side service entry demo.

## Current State

- Added `Customer Simulator > BankApp` menu entry and `BankApp Demo` workspace tab.
- Added a three-column BankApp demo page: customer phone simulator, AICC routing timeline, and agent desktop outcome.
- Copied customer-provided BankApp/Haloapps screenshots into `public/screenshots/bankapp/` with ASCII filenames.
- Text Chat outcome opens Live Chat and focuses the BankApp customer session `live-chat-002`.
- Voice Call outcome triggers the existing inbound voice state machine with `BankApp Voice` customer context.
- Video Call outcome triggers the existing video call state machine and reuses the OpenEye floating window after answer.
- Visible customer-facing naming is `BankApp`; no page should display `Haloapps` for these paths.

## Key Files Changed

- `src/pages/bankapp/BankAppDemoPage.tsx`
- `src/mock/bankapp.ts`
- `src/types/bankapp.ts`
- `src/store/appStore.ts`
- `src/layouts/BasicLayout.tsx`
- `src/pages/AgentWorkspace.tsx`
- `src/pages/inbound/InboundPage.tsx`
- `src/pages/inbound/LiveChatPage.tsx`
- `src/styles/index.less`
- `public/screenshots/bankapp/*`

## Validation

- `npm run lint`: passed.
- `npm run build`: passed with the existing Vite/Rolldown chunk size warning.
- Browser smoke check `/`: BankApp menu entry, tab open, no visible `Haloapps` text, Text Chat focus, Voice Call trigger, Video Call trigger, OpenEye after answer, and Reset Demo all passed.
- Browser smoke check `/design-system`: passed.

## Recovery Notes

- To revert only this round, remove the BankApp page/mock/types/assets and restore the BankApp-specific app store, menu, workspace tab, inbound source, Live Chat focus, and style changes.
- Do not revert the existing Live Chat Conversation work from `codex/live-chat-detail`.
