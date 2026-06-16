# Context Snapshot - 2026-06-13 18:52 +08:00

## This Session

- Added `Mode` to Verification Rule V2 special scenarios.
- Supported `Append` and `Replace` behavior in the customer verification popup calculation.
- Added a compact `Mode` select to the `Edit Verification Rule V2` special scenario row.
- Updated default scenarios so `ATO / add-on` remains append, while `Khusus laporan mbl d` and `Branch Combined Verification` use replace.

## Key Files

- `src/types/verificationRuleV2.ts`
- `src/utils/verificationRuleV2.ts`
- `src/mock/verificationRuleV2.ts`
- `src/pages/call-management/VerificationRuleV2Page.tsx`
- `src/styles/index.less`

## Business Rule

- `Append` keeps base questions and adds special scenario questions.
- `Replace` skips base questions and uses only the special scenario questions.
- `Max Wrong` and `Failure Action` still come from the outer rule.
- Special scenario remains single-select in the agent popup.

## Validation

- `npm run lint` passed.
- `npm run build` passed with the existing chunk size warning.
- `rg -n -i "halo|bca" src` returned no results.
- HTTP checks for `/`, `/call-management/verification-rule-v2`, and `/design-system` returned 200.
- `git diff --check` passed with Windows line-ending warnings only.

## Risk

- Manual browser validation is still needed for the compact `Mode` select in the edit modal.
- The model still does not support multiple simultaneous special scenarios or subgroups inside a special scenario.
