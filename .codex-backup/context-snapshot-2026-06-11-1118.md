# Context Snapshot - 2026-06-11 11:18 +08:00

## Project

- Project: `bca-aicc-demo-v2`
- Single local directory: `D:\03projects\bca-aicc-demo-v2`
- Branch: `main`
- Goal: keep one codebase for customer and engineering demos.

## Latest State

- `main` contains the customer workspace features and the internal `Call Management` / `Routing Config` pages.
- Visibility is controlled by `VITE_ENABLE_ADMIN_MENUS`.
- Customer Production default: false or unset, hide admin menus and block direct admin URLs.
- Local engineering default on this machine: `.env.local` sets `VITE_ENABLE_ADMIN_MENUS=true`.

## Cleanup Completed

- Removed `D:\03projects\bca-aicc-demo-v2-main-fix`.
- Removed `D:\03projects\bca-aicc-demo-v2-integration`.
- Removed `D:\03projects\bca-aicc-demo-v2-private-assets`.
- Removed local merged branches `codex/admin-config-latest`, `codex/admin-config-mainline-integration`, and `codex/livechat-copy-update`.
- `git worktree list` now shows only `D:/03projects/bca-aicc-demo-v2 c6582f6 [main]`.

## Risk

- Local `main` is ahead of `origin/main`; production is unchanged until push/deploy.
- `VITE_ENABLE_ADMIN_MENUS` is a demo front-end visibility guard, not real authorization.

## Validation To Keep

- Run `npm run lint`.
- Run customer-safe build with `VITE_ENABLE_ADMIN_MENUS=false`.
- Check `/`, `/design-system`, `/routing-config/channels`, and `/call-management/global-control-configuration` in the expected flag states before publishing.
