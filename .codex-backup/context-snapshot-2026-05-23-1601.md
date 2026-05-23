# Context Snapshot - 2026-05-23 16:01 +08:00

## Project

- Project: `bca-aicc-demo-v2`
- Branch: `codex/bankapp-channel-demo`
- Purpose: BANK 1 AICC demo with agent workspace and BankApp customer-side access simulation.
- Current focus: BankApp customer-side flow with sanitized screenshot-driven entry, business selection, and business confirmation pages.

## Latest Change

- Added six sanitized business screenshots:
  - `voice-business-selection-sanitized.png`
  - `video-business-selection-sanitized.png`
  - `livechat-business-selection-sanitized.png`
  - `voice-business-confirm-sanitized.png`
  - `video-business-confirm-sanitized.png`
  - `livechat-business-confirm-sanitized.png`
- Updated `src/mock/bankapp.ts` to expose per-channel business selection and confirmation image paths.
- Updated `src/pages/bankapp/BankAppDemoPage.tsx` so `business` and `confirm` steps use sanitized screenshots.
- Added transparent business and confirmation hotspots in `src/styles/index.less`.
- Updated `PROJECT_CONTEXT.md`, `DEV_LOG.md`, and `.codex-backup/key-prompts.md`.

## Behavior

- Voice, Video, and Livechat each show a channel-specific sanitized business selection screenshot.
- Clicking a business card hotspot selects a mock business type and opens the confirmation screenshot.
- Confirmation screenshot includes two hotspots:
  - No -> back to `Select Business`
  - Yes -> `Calling Agent`
- `Calling Agent`, `Connected`, `Chat Page`, and `Service Closed` remain generated frontend UI.

## Validation

- `npm run lint` passed.
- `npm run build` passed with the existing Vite/Rolldown chunk size warning.
- Browser `/` passed:
  - Voice selection and confirmation screenshot paths load correctly; Yes proceeds to `Calling...`.
  - Video selection and confirmation screenshot paths load correctly.
  - Livechat selection and confirmation screenshot paths load correctly.
- Browser `/design-system` loaded normally.

## Risks

- The six business screenshots are sanitized redraws based on the available customer voice business screenshots; dedicated customer screenshots for Video and Livechat were not present in the provided folder.
- Business hotspot coordinates depend on the current sanitized image layout.
- BankApp remains a frontend demo and does not connect to a real routing service, messaging gateway, or audio/video stack.
