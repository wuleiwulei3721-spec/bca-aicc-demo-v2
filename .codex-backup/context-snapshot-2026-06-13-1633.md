# Context Snapshot - 2026-06-13 16:33 +08:00

## Project State

- Workspace: `D:\03projects\bca-aicc-demo-v2`
- Current focus: Customer Verification Rule V2 for KBV question verification.
- Admin pages should continue using the shared `src/components/admin/*` patterns and the latest toolbar/table standards.
- Customer-visible wording and mock display data must use Bank / BankApp / BANK 1 wording.

## This Session

- Clarified V2 scope: it configures KBV question verification only.
- PIN is treated as a separate entry authentication process and is not configured in V2 rules.
- Updated the V2 verification popup title from `Demo Conditions` to `Verification Scenario`.
- Special scenarios are now described as agent-selectable KBV scenarios, not automatic external triggers.
- Added Perbankan default fallback:
  - exact match: `Channel + Skill Queue + Customer Segment`
  - fallback: same `Channel + SQ_GENERAL_ID + Customer Segment`
  - no cross-channel fallback
- Added a lightweight popup tag and message when Perbankan fallback is used.

## Key Files

- `src/types/verificationRuleV2.ts`
- `src/utils/verificationRuleV2.ts`
- `src/pages/inbound/components/CustomerVerificationV2Modal.tsx`
- `src/pages/call-management/VerificationRuleV2Page.tsx`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`

## Validation

- `npm run lint` passed.
- `npm run build` passed with existing Vite/Rolldown chunk warning and plugin timing warning.
- `rg -n -i "halo|bca" src` returned no results.

## Risks

- Cross-skill answer reuse within the same call is not implemented. Changing verification scenario still clears current progress.
- PIN interface flow remains a customer confirmation item and is intentionally outside V2 rule configuration.
