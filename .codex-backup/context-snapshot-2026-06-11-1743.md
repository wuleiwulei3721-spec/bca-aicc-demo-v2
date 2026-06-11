# Context Snapshot - 2026-06-11 17:43 +08:00

## Project

- Project: `bca-aicc-demo-v2`
- Branch: `main`
- Customer production line remains `main`.

## Latest Change

- Customer-facing release policy changed: `Call Management` is now visible to customers.
- Only `Routing Config` remains hidden in customer-safe mode.
- `VITE_ENABLE_ADMIN_MENUS` is still the environment variable, but it now controls `Routing Config` visibility only.

## Customer Mode

- `VITE_ENABLE_ADMIN_MENUS=false` or unset.
- `Call Management` is visible.
- Visible `Call Management` children: `Verification Rules`, `Global Control Configuration`, `Busy Reason Management`.
- `Text Channel Settings` remains removed from the menu.
- `/call-management/text-channel-settings` redirects to `/call-management/verification-rules`.
- `/call-management/routing-configuration` redirects to `/call-management/verification-rules`.
- `Routing Config` is hidden and `/routing-config/*` redirects to `/`.

## Engineering Mode

- `VITE_ENABLE_ADMIN_MENUS=true`.
- `Routing Config` is visible for internal engineering/admin demos.
- `Call Management` remains visible in both modes.

## Risk

- The variable name `VITE_ENABLE_ADMIN_MENUS` is now broader than its behavior; it controls only `Routing Config`.
- This is a front-end demo visibility guard, not production authorization.
