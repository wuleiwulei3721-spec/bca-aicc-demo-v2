# Context Snapshot - 2026-06-11 21:02 +08:00

## Project

- Project: `bca-aicc-demo-v2`
- Branch: `main`
- Customer production line remains `main`.

## Latest Change

- Blacklist Management Add / Batch Add no longer allows `All Channels`.
- Added `Call Management > Priority List Management`.
- Route: `/call-management/priority-list`.

## Blacklist Management

- Search Channel dropdown keeps `All` for no channel filtering.
- Add / Batch Add Channel dropdown uses only active `Routing Config > Channels` names.
- `All Channels` was removed from blacklist form options.
- Default mock records now use concrete channels such as `Phone`, `WhatsApp`, and `Haloapp`.
- If no active channel exists, saving a new blacklist record is blocked with a channel-required validation message.

## Priority List Management

- New page: `src/pages/call-management/PriorityListManagementPage.tsx`.
- Query fields: Channel, Priority Number.
- List fields: No., Channel, Priority Number, Remark, Created Date, Created By.
- Add and Batch Add are supported.
- Batch Add uses a large Priority Number textarea with placeholder `Use semicolons for batch add`.
- No Restriction Policy field.
- No Validity Days field.

## Data / Store

- New type: `src/types/priorityList.ts`.
- New mock: `src/mock/priorityList.ts`.
- `callManagementStore` now includes:
  - `priorityListEntries`
  - `addPriorityListEntries`
  - `resetPriorityListEntries`

## Verification

- `npm.cmd run lint`: passed.
- `npm.cmd run build`: passed with existing Vite/Rolldown chunk size warning.
- HTTP smoke for `/call-management/blacklist`: returned 200.
- HTTP smoke for `/call-management/priority-list`: returned 200.

## Risk

- Priority List is front-end demo state only and does not connect to a real queue priority service.
- If all Routing Config channels are disabled, blacklist and priority list adds are blocked because records must target a concrete enabled channel.
