# Context Snapshot - 2026-06-03 00:54 +08:00

## Project

- Project: `bca-aicc-demo-v2`
- Branch: `codex/text-channel-config-settings`
- Current workstream: `Routing Config > Skill Queues`.

## Current Change

- Adjusted `Skill Queues` query fields, list columns, modal fields, default values, units, and validation.
- Added `supportsVideo: boolean` to `SkillQueue` type and mock data.
- Removed `routingMethod` from `SkillQueue` type, mock data, list, and modal.
- Generic `RoutingConfigCrudPage` now supports number field `min/max/addonAfter` and always-read-only fields.

## Key Files

- `src/pages/routing-config/RoutingConfigDataPages.tsx`
- `src/pages/routing-config/RoutingConfigCrudPage.tsx`
- `src/types/routingConfiguration.ts`
- `src/mock/routingConfiguration.ts`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`

## Verification

- `npm run lint`: passed.
- `npm run build`: passed with existing Vite/Rolldown chunk size warning.
- Browser `/routing-config/skill-queues`: list shows work time plan names, queue units, video support, and no routing method.
- Browser `/routing-config/skill-queues`: Add modal shows `60 items`, `100 sec`, `Supports Video = No`, disabled `Assigned Agents`, and no routing method.

## Risks

- User-provided units appeared reversed in parentheses; implementation uses field semantics: queue size uses `items`, timeout uses `sec`.
