# Context Snapshot - 2026-05-29 15:31 +08:00

Project: `bca-aicc-demo-v2`
Branch: `codex/livechat2-popup`
Goal: Continue local `livechat2` popup iteration without replacing old `Live Chat` and without pushing to GitHub.

## Current State

- Optimized the livechat2 right `Quick Replies` panel.
- Removed visible counts from section and group headers.
- Group/category headers are now collapsible and default expanded.
- `My Phrases` group add action moved to a hover/focus plus button on the section header.
- Phrase text now wraps fully instead of truncating with ellipsis.
- My phrase actions float over the phrase on hover/focus instead of reserving a permanent right column.

## Key Files

- `src/pages/inbound/components/LiveChat2QuickRepliesPanel.tsx`
- `src/styles/index.less`

## Validation

- `npm run lint`: passed.
- `npm run build`: passed with the existing Vite/Rolldown chunk size warning and plugin timing notice.
- Browser `/` and `/design-system`: loaded successfully.
- Actual livechat2 Quick Replies visual flow: still needs manual review because the in-app browser DOM did not expose the `livechat2` menu entry.

## Risks

- Needs manual visual review in livechat2 because browser automation may not expose the left `livechat2` menu path.
- Long phrase wrapping increases row height; verify density at the target demo resolution.
