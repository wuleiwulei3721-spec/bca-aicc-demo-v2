# Context Snapshot - 2026-06-03 01:05 +08:00

## Project

- Project: `bca-aicc-demo-v2`
- Branch: `codex/text-channel-config-settings`
- Current workstream: `Routing Config > Skill Queues`.

## Current Change

- Refined `Skill Queues` keyword search, table density, and modal field layout.
- Keyword search now matches only `Skill ID`, `Platform Skill ID`, and `Skill Name`; status remains a separate dropdown.
- Removed `Queue Prompts` from Add/Edit/View modal fields.
- Reduced Skill Queues table column widths and removed forced horizontal `tableScrollX`.
- Unified CRUD modal input/select/number-with-unit heights.

## Key Files

- `src/pages/routing-config/RoutingConfigDataPages.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`

## Verification

- `npm run lint`: passed.
- `npm run build`: passed with existing Vite/Rolldown chunk size warning.
- Browser `/routing-config/skill-queues`: Keyword placeholder no longer includes Status.
- Browser `/routing-config/skill-queues`: Add modal no longer shows `Queue Prompts` or `Routing Method`.

## Risks

- `Queue Prompts` are no longer user-editable in this page; new records keep the default prompt and existing records preserve current prompt data.
