# Context Snapshot - 2026-06-13 17:23 +08:00

## This Session

- Updated Verification Rule V2 special rule design from fixed options to configurable special scenarios.
- Each special scenario now has a maintained name, selected questions, required correct count, and `Order` switch.
- Customer Verification V2 now shows one `Special Scenario` selector, defaulting to `None`.
- Selecting a special scenario appends only that scenario's questions and preserves answered base questions.
- Organization segment override remains fixed for `O1-O3` and `O4-O5`.

## Key Files

- `src/types/verificationRuleV2.ts`
- `src/utils/verificationRuleV2.ts`
- `src/mock/verificationRuleV2.ts`
- `src/pages/call-management/VerificationRuleV2Page.tsx`
- `src/pages/inbound/components/CustomerVerificationV2Modal.tsx`
- `src/store/appStore.ts`

## Validation

- `npm run lint` passed.
- `npm run build` passed with the existing chunk size warning.
- `rg -n -i "halo|bca" src` returned no results.
- HTTP checks for `/`, `/call-management/verification-rule-v2`, and `/design-system` returned 200.

## Risk

- Click-level browser validation is still needed for adding a new special scenario, saving it, reopening Customer Verification, and selecting it in the popup.
