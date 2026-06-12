# Context Snapshot - 2026-06-11 20:52 +08:00

## Project

- Project: `bca-aicc-demo-v2`
- Branch: `main`
- Customer production line remains `main`.

## Latest Change

- Refined `Call Management > Blacklist Management` Channel source.
- The search Channel dropdown now keeps `All` as the no-filter option.
- All other search Channel options come from `Routing Config > Channels` enabled records: `useRoutingConfigStore().channels.filter(status === 'Active').map(channelName)`.

## Implementation

- `src/pages/call-management/BlacklistManagementPage.tsx`
  - Imports `useRoutingConfigStore`.
  - Builds enabled channel options from active routing channels.
  - Search Channel options: `All` + active `channelName`.
  - Add / Batch Add Channel options: `All Channels` + active `channelName`.
- `src/types/blacklist.ts`
  - `BlacklistChannel` is now a string alias to support configured channel names.
- `src/mock/blacklist.ts`
  - Default channel values changed to `All Channels`, `Phone`, `WhatsApp`, and `Haloapp`.

## Verification

- `npm.cmd run lint`: passed.
- `npm.cmd run build`: passed with existing Vite/Rolldown chunk size warning.

## Risk

- If a channel used by an existing blacklist record is later disabled in Channels, the record remains visible in the table but that channel no longer appears in the search dropdown. Product confirmation may be needed for historical disabled-channel query behavior.
