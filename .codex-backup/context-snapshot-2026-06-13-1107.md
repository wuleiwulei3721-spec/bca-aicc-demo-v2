# Context Snapshot - 2026-06-13 11:07 +08:00

## Project

- Current workspace: `D:\03projects\bca-aicc-demo-v2`
- Main focus: BANK 1 AICC demo, Inbound workspace, Call Management, Routing Config, and Customer Verification Rule V2.
- Current rule: customer-visible UI, mock display data, demo wording, document summaries, and backups must use Bank / BankApp / BANKAPP / BANK 1 wording instead of old customer brand terms.

## This Session

- Fixed `Verification Rule V2` runtime crash when selected questions are rendered in a rule group. The question order list uses Ant Design `Space`, and the missing import has been restored.
- Changed V2 rule list audit columns from a single `Updated At` column to `Updated By` and `Updated Time`.
- Added `updatedBy` to the V2 rule type and save/status update flow. New and modified rules use `Admin` as the demo updater.
- Unified relevant `src/` UI-facing mock data and internal demo channel codes to Bank / BankApp / BANKAPP wording.
- Added the project-level desensitization rule to `AGENTS.md`.

## Key Files

- `AGENTS.md`
- `src/pages/call-management/VerificationRuleV2Page.tsx`
- `src/types/verificationRuleV2.ts`
- `src/utils/verificationRuleV2.ts`
- `src/mock/verificationRuleV2.ts`
- `src/mock/routingConfiguration.ts`
- `src/mock/inbound.ts`
- `src/pages/inbound/components/CustomerVerificationV2Modal.tsx`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`

## Validation

- `rg -n -i "halo|bca" src` returned no results.
- Mojibake scan for recently touched routing/V2 files returned no results.
- `npm run lint` passed.
- `npm run build` passed with only the existing Vite/Rolldown chunk size warning.

## Risks

- Historical recovery notes in long-term docs may still contain earlier discussion wording. The new project rule applies to current customer-visible content and new summaries going forward.
- V2 channel matching now uses `BANKAPP` demo code consistently across routing mock, V2 rules, and default channel resolution.
