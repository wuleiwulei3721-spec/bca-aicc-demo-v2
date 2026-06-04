# Context Snapshot - 2026-06-03 13:03 +08:00

## Project

- Project: `bca-aicc-demo-v2`
- Branch: `codex/text-channel-config-settings`
- Current workstream: Routing Config admin pages.

## Current Change

- Changed Skill Routing Rules Batch Add route factor empty behavior from `ANY` to blank values.
- Removed `ANY` options and display from Batch Add, rule conditions, duplicate table, and default mock rules.
- Added duplicate-combination hint text explaining checked rows overwrite existing skill queue and unchecked rows keep current configuration.

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
- Browser Batch Add: confirmed no visible `ANY`, duplicate hint text appears, duplicate rows still render, and clearing a selected factor leaves the field blank.

## Risks

- Blank string now represents the same routing semantics previously represented by `ANY`. A future backend API may need a mapping to null or another agreed value.
