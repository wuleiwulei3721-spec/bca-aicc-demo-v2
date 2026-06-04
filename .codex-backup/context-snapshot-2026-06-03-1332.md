# Context Snapshot - 2026-06-03 13:32 +08:00

## Project

- Project: `bca-aicc-demo-v2`
- Branch: `codex/text-channel-config-settings`
- Current workstream: Routing Config admin pages.

## Current Change

- Refined `Routing Config > Skill Routing Rules` after the split-rule preview change.
- Factor filters are now multi-select dropdowns with no All / Empty options.
- The main rule list now splits enabled route factors into separate columns instead of one `Elements` column.
- View/Edit modal now uses the standard admin two-column form layout. Route factors are read-only; Target Skill Queue and Status remain editable in edit mode.

## Key Files

- `src/pages/routing-config/SkillRoutingRulesPage.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`

## Verification

- `npm run lint`: passed.
- `npm run build`: passed with existing Vite/Rolldown chunk size warning.
- Browser `/routing-config/skill-routing-rules`: confirmed split factor columns, no Elements merged column, no All / Empty in factor dropdown, and standard edit modal layout.

## Risks

- With 5 enabled route factors the table remains readable. If more route factors are enabled, the page may need column visibility controls, horizontal scroll, or a drawer-based details view.
