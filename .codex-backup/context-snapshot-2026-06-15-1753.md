# Context Snapshot - 2026-06-15 17:53 +08:00

## Project

- Path: `D:\03projects\bca-aicc-demo-v2`
- Branch: `main`
- Focus: BANK 1 AICC demo, Verification Rule V2.

## Current Change

- Rechecked V2 Max Wrong defaults against the original customer Excel.
- Kept `No Limit` for Personal Banker, Layanan Cabang, KPR, and Merchant Solution because the original Excel explicitly says there is no maximum wrong-answer rule.
- Changed Paylater from `No Limit` to `Max Wrong = 3` because the original Excel only says it may follow Perbankan or an internal rule; demo default now follows Perbankan.
- Fixed Preview condition reuse by adding a stable key based on current rule, condition, scenario, and question configuration.
- Simplified agent/preview rule bar by removing the persistent status label and info tooltip button.

## Key Files

- `src/mock/verificationRuleV2.ts`
- `src/pages/call-management/VerificationRuleV2Page.tsx`
- `src/pages/inbound/components/CustomerVerificationV2Modal.tsx`
- `src/styles/index.less`

## Validation

- `npx tsc --noEmit --pretty false`: passed.
- `npm run lint`: passed.
- `npm run build`: passed with existing chunk-size warning.
- `rg -n -i "halo|bca" src`: no matches.
- Old status/info/failure-action residual scans: no matches.
- HTTP smoke:
  - `/`: 200
  - `/call-management/verification-rule-v2`: 200
  - `/design-system`: 200

## Risk

- Browser screenshot validation was unavailable in this environment.
- Manual visual check is recommended for the new rule bar density and Preview condition lock behavior.
