# Context Snapshot - 2026-06-13 18:00 +08:00

## This Session

- Restored the Alternative question hint in Verification Rule V2.
- The hint is now a compact question-mark tooltip beside the `Alternative` title.
- The hint explains Alternative questions only replace Dynamic or Static questions and do not have a separate required count.

## Key Files

- `src/pages/call-management/VerificationRuleV2Page.tsx`
- `src/styles/index.less`

## Validation

- `npm run lint` passed.
- `npm run build` passed with the existing chunk size warning.
- `rg -n -i "halo|bca" src` returned no results.

## Risk

- Manual hover validation is still needed for the Alternative tooltip.
