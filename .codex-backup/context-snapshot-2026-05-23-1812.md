# Context Snapshot - 2026-05-23 18:12 +08:00

## Project

- Project: `bca-aicc-demo-v2`
- Branch: `codex/bankapp-channel-demo`
- Purpose: BANK 1 AICC demo with agent workspace and BankApp customer-side access simulation.
- Current focus: BankApp voice/video/live chat customer-side flow, exact screenshot asset usage, and final Service Closed closure.

## Latest Change

- Replaced BankApp Live Chat queue image with the exact user-provided processed attachment: `public/screenshots/bankapp/livechat-queue.png`.
- Replaced BankApp Live Chat conversation image with the exact user-provided processed attachment: `public/screenshots/bankapp/livechat-chat.png`.
- Added exact user-provided satisfaction evaluation attachment: `public/screenshots/bankapp/service-closed.png`.
- `src/mock/bankapp.ts` now exposes `serviceClosed`.
- `BankAppDemoPage` renders `Service Closed` with `service-closed.png` for Voice, Video, and Live Chat.
- `requestInboundPopup`, `requestVideoCallPopup`, and `requestLiveChatWorkspace` now accept an optional `activate` flag.
- BankApp handoff opens agent workspace tabs in the background while keeping `BankApp Demo` visible for the customer-side final state.
- Updated `PROJECT_CONTEXT.md`, `DEV_LOG.md`, and `.codex-backup/key-prompts.md`.

## Behavior

- BankApp Live Chat Registered Customer:
  - `Live Chat -> Select Business -> Confirm Business -> Connecting to Agent -> Chat Page -> Service Closed`.
  - `Connecting to Agent` displays `/screenshots/bankapp/livechat-queue.png`.
  - `Chat Page` displays `/screenshots/bankapp/livechat-chat.png`.
  - Next from `Chat Page` opens/focuses the BankApp Live Chat session in the background and displays `/screenshots/bankapp/service-closed.png`.
- BankApp Live Chat Guest:
  - `Live Chat -> Personal Information -> Select Business -> Confirm Business -> Connecting to Agent -> Chat Page -> Service Closed`.
- BankApp Voice:
  - Next from `Connected` opens the BankApp voice inbound tab in the background and displays `/screenshots/bankapp/service-closed.png`.
- BankApp Video:
  - Next from `Connected` opens the BankApp video tab in the background and displays `/screenshots/bankapp/service-closed.png`.
- Agent-side Customer Information still shows BankApp icon/text for BankApp voice/video.

## Validation

- `npm run lint` passed.
- `npm run build` passed with the existing Vite/Rolldown chunk size warning.
- Browser `/` passed:
  - Livechat queue loads `/screenshots/bankapp/livechat-queue.png`.
  - Livechat chat loads `/screenshots/bankapp/livechat-chat.png`.
  - Voice reaches `/screenshots/bankapp/service-closed.png`.
  - Video reaches `/screenshots/bankapp/service-closed.png`.
  - Livechat reaches `/screenshots/bankapp/service-closed.png`.
  - `BankApp Demo` remains the visible active workspace after background handoff.
- Browser `/design-system` loaded normally and displayed `UI Design System`.

## Risks

- The three direct attachment images are static demo assets, not real gateway or rating API states.
- Background handoff is intentional for the demo customer-side closure; if the required narrative changes to immediately show the agent workspace, restore active tab switching.
- Existing bundle-size warning remains unchanged.
