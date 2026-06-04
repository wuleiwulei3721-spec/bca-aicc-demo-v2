# Context Snapshot - 2026-06-03 12:26 +08:00

## Project

- Project: `bca-aicc-demo-v2`
- Branch: `codex/text-channel-config-settings`
- Current workstream: Routing Config admin pages.

## Current Change

- Adjusted `Routing Config > Skill Routing Rules` to match the common admin page style.
- Removed the duplicate table-card title and removed the visible `Published Routing Rule Index` section.
- Rebuilt Batch Add modal into `Route Elements` and `Target Routing` sections.
- Changed active route factor controls to one factor per row with full-width multi-selects.
- Removed Batch Add Priority, Overwrite checkbox, and summary cards from the modal.
- Replaced duplicate-combination alert list with a selectable duplicate table.

## Key Files

- `src/pages/routing-config/SkillRoutingRulesPage.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`

## Verification

- `npm run lint`: passed.
- `npm run build`: passed with existing Vite/Rolldown chunk size warning.
- Browser `/routing-config/skill-routing-rules`: confirmed title appears once and `Published Routing Rule Index` is not shown.
- Browser Batch Add: confirmed section layout, five factor rows, no Overwrite/summary UI, duplicate table, default selected duplicate row, and no-change warning after unselecting duplicates.

## Risks

- Priority remains in the main list and Edit modal. Batch Add hides Priority and uses internal default `70`; full Priority removal is intentionally out of scope.
