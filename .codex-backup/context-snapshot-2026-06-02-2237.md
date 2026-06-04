# Context Snapshot - 2026-06-02 22:37 +08:00

## Project

- Project: `bca-aicc-demo-v2`
- Current branch: `codex/text-channel-config-settings`
- Current workstream: `Routing Config` admin configuration pages.

## Current Change

- Trimmed unused or duplicate `Routing Config` second-level menu items.
- Removed menu entries, routes, and page components for:
  - `Channel Media`
  - `Media Types`
  - `Languages`
  - `Access Entries`
- Kept `Access Accounts`, because it represents multiple external accounts per channel and channel-specific connection fields.

## Important Boundary

- Did not delete underlying `mediaTypes`, `languageTypes`, `channelMediaSettings`, or `accessEntries` mock/store data.
- These values still support Channels media options, Site Access Volume overrides, Skill Routing Rules factor values, and existing mock relationships.

## Key Files

- `src/layouts/BasicLayout.tsx`
- `src/routes.tsx`
- `src/pages/routing-config/RoutingConfigDataPages.tsx`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`

## Verification

- `npm run lint`: passed.
- `npm run build`: passed with existing Vite chunk size warning.
- Browser `/routing-config/channels`: page remains available; removed menu labels are not present in the page snapshot.
- Browser `/routing-config/access-accounts`: page remains available.
- Browser `/routing-config/route-elements` and `/routing-config/skill-routing-rules`: retained pages remain available.
- Removed URLs now fall back to `/`: `/routing-config/channel-media`, `/routing-config/media-types`, `/routing-config/languages`, `/routing-config/access-entries`.

## Risks

- Access entry data remains hidden without a management page. If DNIS/mailbox/app-entry maintenance becomes necessary, add it back or fold it into Access Accounts.
- Channel media detail data remains hidden without a management page. If scan mode or per-channel-media advanced settings are needed, extend Channels or restore an advanced page.
