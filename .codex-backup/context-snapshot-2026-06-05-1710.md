# Context Snapshot - 2026-06-05 17:10 +08:00

## Project

- Project: BANK 1 AICC Demo V2.
- Current local branch: `codex/routing-vdn-sites-remove-status`.
- Customer Production branch: `main`, currently at `99fba67 Add customer AUX busy reason modal`.
- This local branch is not customer-safe because it exposes Call Management and Routing Config.

## Latest Change

- Removed `Status` UI from `Routing Config > Skill Queues`.
- Kept the internal `SkillQueue.status` field and defaulted saved skill queues to `Active`.

## Files Changed

- `src/pages/routing-config/RoutingConfigDataPages.tsx`
  - Removed Skill Queues Status table column.
  - Removed Skill Queues Status filter.
  - Removed Skill Queues modal Status field and switch.
  - Changed Skill Queues save mapping to write `status: 'Active'`.
- `PROJECT_CONTEXT.md`, `DEV_LOG.md`, `.codex-backup/key-prompts.md`
  - Updated recovery context, log, and prompt notes.

## Behavior

- `/routing-config/skill-queues` still shows:
  - Keyword filter.
  - VDN filter.
  - Skill ID.
  - Platform Skill ID.
  - Skill Name.
  - VDN.
  - Work Time Plan.
  - Max Queue Customers.
  - Queue Timeout.
  - Supports Video.
  - Agents.
  - Actions.
- `/routing-config/skill-queues` no longer shows:
  - Status filter.
  - Status table column.
  - Status Add/Edit/View modal field.

## Validation

- `npm run lint` passed.
- `npm run build` passed with the existing Vite/Rolldown chunk size warning and one plugin timing warning.
- Browser DOM check for `/routing-config/skill-queues` confirmed the main page header and filter area no longer show `Status`.
- Browser click on Add modal timed out in the browser control connection, but source diff confirms `renderStatusField` and its usage were removed, and build/lint passed.

## Risks

- Internal `SkillQueue.status` remains in type and mock data, defaulted to `Active` on save. This matches the current UI simplification but should be revisited if backend disable logic is required later.
- This branch should not be pushed to customer Production.
