# Context Snapshot - 2026-06-05 11:30 +08:00

## Project

- Project: BANK 1 AICC Demo V2.
- Branch: `codex/text-channel-config-settings`.
- Customer Production `main` remains the hidden management-menu version; local branch continues admin configuration development.

## Latest Change

- Added `Call Management > 示忙原因维护`.
- Added a shared front-end demo store for busy reasons.
- Right header AUX menu now reads enabled busy reasons from the store.

## Files Changed

- `src/types/busyReason.ts`
  - Added `BusyReason` and `BusyReasonStatus`.
- `src/mock/busyReasons.ts`
  - Added default busy reasons: Ibadah, Makan, Training.
- `src/store/callManagementStore.ts`
  - Added local demo store with upsert/delete/reset.
  - Enforces a unique default busy reason when saving a default record.
- `src/pages/call-management/BusyReasonManagementPage.tsx`
  - Added query, table, add/view/edit/delete modal.
- `src/layouts/components/AgentProfileArea.tsx`
  - AUX menu now shows enabled busy reasons only.
- `src/layouts/BasicLayout.tsx`, `src/routes.tsx`, `src/pages/call-management/index.ts`
  - Added menu, selected state, navigation, route, and export.
- `src/styles/index.less`
  - Added scoped modal styles for the busy reason form.
- `PROJECT_CONTEXT.md`, `DEV_LOG.md`, `.codex-backup/key-prompts.md`
  - Updated recovery context and implementation notes.

## Behavior

- Route: `/call-management/busy-reasons`.
- List columns:
  - ID
  - 示忙原因
  - 是否默认
  - 状态
  - 备注
  - 更新时间
  - 更新人
- Query filters:
  - Keyword: matches ID, reason, remark.
  - Default: all / yes / no.
  - Status: all / enabled / disabled.
- Enabled busy reasons appear in the header AUX menu.
- Disabled busy reasons do not appear in AUX.
- Default busy reason is unique.

## Verification

- `npm run lint` passed.
- `npm run build` passed with the existing Vite/Rolldown chunk size warning.
- Browser checked `/call-management/busy-reasons`:
  - Page, filters, columns, and mock rows render.
  - Header menu before sign-in shows Sign In only.
  - After sign-in, AUX shows enabled Ibadah and Makan, and hides disabled Training.
  - Editing `BR003 Training` can update its table status to enabled.

## Risks

- This is a front-end demo store only; browser refresh restores mock data.
- Manual follow-up is recommended for the exact "enable Training then AUX appears immediately" interaction because browser automation was unstable around the header dropdown after modal close.
