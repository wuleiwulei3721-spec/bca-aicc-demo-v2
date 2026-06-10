# Context Snapshot - 2026-06-10 16:03 +08:00

## Project

- Project: `bca-aicc-demo-v2`
- Branch: `codex/livechat-copy-update`
- Worktree: `D:\03projects\bca-aicc-demo-v2-main-fix`

## Latest Change

- Agent toolbar duration now reuses the shared `formatDuration()` helper.
- Duration display rule: below 1 hour uses `mm:ss`; at 1 hour and above uses `hh:mm:ss`.
- Message Record `Locate` no longer leaves focus on the record article.
- After Message Record locate, focus returns to the search input, so agents can type a second keyword immediately.
- Changing keyword or date clears the prior located highlight.

## Key Files

- `src/layouts/components/AgentToolbar.tsx`
- `src/pages/inbound/components/LiveChat2ConversationWorkspace.tsx`

## Validation

- `npm run lint` passed.
- `npm run build` passed with the existing Vite chunk size warning.
- Source helper check passed: `00:00`, `59:59`, `01:00:00`, `16:09:32`.
- Browser smoke passed for first search, locate, focus returning to search input, second search, highlight clearing, and no Conversation locate.

## Risk

- This fixes frontend duration rendering. Preformatted duration strings from external systems would still need input normalization if introduced later.
