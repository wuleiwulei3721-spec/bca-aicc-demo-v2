# Context Snapshot - 2026-06-15 16:32 +08:00

## Project

- Path: `D:\03projects\bca-aicc-demo-v2`
- Branch: `main`
- Focus: Verification Rule V2 scenario-level policy.

## Current State

- `Verification Rule V2` remains modeled as `Rule -> Verification Scenario -> Question Block -> Question`.
- Rule-level customer-visible config now only contains matching conditions and status.
- Scenario-level policy now contains:
  - `Correct Required` from question block Correct sum.
  - `Max Wrong`, including `No Limit`.
  - `Failure Action`.
  - `Agent Hint`.
- Customer Verification popup uses the selected scenario policy for wrong-limit failure and block-continuation messaging.
- No forced order field was added. Sequence-sensitive instructions are expressed through question order plus `Agent Hint`.
- Legacy rule-level `maxWrongAttempts` and `failureAction` remain for compatibility and are copied into scenarios when reading old data.

## Key Files

- `src/types/verificationRuleV2.ts`
- `src/utils/verificationRuleV2.ts`
- `src/pages/call-management/VerificationRuleV2Page.tsx`
- `src/pages/inbound/components/CustomerVerificationV2Modal.tsx`
- `src/mock/verificationRuleV2.ts`
- `src/styles/index.less`

## Risk

- Browser click-level verification is still needed if browser tooling becomes available.
- Future backend schema should decide whether rule-level compatibility fields remain or are removed.
