# Context Snapshot - 2026-05-22 18:49 +08:00

## Project

- Project: BANK 1 AICC Demo V2
- Path: `D:\03projects\bca-aicc-demo-v2`
- Branch: `codex/live-chat-detail`
- Focus: Conversation Transfer Agent action compaction.

## Current State

- `TransferModal` still supports `variant?: 'call' | 'conversation'`, with `call` as the default so Agent Toolbar behavior remains unchanged.
- Conversation header `Transfer` opens the shared Transfer modal in `conversation` variant.
- Conversation Transfer modal shows only `Transfer Agent` and `Transfer Skill`.
- Conversation Agent rows now show `Request Transfer`, `Request Conference`, and a compact more arrow.
- The more arrow opens a dropdown with `Force Transfer` and `Force Conference`.
- Conversation Transfer no longer uses `Request Invite` or `Force Invite`; this workflow now uses the same `Conference` terminology as the call toolbar.
- Conversation Skill rows stay unchanged from the call toolbar modal and still use `Transfer`.
- Message area, composer, customer list, Customer Information, CRM, Assistant, mock data, and transfer types were not intentionally changed.

## Key Files Changed

- `src/layouts/components/TransferModal.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`

## Validation

- `npm run lint`: passed.
- `npm run build`: passed with the existing Vite/Rolldown chunk size warning.
- Browser smoke check `/`: Conversation Transfer modal has no `Transfer Number` tab, Agent rows show two primary actions plus a more arrow, and the dropdown exposes the two force actions.
- Browser smoke check `/`: Conversation Transfer Skill tab still shows visible `Transfer` actions only.
- Browser smoke check `/`: Agent Toolbar Transfer modal still shows `Transfer Agent`, `Transfer Skill`, `Transfer Number`, and original call actions.
- Browser smoke check `/design-system`: page loads normally.

## Recovery Notes

- To revert only this round, restore the conversation Agent actions to the previous four inline buttons and remove `.aicc-transfer-agent-actions` styles.
- Do not revert the `TransferModal` variant prop, Conversation Transfer modal state/import, Conversation tab feature, message layout, customer switching, send logic, or End Service confirmation unless explicitly requested.
