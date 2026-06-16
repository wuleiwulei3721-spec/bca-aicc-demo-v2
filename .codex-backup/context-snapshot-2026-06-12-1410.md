# Context Snapshot - 2026-06-12 14:10 +08:00

## Project State

`bca-aicc-demo-v2` remains on `main` with the customer-facing Inbound workspace and Call Management configuration pages. `Verification Rule V2` is still the active customer identity verification demo used by the Inbound `Verify` popup.

## Latest Change

Refined the V2 rule configuration modal based on user feedback:

- Max Wrong defaults to no limit and hides the numeric input while unlimited.
- Correct Required no longer shows explanatory helper copy.
- Question Configuration now starts from explicit `Add Group`; Mandatory / Dynamic / Static / Alternative groups are added and removed as blocks.
- Each group opens a separate searchable question picker with checkbox selection; selected questions are written back only after `Confirm`.
- Selected questions can be sorted and removed inside each group.
- V2 question bank was rebuilt from the customer Excel attachment's original non-Chinese question text.
- Default V2 rules were expanded to cover the customer sheet scenarios and rules, including ATO/add-on, mbl d, branch combined verification, organization override, and strict failure handling.

## Key Files

- `src/pages/call-management/VerificationRuleV2Page.tsx`
- `src/pages/inbound/components/CustomerVerificationV2Modal.tsx`
- `src/mock/verificationRuleV2.ts`
- `src/types/verificationRuleV2.ts`
- `src/utils/verificationRuleV2.ts`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`

## Verification

- `npm run lint` passed.
- `npm run build` passed with the existing Vite chunk-size warning.
- HTTP smoke checks returned 200 for `/`, `/call-management/verification-rules`, `/call-management/verification-rule-v2`, and `/design-system` on the running 5173 dev server.
- Codex in-app browser connection timed out after 120 seconds, so no visual screenshot was captured.

## Known Risks

- The default rule mapping is a demo interpretation of the customer Excel rules; production trigger fields and final rule semantics still require customer confirmation.
- Question text intentionally uses the customer attachment's original non-Chinese wording and may include customer/product terms that require masking for external demo contexts.
- Manual visual verification is still recommended before the customer demo because browser automation timed out.
