# Context Snapshot - 2026-06-03 00:34 +08:00

## Project

- Project: `bca-aicc-demo-v2`
- Branch: `codex/text-channel-config-settings`
- Current workstream: `Routing Config > Site Access Volume`.

## Current Change

- Refined the merged-cell `Site Access Volume` list and Add modal behavior.
- `Site Configuration` now joins site ratios with ` | ` instead of semicolons.
- The Add modal disables channels that already have site access volume records.
- The Add modal defaults to the first unconfigured channel, so existing channel configuration is maintained through Edit.
- Site ratio rows inside the modal now use compact fixed columns so the site name and percentage input stay close together.

## Key Files

- `src/pages/routing-config/RoutingConfigDataPages.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`

## Verification

- `npm run lint`: passed.
- `npm run build`: passed with existing Vite/Rolldown chunk size warning.
- Browser `/routing-config/site-access-volume`: list shows `Jakarta Site 34% | Surabaya Site 33% | Singapore DR Site 33%`.
- Browser `/routing-config/site-access-volume`: Add modal defaults to unconfigured channel `webchat`.

## Risks

- AntD Select dropdown disabled options were implemented in code, but the Browser DOM did not reliably expose the popup options during verification.
- Invalid-ratio save blocking still needs a manual check because the browser plugin cannot reliably retype AntD `InputNumber` values.
