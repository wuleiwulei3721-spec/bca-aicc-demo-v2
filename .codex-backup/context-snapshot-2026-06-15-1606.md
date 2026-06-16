# Context Snapshot - 2026-06-15 16:06 +08:00

## Project

- Path: `D:\03projects\bca-aicc-demo-v2`
- Branch: `main`
- Focus: `Call Management > Verification Rule V2` editing experience.

## Current State

- V2 remains modeled as `Rule -> Verification Scenario -> Question Block -> Question`.
- Fixed question block types remain `Mandatory`, `Dynamic`, `Static`, `Alternative`; free naming is only for `Custom Block`.
- The edit/add rule modal now follows the admin modal pattern: fixed modal height, scrollable content body, fixed footer.
- Base rule fields use the admin form field style; multi-select controls are constrained to one line with `+N`.
- Verification Scenario selection is now a compact horizontal tab strip rather than large cards.
- Scenario copy is only available through `+ Scenario` using `Copy current scenario`; the outer `Copy Scenario` action is removed.
- Non-default scenarios support inline rename via edit icon and delete via delete icon; default scenario cannot be deleted.

## Key Files

- `src/pages/call-management/VerificationRuleV2Page.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`

## Risks

- Browser click-level verification is still required after command validation.
- The V2 store remains front-end demo state only; refresh restores mock defaults.
