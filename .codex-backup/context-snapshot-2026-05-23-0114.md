# Context Snapshot - 2026-05-23 01:14 +08:00

## Project

- Repository: `D:\03projects\bca-aicc-demo-v2`
- Branch: `codex/bankapp-channel-demo`
- Current focus: BankApp customer simulator sizing, hotspot alignment, and screenshot-based pre-AICC pages.

## Latest Changes

- Phone frame is now height-driven and enlarged to nearly fill the left panel while preserving the customer screenshot aspect ratio.
- AICC Process controls now show `Customer Type`, `Next Step`, and `Reset` on one row.
- Voice/Video/Livechat transparent hotspots were recalibrated to align with the screenshot menu rows.
- `Input Phone Number` now uses `public/screenshots/bankapp/voice-phone-number.png`.
- `Personal Information` now uses `public/screenshots/bankapp/text-login.png`.
- `Select Business` and later AICC-controlled steps remain generated React components.

## Key Files

- `src/pages/bankapp/BankAppDemoPage.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`

## Validation

- `npm run lint`: passed.
- `npm run build`: passed with existing Vite/Rolldown chunk size warning.
- Browser `/`: phone frame enlarged and fills the left panel better.
- Browser `/`: AICC Process control row is compact and single-line.
- Browser `/`: Guest + Voice hotspot opens the customer phone-number screenshot page.
- Browser `/`: Livechat hotspot opens the customer information screenshot page.

## Risks

- Three pre-AICC pages now directly show customer screenshots. If copy or branding must change, the screenshots need replacement or these pages must be componentized again.
- Hotspot coordinates depend on the current `channel-selection.png` layout.
