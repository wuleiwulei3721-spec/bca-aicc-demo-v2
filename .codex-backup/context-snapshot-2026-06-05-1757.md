# Context Snapshot - 2026-06-05 17:57 +08:00

## Project

- Project: BANK 1 AICC Demo V2.
- Current local branch: `codex/routing-vdn-sites-remove-status`.
- Worktree used for this change: `D:\03projects\bca-aicc-demo-v2-routing-247`.
- Customer Production branch: `main`, currently at `99fba67 Add customer AUX busy reason modal`.

## Latest Change

- Standardized the Routing Config always-open working time label from `Default 24x7` to `Default 24/7`.
- This is a UI/documentation wording change only.

## Files Changed

- `src/pages/routing-config/RoutingConfigDataPages.tsx`
  - `useRoutingLookups().workTimeOptions` now labels the empty work time plan option as `Default 24/7`.
  - Skill Queues list fallback now displays `Default 24/7`.
  - Skill Queues modal fallback now displays `Default 24/7`.
- `PROJECT_CONTEXT.md`, `DEV_LOG.md`, `.codex-backup/key-prompts.md`
  - Updated current recovery context and standard wording.

## Behavior

- Empty `workTimePlanCode: ''` still means no custom working time plan is selected.
- No real `Default 24/7` Working Time Plan record is created.
- Skill Queues and Phone Exception Working Time Plan inherit the same `Default 24/7` option.

## Validation

- `npm run lint` passed.
- `npm run build` passed with the existing Vite/Rolldown chunk size warning.
- Browser checks confirmed:
  - `/routing-config/skill-queues` shows `Default 24/7` in the list.
  - Skill Queues Add modal shows `Default 24/7` in Work Time Plan.
  - Phone Channel Business Config shows one `Default 24/7` option.
  - Working Time Plans does not show a real `Default 24/7` record.

## Risks

- This local branch exposes admin menus and must not be pushed directly to customer Production.
- Backend/API wording has not been audited in this round.
