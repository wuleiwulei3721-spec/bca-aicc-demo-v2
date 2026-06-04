# Context Snapshot - 2026-06-03 10:45 +08:00

## Project

- Project: `bca-aicc-demo-v2`
- Branch: `codex/text-channel-config-settings`
- Current workstream: Routing Config admin pages.

## Current Change

- Updated `Routing Config > Access Accounts` to use account-list maintenance with channel-specific dynamic fields.
- Excluded `Phone` from Access Accounts channel choices while keeping it in Channels.
- Replaced free-text `Channel-specific Config` with structured `extensionConfig`.

## Key Files

- `src/pages/routing-config/RoutingConfigCrudPage.tsx`
- `src/pages/routing-config/RoutingConfigDataPages.tsx`
- `src/types/routingConfiguration.ts`
- `src/mock/routingConfiguration.ts`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`

## Verification

- `npm run lint`: passed.
- `npm run build`: passed with existing Vite/Rolldown chunk size warning and plugin timing notice.
- Browser `/routing-config/access-accounts`: checked page load, filters, Key Config column, Add modal dynamic fields, no Phone channel option, and webchat field switching.

## Risks

- This is still frontend demo state. A real backend should either own the channel schema metadata or accept the same structured extension config contract.
