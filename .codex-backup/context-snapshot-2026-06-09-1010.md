# Context Snapshot - 2026-06-09 10:10 +08:00

## Project

- Project: BANK 1 AICC Demo V2.
- Branch: `main`.
- Current focus: customer-visible AUX operation adjustment and Busy Reason Management.

## Latest Change

- Customer preferred the previous fast dropdown style over the new AUX reason modal.
- The signed-in avatar menu now directly lists enabled AUX reasons.
- Selecting a reason immediately changes agent status to `AUX - {reasonName}`.
- `Call Management > Busy Reason Management` is added as a customer-visible demo configuration page.

## Busy Reason Seed

- Enabled reasons: `Break`, `Istirahat`, `Job Routine`, `Keagamaan`, `Keperluan Pribadi`, `Meeting/Coaching`, `Special Assignment`, `Toilet`, `Yoga`.
- Disabled reserve fields: `Extension 1` through `Extension 11`.
- `AUX` and `Aux New Updated` from the customer screenshot are not treated as business busy reasons.
- All default flags are `No`.

## Validation

- `npm run lint`, `npm run build`, and `git diff --check` passed.
- Local Chrome CDP smoke checks passed for direct AUX dropdown behavior, Busy Reason Management seed data, edit-to-dropdown linkage, Call Management route regression, and Routing Config redirect.

## Risks

- Busy Reason data is front-end demo state only; browser refresh restores mock defaults.
- Names are copied from the customer screenshot and should be replaced if BCA provides an official dictionary.
