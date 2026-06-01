# Context Snapshot - 2026-05-28 23:16 +08:00

Project: `bca-aicc-demo-v2`
Branch: `codex/livechat2-popup`
Goal: Continue local `livechat2` popup iteration without replacing old `Live Chat` and without pushing to GitHub.

## Current State

- The `livechat2` composer Message Record icon is now a two-state toggle.
- Clicking it opens the right-side `Message Record` tab; clicking it again closes the tab and returns the right panel to `Connection`.
- The right-side `Message Record` panel no longer renders its own title/header/close button because the tab label already provides close.
- The search area is a compact one-line form: date range picker, message text input, `Search`, and compact result count.
- The date range uses AntD `RangePicker` with a default last-7-days range.
- Existing search filtering, reverse chronological order, keyword highlight, `Locate`, and center-message highlight remain.

## Key Files

- `src/pages/inbound/LiveChat2Page.tsx`
- `src/pages/inbound/components/AssistantPanel.tsx`
- `src/pages/inbound/components/LiveChat2ConversationWorkspace.tsx`
- `src/styles/index.less`

## Validation

- `npm run lint`: passed.
- `npm run build`: passed, with existing Vite/Rolldown chunk size warning.
- Browser `/`: loaded, Home tab visible.
- Browser `/design-system`: loaded, Design System text visible.
- Browser livechat2 click path: not completed because the in-app browser DOM did not expose the left `livechat2` menu item.

## Risks

- Needs visual review in livechat2 for tab close spacing, tabs more icon spacing, and whether the one-line search form fits the target demo width.
- Old `Live Chat` should not be affected; changes are scoped to livechat2 and shared right-panel extra tab styling.
- Manual livechat2 review remains required for the toggle button, tab close behavior, and compact search row.
