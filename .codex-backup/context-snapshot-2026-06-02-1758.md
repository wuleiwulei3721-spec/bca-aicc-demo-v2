# Context Snapshot - 2026-06-02 17:58 +08:00

Project: `bca-aicc-demo-v2`
Branch: `codex/text-channel-config-settings`
Goal: Add a non-production `Call Management > Routing Configuration` demo page based on the revised AICC routing architecture.

## Current State

- Added `/call-management/routing-configuration`.
- `Call Management` now includes `Routing Configuration` and `Text Channel Settings`.
- `Routing Configuration` is a frontend architecture demo, not connected to a real backend.
- The page implements:
  - Route Elements
  - VDN
  - Sites
  - Channels & Media
  - Access Accounts
  - Access Entries
  - Business Types
  - Site Access Volume
  - Working Time Plans
  - Skill Queues
  - Skill Routing Rules
- Routing factors use explicit codes. Because the meeting notes require VDN but only listed `11-18`, this implementation adds `10=VDN` and keeps `11-18` unchanged.
- `channel_media` is modeled separately from `channel`, so media support is not stored as a channel multi-select.
- Skill queues are reusable routing targets and are not hard-bound to VDN; VDN is matched by routing rules.
- Batch routing rules can preview factor combinations, detect duplicates, optionally overwrite duplicates, and show a materialized routing index.

## Key Files

- `src/pages/call-management/RoutingConfigurationPage.tsx`
- `src/mock/routingConfiguration.ts`
- `src/types/routingConfiguration.ts`
- `src/layouts/BasicLayout.tsx`
- `src/routes.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`

## Validation

- `npm run lint`: passed.
- `npm run build`: passed with existing Vite/Rolldown chunk size warning.
- Local Vite server: `http://127.0.0.1:5174/`; port 5173 was already occupied by an older service.
- Chrome headless smoke check:
  - `/` rendered BANK 1 shell.
  - `/design-system` rendered BANK 1 shell and Design System content.
  - `/call-management/routing-configuration` rendered BANK 1 shell, `Route Elements`, and `Skill Routing Rules`.
  - `/call-management/text-channel-settings` still rendered `Text Channel Settings`, `Service Rules`, and `Channel Queue Alerts`.

## Risks

- The routing configuration page is frontend-only; batch apply changes live in page memory and reset on refresh.
- No real config API, authorization, audit trail, backend conflict resolution, import/export, or platform skill sync is implemented.
- Manual visual review is still needed at the target demo resolution, especially for the 11-tab toolbar and wide routing tables.
