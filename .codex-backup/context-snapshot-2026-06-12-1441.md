# Context Snapshot - 2026-06-12 14:41 +08:00

## Project State

`Verification Rule V2` remains the active identity verification demo under Call Management. The old V1 page remains unchanged.

## Latest Change

Simplified V2 Question Bank:

- Removed question status from the question bank data model and UI.
- Question Bank now only maintains unique question names.
- Removed status filter, Status column, and Add/Edit status switch.
- Merged duplicate question names by normalized text. Default question bank now has 56 questions and 56 unique normalized names.
- Added duplicate-name validation when adding or editing a question.
- Fixed Question Bank modal body/table height so filtering fewer rows or no rows does not resize the modal.

## Key Files

- `src/types/verificationRuleV2.ts`
- `src/mock/verificationRuleV2.ts`
- `src/utils/verificationRuleV2.ts`
- `src/pages/call-management/VerificationRuleV2Page.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`

## Verification

- `npm run lint` passed.
- `npm run build` passed with the existing Vite chunk-size warning.
- Duplicate scan result: `total 56 unique 56 duplicates 0`.

## Known Risks

- Question Bank no longer supports disabling individual questions. Temporary removal should be done by removing the question from rules, unless a future requirement reintroduces question-level status.
