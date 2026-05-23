# Context Snapshot - 2026-05-23 18:38 +08:00

## Project

- Project: `bca-aicc-demo-v2`
- Branch: `codex/bankapp-channel-demo`
- Purpose: BANK 1 AICC demo with agent workspace and BankApp customer-side access simulation.
- Current focus: BankApp customer-side video connected screenshot must use the exact user-provided attachment.

## Latest Change

- Replaced `public/screenshots/bankapp/video-connected.png` with the exact video-call screenshot attached by the user in the latest message.
- No component logic changed because `src/mock/bankapp.ts` already points `videoConnected` to `/screenshots/bankapp/video-connected.png`.
- Updated `PROJECT_CONTEXT.md`, `DEV_LOG.md`, and `.codex-backup/key-prompts.md`.

## Behavior

- BankApp Video `Connected` step directly displays `/screenshots/bankapp/video-connected.png`.
- The image is the user-provided original attachment and is not redrawn or sanitized.
- Voice, Live Chat, and Service Closed behavior is unchanged by this asset replacement.

## Validation

- Local image check confirmed `video-connected.png` visually matches the latest user-provided video-call screenshot.
- `npm run lint` passed.
- `npm run build` passed with the existing Vite/Rolldown chunk size warning.
- Browser `/` passed: BankApp Video reaches `Connected` and displays `img[alt="BankApp connected video call"][src*="video-connected.png"]`.
- Browser `/design-system` loaded normally and displayed `UI Design System`.

## Risks

- The image is a static customer-side demo asset and does not represent a real video protocol state.
- The original attachment is larger than the previous generated image; current impact should be limited to static asset size.
