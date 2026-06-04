# Context Snapshot - 2026-06-03 12:54 +08:00

## Project

- Project: `bca-aicc-demo-v2`
- Branch: `codex/text-channel-config-settings`
- Current workstream: Routing Config admin pages.

## Current Change

- Refined `Skill Routing Rules` Batch Add modal.
- Reduced label/input spacing and made non-section labels normal weight.
- Route factor selects now show names only, without IDs in parentheses.
- Skill queue selects and duplicate table values now show skill queue names only.
- Duplicate table now has a header select-all checkbox.
- Default Batch Add example now produces multiple duplicate rows across three sites.
- Duplicate table columns are compressed and no longer use horizontal scroll.

## Key Files

- `src/pages/routing-config/SkillRoutingRulesPage.tsx`
- `src/mock/routingConfiguration.ts`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`

## Verification

- `npm run lint`: passed.
- `npm run build`: passed with existing Vite/Rolldown chunk size warning.
- Browser Batch Add: confirmed select-all checkbox, three duplicate site rows, no ID parentheses in element/skill labels, and intact Route Elements / Target Routing sections.

## Risks

- Duplicate table fits the current five enabled factors. More enabled factors may require a different detail pattern.
