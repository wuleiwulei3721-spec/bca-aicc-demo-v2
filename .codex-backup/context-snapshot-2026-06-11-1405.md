# Context Snapshot - 2026-06-11 14:05 +08:00

## Project

- Project: `bca-aicc-demo-v2`
- Branch: `main`
- Current model: single mainline codebase with admin visibility controlled by `VITE_ENABLE_ADMIN_MENUS`.

## Latest Change

- Removed `Text Channel Settings` from the `Call Management` submenu.
- Old `/call-management/text-channel-settings` now redirects to `/call-management/verification-rules` when admin menus are enabled.
- `TextChannelSettingsPage` source remains in the repo for recovery/reference.

## Current Call Management Menu

- `Verification Rules`
- `Global Control Configuration`
- `Busy Reason Management`

## Validation

- `npm run lint` passed.
- `npm run build` passed with the existing Vite chunk size warning.
- `git diff --check` passed with existing CRLF working-copy warnings.
- Source check confirmed the old menu label/key is gone from `BasicLayout` and `routes`.

## Risk

- Historical docs still mention `Text Channel Settings`; current route/menu state is captured in this snapshot and the latest `PROJECT_CONTEXT.md`.
