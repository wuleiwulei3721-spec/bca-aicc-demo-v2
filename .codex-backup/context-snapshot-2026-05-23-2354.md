# Context Snapshot - 2026-05-23 23:54 +08:00

## Project

- Project: `bca-aicc-demo-v2`
- Branch: `codex/whatsapp-demo-detail`
- Change: WhatsApp Demo Live Chat workspace handoff step and progressive process rail.

## Latest Change

- Added `agent-workspace` to `BankAppDemoStep`.
- Updated WhatsApp Demo sequence to:
  - Request Human Agent
  - Business Selection
  - Queue & Agent Chat
  - View Agent Workspace
  - Satisfaction Rating
- Clicking Next on `Queue & Agent Chat` activates the `Live Chat` tab and focuses WhatsApp session `live-chat-001`.
- WhatsApp Demo stays mounted while inactive so returning from Live Chat preserves the current step.
- WhatsApp process rail now shows only reached steps; future steps appear only after Next is clicked.

## Validation

- `npm run lint`: passed.
- `npm run build`: passed with the existing Vite/Rolldown chunk size warning.
- Browser smoke check `/`: WhatsApp flow advances progressively, jumps to Live Chat after the third step, preserves WhatsApp Demo state on return, then advances to Satisfaction Rating.
- Browser smoke check `/design-system`: passed.

## Risks

- Live Chat remains static demo state and does not connect to a real WhatsApp gateway.
- Keeping WhatsApp Demo mounted is intentional for state preservation; revisit if the tab later gains heavy runtime resources.
