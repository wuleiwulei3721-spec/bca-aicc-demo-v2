# Context Snapshot - 2026-06-05 10:47 +08:00

## Project

- Project: BANK 1 AICC Demo V2.
- Branch: `codex/text-channel-config-settings`.
- Customer Production `main` remains the hidden management-menu version; local branch continues admin configuration development.

## Latest Change

- Added a new Working Time Plan: `连续3次输入有误-中文`.
- Phone channel Business Config now defaults its `Exception Working Time Plan` to this new plan.
- Phone Business Config now follows the same preview behavior as Skill Queues: non-default plans show `Preview`; `Default 24x7` does not.

## Files Changed

- `src/mock/routingConfiguration.ts`
  - Added `WTP_3_WRONG_INPUT_ZH / 连续3次输入有误-中文`.
  - Phone VOICE Business Config now defaults `exceptionWorkTimePlanCode` to `WTP_3_WRONG_INPUT_ZH`.
- `src/pages/routing-config/RoutingConfigDataPages.tsx`
  - Channels page now reads `workingTimePlans`.
  - Removed duplicate `Default 24x7` construction for Phone Business Config.
  - Added Phone exception work time preview button and read-only preview modal.
- `src/styles/index.less`
  - Added Channel Business Config scoped Work Time Plan control styles.
- `PROJECT_CONTEXT.md`, `DEV_LOG.md`, `.codex-backup/key-prompts.md`
  - Updated recovery context and implementation notes.

## Behavior

- Route: `/routing-config/channels`.
- Entry: Phone row `101` -> `Business Config`.
- Field: `Exception Working Time Plan`.
- Default value: `连续3次输入有误-中文`.
- Dropdown options:
  - `Default 24x7`
  - `Bank Working Hours`
  - `连续3次输入有误-中文`
- Only one `Default 24x7` should be visible.
- `Preview` appears for real Working Time Plans and disappears for `Default 24x7`.

## Verification

- `npm run lint` passed.
- `npm run build` passed with the existing Vite/Rolldown chunk size warning.
- Browser checked `/routing-config/channels`:
  - Phone Business Config defaults to `连续3次输入有误-中文`.
  - Dropdown has one `Default 24x7`.
  - Preview opens `View Working Time Plan` and shows the new plan.
  - Selecting `Default 24x7` removes Preview.

## Risks

- The new plan's schedule is demo mock data: weekdays `08:00-20:00`, weekends `09:00-15:00`.
- Product/business should confirm the exact working window for the "three invalid IVR inputs" exception scenario.
