# Context Snapshot - 2026-06-15 15:28 +08:00

## Project

- Project: BANK 1 AICC Demo V2
- Workspace: `D:\03projects\bca-aicc-demo-v2`
- Focus: `Call Management > Verification Rule V2` and Customer Verification popup.

## This Update

- Kept the rule model as `Rule -> Verification Scenario -> Question Block -> Question`.
- Restored fixed question block categories by adding explicit `blockType`.
- Customer-visible configuration no longer relies on free-text block names for `Mandatory / Dynamic / Static / Alternative`.
- Scenario selection in the admin modal is now card-based.
- Added admin Preview using the same Customer Verification popup component.

## Behavior

- Fixed block types: `Mandatory`, `Dynamic`, `Static`, `Alternative`.
- `Alternative` has no Correct input and keeps the replacement tooltip.
- `Custom Block` is the only free-name block type, for `Branch Data`, `Customer Data`, `Layering`, etc.
- New scenario flow opens a small modal with `Copy current scenario` or `Blank scenario`; copy is the default.
- Non-default scenarios support rename, duplicate, and delete; default scenario remains undeletable.
- Agent-side Scenario selector is hidden when a matched rule has only one scenario.
- `O1-O3 / O4-O5` are now normal scenarios in the default organization rule data.
- The old Organization Segment Override UI has been removed from the customer-visible admin page.

## Key Files

- `src/types/verificationRuleV2.ts`
- `src/utils/verificationRuleV2.ts`
- `src/mock/verificationRuleV2.ts`
- `src/pages/call-management/VerificationRuleV2Page.tsx`
- `src/pages/inbound/components/CustomerVerificationV2Modal.tsx`
- `src/styles/index.less`

## Verification

- `npx tsc --noEmit --pretty false`: passed.
- `npm run lint`: passed.
- `npm run build`: passed with existing chunk-size warning.
- `rg -n -i "halo|bca" src`: no results.
- HTTP 200 for `/`, `/call-management/verification-rule-v2`, `/design-system`.
- `git diff --check`: passed with Windows line-ending warnings only.

## Risks

- Browser click-level verification was not available in this tool context.
- Legacy special-rule fields remain for compatibility but are not exposed in V2 customer-visible UI.
