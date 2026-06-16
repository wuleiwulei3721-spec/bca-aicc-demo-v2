# Context Snapshot - 2026-06-16 19:20 +08:00

## Current Focus

- Inbound call menu display is now consolidated in the top call toolbar `Skill` field.
- `Routing Config` is visible by default for customer review of channel management and routing strategy.
- `Routing Config > Channels` has two customer feedback fixes:
  - Phone has no account management.
  - Webchat recall configuration is Webchat-only.

## Change

- Removed the visible `Menu` route hint from `Customer Information`.
- Kept `routeMenuName` internally for Verification V2 default Skill Queue mapping.
- `VITE_ENABLE_ADMIN_MENUS` now defaults to enabled; only explicit `false` hides `Routing Config` and blocks `/routing-config/*`.
- `.env.example` now documents the default visible behavior.
- Phone channel `Accounts` action is disabled in the Channels table.
- `Webchat Message Recall Limit (sec)` is shown only for `WEBCHAT + TEXT` Business Config.

## Validation

- `npx tsc --noEmit --pretty false` passed.
- `npm run lint` passed.
- `npm run build` passed with the existing Vite/Rolldown chunk-size warning.
- HTTP smoke passed for `/`, `/routing-config/channels`, `/routing-config/skill-routing-rules`, `/routing-config/business-types`, and `/design-system`.
- `git diff --check` reported only existing Windows LF/CRLF warnings.
- Added-line sensitive term scan found no matches.

## Risk

- Browser screenshot/DOM verification was not completed because the in-app browser connection timed out.
- Manual customer-demo verification should still check the Channels table and Business Config modal.
