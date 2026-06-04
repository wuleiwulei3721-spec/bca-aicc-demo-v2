# Context Snapshot - 2026-06-03 13:21 +08:00

## Project

- Project: `bca-aicc-demo-v2`
- Branch: `codex/text-channel-config-settings`
- Current workstream: Routing Config admin pages.

## Current Change

- Changed `Routing Config > Skill Routing Rules` to maintain split routing rule rows instead of emphasizing a single keyword search and duplicate-only preview.
- Query fields now come from enabled route factors, plus Target Skill Queue and Enabled/Disabled status.
- Main list now shows Rule ID, Elements, Target Skill Queue, Updated Date, Updated By, Status, and Actions.
- Batch Add now shows `Generated Routing Rules Preview` with generated rows, duplicate overwrite selection, original/target skill queue, and status.
- Edit modal now allows only Target Skill Queue and Status changes.

## Key Files

- `src/pages/routing-config/SkillRoutingRulesPage.tsx`
- `src/types/routingConfiguration.ts`
- `src/mock/routingConfiguration.ts`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`

## Verification

- `npm run lint`: passed.
- `npm run build`: passed with existing Vite/Rolldown chunk size warning.
- Browser `/routing-config/skill-routing-rules`: confirmed enabled-factor filters, updated list columns, Batch Add generated preview, no `ANY`, and Edit modal target/status-only behavior.

## Risks

- `updatedBy` is demo-only fixed as `Admin`; a backend integration should use authenticated user audit data.
- Blank route factor values still represent unrestricted matching and may need API mapping to null.
