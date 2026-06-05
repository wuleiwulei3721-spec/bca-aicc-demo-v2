# Context Snapshot - 2026-06-05 15:56 +08:00

## Project

- Project: BANK 1 AICC Demo V2.
- Branch: `codex/customer-aux-busy-reason-modal`.
- Base: `main`, customer-safe hidden-management-menu version.

## Latest Change

- Added customer-facing AUX busy reason selection modal.
- Cleaned local stale branches only; remote branches were not deleted.
- `Call Management` and `Routing Config` remain hidden from the customer branch.

## Files Changed

- `src/layouts/components/AgentProfileArea.tsx`
  - Signed-in menu now shows one `AUX` item and `Sign Out`.
  - Clicking `AUX` opens `Select AUX Reason`.
  - Confirm applies `AUX - {reasonName}` through existing status handling.
- `src/types/agent.ts`
  - `AgentStatus` now supports dynamic `AUX - ${string}`.
- `src/types/busyReason.ts`, `src/mock/busyReasons.ts`, `src/store/callManagementStore.ts`
  - Added minimal customer-safe busy reason data source.
- `src/styles/index.less`
  - Added scoped AUX reason modal/list styles.
- `PROJECT_CONTEXT.md`, `DEV_LOG.md`, `.codex-backup/key-prompts.md`
  - Updated recovery context and prompt notes.

## Behavior

- Signed out:
  - Avatar menu shows `Sign In` only.
- Signed in:
  - Avatar menu shows `AUX` and `Sign Out`.
  - Direct `AUX - Ibadah` and `AUX - Makan` menu items are removed.
- AUX modal:
  - Shows enabled reasons only: `Ibadah`, `Makan`.
  - Selects default enabled reason `Ibadah`.
  - Hides disabled `Training` and `Extension 1-7`.
  - `Cancel` closes without status change.
  - `Confirm` changes status to `AUX - {reasonName}`.

## Validation

- `npm run lint` passed.
- `npm run build` passed with existing Vite chunk size warning.
- Browser checked `/`:
  - No `Call Management` or `Routing Config` menu.
  - Signed-out and signed-in avatar menu behavior works.
  - AUX modal lists only enabled reasons.
  - Confirm changes status to `AUX - Ibadah`.
- Browser checked `/call-management/busy-reasons`:
  - Redirects to `/`.
  - Busy Reason Management page is not exposed.
- `/design-system` returned HTTP 200.

## Risks

- Busy Reason data is currently front-end mock only.
- No admin management page is available on this customer-safe branch; changing busy reasons requires code/mock changes or a future safe backend source.
