# Context Snapshot - 2026-05-22 18:28 +08:00

## Project

- Project: BANK 1 AICC Demo V2
- Path: `D:\03projects\bca-aicc-demo-v2`
- Branch: `codex/live-chat-detail`
- Focus: Conversation Transfer modal componentization.

## Current State

- `TransferModal` now supports `variant?: 'call' | 'conversation'`, with `call` as the default so Agent Toolbar behavior remains unchanged.
- Conversation header Transfer opens the shared Transfer modal in `conversation` variant.
- Conversation Transfer modal shows only `Transfer Agent` and `Transfer Skill`.
- Conversation Agent rows show `Request Transfer`, `Force Transfer`, `Request Invite`, and `Force Invite`.
- Conversation Skill rows stay unchanged from the call toolbar modal and still use `Transfer`.
- Message area, composer, customer list, Customer Information, CRM, Assistant, mock data, and transfer types were not intentionally changed.

## Key Files Changed

- `src/layouts/components/TransferModal.tsx`
- `src/pages/inbound/components/ConversationWorkspace.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`

## Validation

- `npm run lint`: passed.
- `npm run build`: passed with the existing Vite/Rolldown chunk size warning.
- Browser smoke check `/`: Conversation Transfer modal has no `Transfer Number` tab, Agent rows show four new actions, Skill rows still show `Transfer`, and actions close the modal.
- Browser smoke check `/`: Agent Toolbar Transfer modal still shows `Transfer Agent`, `Transfer Skill`, `Transfer Number`, and original call actions.
- Browser smoke check `/design-system`: page loads normally.

## Recovery Notes

- To revert only this round, remove the `TransferModal` variant prop and conditional actions/tabs, remove the Conversation Transfer modal state/import, and remove `.aicc-transfer-row-actions`.
- Do not revert the Conversation tab feature, message layout, customer switching, send logic, or End Service confirmation unless explicitly requested.
