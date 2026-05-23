# Context Snapshot - 2026-05-23 19:39 +08:00

## Project

- Project: `bca-aicc-demo-v2`
- Branch: `codex/video-screenshare-demo`
- Milestone: `v0.4.0` Video screen share demo.
- Current baseline: local `main` includes `v0.3.1` menu and WhatsApp simulator.

## Latest Change

- Added demo-only screen share state to `appStore`.
- BankApp Video connected screen now has Start/Stop screen share control.
- Video Call OpenEye floating window displays a desktop share preview when sharing is active.
- Hang Up, closing Video Call tab, ordinary new video calls, reset, and unsigned/AUX state changes clean up sharing state.

## Validation

- `npm run lint`: passed.
- `npm run build`: passed with the existing Vite/Rolldown chunk size warning.

## Risks

- Screen share is front-end demo state only and does not request media permissions or stream a real desktop.
- The control is overlaid on the existing connected-call screenshot and may need customer-specific visual refinement later.
