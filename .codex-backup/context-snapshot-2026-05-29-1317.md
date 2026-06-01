# Context Snapshot - 2026-05-29 13:17 +08:00

Project: `bca-aicc-demo-v2`
Branch: `codex/livechat2-popup`
Goal: Continue local `livechat2` popup iteration without replacing old `Live Chat` and without pushing to GitHub.

## Current State

- Added a fixed `Quick Replies` tab to the livechat2 right Assistant panel.
- The tab appears after `Assistant` and `Connection`; `Message Record` remains a closable dynamic tab appended after it.
- Quick reply data is now shared between the Conversation `/` popup and the right `Quick Replies` panel.
- `My Phrases` supports runtime group and phrase CRUD; `Public Phrases` is read-only.
- Clicking a phrase in the right panel inserts it into the current livechat2 textarea and places the caret at the end.
- Runtime changes are local to the current demo session only; refresh restores defaults.

## Key Files

- `src/pages/inbound/LiveChat2Page.tsx`
- `src/pages/inbound/components/LiveChat2ConversationWorkspace.tsx`
- `src/pages/inbound/components/LiveChat2QuickRepliesPanel.tsx`
- `src/pages/inbound/components/liveChat2QuickReplies.ts`
- `src/pages/inbound/components/AssistantPanel.tsx`
- `src/styles/index.less`

## Validation

- `npm run lint`: passed.
- `npm run build`: passed with the existing Vite/Rolldown chunk size warning.
- Browser `/` and `/design-system`: loaded successfully.
- Actual livechat2 Quick Replies flow: still needs manual review because the in-app browser DOM did not expose the `livechat2` menu entry.

## Risks

- Needs manual visual review in livechat2 because the browser automation view may not expose the left `livechat2` menu path.
- Inline CRUD is intentionally demo-local and does not persist to localStorage or backend.
