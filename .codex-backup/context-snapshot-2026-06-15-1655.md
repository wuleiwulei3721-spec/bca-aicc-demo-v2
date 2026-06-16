# Context Snapshot - 2026-06-15 16:55 +08:00

## Project

- Path: `D:\03projects\bca-aicc-demo-v2`
- Branch: `main`
- Focus: BANK 1 AICC demo, especially Call Management and Customer Verification Rule V2.

## Current Change

- Refined `Verification Rule V2` edit modal after customer feedback.
- Unified V2 modal input/select/input-number height to 32px.
- Default scenario can now be renamed with the pencil icon, but cannot be deleted.
- Scenario tabs now only show the scenario name; Correct/Wrong/Blocks stats were removed from the tab text.
- `Failure Action` is no longer shown as an outer-list column. It is tied to `Max Wrong`: it only appears when `No Limit` is off and a wrong-answer limit is configured.
- `Question Bank` delete now checks rule references. If a question is referenced by any V2 scenario block, a confirmation modal shows the reference count and rule count before deletion.

## Key Files

- `src/pages/call-management/VerificationRuleV2Page.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`

## Validation

- `npx tsc --noEmit --pretty false`: passed.
- `npm run lint`: passed.
- `npm run build`: passed with existing chunk size warning.
- `rg -n -i "halo|bca" src`: no matches.
- HTTP smoke:
  - `/`: 200
  - `/call-management/verification-rule-v2`: 200
  - `/design-system`: 200

## Risk

- No screenshot-level browser validation was possible in this environment because browser automation and Playwright dependencies were unavailable.
- Manual visual check is still recommended for V2 edit modal alignment and Question Bank delete confirmation.
