# Context Snapshot - 2026-06-05 10:33 +08:00

## Project

- Project: BANK 1 AICC Demo V2.
- Branch: `codex/text-channel-config-settings`.
- Customer Production `main` remains the hidden management-menu version; local branch continues admin configuration development.

## Latest Change

- Optimized `Routing Config > Skill Queues` Work Time Plan field.
- Removed the duplicated `Default 24x7` option in Skill Queue Add/Edit/View modals.
- Added a read-only `Preview` button for non-default Working Time Plans.

## Files Changed

- `src/pages/routing-config/RoutingConfigDataPages.tsx`
  - `SkillQueuesPage` now uses `useRoutingLookups().workTimeOptions` directly.
  - Added `WorkingTimePlanPreviewContent`.
  - Added `previewWorkingTimePlan` state and the `View Working Time Plan` modal.
  - Work Time Plan field renders a `Preview` button only when a real Working Time Plan record exists.
- `src/styles/index.less`
  - Added scoped Skill Queue Work Time Plan control styles.
  - Added read-only row value styles for the preview modal.
- `PROJECT_CONTEXT.md`, `DEV_LOG.md`, `.codex-backup/key-prompts.md`
  - Updated recovery context and implementation notes.

## Behavior

- `Default 24x7` is the empty Work Time Plan value and has no preview.
- Non-empty Work Time Plan codes such as `WTP_BANK_HOURS` show `Preview`.
- Preview opens `View Working Time Plan` and shows:
  - Basic Info
  - Work Schedule
  - Ramadan Work Schedule
  - Holiday Schedule
  - Special Working Plan
  - Priority note
- Preview is read-only and does not mutate Skill Queue or Working Time Plan data.

## Verification

- `npm run lint` passed.
- `npm run build` passed with the existing Vite/Rolldown chunk size warning.
- Browser checked `/routing-config/skill-queues`:
  - Add modal Work Time Plan dropdown has only one `Default 24x7`.
  - Dropdown also contains `Bank Working Hours`.
  - View mode for a queue using `Bank Working Hours` shows `Preview`.
  - Clicking `Preview` opens the read-only Working Time Plan details modal.

## Risks

- The preview is intentionally read-only. Future edit/jump behavior should be designed separately.
- Similar manual default-option prepending may exist in other pages and should be checked only when those pages show duplication.
