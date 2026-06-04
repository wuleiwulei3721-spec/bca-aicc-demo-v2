# Context Snapshot - 2026-06-03 14:36 +08:00

## Project

- Project: `bca-aicc-demo-v2`
- Branch: `codex/text-channel-config-settings`
- Current workstream: Routing Config admin pages.

## Current Change

- Refined `Routing Config > Skill Routing Rules` query toolbar spacing.
- Target Skill Queue filter now uses the same width as other query controls.
- Batch Add no longer uses a rule-page `margin-left: auto` spacer, so it follows Search / Reset naturally instead of reserving a large right-side blank area.

## Key Files

- `src/pages/routing-config/SkillRoutingRulesPage.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`

## Verification

- `npm run lint`: passed.
- `npm run build`: passed with existing Vite/Rolldown chunk size warning.
- Browser `/routing-config/skill-routing-rules`: DOM order confirmed Business Type -> Target Skill Queue -> Status -> Search -> Reset -> Batch Add.

## Risks

- If future route factors increase, the toolbar will wrap naturally; Batch Add should not regain a dedicated right-side spacer.
