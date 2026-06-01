# Context Snapshot - 2026-05-29 16:27 +08:00

Project: `bca-aicc-demo-v2`
Branch: `codex/livechat2-popup`
Goal: Replace the old visible `Live Chat` popup with the completed livechat2 implementation locally, without pushing to GitHub.

## Current State

- The official workspace tab keeps key `live-chat` and label `Live Chat`, but now renders `LiveChat2Page`.
- The standalone `livechat2` tab is no longer rendered in `AgentWorkspace`.
- The temporary `Channel Simulation > livechat2` menu entry was removed.
- `requestLiveChatWorkspace` still preserves the old WhatsApp / BankApp flow contract, but maps old IDs to livechat2 sessions:
  - `live-chat-001` -> `livechat2-001`
  - `live-chat-002` -> `livechat2-002`
  - `live-chat-003` -> `livechat2-003`
- The official `Live Chat` tab now shows a total unread badge, capped visually at `99+`.

## Key Files

- `src/layouts/BasicLayout.tsx`
- `src/pages/AgentWorkspace.tsx`
- `src/pages/inbound/LiveChat2Page.tsx`
- `src/pages/inbound/components/LiveChat2CustomerPanel.tsx`
- `src/store/appStore.ts`
- `src/styles/index.less`

## Validation

- `npm run lint`: passed.
- `npm run build`: passed with the existing Vite/Rolldown chunk size warning.
- `git diff --check`: passed with CRLF warnings only.
- Browser `/`: Sign In works, the official `Live Chat` tab opens and renders the new Live Chat workspace, and no visible `livechat2` text appears.
- Browser `/design-system`: loaded normally.

## Risks

- Need manual verification in the target demo resolution that WhatsApp Demo and BankApp Live Chat still enter the official `Live Chat` tab and focus the expected customer.
- Old `LiveChatPage` remains in source only as rollback reference and is not currently rendered by the official tab.
