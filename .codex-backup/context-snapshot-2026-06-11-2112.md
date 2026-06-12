# Context Snapshot - 2026-06-11 21:12 +08:00

## Project

- Project: `bca-aicc-demo-v2`
- Branch: `main`
- Customer production line remains `main`.

## Latest Change

- Added delete capability to `Call Management > Blacklist Management`.
- Added delete capability to `Call Management > Priority List Management`.
- Both pages now use table checkbox selection plus a toolbar `Delete` action.

## Blacklist Management

- Route: `/call-management/blacklist`.
- Search Channel dropdown keeps `All` for no channel filtering.
- Add / Batch Add Channel dropdown uses only active `Routing Config > Channels` names.
- Table fields remain No., Channel, Restricted Number, Restriction Policy, Validity Days, Remark, Created Date, Created By.
- The table now has a leading checkbox selection column.
- Header checkbox selects or clears the current visible page.
- Selection is controlled and preserved across pagination.
- Search and Reset clear current selection.
- Toolbar actions are `Add`, `Batch Add`, and `Delete`.
- `Delete` is disabled when no rows are selected and shows `Delete (n)` when rows are selected.
- Delete confirmation removes selected rows from front-end demo store and clears selection.

## Priority List Management

- Route: `/call-management/priority-list`.
- Query fields remain Channel and Priority Number.
- Table fields remain No., Channel, Priority Number, Remark, Created Date, Created By.
- Add / Batch Add Channel dropdown uses only active `Routing Config > Channels` names.
- No Restriction Policy field.
- No Validity Days field.
- The table now has a leading checkbox selection column.
- Header checkbox selects or clears the current visible page.
- Selection is controlled and preserved across pagination.
- Search and Reset clear current selection.
- Toolbar actions are `Add`, `Batch Add`, and `Delete`.
- `Delete` is disabled when no rows are selected and shows `Delete (n)` when rows are selected.
- Delete confirmation removes selected rows from front-end demo store and clears selection.

## Data / Store

- `callManagementStore` now includes:
  - `deleteBlacklistEntries(ids: string[])`
  - `deletePriorityListEntries(ids: string[])`
- Delete only affects the current front-end demo session.
- Browser refresh restores mock default records.

## Verification

- `npm.cmd run lint`: passed.
- `npm.cmd run build`: passed with existing Vite/Rolldown chunk size warning.
- HTTP smoke for `/call-management/blacklist`: returned 200.
- HTTP smoke for `/call-management/priority-list`: returned 200.
- Browser plugin initialization timed out twice; visual click-through was not completed.

## Risk

- Delete is demo store behavior only and does not call a real backend.
- Full visual click-through of checkbox selection and confirmation modal still needs manual browser review.
