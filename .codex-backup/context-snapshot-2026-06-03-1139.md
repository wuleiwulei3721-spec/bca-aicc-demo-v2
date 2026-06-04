# Context Snapshot - 2026-06-03 11:39 +08:00

## Project

- Project: `bca-aicc-demo-v2`
- Branch: `codex/text-channel-config-settings`
- Current workstream: Routing Config admin pages.

## Current Change

- Refactored `Routing Config > Skill Routing Rules` into a standard admin management layout.
- Moved Batch Add from a persistent top card into a dedicated modal.
- Collapsed Published Routing Rule Index by default.
- Kept the routing rule data model and batch generation logic unchanged.

## Key Files

- `src/pages/routing-config/SkillRoutingRulesPage.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`

## Verification

- `npm run lint`: passed.
- `npm run build`: passed with existing Vite/Rolldown chunk size warning.
- Browser `/routing-config/skill-routing-rules`: checked standard query toolbar, Batch Add modal, duplicate blocking, edit constraints, and collapsible Published Routing Rule Index.

## Risks

- `Route Conditions` now wraps all enabled factors into one compact table cell. If future projects enable many more factors, a detail popover or drawer may be needed.
