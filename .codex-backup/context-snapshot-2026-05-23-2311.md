# Context Snapshot - 2026-05-23 23:11 +08:00

## Project

- Project: `bca-aicc-demo-v2`
- Branch: `codex/whatsapp-demo-detail`
- Change: WhatsApp Demo four-step screenshot flow.

## Latest Change

- Added 4 user-provided sanitized WhatsApp screenshots under `public/screenshots/whatsapp/`.
- Added `whatsAppScreenshotSources` in `src/mock/bankapp.ts`.
- Updated `BankAppDemoPage` so `variant="whatsapp"` uses a dedicated four-step sequence:
  - Request Human Agent
  - Business Selection
  - Queue & Agent Chat
  - Satisfaction Rating
- Removed `Customer Type` from the WhatsApp Demo AICC Process controls.
- Set every WhatsApp Demo step owner badge to `Bank1`.

## Validation

- `npm run lint`: passed.
- `npm run build`: passed with the existing Vite/Rolldown chunk size warning.
- Browser smoke check `/`: WhatsApp Demo opens from `Channel Simulation > WhatsApp`, uses four WhatsApp screenshots, hides `Customer Type`, and shows `Bank1` on every step.
- Browser smoke check `/design-system`: passed.

## Risks

- WhatsApp screenshots are static demo assets and do not represent a real WhatsApp gateway integration.
- Public release still needs confirmation that the four screenshot assets are approved and fully sanitized.
