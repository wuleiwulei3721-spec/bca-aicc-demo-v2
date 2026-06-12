# Context Snapshot - 2026-06-11 20:40 +08:00

## Project

- Project: `bca-aicc-demo-v2`
- Branch: `main`
- Customer production line remains `main`.

## Latest Change

- Added customer-visible `Call Management > Blacklist Management`.
- Route: `/call-management/blacklist`.
- Menu label: `Blacklist Management`.

## Implementation

- New page: `src/pages/call-management/BlacklistManagementPage.tsx`.
- New types: `src/types/blacklist.ts`.
- New mock: `src/mock/blacklist.ts`.
- Store updated: `src/store/callManagementStore.ts` now includes `blacklistEntries`, `addBlacklistEntries`, and `resetBlacklistEntries`.
- Routing/menu updated in `src/routes.tsx` and `src/layouts/BasicLayout.tsx`.
- Page export updated in `src/pages/call-management/index.ts`.
- Minor styles added in `src/styles/index.less` for the add action group and batch number textarea.

## Behavior

- Query fields: Channel, Restricted Number, Restriction Policy.
- List fields: No., Channel, Restricted Number, Restriction Policy, Validity Days, Remark, Created Date, Created By.
- Restriction policies:
  - `Prohibit Transfer to Agent`
  - `Prohibit Access`
- `Validity Days` is optional. Blank saves `null` and displays `Permanent`.
- `Add` supports one restricted number.
- `Batch Add` uses a large Restricted Number textarea with placeholder `Use semicolons for batch add`; numbers are split by semicolon and empty values are removed.
- Created By uses current auth session `displayName`, falling back to `Admin`.

## Verification

- `npm.cmd run lint`: passed.
- `npm.cmd run build`: passed with existing Vite/Rolldown chunk size warning and plugin timing notice.
- `Invoke-WebRequest http://127.0.0.1:5175/call-management/blacklist`: returned 200.
- Codex in-app Browser connection timed out three times; visual smoke check remains manual.

## Risk

- This is front-end demo state only. It does not connect to a production blacklist, routing, IVR, bot, or transfer blocking service.
- Browser visual check for `/`, `/design-system`, and `/call-management/blacklist` was not completed due Browser connection timeout.
