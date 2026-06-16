# Context Snapshot - 2026-06-12 16:13 +08:00

## Project State

`Verification Rule V2` remains the active customer identity verification configuration demo under `Call Management`. The old `Verification Rules` page remains unchanged.

## Latest Change

The outer V2 rule list was corrected to follow the management-console standard more strictly:

- Removed the duplicate `Keyword` filter from the outer V2 rule list.
- Filtering now uses only explicit fields: Channel, Skill Queue, Customer Segment, and Status.
- Channel / Skill Queue / Customer Segment multi-select filters now use one visible tag plus `+N` overflow.
- Shared `.routing-config-page__filter .ant-select-multiple` styling now prevents multi-select filters from wrapping or growing in height.
- The V2 table now has a controlled scrollable table body and visible pagination below it.
- Removed the previous V2 page-level `max-height + overflow-y` workaround.

## Key Files

- `src/pages/call-management/VerificationRuleV2Page.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`

## Verification

- `npm run lint` passed.
- `npm run build` passed with the existing Vite chunk-size warning.
- HTTP smoke check returned 200 for `/`, `/call-management/verification-rule-v2`, and `/design-system` on local dev server 5176.
- `git diff --check` passed with existing CRLF conversion warnings only.
- Source scan confirmed the V2 outer list no longer contains `Keyword`, `Reset Demo Rules`, old `pagination={false}`, outer `Question Set`, or the previous V2 page-level scroll workaround.
- Codex in-app browser timed out twice, so visual screenshot verification was not completed.

## Known Risks

- Browser visual verification remains incomplete due to repeated in-app browser timeout. Before customer demo, manually verify `/call-management/verification-rule-v2` at the actual demo viewport, especially multi-select filters and 20 / 50 row pagination.
