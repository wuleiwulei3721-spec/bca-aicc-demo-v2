# Context Snapshot - 2026-06-05 16:24 +08:00

## Project

- Project: BANK 1 AICC Demo V2.
- Production branch: `main`.
- Current local branch: `codex/routing-vdn-sites-remove-status`.
- Local branch base: `codex/text-channel-config-settings`.

## Latest Change

- Published the customer-safe AUX busy reason modal by fast-forwarding `main` to `99fba67 Add customer AUX busy reason modal` and pushing `origin/main`.
- Created local Routing Config branch `codex/routing-vdn-sites-remove-status`.
- Removed `Status` from the VDN and Access Sites page UI only.

## Files Changed On Current Branch

- `src/pages/routing-config/RoutingConfigDataPages.tsx`
  - `VDN` table no longer has a Status column.
  - `VDN` search no longer has a Status filter.
  - `VDN` Add/Edit/View modal no longer has a Status field.
  - `Access Sites` table no longer has a Status column.
  - `Access Sites` search no longer has a Status filter.
  - `Access Sites` Add/Edit/View modal no longer has a Status field.
  - Both pages still save `status: 'Active'` internally.
- `PROJECT_CONTEXT.md`, `DEV_LOG.md`, `.codex-backup/key-prompts.md`
  - Updated recovery context and release notes.

## Production Behavior Verified

- `https://netinfo-aicc-demo-v2.vercel.app/` loads.
- `/design-system` loads.
- `Call Management` and `Routing Config` are not visible in the customer navigation.
- `/call-management/busy-reasons` redirects to `/`.
- `/routing-config/vdn` redirects to `/`.
- Signed-in menu shows `AUX`, not direct `AUX - Ibadah` or `AUX - Makan`.
- `Select AUX Reason` lists `Ibadah` and `Makan`, hides `Training`, and Confirm changes the status to `AUX - Ibadah`.

## Local Behavior Verified

- `/routing-config/vdn` renders without Status in table header, filter area, and Add modal.
- `/routing-config/sites` renders without Status in table header, filter area, and Add modal.
- `/routing-config/skill-routing-rules` still renders Access Site-related routing content.
- `/routing-config/site-access-volume` still renders Site Configuration content.

## Validation

- Customer AUX branch:
  - `npm run lint` passed.
  - `npm run build` passed with the existing chunk size warning.
  - `git diff --check` passed with LF/CRLF warnings only.
- Local Routing Config branch:
  - `npm run lint` passed.
  - `npm run build` passed with the existing chunk size warning.

## Risks

- Current local Routing Config branch is not customer-safe and should not be pushed to Production directly.
- VDN and Access Sites still have internal `status` fields. They are defaulted to `Active` when saved because this round removes only the business UI field.
