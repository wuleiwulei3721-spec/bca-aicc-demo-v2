# Context Snapshot - 2026-06-06 16:35 +08:00

## Project

- Project: `bca-aicc-demo-v2`
- Goal: BANK 1 AICC front-end demo for bank agent workspace.
- Current focus: Customer Verification Assist dynamic question bank demo and customer-visible Call Management verification rule configuration.

## Current State

- Customer Verification Assist loads rules by `Verification Channel Type + Business Type`.
- Agent modal is compact: top shows channel, business type, status badge; rule bar shows `Need N correct` and colored group requirement blocks.
- `Correct / Wrong / Skip` remains editable per question until final apply; standard answers and answer sources are not shown to the agent.
- BankApp is demo masking for HaloApp; BankApp/HaloApp voice flow supports a simulated 4-digit PIN page and then loads `HaloApp Registered` rules.
- `Call Management` is visible with `Verification Rules` and `Text Channel Settings`.
- `Routing Config` remains hidden; `/routing-config/*` redirects to `/`.

## Key Files Changed

- `src/types/inbound.ts`
- `src/mock/inbound.ts`
- `src/store/appStore.ts`
- `src/layouts/BasicLayout.tsx`
- `src/routes.tsx`
- `src/pages/call-management/VerificationRulesPage.tsx`
- `src/pages/inbound/components/CustomerInformationCard.tsx`
- `src/pages/inbound/components/CustomerVerificationModal.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`

## Implementation Notes

- `verificationRules` are cloned from mock into `appStore`.
- `updateVerificationRule` and `resetVerificationRules` are demo-only actions.
- `CustomerInformationCard` reads enabled rules from `state.verificationRules`.
- `VerificationRulesPage` edits the same store, so saved changes affect subsequently opened verification modals.
- No backend persistence is implemented; refresh restores mock defaults.

## Validation

- `npm run lint`: passed.
- `npm run build`: passed with existing Vite chunk size warning.
- Browser checked:
  - `/call-management/verification-rules`
  - `/call-management/text-channel-settings`
  - `/call-management` redirect
  - `/routing-config` redirect
  - `/design-system`
- Browser plugin could not complete Sign In/PSTN modal flow in this session because dropdown/screenshot CDP control was unstable; leave full `Sign In -> PSTN -> Verify` as manual check.

## Risks

- Real answer source and matching service are not connected.
- Verification records, wrong-answer handling, and PIN equivalence still need customer confirmation.
- Configuration page is front-end demo state only.
