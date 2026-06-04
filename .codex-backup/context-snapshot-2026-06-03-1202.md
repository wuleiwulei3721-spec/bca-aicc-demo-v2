# Context Snapshot - 2026-06-03 12:02 +08:00

## Project

- Project: `bca-aicc-demo-v2`
- Branch: `codex/text-channel-config-settings`
- Current workstream: Routing Config admin pages.

## Current Change

- Updated default Route Elements to the user-defined 8-factor order.
- Removed VDN from default Route Elements while keeping VDN master data.
- Removed VDN conditions from default routing rules.
- Confirmed Skill Routing Rules only renders enabled and active factors.

## Key Files

- `src/mock/routingConfiguration.ts`
- `src/pages/routing-config/RoutingConfigDataPages.tsx`
- `src/pages/routing-config/SkillRoutingRulesPage.tsx`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`

## Verification

- `npm run lint`: passed.
- `npm run build`: passed with existing Vite/Rolldown chunk size warning.
- Browser `/routing-config/route-elements`: checked order, disabled state, and no VDN row.
- Browser `/routing-config/skill-routing-rules`: checked Route Conditions, Batch Add, and Published Routing Rule Index exclude disabled factors and VDN.

## Risks

- VDN remains in VDN master data and factor value options for future reuse, but is not enabled as a default route element.
