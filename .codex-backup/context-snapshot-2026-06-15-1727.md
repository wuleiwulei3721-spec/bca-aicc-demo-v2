# Context Snapshot - 2026-06-15 17:27 +08:00

## Project

- Path: `D:\03projects\bca-aicc-demo-v2`
- Branch: `main`
- Focus: BANK 1 AICC demo, Customer Verification Rule V2.

## Current Change

- Removed `Failure Action / Action` from Verification Rule V2 because it had no real workflow-blocking effect.
- Scenario policy now only contains `Correct Required`, `Max Wrong`, and `Agent Hint`.
- Customer Verification top condition area no longer shows Channel.
- Customer Verification top condition area now uses one row: `Customer Segment`, `Skill`, and `Scenario` when multiple scenarios exist.
- Preview still reuses the agent-side verification modal, but locks `Customer Segment` and `Skill` through `readonlyConditions`; only scenario switching remains available in multi-scenario rules.

## Key Files

- `src/types/verificationRuleV2.ts`
- `src/utils/verificationRuleV2.ts`
- `src/mock/verificationRuleV2.ts`
- `src/pages/call-management/VerificationRuleV2Page.tsx`
- `src/pages/inbound/components/CustomerVerificationV2Modal.tsx`
- `src/styles/index.less`

## Validation

- `npx tsc --noEmit --pretty false`: passed.
- `npm run lint`: passed.
- `npm run build`: passed with existing Vite/Rolldown chunk size warning.
- `rg -n -i "halo|bca" src`: no matches.
- `rg -n "failureAction|Failure Action|verificationV2FailureAction|block-continuation|show-failed-only|cannot continue|failure-action" src`: no matches.
- HTTP smoke:
  - `/`: 200
  - `/call-management/verification-rule-v2`: 200
  - `/design-system`: 200

## Risk

- No screenshot-level browser validation was possible in this environment.
- If customer later requires actual blocking after too many wrong answers, it should be designed as a separate workflow-control feature, not as KBV question rule configuration.
