# Context Snapshot - 2026-06-12 16:24 +08:00

## Project State

`Verification Rule V2` remains the active customer identity verification configuration demo under `Call Management`. The old `Verification Rules` page remains unchanged.

## Latest Change

The V2 outer rule table was corrected back to the standard management-console table behavior:

- Removed V2-only list card/table height and scroll styles.
- Removed outer table `scroll.y`; the table now uses natural height and normal page flow.
- Reduced outer table column widths so normal desktop width should not show a horizontal scrollbar.
- Kept only a narrow-screen horizontal fallback with `scroll.x = 1120`.
- Fixed the outer table `Actions` column to the right.
- Kept structured filters and multi-select `+N` behavior from the previous pass.
- Kept Question Bank modal internal scroll unchanged.

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
- Source scan confirmed old V2 outer `verification-rule-v2-list-card`, `verification-rule-v2-table`, `x: 1280`, and outer `scroll.y` were removed; only Question Bank retains its modal-local `scroll={{ y: 390 }}`.
- Codex in-app browser timed out, so visual screenshot verification was not completed.

## Known Risks

- Browser visual verification remains incomplete due to in-app browser timeout. Before customer demo, manually verify the actual viewport has no unnecessary horizontal scrollbar, no empty vertical scroll box, and a fixed right-side Actions column when horizontal scrolling is forced.
