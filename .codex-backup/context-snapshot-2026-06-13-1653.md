# Context Snapshot - 2026-06-13 16:53 +08:00

## This Session

- Updated Customer Verification V2 scenario switching behavior.
- Scenario dropdowns add or adjust effective KBV rules and should not clear existing answers.
- Existing `Correct/Wrong/Skip` states are preserved when the same question remains in the recalculated question set.
- Removed states only for questions no longer present after the scenario change.
- New questions remain unanswered.

## Key File

- `src/pages/inbound/components/CustomerVerificationV2Modal.tsx`

## Validation

- `npm run lint` passed.
- `npm run build` passed with existing chunk size warning.
- `rg -n -i "halo|bca" src` returned no results.

## Risk

- Click-level browser validation is still needed to confirm the visible selected states remain after choosing a special scenario.
