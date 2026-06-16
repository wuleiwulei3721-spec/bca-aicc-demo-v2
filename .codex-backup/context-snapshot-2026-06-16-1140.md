# Context Snapshot - 2026-06-16 11:40 +08:00

## Current Focus

- Verification Rule V2 continues to own KBV question verification configuration and the inbound customer verification popup.
- This snapshot records the correction of default rule behavior and Agent Hint semantics.

## Change

- Removed Perbankan fallback from V2 rule matching.
- `findVerificationV2RuleMatch` now only performs exact matching on `Channel + Skill Queue + Customer Segment`.
- Missing rules return `none`; the popup shows `No KBV Rule Available` and the question-list empty state.
- `Agent Hint` is now reserved only for scenario-level configured agent wording.

## Intended Behavior

- If upstream does not provide Skill Queue or customer identity, the popup may initialize with `Perbankan` and `Layanan Reguler`.
- If upstream provides a Skill Queue or customer segment and that combination is not configured, no fallback rule is used.
- Preview remains scoped to the current draft rule.

## Validation

- `npx tsc --noEmit --pretty false` passed.
- `npm run lint` passed.
- `npm run build` passed with only the existing Vite/Rolldown chunk-size warning.
- Sensitive old-brand scan for `src/` returned no matches.
- HTTP smoke passed for `/`, `/call-management/verification-rule-v2`, and `/design-system`.
- `git diff --check` reported no whitespace errors, only existing Windows LF/CRLF warnings.

## Risk

- Browser-level visual verification is still recommended for the no-rule state and configured Agent Hint display.
