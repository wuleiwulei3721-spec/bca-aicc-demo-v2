# Context Snapshot - 2026-06-05 11:53 +08:00

## Project

- Project: BANK 1 AICC Demo V2.
- Branch: `codex/text-channel-config-settings`.
- Customer Production `main` remains the hidden management-menu version; this local branch continues Call Management and Routing Config development.

## Latest Change

- `Call Management > Global Control Configuration` and `Busy Reason Management` now use English UI copy.
- `Busy Reason Management` is edit-only.
- Seven reserved disabled busy reasons were added for future use.

## Files Changed

- `src/pages/call-management/GlobalControlConfigurationPage.tsx`
  - Replaced Chinese UI copy with English page title, sections, labels, units, buttons, validation, and save notice.
- `src/pages/call-management/BusyReasonManagementPage.tsx`
  - Rebuilt the page as an English edit-only maintenance view.
  - Removed Add, View, and Delete actions from the UI.
  - Kept search by Keyword, Default, and Status.
- `src/mock/busyReasons.ts`
  - Added `BR004` to `BR010`: `Extension 1` through `Extension 7`.
  - All extension rows are `Disabled` and non-default.
- `src/layouts/BasicLayout.tsx`
  - Updated Call Management submenu labels to `Global Control Configuration` and `Busy Reason Management`.
- `PROJECT_CONTEXT.md`, `DEV_LOG.md`, `.codex-backup/key-prompts.md`
  - Updated recovery context, log, and prompt notes.

## Behavior

- Route: `/call-management/global-control-configuration`.
  - English title: `Global Control Configuration`.
  - Maintains Answer Mode, Answer Delay, Status after Sign-in, ACW, inactivity, and text media capacity settings.
- Route: `/call-management/busy-reasons`.
  - English title: `Busy Reason Management`.
  - Columns: ID, Busy Reason, Default, Status, Remark, Updated Date, Updated By, Actions.
  - Actions only shows Edit.
  - Editing can update Busy Reason, Default, Status, and Remark.
  - ID is read-only.
- AUX menu behavior remains unchanged:
  - Shows only `status === 'Active'`.
  - Disabled `Training` and `Extension 1-7` stay hidden.
  - Saving a default reason keeps default uniqueness through the store.

## Verification

- `npm run lint` passed.
- `npm run build` passed with the existing Vite/Rolldown chunk size warning.
- Browser checked `/call-management/busy-reasons`:
  - English page text renders.
  - `Extension 1` and `Extension 7` are visible.
  - Add/View/Delete button counts are 0.
  - Edit button count is 10.
- Browser checked `/call-management/global-control-configuration`:
  - English title and core fields render.

## Risks

- This is a front-end demo store only; browser refresh restores mock data.
- `deleteBusyReason` still exists in the store for compatibility/future use, but the page no longer exposes deletion.
