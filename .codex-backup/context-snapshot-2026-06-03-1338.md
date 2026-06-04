# Context Snapshot - 2026-06-03 13:38 +08:00

## Project

- Project: `bca-aicc-demo-v2`
- Branch: `codex/text-channel-config-settings`
- Current workstream: Routing Config admin pages.

## Current Change

- Refined `Routing Config > Skill Routing Rules` edit modal status control, query toolbar layout, and horizontal-scroll table behavior.
- Status in Edit modal now uses the shared short switch style with Enabled/Disabled text.
- Query toolbar now places Search / Reset directly after filters and keeps Batch Add on the same line aligned right when space allows.
- Skill Routing Rules Actions column is fixed right so only non-action columns scroll horizontally.

## Key Files

- `src/pages/routing-config/SkillRoutingRulesPage.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`

## Verification

- `npm run lint`: passed.
- `npm run build`: passed with existing Vite/Rolldown plugin timing and chunk size warnings.
- Browser `/routing-config/skill-routing-rules`: confirmed split factor columns and Actions column presence.
- Browser Edit modal: confirmed Status is a switch and no Status combobox remains.

## Risks

- Other custom Routing Config tables should be reviewed if they later gain horizontal scroll; the shared CRUD table already fixes the action column.
