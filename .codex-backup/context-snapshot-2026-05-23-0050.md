# Context Snapshot - 2026-05-23 00:50 +08:00

## Project

- Repository: `D:\03projects\bca-aicc-demo-v2`
- Branch: `codex/bankapp-channel-demo`
- Current focus: BankApp customer entry demo browser-comment adjustments.

## Latest Changes

- Removed the BankApp Demo page-level title header (`Customer Simulator / BankApp Service Entry`).
- Removed the visible Language segmented control.
- Moved `Customer Type` and `Next Step` / `Reset` into the `AICC Process` panel.
- Removed AICC Process header customer/language subtitle.
- Removed `Business`, `Skill`, and `Phone` summary rows from the AICC Process panel.
- Kept a compact current channel summary plus the vertical AICC step rail.
- Restored the customer-provided channel selection screenshot as the channel page visual.
- Added transparent click hotspots over Voice Call, Video Call, and Livechat on the screenshot.
- Changed phone sizing to use screenshot aspect ratio with height-driven sizing, preventing the phone from becoming too wide when viewport height is constrained.

## Key Files

- `src/pages/bankapp/BankAppDemoPage.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`

## Validation

- `npm run lint`: passed.
- `npm run build`: passed with existing Vite/Rolldown chunk size warning.
- Browser `/`: deleted header and Language controls no longer visible.
- Browser `/`: Customer Type and Next/Reset appear inside AICC Process.
- Browser `/`: Business/Skill/Phone summary rows are gone.
- Browser `/`: channel screenshot is visible and Video hotspot opens Select Business.
- Browser `/`: Guest + Voice hotspot opens Input Phone Number.

## Risks

- Channel selection now directly shows the customer-provided source screenshot, including any original screenshot branding.
- Hotspot coordinates are tied to `channel-selection.png`; replacing that asset requires recalibration.
