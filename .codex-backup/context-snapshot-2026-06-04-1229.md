# Context Snapshot - 2026-06-04 12:29 +08:00

## Project

- Project: `bca-aicc-demo-v2`
- Current branch: `main`
- Goal: publish the customer-accessible Production version after local preview approval.

## Release State

- `main` has fast-forward merged `codex/customer-preview-hide-admin-menus`.
- Customer Production version hides unfinished management areas:
  - `Call Management`
  - `Routing Config`
- Direct URLs remain blocked:
  - `/call-management`
  - `/call-management/*`
  - `/routing-config`
  - `/routing-config/*`

## Preserved Development Path

- Unfinished management source code, mock data, store, styles, and types remain in the repo.
- Local continued development should switch back to `codex/text-channel-config-settings`, where management menu work can continue.

## Validation

- `npm run lint`: passed.
- `npm run build`: passed with existing Vite chunk size warning.
- Push `main` to trigger Vercel Production.
- Check Production deployment status and customer URL.

## Risk

- Production accessibility depends on Vercel Production settings.
- If Production needs rollback, restore `main` to pre-release commit `7e651bc` or redeploy the prior production build.
