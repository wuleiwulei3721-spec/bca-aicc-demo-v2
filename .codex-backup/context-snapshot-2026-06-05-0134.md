# Context Snapshot - 2026-06-05 01:34 +08:00

## Project

- Project: BANK 1 AICC Demo V2.
- Branch: `codex/text-channel-config-settings`.
- Local development branch exposes `Call Management` and `Routing Config`; customer Production `main` still hides unfinished management menus.

## Latest Change

- Updated `Routing Config > Skill Queues` modal layout.
- Queue-related fields are now grouped in a separate lower `Queue Configuration` section.
- Prompt/message fields now use field-level `Insert Variable` controls aligned with `Channels > Business Config`.

## Files Changed

- `src/pages/routing-config/RoutingConfigCrudPage.tsx`
  - Added optional `renderFormContent` for page-specific modal content.
  - Added optional `modalWidth`.
  - Default field rendering remains unchanged for existing CRUD pages.
- `src/pages/routing-config/RoutingConfigDataPages.tsx`
  - `SkillQueuesPage` now uses a custom form renderer.
  - Added message selection tracking and variable insertion for Skill Queue prompt fields.
- `src/styles/index.less`
  - Added custom modal form layout support.
  - Added `routing-config-skill-queue-modal` scoped layout.

## Skill Queues Modal State

- Modal width: `820`.
- Sections:
  - `Basic Information`
  - `Queue Configuration`
- Queue Configuration rows:
  - `Non-working Time Message`
  - `Max Queue Customers` + `Queue Waiting Message`
  - `Queue Timeout` + `Queue Timeout Message`

## Variable Scope

- `Non-working Time Message`: `{workTime}`.
- `Queue Waiting Message`: `{estimatedWaitMinutes}`.
- `Queue Timeout Message`: `{customerName}`.
- Add/Edit show `Insert Variable`; View does not.
- Insert behavior targets the current textarea cursor/selection; fallback appends to the end.

## Verification

- `npm run lint` passed.
- `npm run build` passed with only the existing Vite/Rolldown chunk size warning.
- Browser checked `http://127.0.0.1:5184/routing-config/skill-queues`:
  - Add modal shows `Basic Information`, `Queue Configuration`, and `Insert Variable`.
  - `Queue Waiting Message` inserted `{estimatedWaitMinutes}` into the current content.
  - View modal shows `Queue Configuration` but no `Insert Variable`.
  - Edit modal shows `Insert Variable`.
- Browser regression checked `Routing Config > Route Elements`: the default CRUD Add modal still opens and renders fields.

## Risk

- `Queue Timeout Message` currently only exposes `{customerName}`. If stakeholders expect queue position, channel, or skill queue variables, define those runtime sources before adding placeholders.
