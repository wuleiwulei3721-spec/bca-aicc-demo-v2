# Context Snapshot - 2026-06-02 23:49 +08:00

## Project

- Project: `bca-aicc-demo-v2`
- Branch: `codex/text-channel-config-settings`
- Current workstream: `Routing Config` admin configuration pages.

## Current Change

- Refined `Routing Config > Site Access Volume` Add/Edit/View modal layout.
- Channel and Status controls now use compact fixed widths instead of stretching across the modal.
- Media section titles now show only the media name, such as `Voice`, `Video`, `Text`.
- Site ratio inputs now use vertical rows: site name on the left, numeric ratio input on the right.
- Site rows no longer show site codes.
- Ratio inputs display a `%` suffix while keeping numeric values.

## Key Files

- `src/pages/routing-config/RoutingConfigDataPages.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`

## Verification

- `npm run lint`: passed.
- `npm run build`: passed with existing Vite/Rolldown chunk size warning.
- Browser `/routing-config/site-access-volume`: Add modal default Phone / Voice layout checked.
- Browser `/routing-config/site-access-volume`: Haloapp selection checked through visible-coordinate click; Voice / Video / Text sections render.
- Browser confirmed media titles do not repeat channel, site rows show only site names, and inputs display `%`.

## Risks

- Browser plugin could not reliably retype `InputNumber` values due virtual clipboard limitations, so invalid total save blocking still needs one manual check.
- Adding an existing channel still updates matching `Channel + Media Type` ratio groups without a separate overwrite confirmation.
