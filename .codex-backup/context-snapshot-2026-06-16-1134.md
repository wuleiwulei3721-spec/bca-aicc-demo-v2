# Context Snapshot - 2026-06-16 11:34 +08:00

## Current Focus

- Verification Rule V2 remains the active model for KBV question verification in the inbound customer verification popup.
- This snapshot records the Prio/Soli skill matching fix.

## Issue

- The customer verification popup showed the fallback notice for `Prio Soli Perbankan`:
  `Selected Skill Queue has no configured KBV rule. Perbankan default is used; agent can switch Skill Queue.`
- The V2 rule was present. The mismatch happened because the popup initialized `customerSegment` as `regular`, while the `Prio Soli Perbankan` rule is configured for `priority` and `solitaire`.

## Fix

- `CustomerInformationCard` now maps the customer profile type into the V2 customer segment:
  - Priority / Prioritas -> `priority`
  - Solitaire -> `solitaire`
  - Organization / Business / Corporate / Bisnis / Organisasi -> `organization-business`
  - fallback -> `regular`
- `getDefaultVerificationV2SkillQueueCode` now recognizes Prio/Soli/Prioritas/Solitaire menu names and maps them to the corresponding Prio/Soli skill queue.

## Validation

- `npx tsc --noEmit --pretty false` passed.
- `npm run lint` passed.
- `npm run build` passed with only the existing Vite/Rolldown chunk-size warning.
- HTTP smoke passed for `/`, `/call-management/verification-rule-v2`, `/design-system`.
- Sensitive old-brand scan for `src/` returned no matches.

## Risk

- Command validation passed, but screenshot-level browser validation was not performed in this turn.
