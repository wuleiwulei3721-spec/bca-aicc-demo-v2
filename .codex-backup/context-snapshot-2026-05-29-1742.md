# Context Snapshot - 2026-05-29 17:42 +08:00

Project: `bca-aicc-demo-v2`
Branch: `codex/livechat2-popup`
Goal: Fix manual review issues after replacing official `Live Chat` with the completed livechat2 implementation.

## Current State

- Official `Live Chat` still uses tab key `live-chat` and renders `LiveChat2Page`.
- Agent-confirmed `End Service` now appends the system ending message and immediately closes the session into History.
- Ticketing History opens CRM dynamic tabs labeled by CRM ID / ticket reference, such as `CRM000145`.
- Assistant right tabs now use a shared label renderer so `Assistant`, `Connection`, `Quick Replies`, and `Message Record` have consistent icon-text spacing.
- CRM and Assistant tabs reserve extra right-side space for the more button to avoid blocking the final close button.
- Sent quoted messages now store `quotedMessage` separately and render the quote as a subtle block instead of embedding `Replying to ...` in the message text.
- Repeated WhatsApp / BankApp demo handoff creates a new livechat2 session instance instead of focusing the original mock session.

## Key Files

- `src/store/appStore.ts`
- `src/pages/inbound/LiveChat2Page.tsx`
- `src/pages/inbound/components/LiveChat2ConversationWorkspace.tsx`
- `src/pages/inbound/components/CrmPanel.tsx`
- `src/pages/inbound/components/AssistantPanel.tsx`
- `src/types/inbound.ts`
- `src/styles/index.less`

## Validation

- `npm run lint`: passed.
- `npm run build`: passed with the existing Vite/Rolldown chunk size warning.
- Browser `/`: loaded; after Sign In, the fixed `Live Chat` tab was visible. The in-app browser did not stably complete the detailed `Live Chat` tab interaction in this run.
- Browser `/design-system`: loaded; `UI Design System` and the base sections were visible.

## Risks

- Needs target-resolution visual review for CRM/Assistant final tab close buttons and quote block polish.
- Needs manual repeat-handoff review for WhatsApp and BankApp Demo to confirm each entry appears as a new customer.
