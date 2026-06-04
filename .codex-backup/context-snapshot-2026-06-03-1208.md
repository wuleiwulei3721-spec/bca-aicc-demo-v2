# Context Snapshot - 2026-06-03 12:08 +08:00

## Project

- Project: `bca-aicc-demo-v2`
- Branch: `codex/text-channel-config-settings`
- Current workstream: Routing Config admin pages.

## Current Change

- Added `VDN` as a required ownership field for `Routing Config > Skill Queues`.
- Updated `SkillQueue` type and mock data with `vdnCode`.
- Added VDN lookup options from existing VDN master data.
- Updated Skill Queues filters, list columns, modal fields, draft mapping, record mapping, and validation.
- Added VDN delete protection for VDNs referenced by skill queues.

## Key Files

- `src/types/routingConfiguration.ts`
- `src/mock/routingConfiguration.ts`
- `src/pages/routing-config/RoutingConfigDataPages.tsx`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`

## Verification

- `npm run lint`: passed.
- `npm run build`: passed with existing Vite/Rolldown chunk size warning and plugin timing notice.
- Browser `/routing-config/skill-queues`: checked Keyword / VDN / Status filters, VDN list column after Skill Name, Add modal required VDN select defaulting to `Retail Inbound VDN`, and final page refresh showing both VDN names.

## Risks

- VDN is now a Skill Queue master-data field only. VDN remains excluded from default Route Elements and Skill Routing Rules enabled factors unless explicitly re-enabled later.
