# Context Snapshot - 2026-06-12 17:51 +08:00

## Project

- Project: `bca-aicc-demo-v2`
- Branch: `main`
- Current workspace contains ongoing Call Management, Verification Rule V2, Routing Config, and admin style standardization changes.

## Latest Change

- Added reusable admin management components under `src/components/admin/*`.
- Migrated Call Management and Routing Config maintenance pages to AdminPage/AdminToolbar/AdminTable/AdminModal patterns.
- Added `/design-system` Admin Management Page example.
- Updated `AGENTS.md` so future management pages must use Admin components instead of hand-written toolbar/table/modal styles.

## Admin Standard

- Query controls are 32px high.
- Search/Reset use equal width and height.
- Page-level primary actions stay on the right side of the query toolbar.
- Table headers are bold; table body data is normal weight, including the first field.
- Main lists default to 20 rows with `10/20/50/100` page size options and `x-y / total records` total text.
- Main pages scroll vertically through AdminPage; modal long tables use internal vertical table scroll.
- Actions columns remain fixed right when horizontal scrolling is needed.

## Affected Pages

- `Call Management > Verification Rules`
- `Call Management > Verification Rule V2`
- `Call Management > Blacklist Management`
- `Call Management > Priority List Management`
- `Call Management > Busy Reason Management`
- Routing Config ordinary CRUD pages through `RoutingConfigCrudPage`
- Routing Config custom pages through `RoutingConfigDataPages.tsx` and `SkillRoutingRulesPage.tsx`
- `/design-system`

## Verification

- `npm run lint` passed.
- `npm run build` passed with the existing Vite/Rolldown chunk size warning.
- Headless Chrome CDP preview spot checks passed for `/design-system`, `/call-management/verification-rule-v2`, `/call-management/blacklist`, `/call-management/priority-list`, `/call-management/busy-reasons`, `/routing-config/business-types`, and `/routing-config/skill-routing-rules`.

## Risk

- Business data and mock semantics were intentionally not changed.
- Some complex Routing Config custom modal internals still keep page-level form classes; they now sit inside AdminModal and should be visually checked.
