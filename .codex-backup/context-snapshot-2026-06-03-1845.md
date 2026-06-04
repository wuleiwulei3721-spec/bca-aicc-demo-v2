# Context Snapshot - 2026-06-03 18:45 +08:00

## Project

- Project: `bca-aicc-demo-v2`
- Branch: `codex/text-channel-config-settings`
- Current focus: Routing Config admin pages.

## Current Change

- Fixed custom `Channels` and `Media Service Rule Plans` toolbar layout to match the standard `RoutingConfigCrudPage` admin toolbar.
- Removed the `Key Rules` column from `Media Service Rule Plans`.

## Key Files Changed

- `src/pages/routing-config/RoutingConfigDataPages.tsx`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`

## Validation

- `npm run lint`: passed.
- `npm run build`: passed; existing Vite chunk size warning only.
- Browser checked `/routing-config/channels` and `/routing-config/media-service-rule-plans`.

## Notes

- The issue was caused by direct `label` and button children inside `routing-config-page__admin-toolbar`; that container uses `justify-content: space-between`.
- The pages now use `query-group`, `filters`, `admin-actions`, and `add-action`, matching the shared CRUD page.
