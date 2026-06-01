# Context Snapshot - 2026-05-29 12:04 +08:00

Project: `bca-aicc-demo-v2`
Branch: `codex/livechat2-popup`
Goal: Continue local `livechat2` popup iteration without replacing old `Live Chat` and without pushing to GitHub.

## Current State

- Fixed the `livechat2` quick replies popup shown after typing `/` in the composer.
- The popup is now anchored above the full composer (`bottom: calc(100% + 6px)`) instead of inside it.
- The textarea remains visible while quick replies are open.
- The quick replies list now has a max height and internal vertical scrolling.

## Key Files

- `src/styles/index.less`

## Validation

- `npm run lint`: passed.
- `npm run build`: passed with the existing Vite/Rolldown chunk size warning.
- Browser `/` and `/design-system`: loaded successfully.
- livechat2 slash popup: still needs manual visual review through the actual menu path.

## Risks

- Needs visual review in livechat2 because browser automation still cannot open the left `livechat2` menu path.
- The fix is CSS-only and scoped to `.livechat2-quick-replies`.
