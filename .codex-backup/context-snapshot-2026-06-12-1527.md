# Context Snapshot - 2026-06-12 15:27 +08:00

## Project State

`Verification Rule V2` remains the active customer identity verification demo. The old `Verification Rules` page remains unchanged.

## Latest Change

Special Rules were changed from always-visible cards to add-on rule blocks:

- `Special Rules` now has `Select special rule type` and `Add Rule`.
- Only enabled special rules are displayed.
- Available special rule blocks are `Case Type Layering`, `Branch Combined Verification`, and `Organization Segment Override`.
- Removing a special rule only disables it; the internal configuration is preserved for re-adding.
- `Strict Failure Handling` was removed from the special rule model and UI.
- Failure blocking is controlled only by base `Failure Action = Block continuation`.

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
- `git diff --check` passed with existing CRLF conversion warnings only.
- HTTP smoke check returned 200 for `/`, `/call-management/verification-rule-v2`, and `/design-system` on local dev servers 5173 and 5175.
- Source scan confirmed no `strictFailureHandling`, `Strict Failure Handling`, or old Max Wrong strict failure copy remains under `src/`.
- Codex in-app browser connection timed out after 30 seconds, so visual screenshot verification was not completed.

## Known Risks

- Browser screenshot verification was not completed due to the timeout. Manually verify `/call-management/verification-rule-v2` before customer demo, especially Add Rule, delete special rule block, save, and verification popup matching.
