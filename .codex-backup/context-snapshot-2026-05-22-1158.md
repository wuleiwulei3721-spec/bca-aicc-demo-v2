# Context Snapshot - 2026-05-22 11:58 +08:00

## Project Goal

`bca-aicc-demo-v2` is a BANK 1 AICC frontend demo for a banking agent workspace. The current branch is `codex/live-chat-detail`, focused on polishing the Live Chat inbound popup left customer list.

## This Change

- ALL channel filter is now dual-state.
- If all channels are selected, clicking ALL clears WhatsApp, BankApp, and Webchat.
- If not all channels are selected, clicking ALL restores all channels.
- Active customer row now uses a simple full-row selection background without a left accent or extra frame.
- Collapsed Live Chat customer list width changed from `66px` to `56px`.
- Collapsed filter icons and customer row icon sizes were tightened to fit the narrower rail.
- Ant Design unread badge white outline was removed inside the customer list panel.

## Key Files

- `src/pages/inbound/LiveChatPage.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`

## Validation

- `npm run lint`: passed.
- `npm run build`: passed; existing Vite chunk size warning remains.
- Browser `/`: ALL clears all channels and shows `No active chats`; clicking ALL again restores all channels.
- Browser `/`: active row is full-row selected with no extra frame; collapsed rail is narrower and still displays channel icons and unread badges.

## Risks

- Empty channel selection leaves the right-side workspace on the most recent active customer.
- Final demo resolution should still be checked for the narrower collapsed rail.
