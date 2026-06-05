# Context Snapshot - 2026-06-05 20:07 +08:00

## Project

- Project: BANK 1 AICC Demo V2.
- Branch: `codex/livechat-current-empty-state`.
- Base: clean `main` after customer identity refresh release.

## Latest Change

- Fixed formal Live Chat behavior when the Current customer list becomes empty.
- Sign In now opens Live Chat with two default Current demo customers:
  - `livechat2-001`: active service conversation.
  - `livechat2-005`: customer-ended conversation waiting for agent `Close`.
- Current and History workspace selection are now isolated.

## Files Changed

- `src/store/appStore.ts`
  - `setLiveChatTabOpen(true)` seeds the default Live Chat demo scenario only in a clean sign-in cycle.
  - `livechat2-005` is initialized as `ended/customer` while still appearing in Current until closed.
- `src/pages/inbound/LiveChat2Page.tsx`
  - Current view no longer falls back to History sessions.
  - Current empty state shows `No current Live Chat customers`.
- `src/pages/inbound/components/LiveChat2CustomerPanel.tsx`
  - Current / History list empty states added for expanded list mode.
- `src/styles/index.less`
  - Added low-emphasis list empty state styling.
- `PROJECT_CONTEXT.md`, `DEV_LOG.md`, `.codex-backup/key-prompts.md`
  - Updated recovery context and release notes.

## Behavior

- Current empty means no customer-linked workspace content on the right.
- History customers remain available only after the agent manually switches to History.
- New WhatsApp / BankApp route still adds a new Current session and restores the normal workspace view.

## Validation

- `npm run lint` passed.
- `npm run build` passed with the existing Vite chunk size warning.
- Browser `/`:
  - Sign In opened Live Chat with two Current customers.
  - `livechat2-005` appeared as a customer-ended session with `Close`.
  - Closing `livechat2-005` changed Current to 1 and History to 2.
  - Ending and confirming the remaining active session changed Current to 0 and History to 3.
  - Current empty state showed `No current conversations` in the list and `No current Live Chat customers` on the right.
  - Switching to History showed the closed sessions and rendered history details.
- Browser `/design-system` loaded successfully.
- Browser automation opened WhatsApp Demo but did not fully advance to Agent Workspace; keep that route as manual follow-up.

## Risks

- Default double-customer setup is a frontend demo seed, not a real queue integration.
- The same sign-in cycle does not auto-reseed default customers after the agent closes all Current sessions.
