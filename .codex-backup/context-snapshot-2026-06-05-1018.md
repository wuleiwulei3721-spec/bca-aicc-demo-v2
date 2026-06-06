# Context Snapshot - 2026-06-05 10:18 +08:00

## Project

- Project: BANK 1 AICC Demo V2.
- Branch: `codex/text-channel-config-settings`.
- Customer Production `main` remains the hidden management-menu version; local branch continues admin configuration development.

## Latest Change

- Added a Phone-only Business Config field in `Routing Config > Channels`.
- Field label: `Exception Working Time Plan`.
- Data field: `ChannelMediaBusinessConfig.exceptionWorkTimePlanCode`.
- The field appears only for `PHONE + VOICE` business config.

## Files Changed

- `src/types/routingConfiguration.ts`
  - Added `exceptionWorkTimePlanCode` to `ChannelMediaBusinessConfig`.
- `src/mock/routingConfiguration.ts`
  - Added the field to default channel business config.
  - Phone VOICE mock now defaults to `WTP_BANK_HOURS`.
- `src/pages/routing-config/RoutingConfigDataPages.tsx`
  - Channels page now reads `workTimeOptions`.
  - Phone Voice Access Configuration renders `Exception Working Time Plan` select.

## Behavior

- Phone channel row `101` -> `Business Config` -> Voice tab:
  - Shows `Exception Working Time Plan`.
  - Default display value is `Bank Working Hours`.
- Non-Phone channels:
  - Do not show `Exception Working Time Plan`.
- Select options:
  - `Default 24x7`
  - Existing active Working Time Plans, currently `Bank Working Hours`.

## Verification

- `npm run lint` passed.
- `npm run build` passed with existing chunk size warning and plugin timing notice.
- Browser checked `http://127.0.0.1:5184/routing-config/channels`:
  - `Business config 101` shows `Exception Working Time Plan` and `Bank Working Hours`.
  - `Business config 201` for Haloapp does not show this field.

## Risks

- The field is demo configuration only. No runtime exception-case logic reads it yet.
- The product team still needs to define which abnormal scenarios should use this working time plan.
