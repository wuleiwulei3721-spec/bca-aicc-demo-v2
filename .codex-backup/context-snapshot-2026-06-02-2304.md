# Context Snapshot - 2026-06-02 23:04 +08:00

## Project

- Project: `bca-aicc-demo-v2`
- Current branch: `codex/text-channel-config-settings`
- Current workstream: `Routing Config` admin configuration pages.

## Current Change

- Updated `Routing Config > Site Access Volume`.
- Replaced the old textarea-based single-record CRUD form with a custom channel/media/site ratio matrix.
- Add flow now selects a channel, reads that channel's configured `mediaTypes`, and renders one media section per media type.
- Each media section lists all configured Sites with ratio inputs.
- Each `Channel + Media Type` section must total 100%.

## Data Model

- `SiteAccessRatioGroup` no longer includes `businessTypeCode` or `languageCode`.
- Ratio groups are now default `Channel + Media Type` records.
- Existing PHONE voice mock changed from business override group to `RATIO_PHONE_VOICE_DEFAULT` and includes all sites.

## Key Files

- `src/types/routingConfiguration.ts`
- `src/mock/routingConfiguration.ts`
- `src/pages/routing-config/RoutingConfigDataPages.tsx`
- `src/styles/index.less`

## Verification

- `npm run lint`: passed.
- `npm run build`: passed with existing Vite chunk size warning.
- Browser `/routing-config/site-access-volume`: no Business/Language override fields, table still shows Site Ratios.
- Browser Add modal: opens, shows Phone / Voice and all site inputs, with no initial validation warning.

## Risks

- Add flow updates existing `Channel + Media Type` ratio groups without a separate overwrite confirmation.
- Browser automation could not reliably switch Ant Select to Haloapp; manually verify Haloapp shows Voice / Video / Text sections.
