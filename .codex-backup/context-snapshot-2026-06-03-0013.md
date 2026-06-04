# Context Snapshot - 2026-06-03 00:13 +08:00

## Project

- Project: `bca-aicc-demo-v2`
- Branch: `codex/text-channel-config-settings`
- Current workstream: `Routing Config > Site Access Volume`.

## Current Change

- Refactored `Site Access Volume` list from `Channel + Media Type` records to channel-level summary rows.
- Removed list columns `Ratio Group ID`, `Site Ratios`, and `Total`.
- New list columns: `Channel ID`, `Channel Name`, `Media Type`, `Site Allocation`, `Status`, `Actions`.
- `Site Allocation` shows media-level summaries such as `Voice 3 sites configured` instead of expanding every site ratio.
- View/Edit/Delete now operate at channel level; Delete removes all media allocation groups for the selected channel.
- Added Haloapp Voice / Video default ratio groups to mock data so Haloapp demonstrates Voice / Video / Text in one row.

## Key Files

- `src/pages/routing-config/RoutingConfigDataPages.tsx`
- `src/mock/routingConfiguration.ts`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`

## Verification

- `npm run lint`: passed.
- `npm run build`: passed with existing Vite/Rolldown chunk size warning.
- Browser `/routing-config/site-access-volume`: list no longer shows `Total`, `Site Ratios`, or `Ratio Group ID`.
- Browser `/routing-config/site-access-volume`: Haloapp appears as one row with `Voice / Video / Text`.
- Browser `/routing-config/site-access-volume`: Haloapp View modal still shows Voice / Video / Text sections with site ratios.

## Risks

- Invalid-ratio save blocking still needs a manual check because the browser plugin cannot reliably retype AntD `InputNumber` values.
- Add/Edit still overwrites existing `Channel + Media Type` groups without a separate overwrite confirmation.
