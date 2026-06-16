# Context Snapshot - 2026-06-16 14:18 +08:00

## Current Focus

- Verification Rule V2 mock data and Customer Verification styling.
- This snapshot records the Personal Loan agent hint and Agent Hint visual treatment.

## Change

- Personal Loan default scenario now includes the original customer wording as `Agent Hint`.
- Personal Loan keeps 7 candidate questions, required correct count 5, and `Max Wrong = 3`.
- Agent Hint visual style is now a clearer light-blue information bar.

## Rule Interpretation

- The Personal Loan sentence has two meanings:
  - `salah menjawab 3 kali` -> system rule `Max Wrong = 3`.
  - `CCO tidak bisa lanjut...` -> agent handling note, stored as `Agent Hint`.
- Paylater remains demoed as following Perbankan until the customer confirms an internal independent rule.

## Validation

- `npx tsc --noEmit --pretty false` passed.
- `npm run lint` passed.
- `npm run build` passed with only the existing Vite/Rolldown chunk-size warning.
- Sensitive old-brand scan for `src/` returned no matches.
- HTTP smoke passed for `/`, `/call-management/verification-rule-v2`, and `/design-system`.
- `git diff --check` reported no whitespace errors, only existing Windows LF/CRLF warnings.

## Risk

- Browser-level visual verification is recommended to confirm long Agent Hint text wraps cleanly.
