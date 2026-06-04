# Context Snapshot - 2026-06-04 12:10 +08:00

## Project

- Project: `bca-aicc-demo-v2`
- Branch: `codex/customer-preview-hide-admin-menus`
- Goal: prepare a Vercel Preview build for customer review.

## Release Scope

- Keep customer-facing demo flows available:
  - `/` Agent Workspace
  - Channel Simulation: PSTN, BankApp, WhatsApp
  - Voice / Video handoff flows
  - Formal `Live Chat` workspace
  - `/design-system`
- Hide unfinished management features:
  - `Call Management`
  - `Routing Config`

## Current Change

- Removed `Call Management` and `Routing Config` from the left navigation menu in `BasicLayout`.
- Redirected `/call-management`, `/call-management/*`, `/routing-config`, and `/routing-config/*` to `/`.
- Kept all related source files, mock data, store, and types for future development.

## Validation

- `npm run lint`: passed.
- `npm run build`: passed with existing Vite/Rolldown plugin timing and chunk size warnings.
- Browser `/`: loaded successfully; expanded side navigation shows Channel Simulation, Agent Center, Operations, Reports only.
- Browser `/design-system`: loaded successfully.
- Browser `/call-management/text-channel-settings`: redirected to `/`.
- Browser `/routing-config/route-elements`: redirected to `/`.
- Browser smoke check passed for BankApp Demo, WhatsApp Demo, Live Chat after Sign In, and PSTN popup from Ready state.

## Risk

- This release branch includes the current local integrated worktree. The management code remains in the bundle but is not reachable through menus or direct routes.
