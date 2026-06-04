# Context Snapshot - 2026-06-03 00:23 +08:00

## Project

- Project: `bca-aicc-demo-v2`
- Branch: `codex/text-channel-config-settings`
- Current workstream: `Routing Config > Site Access Volume`.

## Current Change

- Refined `Site Access Volume` list from channel-level summary rows to media-level rows with merged channel cells.
- `Channel ID`, `Channel Name`, `Status`, and `Actions` use table rowSpan for the same channel.
- `Media Type` displays one media per row.
- `Site Configuration` displays semicolon-separated site ratios for that media, such as `Jakarta Site 34%; Surabaya Site 33%; Singapore DR Site 33%`.
- Haloapp now appears as three rows: Voice, Video, and Text, with the channel cells merged.

## Key Files

- `src/pages/routing-config/RoutingConfigDataPages.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`

## Verification

- `npm run lint`: passed.
- `npm run build`: passed with existing Vite/Rolldown chunk size warning.
- Browser `/routing-config/site-access-volume`: table headers show `Channel ID`, `Channel Name`, `Media Type`, `Site Configuration`, `Status`, `Actions`.
- Browser `/routing-config/site-access-volume`: Haloapp renders as Voice / Video / Text media rows with merged channel/status/action cells.
- Browser `/routing-config/site-access-volume`: Site Configuration shows site ratio text joined by semicolons.

## Risks

- Invalid-ratio save blocking still needs a manual check because the browser plugin cannot reliably retype AntD `InputNumber` values.
- Add/Edit still overwrites existing `Channel + Media Type` groups without a separate overwrite confirmation.
