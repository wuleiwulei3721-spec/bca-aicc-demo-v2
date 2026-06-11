# Context Snapshot - 2026-06-11 11:00 +08:00

## Project

- Project: `bca-aicc-demo-v2`
- Worktree: `D:\03projects\bca-aicc-demo-v2-integration`
- Branch: `codex/admin-config-mainline-integration`
- Base: `origin/main`
- Merged source: `codex/admin-config-latest`

## Integration Goal

- Converge the customer demo and engineering admin demo into one mainline candidate.
- Keep `main` customer features: login, auth guard, service mode sign-in, toolbar/state machine, Live Chat default seeding rules, and active-service Sign Out / Log Out guards.
- Bring in internal admin capabilities: `Global Control Configuration` and `Routing Config`.
- Hide or show admin entry points with `VITE_ENABLE_ADMIN_MENUS`, not by long-running branch divergence.

## Current Behavior

- `VITE_ENABLE_ADMIN_MENUS=false` or unset:
  - `Call Management` and `Routing Config` are hidden from navigation.
  - `/call-management/*` redirects to `/`.
  - `/routing-config/*` redirects to `/`.
- `VITE_ENABLE_ADMIN_MENUS=true`:
  - `Call Management` shows Verification Rules, Global Control Configuration, Text Channel Settings, and Busy Reason Management.
  - `Routing Config` shows VDN, Access Sites, Channels, Business Types, Skill Queues, Site Access Volume, Skill Routing Rules, and Working Time Plans.

## Risk

- This is an integration candidate and needs full validation before replacing `main`.
- The feature flag is front-end demo visibility only, not production-grade backend authorization.

## Validation

- `npm ci` passed with 0 vulnerabilities.
- `npm run lint` passed.
- `VITE_ENABLE_ADMIN_MENUS=false npm run build` passed with existing chunk-size/plugin-timing warnings.
- `git diff --check` passed with existing CRLF warnings.
- Chrome DevTools smoke passed:
  - Customer-safe `/routing-config/channels` redirected to `/` and did not show admin content.
  - Engineering `/routing-config/channels` showed Channels.
  - Engineering `/call-management/global-control-configuration` showed Global Control Configuration.
