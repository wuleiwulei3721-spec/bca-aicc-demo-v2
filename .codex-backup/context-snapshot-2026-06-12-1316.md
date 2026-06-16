# Context Snapshot - 2026-06-12 13:16 +08:00

## Project State

`bca-aicc-demo-v2` remains a React 19 + TypeScript + Vite 8 + Ant Design 6 banking AICC demo. The current main flow is still the Inbound agent workspace, with Call Management exposed for customer-facing configuration demos.

## Latest Change

Added `Verification Rule V2` while keeping the existing `Verification Rules` page unchanged. The new V2 flow demonstrates:

- Configuration of verification rules by channel, service scenario / skill queue, and customer segment.
- Separate question bank maintenance with question names only.
- Rule-level question grouping for Mandatory, Dynamic, Static, and Alternative questions.
- Special rule templates for ATO / add-on layering, branch combined verification, organization segment overrides, and strict failure handling.
- Inbound customer verification popup now reads V2 rules and exposes compact demo conditions to simulate fields that production systems should pass automatically.

## Key Files

- `src/types/verificationRuleV2.ts`
- `src/mock/verificationRuleV2.ts`
- `src/utils/verificationRuleV2.ts`
- `src/store/appStore.ts`
- `src/routes.tsx`
- `src/layouts/BasicLayout.tsx`
- `src/pages/call-management/VerificationRuleV2Page.tsx`
- `src/pages/inbound/components/CustomerInformationCard.tsx`
- `src/pages/inbound/components/CustomerVerificationV2Modal.tsx`
- `src/styles/index.less`

## Verification

- `npm run lint` passed.
- `npm run build` passed with the existing Vite chunk-size warning.
- HTTP smoke checks returned 200 for `/`, `/call-management/verification-rules`, `/call-management/verification-rule-v2`, and `/design-system`.
- `git diff --check` passed; PowerShell reported CRLF line-ending warnings only.

## Known Risks

- In-app browser automation timed out and local Playwright fallback could not run because `playwright-core` was missing, so no rendered screenshot was captured in this session.
- V2 data is still frontend demo state only; refresh restores mock defaults.
- Special rule trigger fields are simulated in `Demo Conditions`; production mapping must be confirmed with CRM / IVR / HaloApp / business systems.
