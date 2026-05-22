# Context Snapshot - 2026-05-22 18:55 +08:00

## Project

- Project: BANK 1 AICC Demo V2
- Path: `D:\03projects\bca-aicc-demo-v2`
- Branch: `codex/live-chat-detail`
- Focus: Agent Toolbar Transfer wrapping regression fix and Conversation header Invite removal.

## Current State

- Conversation header now shows channel icon, customer name, timer, `Transfer`, and End Service only.
- Conversation header no longer shows `Invite`.
- Conversation Transfer modal still uses the shared `TransferModal` in `conversation` variant.
- Conversation Agent rows still show `Request Transfer`, `Request Conference`, and a compact more arrow.
- Conversation more menu still exposes `Force Transfer` and `Force Conference`.
- Agent Toolbar Transfer modal still uses the default `call` variant with `Transfer Agent`, `Transfer Skill`, and `Transfer Number`.
- Agent Toolbar Transfer Agent rows now keep `Consult`, `Transfer`, and `Conference` on one line again.

## Key Files Changed

- `src/layouts/components/TransferModal.tsx`
- `src/pages/inbound/components/ConversationWorkspace.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`

## Validation

- `npm run lint`: passed.
- `npm run build`: passed with the existing Vite/Rolldown chunk size warning.
- Browser smoke check `/`: PSTN / Voice Call toolbar Transfer keeps `Consult`, `Transfer`, and `Conference` on one row.
- Browser smoke check `/`: Conversation header has no `Invite` button.
- Browser smoke check `/`: Conversation Transfer modal still has no `Transfer Number` tab and still exposes request/force conference actions.
- Browser smoke check `/design-system`: page loads normally.

## Recovery Notes

- To revert only this round, restore `rowActions` wrapping and the previous call Action column width, then add back Conversation header `Invite` and `UserAddOutlined`.
- Do not revert Conversation Transfer Agent action compaction or the shared `TransferModal` variant structure unless explicitly requested.
