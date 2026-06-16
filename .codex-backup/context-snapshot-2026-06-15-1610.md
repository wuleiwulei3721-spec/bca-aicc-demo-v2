# Context Snapshot - 2026-06-15 16:10 +08:00

Project: `D:\03projects\bca-aicc-demo-v2`

## Current Goal

Keep `Call Management > Priority List Management` customer-facing labels aligned with the visible table model.

## Completed In This Snapshot

- Updated duplicate preview in `PriorityListManagementPage`.
- The duplicate preview no longer shows internal ids such as `PL009`.
- The duplicate preview column is now `Existing No.`
- The value is computed from the current full priority-list order, matching the main table `No.` convention. Example: an existing row previously displayed as `PL009` now displays `9`.
- Duplicate detection and save behavior are unchanged.

## Validation

- `npx tsc --noEmit --pretty false` passed.
- `npm.cmd run lint` passed.
- `npm.cmd run build` passed; only the existing Vite/Rolldown chunk size warning remains.
- HTTP smoke for `/call-management/priority-list` returned 200.

## Risks

- Browser click-level validation was not completed in this snapshot.
- If filters are active, `Existing No.` still uses the full priority-list order because duplicate detection checks the full demo store, not only the currently filtered table.

## Rollback

- Restore `existingRecord` in `PriorityListDuplicateRow`.
- Store and display `entry.id` in the duplicate preview.
- Restore the duplicate preview header to `Existing Record`.
