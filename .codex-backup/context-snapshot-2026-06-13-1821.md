# Context Snapshot - 2026-06-13 18:21 +08:00

## This Session

- Simplified `Edit Verification Rule V2` by merging `Max Wrong Limit` and `Max Wrong` into one `Max Wrong` field.
- `No Limit` is now the switch inside the `Max Wrong` field; when enabled, the numeric input is hidden.
- Updated question and special scenario block headers so `Questions`, `Correct`, and delete actions stay on the right.
- Increased the special scenario name input width without letting it occupy the full row.
- Replaced the previous five branch special scenarios with one `Branch Combined Verification` scenario.

## Key Files

- `src/pages/call-management/VerificationRuleV2Page.tsx`
- `src/mock/verificationRuleV2.ts`
- `src/styles/index.less`

## Business Rule

- `Branch Combined Verification` represents the combined branch service scenario.
- The demo configuration uses 3 branch data questions and 3 customer data questions, with `Correct = 6`.
- The current model supports fixed questions with one correct threshold; it does not yet support separate sub-thresholds such as “3 branch questions correct and 3 customer questions correct.”

## Validation

- `npm run lint` passed.
- `npm run build` passed with the existing chunk size warning.
- `rg -n -i "halo|bca" src` returned no results.
- HTTP checks for `/`, `/call-management/verification-rule-v2`, and `/design-system` returned 200.
- `git diff --check` passed with Windows line-ending warnings only.

## Risk

- Manual browser validation is still needed for the edit modal layout and the branch scenario option in the verification popup.
