# Context Snapshot - 2026-05-22 01:28 +08:00

## Project Goal

`bca-aicc-demo-v2` is a BANK 1 AICC frontend demo for a banking agent workspace. The current branch is `codex/live-chat-detail`, focused on polishing the Live Chat inbound popup left customer list without touching the surrounding workspace content.

## This Change

- Live Chat channel filtering changed from single-select to multi-select.
- Default selected channels are WhatsApp, BankApp, and Webchat; therefore ALL is highlighted by default.
- Clicking ALL restores all three channels and highlights all four filter buttons.
- Clicking an individual channel toggles that channel; if any channel is off, ALL is not highlighted.
- Inactive filter icons are greyed out; active filters use their channel color.
- Webchat icon color changed to orange so it no longer duplicates WhatsApp green.
- Customer list panel uses a deeper cool grey-blue background and header to create visual separation from the adjacent white workspace columns.

## Key Files

- `src/pages/inbound/LiveChatPage.tsx`
- `src/pages/inbound/components/LiveChatCustomerList.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`

## Validation

- `npm run lint`: passed.
- `npm run build`: passed; existing Vite chunk size warning remains.
- Browser `/`: default ALL + all channels highlighted; toggling Webchat removes Rafi and turns off ALL; clicking ALL restores the complete list.
- Browser visual check `/`: customer list panel has stronger visual separation and Webchat is orange.

## Risks

- Multi-select currently allows all channels to be deselected, leaving the list empty while Customer Information keeps the latest active customer.
- The chosen style is the cool grey-blue panel option; possible alternatives are a deeper BANK 1 blue sidebar or a softer neutral grey panel.
- Live Chat remains static demo mock data.
