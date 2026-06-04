# Context Snapshot - 2026-06-02 22:04 +08:00

## Project

- Project: `bca-aicc-demo-v2`
- Purpose: BANK 1 AICC enterprise demo for banking contact center workflows.
- Current branch: `codex/text-channel-config-settings`
- Current workstream: `Routing Config` admin configuration pages.

## Current Change

- Updated `Routing Config > Channels` to match the requested channel management model.
- Channels visible list fields now include `Channel ID`, `Channel Name`, `Media Type`, `Max Concurrent Calls`, `Min Scan Interval (s)`, and `Status`.
- Added visible non-sequential numeric `channelId` while preserving internal `channelCode` for existing references.
- Added `mediaTypes`, `maxConcurrency`, and `minScanIntervalSeconds` to `Channel`.
- Added reusable `multiSelect` support to `RoutingConfigCrudPage` for form fields and filters.
- Channels query is now `Keyword + Media Type + Status`.

## Business Rules Captured

- Channel IDs shown in Channels are numeric.
- Channel names: Phone, Haloapp, webchat, WhatsApp, Email, Instagram, LinkedIn, Facebook, X, Tik Tok, YouTube, AppStore, playstore.
- Phone supports Voice only.
- Haloapp and webchat support Voice, Video, and Text.
- Other channels support Text only.
- Default max concurrent calls is 50.
- Default minimum scan interval is 30 seconds.

## Key Files

- `src/types/routingConfiguration.ts`
- `src/mock/routingConfiguration.ts`
- `src/store/routingConfigStore.ts`
- `src/pages/routing-config/RoutingConfigCrudPage.tsx`
- `src/pages/routing-config/RoutingConfigDataPages.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`

## Verification

- `npm run lint`: passed.
- `npm run build`: passed, with existing Vite chunk size warning.
- Browser `/routing-config/channels`: page rendered expected fields, filters, channels, and pagination.
- Browser Add modal: rendered expected fields and defaults 50 / 30, with no validation warning before save.

## Risks

- `channelId` is visible business ID, while `channelCode` remains the internal reference key. If real backend contracts require numeric IDs everywhere, routing rules, channel media, access accounts, and access entries need coordinated migration.
- `Channel Media` details were not expanded for all channel/media combinations in this change.
