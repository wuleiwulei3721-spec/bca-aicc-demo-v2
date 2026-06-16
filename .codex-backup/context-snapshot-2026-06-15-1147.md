# Context Snapshot - 2026-06-15 11:47 +08:00

## Project

- Project: BANK 1 AICC Demo V2
- Workspace: `D:\03projects\bca-aicc-demo-v2`
- Main branch: `main`
- Current focus: Customer identity verification KBV demo and `Call Management > Verification Rule V2`.

## This Update

- `Verification Rule V2` was refactored from `base question groups + Special Scenario Append/Replace` to `one rule with multiple Verification Scenarios`.
- `VerificationV2Rule` now supports `scenarios`; each scenario owns multiple question blocks with `name`, `questionIds`, and `requiredCorrect`.
- Legacy `groups` and `specialRules.scenarios` remain in types/utilities only for compatibility with existing mock/store data.
- Customer-visible V2 UI no longer exposes `Append` or `Replace` as maintenance concepts.
- `Customer Verification` now selects a `Scenario`, defaults to the rule default scenario, and preserves answers across scenario switches by using the underlying question id as the answer key.

## Key Files

- `AGENTS.md`
- `src/types/verificationRuleV2.ts`
- `src/utils/verificationRuleV2.ts`
- `src/mock/verificationRuleV2.ts`
- `src/pages/call-management/VerificationRuleV2Page.tsx`
- `src/pages/inbound/components/CustomerInformationCard.tsx`
- `src/pages/inbound/components/CustomerVerificationV2Modal.tsx`
- `src/store/appStore.ts`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`

## Important Behavior

- Rule matching remains `Channel + Skill Queue + Customer Segment`; missing specific skill queue still falls back only to same-channel, same-segment Perbankan default.
- `Max Wrong` and `Failure Action` remain rule-level, not scenario-level.
- `Organization Segment Override` remains outside scenarios for now.
- `Layanan Cabang` default data now has:
  - `Default`: `Branch Data`, 5 branch questions, correct required 2.
  - `Branch to Other Services`: `Branch Data`, 5 branch questions, correct required 3; `Customer Data`, 6 customer questions, correct required 3.

## Agent Rule Update

- `AGENTS.md` now requires model-level judgment before patching UI when business complexity grows.
- High-impact ambiguity must be clarified with the user before implementation.

## Verification

- `npx tsc --noEmit --pretty false`: passed.
- `npm run lint`: passed.
- `npm run build`: passed with existing Vite/Rolldown chunk size warning.
- `rg -n -i "halo|bca" src`: no results.
- HTTP checks returned 200 for `/`, `/call-management/verification-rule-v2`, and `/design-system`.
- `git diff --check`: passed with Windows line-ending warnings only.

## Risks

- No browser-use click/screenshot tool was available in this session; validation is code-level plus HTTP.
- Only one scenario can be selected at a time.
- Organization segment override is still a separate override, not a scenario.
