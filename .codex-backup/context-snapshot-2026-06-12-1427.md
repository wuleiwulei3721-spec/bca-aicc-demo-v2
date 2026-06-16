# Context Snapshot - 2026-06-12 14:27 +08:00

## Project State

`Verification Rule V2` remains the active customer identity verification demo page under Call Management. The old V1 `Verification Rules` page remains unchanged.

## Latest Change

Refined the V2 Question Bank maintenance experience:

- Added filters by question name and status.
- Replaced the inline add/edit area with a separate Add/Edit Question modal.
- Question status now uses a switch instead of a select.
- Question Bank modal uses fixed height.
- The table defaults to 10 rows per page and supports 20 / 50 page sizes with internal table scrolling.

## Key Files

- `src/pages/call-management/VerificationRuleV2Page.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`

## Verification

- `npm run lint` passed.
- `npm run build` passed with the existing Vite chunk-size warning.

## Known Risks

- Browser screenshot verification was not completed in this pass. Manually check the Question Bank modal, Add/Edit Question modal, and pagination before customer demo.
