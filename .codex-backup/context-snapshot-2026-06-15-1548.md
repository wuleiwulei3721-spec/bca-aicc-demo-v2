# Context Snapshot - 2026-06-15 15:48 +08:00

Project: `D:\03projects\bca-aicc-demo-v2`

## Current Goal

Keep the customer-visible `Call Management > Priority List Management` page aligned with the customer's priority-list feedback while preserving the existing front-end demo model:

- One page record represents one selected channel group plus one Identifier plus one Match Rule.
- The page does not introduce a separate Channel Type / Sub Channel master data model.
- Back-end execution can later split the page record into channel-level details if needed.

## Completed In This Snapshot

- Rebuilt `src/mock/priorityList.ts` default entries from the customer examples:
  - `Bankapp` + `BANKID00045678`
  - `Phone` + `08129876543`, `08123456789`, `08122222222`
  - `Instagram`, `X`, `Tik Tok`, `YouTube`, `Facebook` + `Bank`, `Bank_1`, `Bank_2`, `Bank_3`
  - `Webchat`, `Email Contact`, `Email Priority` + `123@gmail.com`, `@ojk.co.id`, `@bi.go.id`
- Kept `Match Rule` because mixed batch input can include both exact identifiers and email-domain identifiers.
- Added batch examples to the Identifier tooltip.
- Added duplicate preview and automatic duplicate filtering to `PriorityListManagementPage`.
- Duplicate definition: same channel, same trimmed/lowercase Identifier, same Match Rule already exists.
- If some selected channels are duplicates and some are new, only duplicate channels are skipped.
- If all selected identifiers/channels already exist, Save keeps the modal open and shows `All selected identifiers already exist.`
- Added compact duplicate preview styles to `src/styles/index.less`.
- Updated `PROJECT_CONTEXT.md` and `DEV_LOG.md`.

## Validation

- `npx tsc --noEmit --pretty false` passed.
- `npm.cmd run lint` passed.
- `npm.cmd run build` passed; only the existing Vite/Rolldown chunk size warning remains.
- HTTP smoke:
  - `/call-management/priority-list` returned 200.
  - `/call-management/blacklist` returned 200.

## Risks

- Browser click-level validation was not completed because Browser callable tools were not exposed in this turn.
- Duplicate filtering is still front-end demo-store behavior. A real service should enforce the same uniqueness rule server-side.
- The worktree contains many pre-existing unrelated dirty files; this snapshot only describes the latest priority-list adjustment.

## Rollback

To roll back only this snapshot:

- Restore the previous `src/mock/priorityList.ts` mock entries.
- Remove duplicate key/indexing, duplicateRows, saveWarning and duplicate preview rendering from `src/pages/call-management/PriorityListManagementPage.tsx`.
- Remove `.priority-list-management__save-warning` and duplicate preview styles from `src/styles/index.less`.
- Keep the existing multi-channel Identifier model unless a full rollback to `Priority Number` is required.
