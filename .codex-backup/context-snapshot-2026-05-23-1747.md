# Context Snapshot - 2026-05-23 17:47 +08:00

## Project

- Project: `bca-aicc-demo-v2`
- Branch: `codex/bankapp-channel-demo`
- Purpose: BANK 1 AICC demo with agent workspace and BankApp customer-side access simulation.
- Current focus: BankApp voice/video/live chat customer-side flow and accurate agent-side handoff.

## Latest Change

- Added BankApp Live Chat customer-side queue image resource `public/screenshots/bankapp/livechat-queue.png`.
- Added BankApp Live Chat customer-side conversation image resource `public/screenshots/bankapp/livechat-chat.png`.
- `src/mock/bankapp.ts` now exposes `textQueue` and `textChat` image paths.
- `BankAppDemoPage` renders the Live Chat `Connecting to Agent` step with `livechat-queue.png`.
- `BankAppDemoPage` renders the Live Chat `Chat Page` step with `livechat-chat.png`.
- Updated `PROJECT_CONTEXT.md`, `DEV_LOG.md`, and `.codex-backup/key-prompts.md`.

## Behavior

- BankApp Live Chat Registered Customer:
  - `Live Chat -> Select Business -> Confirm Business -> Connecting to Agent -> Chat Page -> Live Chat workspace`.
  - `Connecting to Agent` displays `/screenshots/bankapp/livechat-queue.png`.
  - `Chat Page` displays `/screenshots/bankapp/livechat-chat.png`.
- BankApp Live Chat Guest:
  - `Live Chat -> Personal Information -> Select Business -> Confirm Business -> Connecting to Agent -> Chat Page -> Live Chat workspace`.
  - `Personal Information` still uses `text-login-sanitized.png`.
- Voice and Video BankApp flows are unchanged by this update.
- Agent-side Live Chat workspace and Conversation mock are unchanged by this update.

## Validation

- `npm run lint` passed.
- `npm run build` passed with the existing Vite/Rolldown chunk size warning.
- Browser `/` passed:
  - Livechat `Connecting to Agent` loads `/screenshots/bankapp/livechat-queue.png`.
  - Livechat `Chat Page` loads `/screenshots/bankapp/livechat-chat.png`.
- Browser `/design-system` loaded normally and displayed `UI Design System`.

## Risks

- These two images are static customer-side demo assets and do not represent a real message gateway state.
- If the exact source screenshots are later saved as local files, replace `livechat-queue.png` and `livechat-chat.png` while preserving the phone screenshot ratio.
- Existing bundle-size warning remains unchanged.
