# Context Snapshot - 2026-06-16 14:02 +08:00

## Current Focus

- Verification Rule V2 mock data continues to drive the demo configuration and Customer Verification preview.
- This snapshot records the KlikBank Bisnis organization scenario correction.

## Change

- `KlikBank Bisnis` organization rule now treats `O1-O3 / O4-O5` as pass-threshold scenarios over the same candidate question set.
- `O1-O3` now includes the full organization candidate question list, with required correct count 3.
- `O4-O5` continues to include the full organization candidate question list, with required correct count 5.
- Both scenarios include Agent Hint: `Please ask questions 1-3 first.`

## Reasoning

- `Pertanyaan 1-3 wajib ditanyakan di awal` is a prompt to the agent, not a rule to hide later questions.
- The previous mock confused candidate question count with pass threshold.

## Validation

- `npx tsc --noEmit --pretty false` passed.
- `npm run lint` passed.
- `npm run build` passed with only the existing Vite/Rolldown chunk-size warning.
- Sensitive old-brand scan for `src/` returned no matches.
- HTTP smoke passed for `/`, `/call-management/verification-rule-v2`, and `/design-system`.
- `git diff --check` reported no whitespace errors, only existing Windows LF/CRLF warnings.

## Risk

- Browser-level Preview check is still recommended for the O1-O3 scenario.
