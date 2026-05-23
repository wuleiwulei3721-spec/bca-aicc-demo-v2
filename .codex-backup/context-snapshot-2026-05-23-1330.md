# Context Snapshot - 2026-05-23 13:30 +08:00

## Project

- Project: `bca-aicc-demo-v2`
- Branch: `codex/bankapp-channel-demo`
- Purpose: BANK 1 AICC demo for inbound agent workspace, Live Chat, Video Call, and BankApp customer-side access simulation.
- Current focus: BankApp customer-side demo for Voice, Video, and Livechat access paths.

## Latest Change

- Added sanitized BankApp entry screenshots:
  - `public/screenshots/bankapp/channel-selection-sanitized.png`
  - `public/screenshots/bankapp/voice-phone-number-sanitized.png`
  - `public/screenshots/bankapp/text-login-sanitized.png`
- Kept original screenshots in `public/screenshots/bankapp/`.
- Updated `src/mock/bankapp.ts` so BankApp Demo only references the three sanitized entry images.
- Updated `PROJECT_CONTEXT.md`, `DEV_LOG.md`, and `.codex-backup/key-prompts.md`.

## Design Notes

- Channel selection image keeps the same `2640 x 5736` ratio and displays `BANK 1`.
- Only `Voice Call`, `Video Call`, and `Live Chat` are readable in the channel image.
- Other service areas, bottom navigation, customer system hints, and sensitive fields are masked or weakened.
- Phone number and personal information images keep `1320 x 2868` ratio and show generic BANK 1 forms with masked fields.
- `Select Business` and later AICC-controlled pages remain generated components, not screenshots.

## Key Files

- `src/pages/bankapp/BankAppDemoPage.tsx`
- `src/mock/bankapp.ts`
- `src/types/bankapp.ts`
- `src/styles/index.less`
- `public/screenshots/bankapp/*`
- `src/store/appStore.ts`
- `src/pages/AgentWorkspace.tsx`
- `src/layouts/BasicLayout.tsx`

## Validation

- `npm run lint` passed.
- `npm run build` passed with existing Vite/Rolldown chunk size warning.
- Browser `/` passed:
  - BankApp Demo opens from `Customer Simulator > BankApp`.
  - Channel page uses `channel-selection-sanitized.png`.
  - Video, Livechat, and Guest Voice hotspots enter the correct flow.
  - Guest Voice uses `voice-phone-number-sanitized.png`.
  - Livechat uses `text-login-sanitized.png`.
- Browser `/design-system` loaded normally.

## Risks

- Sanitized screenshots are deterministic redraws/masked approximations, not pixel-perfect customer app captures.
- Channel hotspots still depend on the current service-card positions in the sanitized image.
- BankApp Demo remains a frontend-only demo with no real BankApp, routing service, messaging gateway, or audio/video integration.
