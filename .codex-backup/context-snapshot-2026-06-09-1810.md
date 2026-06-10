# Context Snapshot - 2026-06-09 18:10 +08:00

## Project

- Project: `bca-aicc-demo-v2`
- Branch: `codex/admin-config-latest`
- Purpose: BANK 1 AICC front-end demo with customer-safe `main` and local internal admin branch.
- Current branch is for local `Call Management` and `Routing Config` work only; do not publish this branch to customer Production.

## Latest Change

- Routing Config menu now removes `Route Elements` and `Channel Types`.
- `/routing-config`, `/routing-config/route-elements`, `/routing-config/channel-types`, and `/call-management/routing-configuration` redirect to `/routing-config/channels`.
- Channels Edit modal no longer renders the `Access Parameters` section.
- Channels Business Config renames `Max Concurrent Access` to `Maximum Concurrent Calls`.
- `Maximum Concurrent Calls` and `Min Scan Interval Seconds` are only shown and validated for Channel Type `category === 'social'`: Instagram, LinkedIn, Facebook, X, Tik Tok, YouTube.
- Haloapp, Webchat, and WhatsApp do not show or validate those two fields.

## Key Files

- `src/layouts/BasicLayout.tsx`
- `src/routes.tsx`
- `src/pages/call-management/RoutingConfigurationPage.tsx`
- `src/pages/routing-config/RoutingConfigDataPages.tsx`
- `src/mock/routingConfiguration.ts`
- `src/types/routingConfiguration.ts`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`

## Validation

- `npm run lint` passed.
- `npm run build` passed with the existing Vite chunk size warning.
- Chrome CDP smoke check confirmed hidden menu entries, redirect behavior, Channels Edit modal, and social-only Business Config fields.

## Risk

- Route Elements and Channel Type Management source code remain in the repo for recovery/reference, but the UI and direct routes no longer expose them.
- Social-channel behavior depends on `ChannelType.category === 'social'`; future social channel dictionary items must use that category.
