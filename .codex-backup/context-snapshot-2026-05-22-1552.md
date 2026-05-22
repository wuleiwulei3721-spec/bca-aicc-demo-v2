# Context Snapshot - 2026-05-22 15:52 +08:00

## Project

- Project: BANK 1 AICC Demo V2
- Path: `D:\03projects\bca-aicc-demo-v2`
- Branch: `codex/live-chat-detail`
- Focus: Live Chat CRM workspace `Conversation` tab for customer-agent real-time text conversation.

## Current State

- Live Chat still uses `InteractionWorkspace` and the left `LiveChatCustomerList`.
- `CrmPanel` now supports an optional fixed `Conversation` tab placed directly to the right of the fixed `CRM` tab.
- Live Chat passes conversation configuration into `InteractionWorkspace`, so Live Chat opens with `Conversation` selected by default; PSTN / Voice Call and Video Call still default to `CRM`.
- `ConversationWorkspace` shows current customer name, `Transfer`, `Invite`, and `End Service` actions.
- `End Service` opens a confirmation modal. Confirming removes the selected Live Chat customer from the local customer list and switches to the next available customer.
- Conversation history is mocked per customer and includes customer messages, previous agent messages, and current agent messages.
- Sending a message appends a Current Agent message to the selected customer conversation and updates the customer list last-message summary.

## Key Files Changed

- `src/pages/inbound/components/ConversationWorkspace.tsx`
- `src/pages/inbound/components/CrmPanel.tsx`
- `src/pages/inbound/InteractionWorkspace.tsx`
- `src/pages/inbound/LiveChatPage.tsx`
- `src/types/inbound.ts`
- `src/mock/inbound.ts`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`

## Validation

- `npm run lint`: passed.
- `npm run build`: passed with the existing Vite/Rolldown chunk size warning.
- Browser smoke check `/`: Live Chat opens with fixed non-closable `Conversation` tab selected.
- Browser smoke check `/`: selecting Sari Amelia updates Conversation header, messages, and composer.
- Browser smoke check `/`: sending a message appends a Current Agent message and updates the customer list last message.
- Browser smoke check `/`: `End Service` confirmation closes Sari Amelia and switches to Rafi Firmansyah.
- Browser smoke check `/design-system`: page loads normally.

## Recovery Notes

- To disable the Conversation tab without deleting the implementation, stop passing `conversation` from `LiveChatPage` to `InteractionWorkspace`.
- To fully revert, remove `ConversationWorkspace.tsx`, remove conversation props from `CrmPanel` and `InteractionWorkspace`, and remove `LiveChatConversationMessage` plus `LiveChatSession.conversation` mock data.
- `Transfer` and `Invite` are currently display-only buttons.
- Sent messages are front-end memory state only and reset on refresh.
