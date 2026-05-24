# Context Snapshot - 2026-05-24 13:04 +08:00

## Project

- Repo: `D:\03projects\bca-aicc-demo-v2`
- Branch: `codex/whatsapp-demo-detail`
- App: BANK 1 AICC Demo V2, React 19 / TypeScript / Vite / Ant Design 6.

## Current State

- BankApp and WhatsApp demos use a unified canvas layout with the customer app preview beside the AICC Process rail.
- BankApp Voice, Video, and Live Chat paths include an `Agent Workspace` step before `Service Closed`.
- WhatsApp Demo uses the user-provided screenshots and preserves state when switching to Live Chat and back.
- BankApp Voice `Calling Agent` / `Connected` directly render user attachment screenshots.
- BankApp Video `Calling Agent` directly reuses `public/screenshots/bankapp/voice-calling.png`.
- BankApp Video `Connected` now renders `public/screenshots/bankapp/video-connected-new.png`, a new-file-name copy of the user-provided Video connected attachment, to avoid same-name image caching.

## Recent Change

- Added `public/screenshots/bankapp/video-connected-new.png`.
- Updated `src/mock/bankapp.ts` so `bankAppScreenshotSources.videoConnected` points to `/screenshots/bankapp/video-connected-new.png`.
- Confirmed local image content matches the user attachment.
- Confirmed browser DOM for BankApp Video `Connected` loads `/screenshots/bankapp/video-connected-new.png`.

## Key Files

- `src/pages/bankapp/BankAppDemoPage.tsx`
- `src/mock/bankapp.ts`
- `public/screenshots/bankapp/voice-calling.png`
- `public/screenshots/bankapp/video-connected.png`
- `public/screenshots/bankapp/video-connected-new.png`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`

## Validation

- `npm run lint`: passed.
- `npm run build`: passed, with existing Vite/Rolldown chunk size warning.
- Browser `/`: BankApp Video `Calling Agent` loads `/screenshots/bankapp/voice-calling.png`; `Connected` loads `/screenshots/bankapp/video-connected-new.png`.
- Browser `/`: after returning to BankApp Demo, Video connected state still uses `/screenshots/bankapp/video-connected-new.png`; next step reaches `Service Closed`.
- Browser `/design-system`: page loads and shows `UI Design System`.

## Risks

- `video-connected-new.png` is a user-provided original attachment; confirm sharing rights before public deployment.
- `video-connected.png` remains as an older-name copy of the same content; current runtime depends on `video-connected-new.png`.
