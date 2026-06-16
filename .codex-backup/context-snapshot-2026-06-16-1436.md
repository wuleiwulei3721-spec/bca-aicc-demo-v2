# Context Snapshot - 2026-06-16 14:36 +08:00

## Current Focus

- Call Management verification-rule navigation has been consolidated.
- The scenario-based Verification Rule V2 page is now the official customer-facing Verification Rules page.

## Change

- Sidebar menu shows only one `Verification Rules` entry under `Call Management`.
- `/call-management/verification-rules` renders `VerificationRuleV2Page`.
- `/call-management/verification-rule-v2` redirects to `/call-management/verification-rules`.
- Customer-visible page and modal titles no longer use `V2`.
- Legacy `VerificationRulesPage` source remains for reference or rollback, but is no longer exposed by menu or routes.

## Validation

- `npx tsc --noEmit --pretty false` passed.
- `npm run lint` passed.
- `npm run build` passed with only the existing Vite/Rolldown chunk-size warning.
- Sensitive old-brand scan for `src/` returned no matches.
- HTTP smoke passed for `/`, `/call-management`, `/call-management/verification-rules`, `/call-management/verification-rule-v2`, and `/design-system`.
- Source search confirmed no customer-visible `Verification Rule V2` text remains in `src/`.
- `git diff --check` reported no whitespace errors, only existing Windows LF/CRLF warnings.

## Risk

- Browser-level verification is recommended for menu selection state and legacy URL redirect; Playwright was not available in the current Node environment.
