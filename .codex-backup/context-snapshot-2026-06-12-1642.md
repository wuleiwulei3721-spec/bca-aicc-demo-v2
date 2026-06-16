# Context Snapshot - 2026-06-12 16:42 +08:00

## Project State

`Verification Rule V2` remains the active customer identity verification configuration demo under `Call Management`. The old `Verification Rules` page remains unchanged.

## Latest Change

The V2 rule list now has complete management CRUD behavior:

- Added `deleteVerificationV2Rule(ruleId)` to the front-end demo store.
- Added Delete to each V2 rule row beside View and Edit.
- Kept the V2 rule Actions column fixed to the right and widened it to fit three icons.
- Added a delete confirmation modal using existing management console modal styles.
- Confirmed delete removes only the selected V2 rule from the current demo session.
- Question Bank questions are not deleted when a rule is deleted.

## Key Files

- `src/store/appStore.ts`
- `src/pages/call-management/VerificationRuleV2Page.tsx`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`

## Verification

- `npm run lint` passed.
- `npm run build` passed with the existing Vite chunk-size warning.
- HTTP smoke check returned 200 for `/`, `/call-management/verification-rule-v2`, and `/design-system` on local dev server 5176.
- `git diff --check` passed with existing CRLF conversion warnings only.
- Source scan confirmed `deleteVerificationV2Rule`, `ruleToDelete`, `Delete Verification Rule V2`, and the widened fixed Actions column exist.
- Codex in-app browser timed out, so visual screenshot verification was not completed.

## Known Risks

- Browser visual verification remains incomplete due to in-app browser timeout. Before customer demo, manually verify View/Edit/Delete icons are visible, Delete opens the confirmation modal, and confirming removes the rule from the list.
