# Context Snapshot - 2026-06-03 18:26 +08:00

## Project

- Project: `bca-aicc-demo-v2`
- Branch: `codex/text-channel-config-settings`
- Goal: BANK 1 AICC frontend demo with enterprise-grade routing configuration pages.

## Current Change

- Added `Routing Config > Media Service Rule Plans` for channel media business rules.
- Current scope is Text media first; Voice / Video are reserved in channel binding rows.
- `Channels` remains channel master data but now shows and maintains `Channel + Media Type` rule plan binding.
- `Text Channel Settings` is intentionally not reused and remains only as the existing Call Management page until the user asks to delete it.

## Key Files Changed

- `src/types/routingConfiguration.ts`
- `src/mock/routingConfiguration.ts`
- `src/store/routingConfigStore.ts`
- `src/pages/routing-config/RoutingConfigDataPages.tsx`
- `src/routes.tsx`
- `src/layouts/BasicLayout.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`

## Behavior

- New route: `/routing-config/media-service-rule-plans`.
- New menu item: `媒体服务规则配置`, placed after `渠道配置`.
- `Channels` list includes `Rule Plan`.
- `Channels` Add/Edit modal includes `Media Rule Plan Binding`.
- Text media must bind an Enabled Text rule plan when channel status is Active.
- Media Service Rule Plan delete is blocked when referenced by a channel media binding.

## Validation

- `npm run lint`: passed.
- `npm run build`: passed; only existing Vite chunk size warning.
- Browser checked:
  - `/routing-config/channels`
  - `/routing-config/media-service-rule-plans`

## Risks

- Voice / Video rule plan detail fields are not implemented yet.
- Existing `Call Management > Text Channel Settings` is still present but expected to be deprecated later.
