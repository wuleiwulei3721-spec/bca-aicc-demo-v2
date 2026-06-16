# Context Snapshot - 2026-06-12 14:50 +08:00

## Project State

`Verification Rule V2` remains the active identity verification demo under Call Management. The old `Verification Rules` page remains unchanged.

## Latest Change

Simplified only the V2 question group configuration header:

- Each group now uses a compact single-line toolbar.
- Toolbar contains group name, `Questions N`, `Select`, `Correct`, `Order`, and delete action.
- `Alternative` does not show `Correct`; its replacement note is in a tooltip.
- `Berurut` is shown as `Order`; tooltip explains that questions should be asked in the configured sequence.
- Selected question rows were not compressed and still use the existing up/down/delete actions.
- No drag sorting dependency was added.

## Key Files

- `src/pages/call-management/VerificationRuleV2Page.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`

## Verification

- `npm run lint` passed.
- `npm run build` passed with the existing Vite chunk-size warning.
- `git diff --check` passed with existing CRLF conversion warnings only.
- HTTP smoke check returned 200 for `/`, `/call-management/verification-rule-v2`, and `/design-system` on local dev servers 5173 and 5175.
- Codex in-app browser connection timed out twice, so visual screenshot verification was not completed.

## Known Risks

- This is a visual density change and browser screenshot verification was not completed. Before customer demo, manually open `/call-management/verification-rule-v2`, edit or create a rule, and check the compact group toolbar with real question data.
