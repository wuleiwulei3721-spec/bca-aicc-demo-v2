# Context Snapshot - 2026-06-12 17:03 +08:00

## Project State

`Verification Rule V2` remains the active customer identity verification configuration demo under `Call Management`. The old `Verification Rules` page remains unchanged.

## Latest Change

The V2 outer list has been realigned with the existing management console CRUD pattern:

- Moved `Question Bank` and `Add` from `PageContainer extra` into the filter toolbar right-side action area.
- Renamed `New Rule` to `Add`.
- Renamed the create modal title to `Add Verification Rule V2`.
- Standardized the field label to `Skill Queue` across filters, table header, modal field, and validation errors.
- Removed the legacy `Service Scenario / Skill Queue` wording from source UI code.
- Tightened V2 outer table column widths and reduced horizontal fallback width to `x: 1040`.
- Kept `Actions` fixed to the right and kept View / Edit / Delete behavior unchanged.

## Key Files

- `src/pages/call-management/VerificationRuleV2Page.tsx`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`

## Verification

- `npm run lint` passed.
- `npm run build` passed with the existing Vite chunk-size warning.
- HTTP smoke check returned 200 for `/`, `/call-management/verification-rule-v2`, and `/design-system` on local dev server 5176.
- Source scan confirmed `src/` no longer contains `Service Scenario / Skill Queue`, `New Rule`, or `New Verification Rule V2`.
- Playwright visual verification did not complete because the bundled runtime `playwright` package is missing `playwright-core`; no dependency was added.

## Known Risks

- Screenshot-level visual verification remains incomplete. Before customer demo, manually confirm `Question Bank` / `Add` are in the toolbar right action area, V2 only shows `Skill Queue` for this field, and normal desktop width has no unnecessary horizontal scrollbar.
