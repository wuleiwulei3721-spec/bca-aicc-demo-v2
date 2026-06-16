# Context Snapshot - 2026-06-12 15:50 +08:00

## Project State

`Verification Rule V2` remains the active customer identity verification configuration demo under Call Management. The old `Verification Rules` page remains unchanged.

## Latest Change

The outer V2 rule list now follows the standard management-console layout:

- Added filter toolbar with Keyword, Channel, Skill Queue, Customer Segment, and Status.
- Added `Search` and `Reset` filter actions.
- Removed customer-visible `Reset Demo Rules`.
- Removed outer table `Question Set` and `Special Rules` columns.
- Added `Updated At`.
- Enabled pagination with default 10 rows and 10 / 20 / 50 options.
- Added total count text and horizontal table scroll.
- Added V2 page-level vertical scroll so pagination remains reachable.

## Key Files

- `src/pages/call-management/VerificationRuleV2Page.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`

## Verification

- `npm run lint` passed.
- `npm run build` passed with the existing Vite chunk-size warning.
- Source scan confirmed the V2 page no longer contains `Reset Demo Rules`, `ReloadOutlined`, `pagination={false}`, or outer `Question Set` / `Special Rules` table columns.
- `git diff --check` passed with existing CRLF conversion warnings only.
- HTTP smoke check returned 200 for `/`, `/call-management/verification-rule-v2`, and `/design-system` on local dev servers 5173 and 5175.
- Codex in-app browser connection timed out after 30 seconds, so visual screenshot verification was not completed.

## Known Risks

- Browser screenshot verification was not completed due to the timeout. Before customer demo, manually verify `/call-management/verification-rule-v2` with the actual viewport height and confirm filters, pagination, and vertical scroll are visible.
