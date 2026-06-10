# Context Snapshot - 2026-06-10 14:53 +08:00

## Project

- Project: `bca-aicc-demo-v2`
- Branch: `codex/livechat-copy-update`
- Worktree: `D:\03projects\bca-aicc-demo-v2-main-fix`
- Purpose: continue customer-safe formal Live Chat Preview fixes.

## Latest Change

- Conversation message list now defaults to the latest message at the bottom when the active session or latest message changes.
- Message Record search `Locate` now stays inside the Message Record panel: it clears the keyword, returns to the continuous record list for the same date range, scrolls the matching record into view, and highlights that record.
- Message Record no longer sends locate requests into Conversation.
- Haloapps menu detail no longer displays `Single-level menu`; the single menu name is shown directly.
- Live Chat text-channel access detail now shows Transfer History / agent records, matching the PSTN call popup pattern.
- Live Chat tab unread badge is positioned above and to the right of the duration with top nav padding, so it stays visible without covering `(00:xx)`.

## Key Files

- `src/pages/inbound/LiveChat2Page.tsx`
- `src/pages/inbound/InteractionWorkspace.tsx`
- `src/pages/inbound/components/LeftColumn.tsx`
- `src/pages/inbound/components/CustomerInformationCard.tsx`
- `src/pages/inbound/components/CallFlowDetailModal.tsx`
- `src/pages/inbound/components/LiveChat2ConversationWorkspace.tsx`
- `src/styles/index.less`

## Validation

- `npm run lint` passed.
- `npm run build` passed with the existing Vite chunk size warning.
- Browser smoke passed for bottom scroll, Message Record in-panel Locate, Haloapps menu detail without `Single-level menu`, text-channel Transfer History, and unread badge not overlapping duration.

## Risk

- Text-channel Transfer History currently reuses demo mock agent records. If customer requires channel-specific history, add a dedicated mock/type structure later.
