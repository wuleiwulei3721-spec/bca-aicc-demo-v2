# Context Snapshot - 2026-05-29 12:25 +08:00

Project: `bca-aicc-demo-v2`
Branch: `codex/livechat2-popup`
Goal: Continue local `livechat2` popup iteration without replacing old `Live Chat` and without pushing to GitHub.

## Current State

- Added keyboard selection for the `livechat2` quick replies popup.
- Typing `/` opens quick replies with the first item selected by default.
- `ArrowDown` / `ArrowUp` cycles through candidates.
- Pressing `Enter` while quick replies are open inserts the selected phrase instead of sending the message.
- After insertion, the textarea keeps focus and the caret is placed at the end of the inserted phrase.
- Mouse hover also updates the selected quick reply.

## Key Files

- `src/pages/inbound/components/LiveChat2ConversationWorkspace.tsx`
- `src/styles/index.less`

## Validation

- `npm run lint`: passed.
- `npm run build`: passed with the existing Vite/Rolldown chunk size warning.
- Browser `/` and `/design-system`: loaded successfully.
- livechat2 slash keyboard flow: still needs manual review because the in-app browser DOM did not expose the `livechat2` menu entry.

## Risks

- Needs manual visual review in the actual livechat2 composer because Browser automation may not expose the left `livechat2` menu path.
- The change is scoped to `livechat2`; old `Live Chat`, modal flows, mock data, and store contracts are unchanged.
